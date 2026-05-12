from sqlalchemy import String, Boolean, Column, Integer, DateTime, func
from sqlalchemy.orm import relationship
from app.models.base import AuditMixin
from app.core.database import Base

class User(Base, AuditMixin):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    full_name = Column(String(255), nullable=True)
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)
