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
    collection_name="cs101_data", # Ensure this matches your exact table name!
    dimension=384
)
index_cs101 = VectorStoreIndex.from_vector_store(
    store_cs101, embed_model=embed_model
)

# 3. Connect to Table 2 (piazza_records)
store_piazza = SupabaseVectorStore(
    postgres_connection_string=os.environ.get("SUPABASE_CONNECTION_STRING"),
    collection_name="piazza_records", 
    dimension=384
)
index_piazza = VectorStoreIndex.from_vector_store(
    store_piazza, embed_model=embed_model
)

def get_relevant_context(query_text):
    print(f"🔍 Searching both tables for: '{query_text}'")
    
    # 4. Perform the search on BOTH tables independently
    # We grab the top 3 from both, giving us 6 potential matches
    retriever_cs101 = index_cs101.as_retriever(similarity_top_k=3)
    retriever_piazza = index_piazza.as_retriever(similarity_top_k=3)
    
    results_cs101 = retriever_cs101.retrieve(query_text)
    results_piazza = retriever_piazza.retrieve(query_text)

    # 5. Combine and sort the results by highest similarity score
    all_results = results_cs101 + results_piazza
    
    # Sort them so the absolute best matches float to the top
    # (We use 'or 0.0' just in case a score comes back missing)
    all_results.sort(key=lambda x: x.score or 0.0, reverse=True)
    
    # 6. Keep only the absolute best 3 results overall to save AI context window
    best_results = all_results[:3]

    if not best_results:
        print("⚠️ No results found in either table.")
    else:
        print(f"✅ Found {len(best_results)} best snippets across both tables.")
        for i, res in enumerate(best_results):
            # Print which table it came from (useful for debugging!)
            table_source = "cs101_data" if res in results_cs101 else "piazza_records"
            print(f"\n--- Result {i+1} | Score: {res.score:.4f} | Source: {table_source} ---")
            print(res.text)
    
    return best_results

if __name__ == "__main__":
    # Test a query to see if it searches both!
    get_relevant_context("Difference between = and ==?")