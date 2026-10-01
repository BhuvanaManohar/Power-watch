from typing import Dict, Any
from uuid import UUID
from supabase import Client
from app.core.exceptions import (
    DatabaseServiceException,
    ResourceNotFoundException,
    ResourceAlreadyExistsException
)
from app.schemas.profile import ProfileCreateRequest, ProfileUpdateRequest

PROFILE_FIELDS = "id, full_name, phone, role, preferred_language, created_at, updated_at"

def get_my_profile(client: Client, user_id: UUID) -> Dict[str, Any]:
    """
    Fetch the profile record from public.profiles for the given user_id using the request-scoped client.
    Raises ResourceNotFoundException if no profile is found.
    """
    try:
        response = (
            client.table("profiles")
            .select(PROFILE_FIELDS)
            .eq("id", str(user_id))
            .execute()
        )
        if not response.data or len(response.data) == 0:
            raise ResourceNotFoundException("Profile for the authenticated user", str(user_id))
        return response.data[0]
    except ResourceNotFoundException:
        raise
    except Exception as err:
        err_msg = str(err)
        if "42501" in err_msg or "row-level security" in err_msg.lower() or "permission denied" in err_msg.lower():
            raise DatabaseServiceException("Permission denied by security policy.")
        raise DatabaseServiceException("Failed to retrieve profile from service.")

def create_profile(client: Client, user_id: UUID, payload: ProfileCreateRequest) -> Dict[str, Any]:
    """
    Create a new citizen profile in public.profiles for the authenticated user_id using the request-scoped client.
    Role is strictly hardcoded to 'citizen'. Checks for existing profile to return HTTP 409 safely.
    """
    # 1. Pre-check for duplicate profile to raise clean ResourceAlreadyExistsException
    try:
        existing = (
            client.table("profiles")
            .select("id")
            .eq("id", str(user_id))
            .execute()
        )
        if existing.data and len(existing.data) > 0:
            raise ResourceAlreadyExistsException("A profile already exists for the authenticated user.")
    except ResourceAlreadyExistsException:
        raise
    except Exception as err:
        err_msg = str(err)
        if "42501" in err_msg or "row-level security" in err_msg.lower() or "permission denied" in err_msg.lower():
            raise DatabaseServiceException("Permission denied by security policy.")
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
            client.table("profiles")
            .insert(insert_data)
            .execute()
        )
        if not response.data or len(response.data) == 0:
            raise DatabaseServiceException("Failed to create profile: Empty response from service.")
        return response.data[0]
    except Exception as err:
        err_msg = str(err).lower()
        if "duplicate" in err_msg or "unique" in err_msg or "23505" in err_msg:
            raise ResourceAlreadyExistsException("A profile already exists for the authenticated user.")
        if "42501" in err_msg or "row-level security" in err_msg or "permission denied" in err_msg:
            raise DatabaseServiceException("Permission denied by security policy.")
        raise DatabaseServiceException("Failed to create profile in database service.")

def update_my_profile(client: Client, user_id: UUID, payload: ProfileUpdateRequest) -> Dict[str, Any]:
    """
    Update editable profile fields (full_name, phone, preferred_language) for the authenticated user
    using the request-scoped authenticated Supabase client.
    Role, id, user_id, and timestamps are protected from modification.
    """
    update_data = payload.model_dump(exclude_unset=True)
    if not update_data:
        return get_my_profile(client=client, user_id=user_id)

    try:
        response = (
            client.table("profiles")
            .update(update_data)
            .eq("id", str(user_id))
            .execute()
        )
        if not response.data or len(response.data) == 0:
            # Check if record actually exists vs RLS/permission failure
            get_my_profile(client=client, user_id=user_id)
            raise DatabaseServiceException("Permission denied by security policy.")
        return response.data[0]
    except ResourceNotFoundException:
        raise
    except DatabaseServiceException:
        raise
    except Exception as err:
        err_msg = str(err)
        if "42501" in err_msg or "row-level security" in err_msg.lower() or "permission denied" in err_msg.lower():
            raise DatabaseServiceException("Permission denied by security policy.")
        raise DatabaseServiceException("Failed to update profile in database service.")
