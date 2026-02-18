import asyncio
import os

from fastapi import APIRouter, HTTPException, status
from fastapi.responses import StreamingResponse
from huggingface_hub import InferenceClient

from ..schemas import AIGenerateRequest

router = APIRouter(prefix="/api/ai", tags=["ai"])

HF_API_KEY = os.getenv("HF_API_KEY", "")
HF_MODEL = os.getenv("HF_MODEL", "google/flan-t5-base")
HF_MODELS = [
    model.strip()
    for model in os.getenv(
        "HF_MODELS",
        f"{HF_MODEL},google/flan-t5-small,Qwen/Qwen2.5-0.5B-Instruct",
    ).split(",")
    if model.strip()
]


async def stream_text(text: str):
    chunk_size = 18
    for index in range(0, len(text), chunk_size):
        chunk = text[index : index + chunk_size]
        yield f"data: {chunk}\n\n"
        await asyncio.sleep(0.05)
    yield "data: [DONE]\n\n"


async def generate_with_huggingface(mode: str, text: str) -> str:
    prompt = (
        f"Summarize this blog content in 4-6 lines:\n\n{text}"
        if mode == "summary"
        else f"Fix grammar and improve readability without changing meaning:\n\n{text}"
    )

    response_format_prompt = "Return only the final text. No explanations."
    last_error = ""
    client = InferenceClient(api_key=HF_API_KEY, provider="hf-inference")

    for model in HF_MODELS:
        try:
            output = client.chat_completion(
                model=model,
                messages=[
                    {
                        "role": "user",
                        "content": f"{prompt}\n\n{response_format_prompt}",
                    }
                ],
                max_tokens=220,
                temperature=0.2,
            )

            text_output = ""
            if getattr(output, "choices", None):
                first_choice = output.choices[0]
                if getattr(first_choice, "message", None):
                    text_output = (first_choice.message.content or "").strip()

            if not text_output:
                text_gen = client.text_generation(
                    f"{prompt}\n\n{response_format_prompt}",
                    model=model,
                    max_new_tokens=220,
                    temperature=0.2,
                    return_full_text=False,
                )
                text_output = str(text_gen).strip()

            if text_output:
                return text_output
            last_error = f"model={model} returned empty text"
        except Exception as exc:
            exc_text = str(exc).strip() or repr(exc)
            last_error = f"model={model} error_type={type(exc).__name__} error={exc_text[:320]}"

    raise RuntimeError(f"Hugging Face API error: {last_error or 'no successful model response'}")


@router.post("/generate")
async def generate(payload: AIGenerateRequest):
    if not HF_API_KEY:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="HF_API_KEY is missing. Configure backend AI provider credentials.",
        )

    try:
        output = await generate_with_huggingface(payload.mode, payload.text)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"AI provider error: {str(exc)}",
        ) from exc

    return StreamingResponse(stream_text(output), media_type="text/event-stream")
