from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import google.generativeai as genai
import os
from pathlib import Path
from dotenv import load_dotenv

router = APIRouter(prefix="/api/ai", tags=["ai"])

def _ensure_env():
    env_path = Path(__file__).resolve().parent.parent.parent / ".env"
    load_dotenv(dotenv_path=env_path, override=True)

class GenerateRequest(BaseModel):
    text: str
    action: str

@router.post("/generate")
async def generate(req: GenerateRequest):
    _ensure_env()
    api_key = os.getenv("GEMINI_API_KEY")
    
    if not api_key:
        raise HTTPException(500, "API Key not found. Set GEMINI_API_KEY or GOOGLE_API_KEY in server/.env")
    
    cleaned_key = api_key.strip()
    
    try:
        genai.configure(api_key=cleaned_key)
        model = genai.GenerativeModel('gemini-2.5-flash')
        
        if req.action == "summary":
            prompt = f"Write a 2-3 sentence summary:\n\n{req.text}"
        else:
            prompt = f"Fix grammar:\n\n{req.text}"
        
        response = model.generate_content(prompt)
        return {"result": response.text}
    
    except Exception as e:
        print(f"❌ GEMINI ERROR: {e}")
        raise HTTPException(500, str(e))