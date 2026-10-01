from typing import List, Dict, Any
from uuid import UUID
from supabase import Client
from app.core.supabase import supabase
from app.core.exceptions import DatabaseServiceException, ResourceNotFoundException
from app.schemas.report import ReportCreateRequest, ReportUpdateRequest

REPORT_FIELDS = (
    "id, user_id, location_id, incident_id, outage_type, "
    "description, status, photo_url, created_at, updated_at"
)

def get_reports(limit: int = 50) -> List[Dict[str, Any]]:
    """
    Fetch up to `limit` report records from public.reports.
    Public read-only operation using standard Supabase client.
    """
    try:
        response = (
            supabase.table("reports")
            .select(REPORT_FIELDS)
            .limit(limit)
            .execute()
        )
        return response.data
    except Exception as err:
        raise DatabaseServiceException("Failed to retrieve reports from service.")

def get_my_reports(user_id: UUID, client: Client, limit: int = 50) -> List[Dict[str, Any]]:
    """
    Fetch up to `limit` report records from public.reports belonging to the given authenticated user_id
    using the request-scoped authenticated Supabase client.
    """
    try:
        response = (
            client.table("reports")
            .select(REPORT_FIELDS)
            .eq("user_id", str(user_id))
            .limit(limit)
            .execute()
        )
        return response.data
    except Exception as err:
        raise DatabaseServiceException("Failed to retrieve user reports from service.")

def get_report_by_id(report_id: UUID, client: Client) -> Dict[str, Any]:
    """
    Fetch a single report by ID from public.reports using the request-scoped authenticated Supabase client.
    """
    try:
        response = (
            client.table("reports")
            .select(REPORT_FIELDS)
            .eq("id", str(report_id))
            .execute()
        )
        if not response.data or len(response.data) == 0:
            raise ResourceNotFoundException("Report", str(report_id))
        return response.data[0]
    except ResourceNotFoundException:
        raise
    except Exception as err:
        raise DatabaseServiceException("Failed to retrieve report from service.")

def create_report(user_id: UUID, client: Client, payload: ReportCreateRequest) -> Dict[str, Any]:
    """
    Insert a new outage report into public.reports for an authenticated citizen using the request-scoped client.
    Fields user_id, status='Submitted', and incident_id=None are enforced server-side.
    """
    insert_data = {
        "user_id": str(user_id),
        "location_id": str(payload.location_id),
        "incident_id": None,
        "outage_type": payload.outage_type,
        "description": payload.description,
        "status": "Submitted",
        "photo_url": payload.photo_url
    }
    try:
        response = (
            client.table("reports")
            .insert(insert_data)
            .execute()
        )
        if not response.data or len(response.data) == 0:
            raise DatabaseServiceException("Failed to create report: Empty response from service.")
        return response.data[0]
    except Exception as err:
        err_msg = str(err)
        if "42501" in err_msg or "row-level security" in err_msg.lower() or "permission denied" in err_msg.lower():
            raise DatabaseServiceException("Permission denied by security policy.")
        raise DatabaseServiceException("Failed to create report in database service.")

def update_report(report_id: UUID, client: Client, payload: ReportUpdateRequest) -> Dict[str, Any]:
    """
    Update an existing report using the request-scoped authenticated Supabase client.
    RLS policies in PostgreSQL enforce officer/admin update authorization.
    """
    update_data = payload.model_dump(exclude_unset=True)
    if not update_data:
        return get_report_by_id(report_id, client)

    if "incident_id" in update_data and update_data["incident_id"] is not None:
        update_data["incident_id"] = str(update_data["incident_id"])

    try:
        response = (
            client.table("reports")
            .update(update_data)
            .eq("id", str(report_id))
            .execute()
        )
        if not response.data or len(response.data) == 0:
            # Check if record actually exists vs RLS/permission failure
            get_report_by_id(report_id, client)
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
        raise DatabaseServiceException("Failed to update report in database service.")

def delete_report(report_id: UUID, client: Client) -> None:
    """
    Delete a report by ID using the request-scoped authenticated Supabase client.
    RLS policies in PostgreSQL enforce admin delete authorization.
    """
    try:
        response = (
            client.table("reports")
            .delete()
            .eq("id", str(report_id))
            .execute()
        )
        if not response.data or len(response.data) == 0:
            # Check if record exists vs RLS/permission failure
            get_report_by_id(report_id, client)
            raise DatabaseServiceException("Permission denied by security policy.")
    except ResourceNotFoundException:
        raise
    except DatabaseServiceException:
        raise
    except Exception as err:
        err_msg = str(err)
        if "42501" in err_msg or "row-level security" in err_msg.lower() or "permission denied" in err_msg.lower():
            raise DatabaseServiceException("Permission denied by security policy.")
        raise DatabaseServiceException("Failed to delete report in database service.")
