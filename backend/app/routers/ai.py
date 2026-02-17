from fastapi import APIRouter, HTTPException
from app.schemas.ai import AIRequest, AIGenerateRequest
from app.services.ai_service import AIService

router = APIRouter(prefix="/api/ai", tags=["AI"])
@router.post("/fix-grammar")
async def fix_grammar(request: AIRequest):
    try:
        improved_text = await AIService.fix_grammar(request.text)
        return {"improved_text": improved_text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

 
@router.post("/generate")
async def generate_text(request: AIGenerateRequest):
    try:
        result = await AIService.generate(request.text, request.action)
        return {"generated_text": result}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
