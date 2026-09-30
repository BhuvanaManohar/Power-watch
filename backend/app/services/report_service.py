from typing import List, Dict, Any
from uuid import UUID
from app.core.supabase import supabase
from app.core.exceptions import DatabaseServiceException
from app.schemas.report import ReportCreateRequest

def get_reports(limit: int = 50) -> List[Dict[str, Any]]:
    """
    Fetch up to `limit` report records from public.reports.
    Selects id, user_id, location_id, incident_id, outage_type,
    description, status, photo_url, created_at, updated_at.
    """
    try:
        response = (
            supabase.table("reports")
            .select(
                "id, user_id, location_id, incident_id, outage_type, "
                "description, status, photo_url, created_at, updated_at"
            )
            .limit(limit)
            .execute()
        )
        return response.data
    except Exception as err:
        raise DatabaseServiceException("Failed to retrieve reports from service.")

def get_my_reports(user_id: UUID, limit: int = 50) -> List[Dict[str, Any]]:
    """
    Fetch up to `limit` report records from public.reports belonging to the given user_id.
    """
    try:
        response = (
            supabase.table("reports")
            .select(
                "id, user_id, location_id, incident_id, outage_type, "
                "description, status, photo_url, created_at, updated_at"
            )
            .eq("user_id", str(user_id))
            .limit(limit)
            .execute()
        )
        return response.data
    except Exception as err:
        raise DatabaseServiceException("Failed to retrieve user reports from service.")

def create_report(user_id: UUID, payload: ReportCreateRequest) -> Dict[str, Any]:
    """
    Insert a new outage report into public.reports for an authenticated citizen.
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
            supabase.table("reports")
            .insert(insert_data)
            .execute()
        )
        if not response.data or len(response.data) == 0:
            raise DatabaseServiceException("Failed to create report: Empty response from service.")
        return response.data[0]
    except Exception as err:
        raise DatabaseServiceException("Failed to create report in database service.")
