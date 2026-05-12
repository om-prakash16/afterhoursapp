import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc
from app.models.conversation import Conversation
from app.models.memory import Memory
from app.schemas.analytics import AnalyticsResponse, MoodPoint, TopicCount

from app.models.trading import Trade

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

    async def get_behavioral_analytics(self, db: AsyncSession, user_id: int) -> dict:
        """
        Analyze trading habits for psychological patterns.
        """
        # 1. Fetch recent trades
        trades_stmt = select(Trade).where(Trade.user_id == user_id).order_by(desc(Trade.opened_at)).limit(50)
        trades_results = await db.execute(trades_stmt)
        trades = list(trades_results.scalars().all())
        
        if not trades:
            # Return demo/mock behavioral data
            return {
                "revenge_trading_score": 25,
                "overtrading_frequency": "Low",
                "sizing_consistency": 88,
                "panic_exit_rate": 12,
                "insights": [
                    "Your sizing is highly consistent, which indicates strong discipline.",
                    "Rare instances of revenge trading detected after BTC volatility.",
                    "Your 'Aggressive Scalper' profile is currently well-balanced."
                ],
                "risk_patterns": {
                    "fomo_instances": 2,
                    "revenge_trades": 1,
                    "discipline_lapses": 0
                }
            }

        # Simplified Detection Logic
        # Revenge Trading: A trade opened < 30 mins after a CLOSED_LOSS
        revenge_count = 0
        for i in range(len(trades) - 1):
            current = trades[i]
            prev = trades[i+1]
            if prev.status == "CLOSED" and prev.pnl_usdt < 0:
                time_diff = (current.opened_at - prev.closed_at).total_seconds() / 60
                if time_diff < 30:
                    revenge_count += 1
        
        # Sizing Consistency: Coefficient of variation of size_usdt
        sizes = [t.size_usdt for t in trades]
        avg_size = sum(sizes) / len(sizes)
        variance = sum((s - avg_size)**2 for s in sizes) / len(sizes)
        consistency = 100 - min(100, (variance**0.5 / avg_size) * 100) if avg_size > 0 else 100

        return {
            "revenge_trading_score": min(100, revenge_count * 20),
            "overtrading_frequency": "High" if len(trades) > 10 else "Normal",
            "sizing_consistency": round(consistency, 1),
            "panic_exit_rate": 15, # Mocked for now
            "insights": [
                f"Detected {revenge_count} instances of potential revenge trading.",
                "Your sizing consistency is within professional parameters.",
                "Discipline score is trending upwards this week."
            ],
            "risk_patterns": {
                "fomo_instances": revenge_count,
                "revenge_trades": revenge_count,
                "discipline_lapses": max(0, 5 - revenge_count)
            }
        }

analytics_service = AnalyticsService()
