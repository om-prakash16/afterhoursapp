import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc
from app.models.conversation import Conversation
from app.models.memory import Memory
from app.schemas.analytics import AnalyticsResponse, MoodPoint, TopicCount

class AnalyticsService:
    async def get_user_analytics(self, db: AsyncSession, user_id: uuid.UUID) -> AnalyticsResponse:
        # 1. Engagement Count
        count_stmt = select(func.count(Conversation.id)).where(Conversation.user_id == user_id)
        engagement_count = await db.scalar(count_stmt)

        # 2. Mood Trend (Last 10 messages)
        mood_stmt = (
            select(Conversation.mood_detected, Conversation.created_at)
            .where(Conversation.user_id == user_id)
            .order_by(desc(Conversation.created_at))
            .limit(10)
        )
        mood_results = await db.execute(mood_stmt)
        # Reverse to get chronological order for the trend
        mood_trend_raw = list(mood_results.all())
        mood_trend_raw.reverse()
        
        mood_trend = [
            MoodPoint(
                mood=row.mood_detected, 
                timestamp=row.created_at.isoformat() if row.created_at else ""
            ) 
            for row in mood_trend_raw
        ]

        # 3. Most Common Topics
        topics_stmt = (
            select(Memory.value, func.count(Memory.id).label("topic_count"))
            .where(Memory.user_id == user_id, Memory.type == "interest")
            .group_by(Memory.value)
            .order_by(desc("topic_count"))
            .limit(5)
        )
        topics_results = await db.execute(topics_stmt)
        
        most_common_topics = [
            TopicCount(topic=row.value, count=row.topic_count) 
            for row in topics_results.all()
        ]

        return AnalyticsResponse(
            mood_trend=mood_trend,
            most_common_topics=most_common_topics,
            engagement_count=engagement_count or 0
        )

analytics_service = AnalyticsService()
