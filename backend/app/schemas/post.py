from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class PostUpdateSchema(BaseModel):
    lexical_state: Optional[dict] = None  
    status: Optional[str] = None
    title: Optional[str] = None