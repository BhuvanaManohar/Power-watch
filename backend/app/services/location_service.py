from typing import List, Dict, Any
from uuid import UUID
from supabase import Client
from app.core.supabase import supabase
from app.core.exceptions import DatabaseServiceException, ResourceNotFoundException
from app.schemas.location import LocationCreateRequest, LocationUpdateRequest

LOCATION_FIELDS = "id, name, address, latitude, longitude, created_at, updated_at"

def get_locations(limit: int = 50) -> List[Dict[str, Any]]:
    """
    Fetch up to `limit` location records from public.locations.
    Public read-only operation using standard Supabase client.
    """
    try:
        response = (
            supabase.table("locations")
            .select(LOCATION_FIELDS)
            .limit(limit)
            .execute()
        )
        return response.data
    except Exception as err:
        raise DatabaseServiceException("Failed to retrieve locations from service.")

def get_location_by_id(location_id: UUID) -> Dict[str, Any]:
    """
    Fetch a single location by ID from public.locations.
    Public read-only operation using standard Supabase client.
    """
    try:
        response = (
            supabase.table("locations")
            .select(LOCATION_FIELDS)
            .eq("id", str(location_id))
            .execute()
        )
        if not response.data or len(response.data) == 0:
            raise ResourceNotFoundException("Location", str(location_id))
        return response.data[0]
    except ResourceNotFoundException:
        raise
    except Exception as err:
        raise DatabaseServiceException("Failed to retrieve location from service.")

def create_location(client: Client, payload: LocationCreateRequest) -> Dict[str, Any]:
    """
    Create a new location using the request-scoped authenticated Supabase client.
    RLS policy 'Locations officer insert' enforces officer/admin insert authorization.
    """
    insert_data = payload.model_dump(exclude_unset=True)

    try:
        response = (
            client.table("locations")
            .insert(insert_data)
            .execute()
        )
        if not response.data or len(response.data) == 0:
            raise DatabaseServiceException("Failed to create location: Empty response from service.")
        return response.data[0]
    except Exception as err:
        err_msg = str(err)
        if "42501" in err_msg or "row-level security" in err_msg.lower() or "permission denied" in err_msg.lower():
            raise DatabaseServiceException("Permission denied by security policy.")
        raise DatabaseServiceException("Failed to create location in database service.")

def update_location(location_id: UUID, client: Client, payload: LocationUpdateRequest) -> Dict[str, Any]:
    """
    Update an existing location using the request-scoped authenticated Supabase client.
    RLS policy 'Locations officer update' enforces officer/admin update authorization.
    """
    update_data = payload.model_dump(exclude_unset=True)
    if not update_data:
        return get_location_by_id(location_id)

    try:
        response = (
            client.table("locations")
            .update(update_data)
            .eq("id", str(location_id))
            .execute()
        )
        if not response.data or len(response.data) == 0:
            # Check if record actually exists vs RLS/permission failure
            get_location_by_id(location_id)
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
        raise DatabaseServiceException("Failed to update location in database service.")

def delete_location(location_id: UUID, client: Client) -> None:
    """
    Delete a location by ID using the request-scoped authenticated Supabase client.
    RLS policy 'Locations admin delete' enforces admin delete authorization.
    """
    try:
        response = (
            client.table("locations")
            .delete()
            .eq("id", str(location_id))
            .execute()
        )
        if not response.data or len(response.data) == 0:
            # Check if record exists vs RLS/permission failure
            get_location_by_id(location_id)
            raise DatabaseServiceException("Permission denied by security policy.")
    except ResourceNotFoundException:
        raise
    except DatabaseServiceException:
        raise
    except Exception as err:
        err_msg = str(err)
        if "42501" in err_msg or "row-level security" in err_msg.lower() or "permission denied" in err_msg.lower():
            raise DatabaseServiceException("Permission denied by security policy.")
        raise DatabaseServiceException("Failed to delete location in database service.")
