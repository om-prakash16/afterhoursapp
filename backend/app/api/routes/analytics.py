import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.schemas.analytics import AnalyticsResponse
from app.services.analytics_service import analytics_service

router = APIRouter(prefix="/analytics", tags=["analytics"])

@router.get("/{user_id}", response_model=AnalyticsResponse)
async def get_analytics(user_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    """
    Retrieve analytics for a specific user.
    Includes mood trends, common topics, and overall engagement count.
    """
    try:
        return await analytics_service.get_user_analytics(db, user_id)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch analytics: {str(e)}"
        )
