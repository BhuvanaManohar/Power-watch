from typing import Optional
from uuid import UUID
from pydantic import BaseModel

class LocationResponse(BaseModel):
    """Pydantic schema for Location response object matching public.locations."""
    id: UUID
    name: str
    address: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None

    class Config:
        from_attributes = True
