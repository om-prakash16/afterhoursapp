from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.schemas.chat import ChatRequest, ChatResponse
from app.services.chat_service import chat_service

router = APIRouter(prefix="/chat", tags=["chat"])

@router.post("/", response_model=ChatResponse)
async def chat(chat_request: ChatRequest, db: AsyncSession = Depends(get_db)):
    """
    Endpoint for chat interactions with the AI companion.
    """
    response = await chat_service.process_chat(db, chat_request)
    return response
