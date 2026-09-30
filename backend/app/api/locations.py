from fastapi import APIRouter
from typing import List, Dict, Any
from app.services.location_service import get_locations

router = APIRouter(prefix="/api/locations", tags=["Locations"])

@router.get("", response_model=List[Dict[str, Any]])
def read_locations():
    return get_locations(limit=20)

