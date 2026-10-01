from typing import Optional
from uuid import UUID
from datetime import datetime
from pydantic import BaseModel

class LocationCreateRequest(BaseModel):
    """Pydantic schema for creating a new Location."""
    name: str
    address: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class LocationUpdateRequest(BaseModel):
    """Pydantic schema for updating an existing Location."""
    name: Optional[str] = None
    address: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class LocationResponse(BaseModel):
    """Pydantic schema for Location response object matching public.locations."""
    id: UUID
    name: str
    address: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
