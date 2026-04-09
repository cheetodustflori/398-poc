import os
from dotenv import load_dotenv
from llama_index.vector_stores.supabase import SupabaseVectorStore
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
from llama_index.core import VectorStoreIndex, StorageContext

load_dotenv(dotenv_path="../.env")

# 1. Setup local embedding model (384 dimensions)
embed_model = HuggingFaceEmbedding(model_name="BAAI/bge-small-en-v1.5")

# 2. Connect to Supabase
# Ensure your .env has SUPABASE_CONNECTION_STRING
# In backend/retriever.py

vector_store = SupabaseVectorStore(
    postgres_connection_string=os.environ.get("SUPABASE_CONNECTION_STRING"),
    collection_name="piazza_records",
    dimension=384  # <--- ADD THIS LINE HERE
)

# 3. Rebuild the index from the vector store
storage_context = StorageContext.from_defaults(vector_store=vector_store)
index = VectorStoreIndex.from_vector_store(
    vector_store, 
    storage_context=storage_context,
    embed_model=embed_model
)

def get_relevant_context(query_text):
    print(f"🔍 Searching for: '{query_text}'")

    # 4. Perform the search
    retriever = index.as_retriever(similarity_top_k=3)
    results = retriever.retrieve(query_text)

    if not results:
        print("⚠️ No results found. You might need to re-run your ingestion script.")
    else:
        print(f"✅ Found {len(results)} relevant snippets.")
        for i, res in enumerate(results):
            print(f"\n--- Result {i+1} (Score: {res.score:.4f}) ---")
            print(res.text)
    
    return results

if __name__ == "__main__":
    get_relevant_context("Is there a syllabus I should read?")