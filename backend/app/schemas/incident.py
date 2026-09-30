from typing import Optional
from uuid import UUID
from datetime import datetime
from pydantic import BaseModel

class IncidentResponse(BaseModel):
    """Pydantic schema for Incident response object matching public.incidents."""
    id: UUID
    location_id: UUID
    title: str
    status: str
    severity: str
    outage_type: str
    estimated_restoration: Optional[datetime] = None
    actual_restoration: Optional[datetime] = None
    affected_households: Optional[int] = None
    assigned_crew: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
