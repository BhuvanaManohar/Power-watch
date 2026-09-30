from typing import Dict, Any
from uuid import UUID
from app.core.supabase import supabase
from app.core.exceptions import (
    DatabaseServiceException,
    ResourceNotFoundException,
    ResourceAlreadyExistsException
)
from app.schemas.profile import ProfileCreateRequest

def get_my_profile(user_id: UUID) -> Dict[str, Any]:
    """
    Fetch the profile record from public.profiles for the given user_id (UUID).
    Raises ResourceNotFoundException if no profile is found.
    """
    try:
        response = (
            supabase.table("profiles")
            .select("id, full_name, phone, role, preferred_language, created_at, updated_at")
            .eq("id", str(user_id))
            .execute()
        )
        if not response.data or len(response.data) == 0:
            raise ResourceNotFoundException("Profile for the authenticated user", str(user_id))
        return response.data[0]
    except ResourceNotFoundException:
        raise
    except Exception as err:
        raise DatabaseServiceException("Failed to retrieve profile from service.")

def create_profile(user_id: UUID, payload: ProfileCreateRequest) -> Dict[str, Any]:
    """
    Create a new citizen profile in public.profiles for the authenticated user_id.
    Role is strictly hardcoded to 'citizen'. Checks for existing profile to return HTTP 409 safely.
    """
    # 1. Pre-check for duplicate profile to raise clean ResourceAlreadyExistsException
    try:
        existing = (
            supabase.table("profiles")
            .select("id")
            .eq("id", str(user_id))
            .execute()
        )
        if existing.data and len(existing.data) > 0:
            raise ResourceAlreadyExistsException("A profile already exists for the authenticated user.")
    except ResourceAlreadyExistsException:
        raise
    except Exception as err:
        raise DatabaseServiceException("Failed to check existing profile in database service.")

    insert_data = {
        "id": str(user_id),
        "full_name": payload.full_name,
        "phone": payload.phone,
        "role": "citizen",
        "preferred_language": payload.preferred_language
    }

    try:
        response = (
            supabase.table("profiles")
            .insert(insert_data)
            .execute()
        )
        if not response.data or len(response.data) == 0:
            raise DatabaseServiceException("Failed to create profile: Empty response from service.")
        return response.data[0]
    except Exception as err:
        # Extra safety check for unique primary key constraint violation
        err_msg = str(err).lower()
        if "duplicate" in err_msg or "unique" in err_msg or "23505" in err_msg:
            raise ResourceAlreadyExistsException("A profile already exists for the authenticated user.")
        raise DatabaseServiceException("Failed to create profile in database service.")
