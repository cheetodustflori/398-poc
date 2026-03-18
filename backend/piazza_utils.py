import os
from dotenv import load_dotenv
from supabase import create_client
from llama_index.embeddings.huggingface import HuggingFaceEmbedding

load_dotenv(dotenv_path="../.env")

# Initialize our free tools
embed_model = HuggingFaceEmbedding(model_name="BAAI/bge-small-en-v1.5")
supabase = create_client(os.environ.get("SUPABASE_URL"), os.environ.get("SUPABASE_KEY"))

def process_and_upload_post(post_data):
    """
    Takes a single Piazza post object and uploads the main content 
    AND all follow-ups as separate searchable rows.
    """
    items_to_upload = []

    # 1. Process the Main Post
    main_content = f"Title: {post_data['title']}\nContent: {post_data['content']}"
    print(f"📦 Processing Main Post: {post_data['title']}")
    
    items_to_upload.append({
        "content": main_content,
        "source_type": "piazza_main",
        "source_id": post_data['id'],
        "title": post_data['title'],
        "folders": post_data['folders'],
        "embedding": embed_model.get_text_embedding(main_content)
    })

    # 2. Process each Follow-up
    for i, followup in enumerate(post_data.get('followups', [])):
        # We inject the main title so the followup has "context"
        contextual_content = f"Context: {post_data['title']} | Follow-up: {followup['content']}"
        print(f"  └─ Processing Follow-up {i+1}...")

        items_to_upload.append({
            "content": contextual_content,
            "source_type": "piazza_followup",
            "source_id": followup['id'],
            "parent_id": post_data['id'], # Link it to the main post
            "title": post_data['title'],
            "folders": post_data['folders'],
            "embedding": embed_model.get_text_embedding(contextual_content)
        })

    # 3. Batch Upload to Supabase
    try:
        supabase.table("knowledge_base").insert(items_to_upload).execute()
        print(f"✅ Successfully uploaded {len(items_to_upload)} items to Knowledge Base.")
    except Exception as e:
        print(f"❌ Error during upload: {e}")

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