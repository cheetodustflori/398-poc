import os
from dotenv import load_dotenv
# --- NEW IMPORT HERE ---
from llama_index.llms.google_genai import GoogleGenAI
from llama_index.core.memory import ChatMemoryBuffer
from retriever import get_relevant_context, index

load_dotenv(dotenv_path="../.env")

# 1. Setup Gemini using the modern class
# 'gemini-1.5-flash' is the correct string for this SDK
llm = GoogleGenAI(
    model="models/gemini-2.5-flash", 
    api_key=os.environ.get("GOOGLE_API_KEY")
)

# 2. Global session storage

session_memories = {}

def get_memory_for_session(session_id:str):
    if session_id not in session_memories: 
        session_memories[session_id] = ChatMemoryBuffer.from_defaults(token_limit=3000)
    return session_memories[session_id]

def generate_socratic_response(student_question, session_id="default-session"):
    memory = get_memory_for_session(session_id)

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
    
    # 6. Initialize Chat Engine
    chat_engine = index.as_chat_engine(
        chat_mode="context",
        memory=memory,
        llm=llm,
        system_prompt=system_prompt
    )
    
    print("🤖 Gemini is crafting a hint...")
    # Using the standardized 'complete' method
    response = chat_engine.chat(f"{system_prompt}\n\nSTUDENT QUESTION: {student_question}")
    
    return response.response

if __name__ == "__main__":
    # question = "Where can I find the course syllabus?"
    # answer = generate_socratic_response(question)
    
    # print("\n--- SOCRATIC RESPONSE ---")
    # print(answer)
    
    print(generate_socratic_response("Where is the syllabus?", "student-123"))
    print(generate_socratic_response("Can you explain that link further?", "student-123"))