from typing import List, Dict, Any
from app.core.supabase import supabase
from app.core.exceptions import DatabaseServiceException

def get_locations(limit: int = 20) -> List[Dict[str, Any]]:
    """
    Fetch up to `limit` location records from public.locations.
    Selects only id, name, address, latitude, and longitude.
    """
    try:
        response = (
            supabase.table("locations")
            .select("id, name, address, latitude, longitude")
            .limit(limit)
            .execute()
        )
        return response.data
    except Exception as err:
        raise DatabaseServiceException("Failed to retrieve locations from service.")

