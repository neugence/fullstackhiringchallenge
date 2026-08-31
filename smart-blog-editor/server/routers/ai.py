from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from models.ai import AIRequest, AutocompleteRequest
from services.ai_service import generate_ai_text, generate_autocomplete_stream

router = APIRouter(prefix="/api", tags=["AI Copilot"])

@router.post("/ai/generate")
async def generate_ai(request: AIRequest):
    try:
        text = await generate_ai_text(request.text, request.prompt_type)
        return {"generated_text": text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/autocomplete")
async def autocomplete_ai(request: AutocompleteRequest):
    return StreamingResponse(
        generate_autocomplete_stream(request.text), 
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*"
        }
    )
