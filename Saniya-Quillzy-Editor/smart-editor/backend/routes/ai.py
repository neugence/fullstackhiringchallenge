from fastapi import APIRouter, HTTPException
import os
import re
from dotenv import load_dotenv

load_dotenv()

router = APIRouter(prefix="/api/ai")

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Try multiple models in order of preference
MODELS_TO_TRY = [
    "gemini-2.0-flash-lite",
    "gemini-2.0-flash",
    "gemini-1.5-flash",
]


def call_gemini(prompt: str) -> str:
    """Helper to call Gemini API using the google-generativeai SDK."""
    if not GEMINI_API_KEY:
        raise HTTPException(status_code=500, detail="Gemini API Key missing in server environment")

    try:
        import google.generativeai as genai
        genai.configure(api_key=GEMINI_API_KEY)

        last_error = None
        for model_name in MODELS_TO_TRY:
            try:
                model = genai.GenerativeModel(model_name)
                response = model.generate_content(prompt)
                if response and response.text:
                    return response.text
            except Exception as e:
                last_error = e
                print(f"Model {model_name} failed: {str(e)}")
                continue

        # If all models failed
        if last_error:
            print(f"All Gemini models failed. Last error: {str(last_error)}")
            raise HTTPException(
                status_code=503,
                detail=f"AI service unavailable: {str(last_error)}"
            )

        raise HTTPException(status_code=500, detail="No response from AI")

    except HTTPException:
        raise
    except Exception as e:
        print(f"Gemini Exception: {str(e)}")
        raise HTTPException(status_code=500, detail=f"AI generation error: {str(e)}")


# --- Local fallback text processing ---

def local_summarize(text: str) -> str:
    """Generate a basic summary locally when AI API is unavailable."""
    sentences = re.split(r'(?<=[.!?])\s+', text.strip())
    sentences = [s.strip() for s in sentences if s.strip() and len(s.strip()) > 10]
    total_words = len(text.split())
    total_sentences = len(sentences)
    reading_time = max(1, total_words // 200)

    # Pick key sentences (first, middle, last)
    key_sentences = []
    if total_sentences >= 1:
        key_sentences.append(sentences[0])
    if total_sentences >= 4:
        key_sentences.append(sentences[total_sentences // 3])
    if total_sentences >= 6:
        key_sentences.append(sentences[2 * total_sentences // 3])
    if total_sentences >= 2 and sentences[-1] not in key_sentences:
        key_sentences.append(sentences[-1])

    # Extract potential topic words (capitalize and repeated words)
    words = text.lower().split()
    word_freq = {}
    stop_words = {'the', 'a', 'an', 'is', 'are', 'was', 'were', 'in', 'on', 'at', 'to',
                  'for', 'of', 'and', 'or', 'but', 'it', 'its', 'this', 'that', 'with',
                  'has', 'have', 'had', 'not', 'from', 'by', 'be', 'been', 'as', 'can',
                  'will', 'would', 'could', 'should', 'may', 'might', 'do', 'does', 'did',
                  'we', 'you', 'i', 'he', 'she', 'they', 'our', 'your', 'my', 'their',
                  'more', 'very', 'also', 'into', 'about', 'than', 'them', 'these', 'those',
                  'such', 'many', 'some', 'all', 'each', 'every', 'both', 'few', 'most'}
    for w in words:
        clean = re.sub(r'[^a-z]', '', w)
        if clean and len(clean) > 3 and clean not in stop_words:
            word_freq[clean] = word_freq.get(clean, 0) + 1

    top_topics = sorted(word_freq.items(), key=lambda x: x[1], reverse=True)[:5]
    topics = [t[0].capitalize() for t in top_topics]

    summary_parts = []
    summary_parts.append("## Summary\n")

    if key_sentences:
        summary_parts.append("**Overview:**\n")
        for s in key_sentences[:3]:
            # Truncate long sentences
            if len(s) > 150:
                s = s[:147] + "..."
            summary_parts.append(f"• {s}\n")

    summary_parts.append(f"\n**Key Topics:** {', '.join(topics) if topics else 'General content'}\n")
    summary_parts.append(f"\n**Statistics:**\n• {total_words} words, {total_sentences} sentences\n• Estimated reading time: {reading_time} min")

    return "\n".join(summary_parts)


def local_fix_grammar(text: str) -> str:
    """Fix common grammar issues locally when AI API is unavailable."""
    fixed = text

    # Fix common double spaces
    fixed = re.sub(r' {2,}', ' ', fixed)

    # Fix missing space after punctuation
    fixed = re.sub(r'([.!?,;:])([A-Za-z])', r'\1 \2', fixed)

    # Fix common spelling mistakes
    common_fixes = {
        r'\bteh\b': 'the',
        r'\brecieve\b': 'receive',
        r'\boccured\b': 'occurred',
        r'\bseperate\b': 'separate',
        r'\bdefinately\b': 'definitely',
        r'\boccasionaly\b': 'occasionally',
        r'\bneccessary\b': 'necessary',
        r'\bneccessary\b': 'necessary',
        r'\baccommodate\b': 'accommodate',
        r'\bwhich\b(?=\s+is)': 'which',
        r'\bthier\b': 'their',
        r'\byou\'re\b(?=\s+\w+ing)': "you're",
        r'\bits\b(?=\s+very)': "it's",
        r'\blifes\b': 'lives',
        r'\balot\b': 'a lot',
        r'\bcould of\b': 'could have',
        r'\bshould of\b': 'should have',
        r'\bwould of\b': 'would have',
        r'\bthere\b(?=\s+(is|are|was|were)\b)': 'there',
        r'\binfomation\b': 'information',
        r'\benviroment\b': 'environment',
        r'\bgoverment\b': 'government',
        r'\bdevelopement\b': 'development',
        r'\bmanagment\b': 'management',
        r'\bachivment\b': 'achievement',
    }

    for pattern, replacement in common_fixes.items():
        fixed = re.sub(pattern, replacement, fixed, flags=re.IGNORECASE)

    # Capitalize first letter of sentences
    fixed = re.sub(r'(?:^|(?<=[.!?]\s))\s*([a-z])', lambda m: m.group(0).upper(), fixed)

    # Capitalize 'I' standing alone
    fixed = re.sub(r'\bi\b', 'I', fixed)

    return fixed


@router.post("/generate")
async def generate_summary(body: dict):
    """Generate a professional summary of the blog content."""
    text = body.get("text")
    if not text:
        raise HTTPException(status_code=400, detail="No content provided for AI")

    prompt = f"Summarize the following blog content professionally. Keep it concise and well-structured:\n\n{text}"

    try:
        result = call_gemini(prompt)
        return {"result": result}
    except Exception as e:
        print(f"AI Summary failed, using local fallback: {str(e)}")
        result = local_summarize(text)
        return {"result": result}


@router.post("/fix-grammar")
async def fix_grammar(body: dict):
    """Fix grammar and improve writing quality."""
    text = body.get("text")
    if not text:
        raise HTTPException(status_code=400, detail="No content provided for AI")

    prompt = (
        "Fix the grammar, spelling, and punctuation in the following text. "
        "Improve clarity and readability while keeping the original meaning and tone. "
        "Return ONLY the corrected text without any explanations or notes:\n\n"
        f"{text}"
    )

    try:
        result = call_gemini(prompt)
        return {"result": result}
    except Exception as e:
        print(f"AI Grammar fix failed, using local fallback: {str(e)}")
        result = local_fix_grammar(text)
        return {"result": result}