import os
from dotenv import load_dotenv
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
from llama_index.vector_stores.supabase import SupabaseVectorStore
from llama_index.core import StorageContext, VectorStoreIndex, Document

load_dotenv(dotenv_path="../.env")

# 1. Initialize our free local embedding model (384 dimensions)
embed_model = HuggingFaceEmbedding(model_name="BAAI/bge-small-en-v1.5")

def process_and_upload_post(post_data):
    """
    Uses LlamaIndex to process and upload Piazza posts to Supabase.
    This ensures the 'Retriever' can actually find them.
    """
    
    # 2. Setup the same Vector Store as the retriever
    vector_store = SupabaseVectorStore(
        postgres_connection_string=os.environ.get("SUPABASE_CONNECTION_STRING"),
        collection_name="piazza_records",
        dimension=384
    )
    
    # Storage context tells LlamaIndex where to save things
    storage_context = StorageContext.from_defaults(vector_store=vector_store)
    
    documents_to_index = []

    # 3. Process the Main Post
    main_text = f"Title: {post_data['title']}\nContent: {post_data['content']}"
    print(f"📦 Processing Main Post: {post_data['title']}")
    
    main_doc = Document(
        text=main_text,
        metadata={
            "source_type": "piazza_main",
            "source_id": post_data['id'],
            "title": post_data['title'],
            "folders": post_data['folders']
        }
    )
    documents_to_index.append(main_doc)

    # 4. Process each Follow-up
    for i, followup in enumerate(post_data.get('followups', [])):
        print(f"  └─ Processing Follow-up {i+1}...")
        followup_text = f"Context: {post_data['title']} | Follow-up: {followup['content']}"
        
        followup_doc = Document(
            text=followup_text,
            metadata={
                "source_type": "piazza_followup",
                "source_id": followup['id'],
                "parent_id": post_data['id'],
                "title": post_data['title'],
                "folders": post_data['folders']
            }
        )
        documents_to_index.append(followup_doc)

    # 5. The "Magic" Step: This handles embedding AND the Supabase upload
    try:
        VectorStoreIndex.from_documents(
            documents_to_index,
            storage_context=storage_context,
            embed_model=embed_model,
            show_progress=True
        )
        print(f"✅ Successfully indexed {len(documents_to_index)} items to Supabase.")
    except Exception as e:
        print(f"❌ Error during indexing: {e}")

# --- MOCK DATA TEST ---
if __name__ == "__main__":
    mock_post = {
        "id": "post-1",
        "title": "Welcome to CS 101! Read this first.",
        "content": "Welcome to CS 101! Please read the syllabus carefully...",
        "folders": ["logistics"],
        "followups": [
            {"id": "f1-1", "content": "Hi everyone! I'm excited for this class."},
            {"id": "f1-2", "content": "Welcome Alex! No question is too basic."}
        ]
    }
    
    process_and_upload_post(mock_post)