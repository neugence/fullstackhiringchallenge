"""
AI Service
==========
Provider priority (first available key wins):
  1. Groq  — free tier 14,400 req/day, extremely fast LLaMA 3.1
  2. Google Gemini — free tier 20 req/day
  3. Mock fallback — always available, no API key required
"""

import json
import asyncio
from core.config import GEMINI_API_KEY, GROQ_API_KEY

# ---------------------------------------------------------------------------
# Optional imports
# ---------------------------------------------------------------------------
try:
    from groq import Groq as GroqClient
    HAS_GROQ = True
except ImportError:
    HAS_GROQ = False

try:
    from google import genai as google_genai
    HAS_GENAI = True
except ImportError:
    HAS_GENAI = False


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _groq_complete_sync(prompt: str) -> list[str]:
    """Run a streaming Groq completion synchronously; return list of text chunks."""
    if not HAS_GROQ or not GROQ_API_KEY:
        return []
    try:
        client = GroqClient(api_key=GROQ_API_KEY)
        stream = client.chat.completions.create(
            model="groq/compound-mini",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are an autocomplete assistant for a blog editor. "
                        "Complete the user's sentence naturally. "
                        "Provide ONLY the completion (max 15 words). "
                        "Do NOT repeat any part of the input."
                    ),
                },
                {"role": "user", "content": prompt},
            ],
            max_tokens=60,
            temperature=0.7,
            stream=True,
        )
        chunks = []
        for chunk in stream:
            delta = chunk.choices[0].delta
            if delta and delta.content:
                chunks.append(delta.content)
        return chunks
    except Exception as e:
        print(f"Groq stream error: {e}")
        return []


def _gemini_complete_sync(prompt: str) -> list[str]:
    """Run a streaming Gemini completion synchronously; return list of text chunks."""
    if not HAS_GENAI or not GEMINI_API_KEY:
        return []
    try:
        client = google_genai.Client(api_key=GEMINI_API_KEY)
        response = client.models.generate_content_stream(
            model="gemini-2.5-flash",
            contents=prompt,
        )
        chunks = []
        for chunk in response:
            if chunk.text:
                chunks.append(chunk.text)
        return chunks
    except Exception as e:
        print(f"Gemini stream error: {e}")
        return []


MOCK_COMPLETIONS = [
    [" is", " rapidly", " transforming", " how", " we", " build", " software."],
    [" are", " reshaping", " the", " future", " of", " content", " creation."],
    [" enable", " developers", " to", " ship", " faster", " than", " ever."],
    [" bring", " unprecedented", " capabilities", " to", " everyday", " users."],
    [" represent", " a", " paradigm", " shift", " in", " software", " design."],
]


# ---------------------------------------------------------------------------
# Public async generator
# ---------------------------------------------------------------------------

async def generate_autocomplete_stream(text: str):
    """
    Async SSE generator.

    Tries Groq first (14,400 req/day free), then Gemini (20 req/day free),
    then falls back to a mock stream so the UI always shows ghost text.
    """
    if not text or not text.strip():
        return

    prompt = text.strip()

    # 1. Try Groq (primary — generous free tier)
    if GROQ_API_KEY and HAS_GROQ:
        chunks = await asyncio.to_thread(_groq_complete_sync, prompt)
        if chunks:
            for chunk in chunks:
                yield f"data: {json.dumps(chunk)}\n\n"
                await asyncio.sleep(0.03)
            return

    # 2. Try Gemini (secondary — limited free tier)
    if GEMINI_API_KEY and HAS_GENAI:
        chunks = await asyncio.to_thread(_gemini_complete_sync, prompt)
        if chunks:
            for chunk in chunks:
                yield f"data: {json.dumps(chunk)}\n\n"
                await asyncio.sleep(0.03)
            return

    # 3. Mock fallback — cycles through canned completions
    import hashlib
    idx = int(hashlib.md5(prompt.encode()).hexdigest(), 16) % len(MOCK_COMPLETIONS)
    for word in MOCK_COMPLETIONS[idx]:
        yield f"data: {json.dumps(word)}\n\n"
        await asyncio.sleep(0.08)


# ---------------------------------------------------------------------------
# Non-streaming AI text generation (for AI modal)
# ---------------------------------------------------------------------------

async def generate_ai_text(text: str, prompt_type: str) -> str:
    if prompt_type == "summary":
        prompt_text = f"Summarize this text in 2 sentences:\n{text}"
    elif prompt_type == "grammar":
        prompt_text = f"Fix grammar and improve these sentences:\n{text}"
    else:
        prompt_text = text

    # Try Groq first
    if GROQ_API_KEY and HAS_GROQ:
        try:
            def _sync():
                client = GroqClient(api_key=GROQ_API_KEY)
                resp = client.chat.completions.create(
                    model="groq/compound-mini",
                    messages=[{"role": "user", "content": prompt_text}],
                    max_tokens=512,
                )
                return resp.choices[0].message.content or ""
            result = await asyncio.to_thread(_sync)
            if result:
                return result
        except Exception as e:
            print(f"Groq generate error: {e}")

    # Try Gemini
    if GEMINI_API_KEY and HAS_GENAI:
        try:
            def _sync():
                client = google_genai.Client(api_key=GEMINI_API_KEY)
                response = client.models.generate_content(
                    model="gemini-2.5-flash",
                    contents=prompt_text,
                )
                return response.text or ""
            result = await asyncio.to_thread(_sync)
            if result:
                return result
        except Exception as e:
            print(f"Gemini generate error: {e}")

    return "[AI Copilot] Unable to generate text. Please check your API keys."
