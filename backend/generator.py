import os
from dotenv import load_dotenv
# --- NEW IMPORT HERE ---
from llama_index.llms.google_genai import GoogleGenAI
from retriever import get_relevant_context

load_dotenv(dotenv_path="../.env")

# 1. Setup Gemini using the modern class
# 'gemini-1.5-flash' is the correct string for this SDK
llm = GoogleGenAI(
    model="models/gemini-2.5-flash", 
    api_key=os.environ.get("GOOGLE_API_KEY")
)

def generate_socratic_response(student_question):
    context_results = get_relevant_context(student_question)
    
    if not context_results:
        return "I couldn't find any information on that in the course records. Perhaps you should check with the instructor on Piazza?"

    context_text = "\n---\n".join([res.text for res in context_results])

    system_prompt = (
        "YOU ARE A SOCRATIC TEACHING ASSISTANT for a Computer Science course. "
        "YOUR GOAL: Guide the student to the answer using course context. DO NOT give direct answers.\n\n"
        "RULES:\n"
        "1. Use ONLY the 'COURSE CONTEXT' provided below.\n"
        "2. If the answer is in the context, give a small hint or ask a guiding question.\n"
        "3. If the student asks for a solution, politely decline and point them to the relevant context.\n\n"
        f"COURSE CONTEXT:\n{context_text}"
    )

    print("🤖 Gemini is crafting a hint...")
    # Using the standardized 'complete' method
    response = llm.complete(f"{system_prompt}\n\nSTUDENT QUESTION: {student_question}")
    
    return response.text

if __name__ == "__main__":
    question = "Where can I find the course syllabus?"
    answer = generate_socratic_response(question)
    
    print("\n--- SOCRATIC RESPONSE ---")
    print(answer)