from typing import Annotated, Any, List, Dict, Optional
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    # App Settings
    APP_NAME: str = "AI Companion API"
    DEBUG: bool = True
    API_V1_STR: str = "/api/v1"

    # Database Settings
    DATABASE_URL: str

    # Security Settings
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours

    # CORS Settings
    BACKEND_CORS_ORIGINS: List[str] = ["*"]

    # AI API Keys
    OPENAI_API_KEY: Optional[str] = None
    ANTHROPIC_API_KEY: Optional[str] = None

    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True)

settings = Settings()
