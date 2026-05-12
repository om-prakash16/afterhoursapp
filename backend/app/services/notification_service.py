from sqlalchemy.ext.asyncio import AsyncSession
from app.models.trading import Notification
from app.api.ws.manager import manager
from typing import Optional

class NotificationService:
    """
    Handles internal notifications and real-time alerts.
    """
    async def create_notification(
        self, 
        user_id: int, 
        type: str, 
        title: str, 
        message: str, 
        session: AsyncSession
    ):
        # 1. Save to DB
        notif = Notification(
            user_id=user_id,
            type=type,
            title=title,
            message=message
        )
        session.add(notif)
        await session.commit()
        
        # 2. Push via WebSocket
        await manager.send_personal_message({
            "type": "NOTIFICATION",
            "data": {
                "id": notif.id,
                "type": type,
                "title": title,
                "message": message,
                "created_at": str(notif.created_at)
            }
        }, user_id)
        
        return notif

    async def send_trade_alert(self, user_id: int, asset: str, side: str, session: AsyncSession):
        return await self.create_notification(
            user_id, "SIGNAL", "New Signal Detected", 
            f"Aura has analyzed a new {side} signal for {asset} matching your DNA.", 
            session
        )

    async def send_emotional_warning(self, user_id: int, risk: str, session: AsyncSession):
        return await self.create_notification(
            user_id, "EMOTION", "Psychological Warning", 
            f"Aura detected signs of {risk}. Consider stepping back for 15 minutes.", 
            session
        )

    async def send_portfolio_update(self, user_id: int, change: str, session: AsyncSession):
        return await self.create_notification(
            user_id, "PORTFOLIO", "Capital Update", 
            f"Your guarded capital has shifted: {change}.", 
            session
        )

    async def send_leaderboard_alert(self, user_id: int, new_rank: int, session: AsyncSession):
        return await self.create_notification(
            user_id, "SOCIAL", "Rank Movement", 
            f"Congratulations! You've climbed to Rank #{new_rank} in the Hall of Alpha.", 
            session
        )

notification_service = NotificationService()
