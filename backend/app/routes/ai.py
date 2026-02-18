from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse, PlainTextResponse
from pydantic import BaseModel
from app.config import GEMINI_API_KEY
from google import genai

router = APIRouter(prefix="/api/ai", tags=["ai"])

client = genai.Client(api_key=GEMINI_API_KEY) if GEMINI_API_KEY else None


class AIRequest(BaseModel):
    text: str
    action: str  # "summary" or "grammar"


PROMPTS = {
    "summary": "Write a short summary of the following blog text. Return only the summary, nothing else.\n\nText:\n{text}",
    "grammar": "Fix the grammar and spelling in the following text. Return only the corrected text, nothing else.\n\nText:\n{text}",
}


MODEL_NAME = "gemini-2.5-flash"


@router.post("/generate")
async def generate(req: AIRequest):
    if not client:
        raise HTTPException(
            status_code=400,
            detail="Gemini API key not set. Add GEMINI_API_KEY to your .env file.",
        )

    if req.action not in PROMPTS:
        raise HTTPException(status_code=400, detail="action must be 'summary' or 'grammar'")

    prompt = PROMPTS[req.action].format(text=req.text)

    try:
        # try streaming first
        response = client.models.generate_content_stream(
            model=MODEL_NAME,
            contents=prompt,
        )
        # read first chunk to catch errors early
        first_chunk = next(iter(response))

        def stream_with_first():
            if first_chunk.text:
                yield first_chunk.text
            for chunk in response:
                if chunk.text:
                    yield chunk.text

        return StreamingResponse(stream_with_first(), media_type="text/plain")

    except Exception as e:
        error_msg = str(e)
        # if rate limited, try non-streaming as fallback
        try:
            result = client.models.generate_content(
                model=MODEL_NAME,
                contents=prompt,
            )
            return PlainTextResponse(result.text)
        except Exception as e2:
            raise HTTPException(status_code=500, detail=str(e2))
