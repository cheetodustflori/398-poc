import os
from dotenv import load_dotenv
from llama_index.llms.gemini import Gemini
from retriever import get_relevant_context # Importing your previous script!

load_dotenv(dotenv_path="../.env")

# 1. Setup Gemini (Free Tier)
llm = Gemini(api_key=os.environ.get("GOOGLE_API_KEY"), model_name="models/gemini-1.5-flash")

def generate_socratic_response(student_question):
    # 2. Get the facts from your Supabase database
    context_results = get_relevant_context(student_question)
    
    # 3. Combine the text from the search results into one "Context Block"
    context_text = "\n---\n".join([res.text for res in context_results])

    # 4. Create the "Socratic" Instruction
    system_prompt = (
        "You are a Socratic TA. Use the Context below to guide the student. "
        "Do not give direct answers. If the answer isn't in the context, say you don't know."
        f"\n\nCONTEXT FROM PIAZZA:\n{context_text}"
    )

    # 5. Ask Gemini to generate the response
    print("🤖 Gemini is thinking...")
    response = llm.complete(f"{system_prompt}\n\nSTUDENT QUESTION: {student_question}")
    
    return response.text

if __name__ == "__main__":
    # Test a question that exists in your mock data
    question = "What should I do first in this class?"
    answer = generate_socratic_response(question)
    
    print("\n--- AI SOCRATIC RESPONSE ---")
    print(answer)