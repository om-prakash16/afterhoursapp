from typing import Annotated, Any, List, Dict, Optional
from pydantic import BaseModel

class MoodPoint(BaseModel):
    mood: Optional[str]
    timestamp: str

class TopicCount(BaseModel):
    topic: str
    count: int

class AnalyticsResponse(BaseModel):
    mood_trend: List[MoodPoint]
    most_common_topics: List[TopicCount]
    engagement_count: int
