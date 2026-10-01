from typing import Optional
from uuid import UUID
from datetime import datetime
from pydantic import BaseModel, field_validator

class ProfileCreateRequest(BaseModel):
    """Pydantic schema for citizen profile creation payload."""
    full_name: Optional[str] = None
    phone: Optional[str] = None
    preferred_language: str = "en"

    @field_validator("preferred_language")
    @classmethod
    def validate_language(cls, v: str) -> str:
        allowed = {"en", "te"}
        if v not in allowed:
            raise ValueError("preferred_language must be either 'en' or 'te'.")
        return v

class ProfileUpdateRequest(BaseModel):
    """Pydantic schema for editing editable profile attributes."""
    full_name: Optional[str] = None
    phone: Optional[str] = None
    preferred_language: Optional[str] = None

    @field_validator("preferred_language")
    @classmethod
    def validate_language(cls, v: Optional[str]) -> Optional[str]:
        if v is not None:
            allowed = {"en", "te"}
            if v not in allowed:
                raise ValueError("preferred_language must be either 'en' or 'te'.")
        return v

class ProfileResponse(BaseModel):
    """Pydantic schema for Profile response object matching public.profiles."""
    id: UUID
    full_name: Optional[str] = None
    phone: Optional[str] = None
    role: str
    preferred_language: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
