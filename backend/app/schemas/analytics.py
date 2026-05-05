from typing import List, Dict, Any, Optional
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
