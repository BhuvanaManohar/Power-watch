from typing import List, Dict, Any
from app.core.supabase import supabase
from app.core.exceptions import DatabaseServiceException

def get_notifications(limit: int = 50) -> List[Dict[str, Any]]:
    """
    Fetch up to `limit` notification records from public.notifications.
    Selects id, user_id, incident_id, report_id, title, message, category, is_read, created_at.
    """
    try:
        response = (
            supabase.table("notifications")
            .select(
                "id, user_id, incident_id, report_id, title, message, category, is_read, created_at"
            )
            .limit(limit)
            .execute()
        )
        return response.data
    except Exception as err:
        raise DatabaseServiceException("Failed to retrieve notifications from service.")
