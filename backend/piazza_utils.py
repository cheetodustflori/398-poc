# import os
# from dotenv import load_dotenv
# from llama_index.embeddings.huggingface import HuggingFaceEmbedding
# from llama_index.vector_stores.supabase import SupabaseVectorStore
# from llama_index.core import StorageContext, VectorStoreIndex, Document
# import nest_asyncio2 as nest_asyncio

# # Always good to have this in FastAPI/Async environments
# nest_asyncio.apply()
# load_dotenv(dotenv_path="../.env")

# # 1. Initialize our free local embedding model (384 dimensions)
# embed_model = HuggingFaceEmbedding(model_name="BAAI/bge-small-en-v1.5")

# def process_and_upload_post(post_data):
#     """
#     Uses LlamaIndex to process and upload Piazza posts to Supabase.
#     This ensures the 'Retriever' can actually find them.
#     """
    
#     # 2. Setup the Vector Store
#     # We changed this to "knowledge_base" to act as your single source of truth
#     vector_store = SupabaseVectorStore(
#         postgres_connection_string=os.environ.get("SUPABASE_CONNECTION_STRING"),
#         collection_name="cs101_data",
#         dimension=384
#     )
    
#     storage_context = StorageContext.from_defaults(vector_store=vector_store)
#     documents_to_index = []

#     # 3. Process the Main Post + Answers (Creating a "Super Chunk" for the AI)
#     print(f"📦 Processing Main Post: {post_data['title']}")
    
#     main_text = f"Question: {post_data['title']}\nDetails: {post_data['content']}\n"
    
#     if post_data.get('instructorAnswer'):
#         main_text += f"\nInstructor Answer: {post_data['instructorAnswer']['content']}"
#     if post_data.get('studentAnswer'):
#         main_text += f"\nStudent Answer: {post_data['studentAnswer']['content']}"
    
#     main_doc = Document(
#         text=main_text.strip(),
#         metadata={
#             "source_type": "piazza_main",
#             "source_id": post_data['id'],
#             "title": post_data['title'],
#             "folders": post_data.get('folders', [])
#         }
#     )
#     documents_to_index.append(main_doc)

#     # 4. Process each Follow-up as a separate context chunk
#     for i, followup in enumerate(post_data.get('followups', [])):
#         print(f"  └─ Processing Follow-up {i+1}...")
#         followup_text = f"Context from '{post_data['title']}':\nFollow-up Comment: {followup['content']}"
        
#         # If the followup has replies, bundle them in!
#         for reply in followup.get('replies', []):
#             followup_text += f"\nReply: {reply['content']}"
            
#         followup_doc = Document(
#             text=followup_text.strip(),
#             metadata={
#                 "source_type": "piazza_followup",
#                 "source_id": followup['id'],
#                 "parent_id": post_data['id'],
#                 "title": post_data['title']
#             }
#         )
#         documents_to_index.append(followup_doc)

#     # 5. The "Magic" Step: Handles embedding AND auto-creates the table if missing
#     try:
#         VectorStoreIndex.from_documents(
#             documents_to_index,
#             storage_context=storage_context,
#             embed_model=embed_model,
#             show_progress=True
#         )
#         print(f"✅ Successfully indexed {len(documents_to_index)} items to Supabase.")
#     except Exception as e:
#         print(f"❌ Error during indexing: {e}")



# # --- MOCK DATA TEST (Updated to match TS schema) ---
# if __name__ == "__main__":
#     mock_post = {
#         "id": "post-2",
#         "title": "Difference between = and == in Python?",
#         "content": "I keep getting errors when I write things like `if x = 5:`. Can someone explain what's going wrong?",
#         "folders": ["general"],
#         "studentAnswer": {
#             "content": "In Python, `=` is the assignment operator. The `==` is the comparison operator."
#         },
#         "followups": [
#             {
#                 "id": "f2-1", 
#                 "content": "So = is like putting something in a box and == is checking what's in the box?",
#                 "replies": [
#                     {"content": "Exactly! That's a great mental model."}
#                 ]
#             }
#         ]
#     }
    
#     process_and_upload_post(mock_post)

import os
from dotenv import load_dotenv
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
from llama_index.vector_stores.supabase import SupabaseVectorStore
from llama_index.core import StorageContext, VectorStoreIndex, Document

load_dotenv(dotenv_path="../.env")

embed_model = HuggingFaceEmbedding(model_name="BAAI/bge-small-en-v1.5")


def _get_vector_store():
    return SupabaseVectorStore(
        postgres_connection_string=os.environ.get("SUPABASE_CONNECTION_STRING"),
        collection_name="knowledge_base",
        dimension=384,
    )


