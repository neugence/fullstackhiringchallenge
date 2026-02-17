import google.generativeai as genai
from datetime import datetime
from os import getenv

# Configure Gemini
genai.configure(api_key=getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-2.5-flash")

class AIService:

    @staticmethod
    async def fix_grammar(text: str) -> str:
        prompt = f"""
You are an expert editor. Fix the grammar, spelling, and improve the clarity of the following text.

CRITICAL INSTRUCTION:
- Preserve ALL Markdown formatting.
- Do NOT add filler or explanations.
- Return ONLY the improved Markdown text.

Original Text:
{text}
"""
        response = model.generate_content(prompt)
        return response.text.strip()

    @staticmethod
    async def generate(text: str, action: str) -> str:

        if action == "summarize":
            prompt = f"""
Provide a short, professional 1–2 sentence summary of this text.
Do NOT include markdown or filler.

Text:
{text}
"""

        elif action == "continue":
            prompt = f"""
Complete the following text with ONLY 3–5 words.
Do NOT repeat input.

Input: {text}
Completion:
"""

        elif action == "title":
            prompt = f"""
Generate a short, catchy 3–6 word title.
No quotes. No prefixes.

Text:
{text[:2000]}
"""

        else:
            raise ValueError("Invalid action type")

        response = model.generate_content(prompt)
        return response.text.strip()
