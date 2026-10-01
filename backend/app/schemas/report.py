from typing import Optional
from uuid import UUID
from datetime import datetime
from pydantic import BaseModel, field_validator

VALID_REPORT_STATUSES = {
    "Submitted",
    "Under Review",
    "Linked to Incident",
    "Resolved",
    "Rejected"
}

class ReportCreateRequest(BaseModel):
    """Pydantic schema for authenticated citizen report creation payload."""
    location_id: UUID
    outage_type: str
    description: str
    photo_url: Optional[str] = None

class ReportUpdateRequest(BaseModel):
    """Pydantic schema for officer/admin report status and incident linking update payload."""
    incident_id: Optional[UUID] = None
    status: Optional[str] = None

    @field_validator("status")
    @classmethod
    def validate_status(cls, v: Optional[str]) -> Optional[str]:
        if v is not None and v not in VALID_REPORT_STATUSES:
            raise ValueError(
                f"Invalid status '{v}'. Allowed statuses: {', '.join(sorted(VALID_REPORT_STATUSES))}"
            )
        return v

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
