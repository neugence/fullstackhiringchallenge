from pydantic import BaseModel
from typing import Optional

class AIRequest(BaseModel):
    text: str
    prompt_type: str = "summary" # summary, grammar, etc.

class AutocompleteRequest(BaseModel):
    text: str
    cursor_offset: Optional[int] = None
