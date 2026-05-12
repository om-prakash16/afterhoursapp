from typing import Annotated, Any, List, Dict, Optional
import uuid
from pydantic import BaseModel, ConfigDict

class CompanionBase(BaseModel):
    name: str
    persona: Optional[str] = None
    mood: str = "neutral"
    settings: Dict[str, Any] = {}

class CompanionCreate(CompanionBase):
    pass

class CompanionUpdate(BaseModel):
    name: Optional[str] = None
    persona: Optional[str] = None
    mood: Optional[str] = None
    settings: Optional[Dict[str, Any]] = None

class Companion(CompanionBase):
    id: uuid.UUID
    user_id: uuid.UUID

    model_config = ConfigDict(from_attributes=True)
