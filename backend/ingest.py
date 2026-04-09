# backend/ingest_ts.py
import os
import re
from dotenv import load_dotenv
from supabase import create_client
from llama_index.embeddings.huggingface import HuggingFaceEmbedding

load_dotenv(dotenv_path="../.env")

# 1. Initialize Supabase (Using your proven method)
url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_KEY")
supabase = create_client(url, key)

# 2. Initialize Local Embeddings
print("⏳ Loading local embedding model...")
embed_model = HuggingFaceEmbedding(model_name="BAAI/bge-small-en-v1.5")

def extract_content_from_ts(file_path):
    print(f"📖 Reading TS file: {file_path}")
    
    with open(file_path, 'r', encoding='utf-8') as file:
        content = file.read()

    # Regex to capture the title and content
    # This specifically looks for title: "...", and content: `...`
    documents = []
    
    # Split the file roughly by object blocks to keep title/content paired
    blocks = re.split(r'id:\s*["\']', content)[1:] # Skip the first empty split
    
    for block in blocks:
        title_match = re.search(r'title:\s*["\'](.*?)["\']', block)
        content_match = re.search(r'content:\s*[`"](.*?)[`"](?:,|$)', block, re.DOTALL)
        
        if content_match:
            title = title_match.group(1) if title_match else "Course Document"
            text = content_match.group(1).strip()
            
            if len(text) > 10:
                documents.append({"title": title, "text": text})
                
    return documents

def upload_knowledge_base():
    # Make sure this points to your mock-data.ts file
    ts_file_path = "../frontend/lib/mock-data.ts" 
    
    if not os.path.exists(ts_file_path):
        print(f"❌ Error: Cannot find {ts_file_path}")
        return

    documents = extract_content_from_ts(ts_file_path)
    print(f"📦 Extracted {len(documents)} blocks of text. Generating embeddings...")

    success_count = 0
    error_count = 0

    # 3. Process and Upload manually, just like your test script
    for i, doc in enumerate(documents):
        print(f"🔄 Processing {i+1}/{len(documents)}: {doc['title']}")
        
        # Generate the embedding
        embedding = embed_model.get_text_embedding(doc["text"])

        # Construct the payload matching YOUR table schema
        data = {
            "content": doc["text"],
            "source_type": "ts_import",
            "source_id": f"imported-{i}",
            "title": doc["title"],
            "folders": ["general"], # Default folder
            "embedding": embedding 
        }

        try:
            # Insert into YOUR specific table name
            supabase.table("knowledge_base").insert(data).execute()
            success_count += 1
        except Exception as e:
            print(f"❌ ERROR on {doc['title']}: {e}")
            error_count += 1

    print(f"✅ Upload complete! {success_count} succeeded, {error_count} failed.")

if __name__ == "__main__":
    upload_knowledge_base()