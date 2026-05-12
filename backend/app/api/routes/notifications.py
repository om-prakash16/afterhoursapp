from typing import Annotated, Any, List, Dict, Optional
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc, update
from app.core.database import get_db
from app.models.trading import Notification
from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter(prefix="/notifications", tags=["notifications"])

@router.get("/")
async def get_notifications(
    current_user: Annotated[User, Depends(get_current_user)],
    session: AsyncSession = Depends(get_db)
):
    result = await session.execute(
        select(Notification)
        .where(Notification.user_id == current_user.id)
        .order_by(desc(Notification.created_at))
        .limit(20)
    )
    return result.scalars().all()

@router.post("/read-all")
async def mark_all_read(
    current_user: Annotated[User, Depends(get_current_user)],
    session: AsyncSession = Depends(get_db)
):
    await session.execute(
        update(Notification)
        .where(Notification.user_id == current_user.id)
        .values(is_read=1)
    )
    await session.commit()
    return {"message": "All marked read"}
