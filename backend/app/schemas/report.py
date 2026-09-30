from typing import Optional
from uuid import UUID
from datetime import datetime
from pydantic import BaseModel

class ReportCreateRequest(BaseModel):
    """Pydantic schema for authenticated citizen report creation payload."""
    location_id: UUID
    outage_type: str
    description: Optional[str] = None
    photo_url: Optional[str] = None

class ReportResponse(BaseModel):
    """Pydantic schema for Report response object matching public.reports."""
    id: UUID
    user_id: UUID
    location_id: UUID
    incident_id: Optional[UUID] = None
    outage_type: str
    description: Optional[str] = None
    status: str
    photo_url: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
