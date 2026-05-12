from typing import Annotated, Any, List, Dict, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.models.companion import Companion
from app.schemas.companion import CompanionCreate, Companion as CompanionSchema

router = APIRouter(prefix="/companions", tags=["companions"])

@router.get("/", response_model=List[CompanionSchema])
async def list_companions(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Companion))
    return result.scalars().all()

@router.post("/", response_model=CompanionSchema)
async def create_companion(companion_in: CompanionCreate, db: AsyncSession = Depends(get_db)):
    # Note: user_id should normally come from auth dependency
    # For now, we assume a placeholder user_id if not provided
    # In a real app, you'd use get_current_user
    raise HTTPException(status_code=501, detail="Companion creation requires authentication context")
