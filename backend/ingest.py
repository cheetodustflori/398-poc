# backend/ingest.py
import os
import re
from dotenv import load_dotenv
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
from llama_index.vector_stores.supabase import SupabaseVectorStore
from llama_index.core import StorageContext, VectorStoreIndex, Document
import nest_asyncio2 as nest_asyncio

# Required for async loops
nest_asyncio.apply()
load_dotenv(dotenv_path="../.env")

# 1. Initialize Local Embeddings
print("⏳ Loading local embedding model...")
embed_model = HuggingFaceEmbedding(model_name="BAAI/bge-small-en-v1.5")

def extract_content_from_ts(file_path):
    print(f"📖 Reading TS file: {file_path}")
    
    with open(file_path, 'r', encoding='utf-8') as file:
        content = file.read()

    documents = []
    
    # Split the file roughly by object blocks to keep title/content paired
    blocks = re.split(r'id:\s*["\']', content)[1:] 
    
    for block in blocks:
        title_match = re.search(r'title:\s*["\'](.*?)["\']', block)
        # Upgraded Regex to handle the multiline backticks (`) in your TS file
        content_match = re.search(r'content:\s*([`"\'\\])(.*?)\1', block, re.DOTALL)
        
        if title_match and content_match:
            title = title_match.group(1)
            text = content_match.group(2).strip()
            
            if len(text) > 10:
                # Format as a LlamaIndex Document instead of a raw dictionary
                doc = Document(
                    text=f"Title: {title}\nContent: {text}",
                    metadata={"title": title, "source": "mock-data.ts"}
                )
                documents.append(doc)
                
    return documents

def upload_knowledge_base():
    ts_file_path = "../frontend/lib/mock-data.ts" 
    
    if not os.path.exists(ts_file_path):
        print(f"❌ Error: Cannot find {ts_file_path}")
        return

    documents = extract_content_from_ts(ts_file_path)
    print(f"📦 Extracted {len(documents)} blocks of text. Generating embeddings...")

    # 2. Connect directly to your unified cs101_data table
    vector_store = SupabaseVectorStore(
        postgres_connection_string=os.environ.get("SUPABASE_CONNECTION_STRING"),
        collection_name="cs101_data", # <--- Using the correct LlamaIndex table
        dimension=384
    )
    
    storage_context = StorageContext.from_defaults(vector_store=vector_store)
    
    # 3. LlamaIndex handles the embedding loop and the Supabase upload automatically!
    try:
        VectorStoreIndex.from_documents(
            documents,
            storage_context=storage_context,
            embed_model=embed_model,
            show_progress=True # Will show a nice loading bar in the terminal
        )
        print(f"✅ Upload complete! Successfully pushed {len(documents)} items to cs101_data.")
    except Exception as e:
        print(f"❌ Error during indexing: {e}")

if __name__ == "__main__":
    upload_knowledge_base()