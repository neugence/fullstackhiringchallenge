# Updated ai_service.py
from google import genai
from fastapi import APIRouter, Body
import os

router = APIRouter()

# Setup client
client = genai.Client(api_key="AIzaSyBGSxDufmnECCUbIG5DFJqKsrGqeK00ukU")

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