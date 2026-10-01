from typing import Optional
from uuid import UUID
from datetime import datetime
from pydantic import BaseModel

class IncidentCreateRequest(BaseModel):
    """Pydantic schema for creating a new Incident."""
    title: str
    location_id: UUID
    severity: str
    outage_type: str
    status: Optional[str] = "investigating"
    estimated_restoration: Optional[datetime] = None
    actual_restoration: Optional[datetime] = None
    affected_households: Optional[int] = None
    assigned_crew: Optional[str] = None

class IncidentUpdateRequest(BaseModel):
    """Pydantic schema for updating an existing Incident (all fields optional)."""
    title: Optional[str] = None
    location_id: Optional[UUID] = None
    severity: Optional[str] = None
    outage_type: Optional[str] = None
    status: Optional[str] = None
    estimated_restoration: Optional[datetime] = None
    actual_restoration: Optional[datetime] = None
    affected_households: Optional[int] = None
    assigned_crew: Optional[str] = None

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
