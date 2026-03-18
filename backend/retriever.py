import os
from dotenv import load_dotenv
from supabase import create_client
from llama_index.vector_stores.supabase import SupabaseVectorStore
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
from llama_index.core import VectorStoreIndex, StorageContext

load_dotenv(dotenv_path="../.env")

# 1. Setup our free local embedding model
embed_model = HuggingFaceEmbedding(model_name="BAAI/bge-small-en-v1.5")

# 2. Connect to Supabase Vector Store
vector_store = SupabaseVectorStore(
    postgres_connection_string=os.environ.get("SUPABASE_CONNECTION_STRING"), # See note below!
    collection_name="knowledge_base"
)

def get_relevant_context(query_text):
    print(f"🔍 Searching for: '{query_text}'")
    
    # 3. Create a "Searchable Index" from our existing Supabase data
    storage_context = StorageContext.from_defaults(vector_store=vector_store)
    index = VectorStoreIndex.from_vector_store(
        vector_store, 
        storage_context=storage_context,
        embed_model=embed_model
    )

    # 4. Perform the search (Retrieve top 3 results)
    retriever = index.as_retriever(similarity_top_k=3)
    results = retriever.retrieve(query_text)

    print(f"✅ Found {len(results)} relevant snippets.")
    for i, res in enumerate(results):
        print(f"\n--- Result {i+1} (Score: {res.score:.4f}) ---")
        print(res.text)
    
    return results

if __name__ == "__main__":
    # Test it with a question related to your mock data
    get_relevant_context("Is there a syllabus I should read?")