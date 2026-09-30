from typing import Optional
from uuid import UUID
from datetime import datetime
from pydantic import BaseModel

class NotificationResponse(BaseModel):
    """Pydantic schema for Notification response object matching public.notifications."""
    id: UUID
    user_id: UUID
    incident_id: Optional[UUID] = None
    report_id: Optional[UUID] = None
    title: str
    message: str
    category: str
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True
