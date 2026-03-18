import os
from dotenv import load_dotenv
from supabase import create_client
from llama_index.embeddings.huggingface import HuggingFaceEmbedding

# 1. Load keys from root folder
load_dotenv(dotenv_path="../.env") 

url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_KEY")

# 2. Initialize the Local Embedding Model
# This downloads a ~100MB model to your Mac the first time you run it.
# It stays on your machine and costs $0 to use.
print("⏳ Loading local embedding model (HuggingFace)...")
embed_model = HuggingFaceEmbedding(model_name="BAAI/bge-small-en-v1.5")

# 3. Initialize Supabase
supabase = create_client(url, key)

def test_free_insert():
    content = "The syllabus says homework is 40% of the grade."
    
    print("🧠 Generating embedding locally...")
    # This turns your text into a list of numbers using your Mac's CPU
    embedding = embed_model.get_text_embedding(content)

    data = {
        "content": content,
        "source_type": "material",
        "source_id": "syllabus-1",
        "title": "Grading Policy",
        "folders": ["logistics"],
        "embedding": embedding 
    }

    try:
        print("📤 Sending to Supabase...")
        supabase.table("knowledge_base").insert(data).execute()
        print("✅ SUCCESS! Check your Supabase Table Editor.")
    except Exception as e:
        print(f"❌ ERROR: {e}")

if __name__ == "__main__":
    test_free_insert()