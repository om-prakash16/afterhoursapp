from typing import Annotated, Any, List, Dict, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.schemas.chat import ChatRequest, ChatResponse
from app.services.aura_service import aura
from app.api.deps import get_current_user
from app.models.user import User
from app.models.conversation import Conversation

router = APIRouter(prefix="/chat", tags=["chat"])

@router.post("/", response_model=ChatResponse)
async def chat(
    chat_request: ChatRequest, 
    current_user: Annotated[User, Depends(get_current_user)],
    db: AsyncSession = Depends(get_db)
):
    """
    Endpoint for chat interactions with Aura.
    """
    result = await aura.get_response(current_user.id, chat_request.message, db)
    return {
        "response": result["response"],
        "mood_detected": result["mood"]
    }

@router.get("/history")
async def get_chat_history(
    current_user: Annotated[User, Depends(get_current_user)],
    db: AsyncSession = Depends(get_db),
    q: str = None
):
    query = select(Conversation).where(Conversation.user_id == current_user.id)
    if q:
        query = query.where(Conversation.message.ilike(f"%{q}%"))
    
    result = await db.execute(query.order_by(Conversation.created_at.desc()).limit(100))
    return result.scalars().all()

@router.get("/history/{conv_id}")
async def get_conversation_detail(
    conv_id: int,
    current_user: Annotated[User, Depends(get_current_user)],
    db: AsyncSession = Depends(get_db)
):
    result = await db.scalar(
        select(Conversation).where(
            Conversation.id == conv_id,
            Conversation.user_id == current_user.id
        )
    )
    if not result:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return result
