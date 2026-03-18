import nest_asyncio
nest_asyncio.apply()

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from generator import generate_socratic_response


app = FastAPI()

# --- CORS SETUP ---
# This allows your frontend (localhost:3000) to talk to your backend (localhost:8000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with your frontend URL
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define the shape of the incoming request
class QuestionRequest(BaseModel):
    question: str

@app.get("/")
def read_root():
    return {"status": "Socratic TA Backend is Online"}

@app.post("/chat")
async def chat_with_ta(request: QuestionRequest):
    try:
        print(f"📩 Received question: {request.question}")
        # Call your working generator logic
        response = generate_socratic_response(request.question)
        return {"answer": response}
    except Exception as e:
        print(f"❌ API Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
    