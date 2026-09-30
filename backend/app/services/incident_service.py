from typing import List, Dict, Any
from app.core.supabase import supabase
from app.core.exceptions import DatabaseServiceException

def get_incidents(limit: int = 50) -> List[Dict[str, Any]]:
    """
    Fetch up to `limit` incident records from public.incidents.
    Selects id, location_id, title, status, severity, outage_type,
    estimated_restoration, actual_restoration, affected_households,
    assigned_crew, created_at, updated_at.
    """
    try:
        response = (
            supabase.table("incidents")
            .select(
                "id, location_id, title, status, severity, outage_type, "
                "estimated_restoration, actual_restoration, affected_households, "
                "assigned_crew, created_at, updated_at"
            )
            .limit(limit)
            .execute()
        )
        return response.data
    except Exception as err:
        raise DatabaseServiceException("Failed to retrieve incidents from service.")

