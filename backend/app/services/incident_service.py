from typing import List, Dict, Any
from uuid import UUID
from supabase import Client
from app.core.supabase import supabase
from app.core.exceptions import DatabaseServiceException, ResourceNotFoundException
from app.schemas.incident import IncidentCreateRequest, IncidentUpdateRequest

INCIDENT_FIELDS = (
    "id, location_id, title, status, severity, outage_type, "
    "estimated_restoration, actual_restoration, affected_households, "
    "assigned_crew, created_at, updated_at"
)

def get_incidents(limit: int = 50) -> List[Dict[str, Any]]:
    """
    Fetch up to `limit` incident records from public.incidents.
    Public read-only operation using standard Supabase client.
    """
    try:
        response = (
            supabase.table("incidents")
            .select(INCIDENT_FIELDS)
            .limit(limit)
            .execute()
        )
        return response.data
    except Exception as err:
        raise DatabaseServiceException("Failed to retrieve incidents from service.")

def get_incident_by_id(incident_id: UUID) -> Dict[str, Any]:
    """
    Fetch a single incident by ID from public.incidents.
    Public read-only operation using standard Supabase client.
    """
    try:
        response = (
            supabase.table("incidents")
            .select(INCIDENT_FIELDS)
            .eq("id", str(incident_id))
            .execute()
        )
        if not response.data or len(response.data) == 0:
            raise ResourceNotFoundException("Incident", str(incident_id))
        return response.data[0]
    except ResourceNotFoundException:
        raise
    except Exception as err:
        raise DatabaseServiceException("Failed to retrieve incident from service.")

def create_incident(client: Client, payload: IncidentCreateRequest) -> Dict[str, Any]:
    """
    Create a new incident using the request-scoped authenticated Supabase client.
    RLS policies in PostgreSQL enforce officer/admin insert authorization.
    """
    insert_data = payload.model_dump(exclude_unset=True)
    if "location_id" in insert_data:
        insert_data["location_id"] = str(insert_data["location_id"])
    if "estimated_restoration" in insert_data and insert_data["estimated_restoration"]:
        insert_data["estimated_restoration"] = insert_data["estimated_restoration"].isoformat()
    if "actual_restoration" in insert_data and insert_data["actual_restoration"]:
        insert_data["actual_restoration"] = insert_data["actual_restoration"].isoformat()

    try:
        response = (
            client.table("incidents")
            .insert(insert_data)
            .execute()
        )
        if not response.data or len(response.data) == 0:
            raise DatabaseServiceException("Failed to create incident: Empty response from service.")
        return response.data[0]
    except Exception as err:
        err_msg = str(err)
        if "42501" in err_msg or "row-level security" in err_msg.lower() or "permission denied" in err_msg.lower():
            raise DatabaseServiceException("Permission denied by security policy.")
        raise DatabaseServiceException("Failed to create incident in database service.")

def update_incident(client: Client, incident_id: UUID, payload: IncidentUpdateRequest) -> Dict[str, Any]:
    """
    Update an existing incident using the request-scoped authenticated Supabase client.
    RLS policies in PostgreSQL enforce officer/admin update authorization.
    """
    update_data = payload.model_dump(exclude_unset=True)
    if not update_data:
        # No fields provided for update, return existing record
        return get_incident_by_id(incident_id)

    if "location_id" in update_data and update_data["location_id"]:
        update_data["location_id"] = str(update_data["location_id"])
    if "estimated_restoration" in update_data and update_data["estimated_restoration"]:
        update_data["estimated_restoration"] = update_data["estimated_restoration"].isoformat()
    if "actual_restoration" in update_data and update_data["actual_restoration"]:
        update_data["actual_restoration"] = update_data["actual_restoration"].isoformat()

    try:
        response = (
            client.table("incidents")
            .update(update_data)
            .eq("id", str(incident_id))
            .execute()
        )
        if not response.data or len(response.data) == 0:
            # Check if record actually exists vs RLS/permission failure
            get_incident_by_id(incident_id)
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
        raise DatabaseServiceException("Failed to update incident in database service.")

def delete_incident(client: Client, incident_id: UUID) -> None:
    """
    Delete an incident by ID using the request-scoped authenticated Supabase client.
    RLS policies in PostgreSQL enforce admin delete authorization.
    """
    try:
        response = (
            client.table("incidents")
            .delete()
            .eq("id", str(incident_id))
            .execute()
        )
        if not response.data or len(response.data) == 0:
            # Check if record exists vs RLS/permission failure
            get_incident_by_id(incident_id)
            raise DatabaseServiceException("Permission denied by security policy.")
    except ResourceNotFoundException:
        raise
    except DatabaseServiceException:
        raise
    except Exception as err:
        err_msg = str(err)
        if "42501" in err_msg or "row-level security" in err_msg.lower() or "permission denied" in err_msg.lower():
            raise DatabaseServiceException("Permission denied by security policy.")
        raise DatabaseServiceException("Failed to delete incident in database service.")
