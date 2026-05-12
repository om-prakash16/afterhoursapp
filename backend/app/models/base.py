from datetime import datetime, timezone
from sqlalchemy import DateTime
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.sql import func

class AuditMixin:
    """Mixin for models that need created_at, updated_at, and is_deleted."""
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        default=lambda: datetime.now(timezone.utc),
        server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        server_default=func.now()
    )
    is_deleted: Mapped[bool] = mapped_column(default=False, index=True)
