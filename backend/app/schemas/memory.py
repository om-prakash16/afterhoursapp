import uuid
from typing import Optional, List
from pydantic import BaseModel, ConfigDict
from datetime import datetime

class MemoryBase(BaseModel):
    type: str # interest, mood, event
    value: str

class MemoryCreate(MemoryBase):
    user_id: uuid.UUID

class MemoryUpdate(BaseModel):
    type: Optional[str] = None
    value: Optional[str] = None

class Memory(MemoryBase):
    id: uuid.UUID
    user_id: uuid.UUID
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class MemorySearchResponse(BaseModel):
    query: str
    results: List[Memory]
    count: int
