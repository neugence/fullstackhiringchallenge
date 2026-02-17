"""
AI routes for generating content using Google Gemini API
Handles summary generation and grammar correction
"""

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field
from typing import Literal
from backend.dependencies.auth_dependency import get_current_user
from backend.core.config import settings
import aiohttp
import asyncio
import traceback


router = APIRouter(prefix="/api/ai", tags=["AI"])


class AIGenerateRequest(BaseModel):
    """Request schema for AI text generation"""
    content: str = Field(..., min_length=1, description="Text content to process")
    type: Literal["summary", "grammar"] = Field(..., description="Type of AI generation")


class AIGenerateResponse(BaseModel):
    """Response schema for AI text generation"""
    result: str = Field(..., description="Generated text from AI")
    type: str = Field(..., description="Type of generation performed")


@router.post("/generate", response_model=AIGenerateResponse)
async def generate_ai_content(
    request: AIGenerateRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    Generate AI content using Google Gemini REST API
    
    Protected endpoint that requires JWT authentication.
    
    - **content**: The text content to process
    - **type**: Either "summary" or "grammar"
    
    Returns the generated text from Gemini API
    """
    try:
        if not settings.GEMINI_API_KEY:
            print("ERROR: GEMINI_API_KEY not configured")
            raise HTTPException(status_code=500, detail="Gemini API key not configured")
        
        print(f"AI Request: type={request.type}, content_length={len(request.content)}")
        
        # Build prompt
        if request.type == "summary":
            prompt = f"""Generate a concise professional summary of the following blog post. 
The summary should be 2-3 sentences and capture the main points clearly.

Blog content:
{request.content}

Professional Summary:"""
        else:  # grammar
            prompt = f"""Fix all grammar mistakes and improve the clarity of the following text. 
Do not change the meaning or core message. Keep the same tone and style.
Only return the corrected text, without any explanations.

Original text:
{request.content}

Corrected text:"""
        
        # Prepare request payload for Gemini REST API
        payload = {
            "contents": [{
                "parts": [{"text": prompt}]
            }],
            "generationConfig": {
                "temperature": 0.7,
                "topK": 40,
                "topP": 0.95,
                "maxOutputTokens": 1024,
            }
        }
        
        # Make request to Gemini API (using Gemini 2.5 Flash - latest working model)
        # Using header-based authentication for better security
        url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent"
        headers = {
            "Content-Type": "application/json",
            "x-goog-api-key": settings.GEMINI_API_KEY
        }
        
        print("Calling Gemini API [REDACTED]")
        
        async with aiohttp.ClientSession() as session:
            async with session.post(url, json=payload, headers=headers) as response:
                response_text = await response.text()
                
                if response.status != 200:
                    print(f"Gemini API Error {response.status}: {response_text}")
                    raise HTTPException(
                        status_code=500,
                        detail=f"Gemini API error ({response.status}): {response_text[:200]}"
                    )
                
                try:
                    data = await response.json()
                except Exception as json_err:
                    print(f"JSON Parse Error: {json_err}, Response: {response_text}")
                    raise HTTPException(
                        status_code=500,
                        detail=f"Failed to parse API response: {str(json_err)}"
                    )
                
                # Extract generated text
                try:
                    result = data["candidates"][0]["content"]["parts"][0]["text"]
                    print(f"AI Generation Success: {len(result)} chars")
                    return AIGenerateResponse(
                        result=result.strip(),
                        type=request.type
                    )
                except (KeyError, IndexError) as e:
                    print(f"Response Format Error: {e}, Data: {str(data)[:500]}")
                    raise HTTPException(
                        status_code=500,
                        detail=f"Unexpected API response format: {str(e)}, Response: {str(data)[:200]}"
                    )
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"UNEXPECTED ERROR in AI endpoint: {type(e).__name__}: {str(e)}")
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=f"AI generation failed: {type(e).__name__}: {str(e)}"
        )

