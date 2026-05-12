from typing import Annotated, Any, List, Dict, Optional
from pydantic import BaseModel

class ChatMessage(BaseModel):
    role: str  # "user" or "assistant"
    content: str

import uuid

class ChatRequest(BaseModel):
    user_id: uuid.UUID
    message: str
    companion_id: Optional[str] = None
    history: List[ChatMessage] = []

class ChatResponse(BaseModel):
    response: str
    mood_detected: Optional[str] = None
    suggested_actions: List[str] = []
