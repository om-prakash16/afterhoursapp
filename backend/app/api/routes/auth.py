from typing import Annotated, Any, List, Dict, Optional
from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core import security
from app.core.config import settings
from app.core.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserOut, Token
from app.api.deps import get_current_user

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=UserOut)
async def register(
    session: Annotated[AsyncSession, Depends(get_db)],
    user_in: UserCreate
) -> Any:
    """
    Register a new user.
    """
    result = await session.execute(select(User).where(User.email == user_in.email))
    user = result.scalars().first()
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system.",
        )
    
    db_user = User(
        email=user_in.email,
        hashed_password=security.get_password_hash(user_in.password),
        full_name=user_in.full_name,
    )
    session.add(db_user)
    await session.commit()
    await session.refresh(db_user)
    return db_user

@router.post("/login", response_model=Token)
async def login(
    session: Annotated[AsyncSession, Depends(get_db)],
    login_data: dict # Simple JSON login for frontend compatibility
) -> Any:
    """
    Login with email and password.
    """
    email = login_data.get("username") or login_data.get("email")
    password = login_data.get("password")
    
    if not email or not password:
        raise HTTPException(status_code=400, detail="Missing email or password")

    result = await session.execute(select(User).where(User.email == email))
    user = result.scalars().first()
    
    if not user or not security.verify_password(password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    elif not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return {
        "access_token": security.create_access_token(
            user.id, expires_delta=access_token_expires
        ),
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name
        }
    }

@router.post("/login-form", response_model=Token)
async def login_form(
    session: Annotated[AsyncSession, Depends(get_db)],
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()]
) -> Any:
    """
    Standard OAuth2 compatible token login.
    """
    result = await session.execute(select(User).where(User.email == form_data.username))
    user = result.scalars().first()
    
    if not user or not security.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return {
        "access_token": security.create_access_token(
            user.id, expires_delta=access_token_expires
        ),
        "token_type": "bearer",
    }

@router.get("/me", response_model=UserOut)
async def get_me(
    current_user: Annotated[User, Depends(get_current_user)]
) -> Any:
    """
    Get current user.
    """
    return current_user
