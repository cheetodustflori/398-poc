# backend/ingest_ts.py
import os
import re
from dotenv import load_dotenv
from llama_index.core import Document, VectorStoreIndex, StorageContext
from llama_index.vector_stores.supabase import SupabaseVectorStore
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
import nest_asyncio2 as nest_asyncio

nest_asyncio.apply()
load_dotenv(dotenv_path="../.env")

# 1. Setup Models & Database (Must match your retriever.py)
embed_model = HuggingFaceEmbedding(model_name="BAAI/bge-small-en-v1.5")

vector_store = SupabaseVectorStore(
    postgres_connection_string=os.environ.get("SUPABASE_CONNECTION_STRING"),
    collection_name="piazza_records",
    dimension=384
)

def extract_content_from_ts(file_path):
    print(f"📖 Reading TS file: {file_path}")
    
    with open(file_path, 'r', encoding='utf-8') as file:
        content = file.read()

    # Regex to find anything between content: ` ` or content: " "
    # This captures both lecture notes and piazza posts
    pattern = r'content:\s*[`"](.*?)[`"](?:,|$)'
    matches = re.finditer(pattern, content, re.DOTALL)
    
    documents = []
    for match in matches:
        extracted_text = match.group(1).strip()
        
        # Skip tiny irrelevant strings
        if len(extracted_text) < 10:
            continue
            
        doc = Document(
            text=extracted_text,
            metadata={"source": "mock-data.ts"}
        )
        documents.append(doc)
        
    return documents

def upload_knowledge_base():
    # Make sure this path correctly points to your TS file!
    ts_file_path = "../frontend/lib/mock-data.ts" # Adjust this path if necessary
    
    if not os.path.exists(ts_file_path):
        print(f"❌ Error: Cannot find {ts_file_path}")
        return

    documents = extract_content_from_ts(ts_file_path)
    
    print(f"📦 Extracted {len(documents)} distinct chunks of text. Generating embeddings...")
    
    # Upload to Supabase
    storage_context = StorageContext.from_defaults(vector_store=vector_store)
    
    VectorStoreIndex.from_documents(
        documents,
        storage_context=storage_context,
        embed_model=embed_model,
        show_progress=True
    )
    
    print("✅ Upload complete! The AI's brain is now fully updated.")

if __name__ == "__main__":
    upload_knowledge_base()