def _index_documents(docs: list[Document]):
    """Embed and upsert a list of documents. The unique constraint on
    (source_id, source_type) in Supabase means duplicates are silently
    ignored, so re-running ingestion is always safe."""
    vector_store = _get_vector_store()
    storage_context = StorageContext.from_defaults(vector_store=vector_store)
    VectorStoreIndex.from_documents(
        docs,
        storage_context=storage_context,
        embed_model=embed_model,
        show_progress=True,
    )
    print(f"  ✅ Indexed {len(docs)} document(s).")


# ──────────────────────────────────────────────
# Piazza posts
# ──────────────────────────────────────────────

def process_and_upload_post(post_data: dict):
    """Ingest a single Piazza post and all its followups."""
    docs = []

    # Main post
    main_text = f"Title: {post_data['title']}\nContent: {post_data['content']}"
    if post_data.get("instructorAnswer"):
        main_text += f"\nInstructor Answer: {post_data['instructorAnswer']['content']}"
    if post_data.get("studentAnswer"):
        main_text += f"\nStudent Answer: {post_data['studentAnswer']['content']}"

    docs.append(Document(
        id_=f"post-{post_data['id']}",
        text=main_text,
        metadata={
            "source_type": "piazza_main",
            "source_id": post_data["id"],
            "title": post_data["title"],
            "folders": post_data.get("folders", []),
            "tags": post_data.get("tags", []),
            "post_number": post_data.get("number"),
            "status": post_data.get("status"),
            "visibility": post_data.get("visibility"),
        },
    ))

    # Followups (recursive helper)
    def _collect_followups(followups, parent_id):
        for f in followups:
            text = f"Context: {post_data['title']} | Follow-up: {f['content']}"
            docs.append(Document(
                id_=f"post-{post_data['id']}",
                text=text,
                metadata={
                    "source_type": "piazza_followup",
                    "source_id": f["id"],
                    "parent_id": parent_id,
                    "title": post_data["title"],
                    "folders": post_data.get("folders", []),
                },
            ))
            _collect_followups(f.get("replies", []), f["id"])

    _collect_followups(post_data.get("followups", []), post_data["id"])

    print(f"📦 Indexing post @{post_data.get('number')}: {post_data['title']}")
    _index_documents(docs)


# ──────────────────────────────────────────────
# Course materials
# ──────────────────────────────────────────────

def process_and_upload_material(material: dict):
    """Ingest a single course material (syllabus, lecture notes, etc.)."""
    if not material.get("visible", True):
        print(f"  ⏭️  Skipping hidden material: {material['title']}")
        return

    text = f"[{material['type'].upper()}] {material['title']} (Week {material['week']})\n{material['content']}"
    doc = Document(
        id_=f"material-{material['id']}",
        text=text,
        metadata={
            "source_type": "material",
            "source_id": material["id"],
            "title": material["title"],
            "material_type": material["type"],
            "week": material["week"],
            "folders": [],
        },
    )
    print(f"📄 Indexing material: {material['title']}")
    _index_documents([doc])


# ──────────────────────────────────────────────
# Trending topics
# ──────────────────────────────────────────────

def process_and_upload_trending_topic(topic: dict):
    """Ingest a trending topic aggregate."""
    text = (
        f"Trending Topic: {topic['topic']}\n"
        f"Asked {topic['askCount']} times.\n"
        f"Sample question: {topic['sampleQuestion']}\n"
        f"Related posts: {', '.join(topic['relatedPostIds'])}"
    )
    doc = Document(
        id_=f"trend-{topic['id']}",
        text=text,
        metadata={
            "source_type": "trending_topic",
            "source_id": topic["id"],
            "title": topic["topic"],
            "ask_count": topic["askCount"],
            "related_post_ids": topic["relatedPostIds"],
            "folders": [],
        },
    )
    print(f"🔥 Indexing trending topic: {topic['topic']}")
    _index_documents([doc])


# ──────────────────────────────────────────────
# Availability schedule
# ──────────────────────────────────────────────

def process_and_upload_availability(slots: list[dict]):
    """Ingest the full availability schedule as one searchable document."""
    lines = ["Instructor/TA Office Hours & Availability:"]
    for s in slots:
        lines.append(
            f"  {s['day'].capitalize()} {s['startTime']}–{s['endTime']}: "
            f"{s['name']} ({s['type'].replace('_', ' ')}) [{s['person']}]"
        )
    text = "\n".join(lines)

    doc = Document(
        id_="global-availability-schedule",
        text=text,
        metadata={
            "source_type": "availability",
            "source_id": "availability-schedule",
            "title": "Office Hours and Availability",
            "folders": ["logistics"],
        },
    )
    print("📅 Indexing availability schedule")
    _index_documents([doc])