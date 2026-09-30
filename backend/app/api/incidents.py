from fastapi import APIRouter
from typing import List, Dict, Any
from app.services.incident_service import get_incidents

router = APIRouter(prefix="/api/incidents", tags=["Incidents"])

@router.get("", response_model=List[Dict[str, Any]])
def read_incidents():
    return get_incidents(limit=50)

