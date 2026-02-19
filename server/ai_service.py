# ai_service.py

from google import genai
from fastapi import APIRouter, Body
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

router = APIRouter()

# Setup client using environment variable
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

@router.post("/api/ai/summarize")
async def summarize_text(text: str = Body(..., embed=True)):
    try:
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=f"Summarize this: {text}"
        )
        return {"summary": response.text}
    except Exception as e:
        return {"error": str(e)}
