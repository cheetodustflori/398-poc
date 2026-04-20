import os
from dotenv import load_dotenv
from llama_index.vector_stores.supabase import SupabaseVectorStore
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
from llama_index.core import VectorStoreIndex, StorageContext

load_dotenv(dotenv_path="../.env")

# 1. Setup local embedding model
embed_model = HuggingFaceEmbedding(model_name="BAAI/bge-small-en-v1.5")

# 2. Connect to Table 1 (cs101_data)
store_cs101 = SupabaseVectorStore(
    postgres_connection_string=os.environ.get("SUPABASE_CONNECTION_STRING"),
    collection_name="cs101_data",
    dimension=384
)

storage_context = StorageContext.from_defaults(vector_store=store_cs101)
index = VectorStoreIndex.from_vector_store(
    store_cs101, 
    storage_context=storage_context,
    embed_model=embed_model
)

def get_relevant_context(query_text):
    print(f"🔍 Searching both tables for: '{query_text}'")
    
    # 4. Perform the search 
    retriever_cs101 = index.as_retriever(similarity_top_k=3)
    results_cs101 = retriever_cs101.retrieve(query_text)
    
    if not results_cs101:
        print("⚠️ No results found in either table.")
    else:
        print(f"✅ Found {len(results_cs101)} best snippets across both tables.")
        for i, res in enumerate(results_cs101):
            # Print which table it came from (useful for debugging!)
            print(f"\n--- Result {i+1} | Score: {res.score:.4f}  ---")
            print(res.text)
    
    return results_cs101

if __name__ == "__main__":
    # Test a query to see if it searches both!
    get_relevant_context("Difference between = and ==?")