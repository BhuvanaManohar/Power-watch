from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, status
from app.services.incident_service import (
    get_incidents,
    get_incident_by_id,
    create_incident,
    update_incident,
    delete_incident
)
from app.schemas.incident import IncidentResponse, IncidentCreateRequest, IncidentUpdateRequest
from app.core.auth import get_current_user
from app.schemas.auth import UserAuthContext
from app.core.supabase_auth import get_authenticated_supabase_client

router = APIRouter(prefix="/api/incidents", tags=["Incidents"])

@router.get("", response_model=List[IncidentResponse])
def read_incidents():
    """Public endpoint to list incidents."""
    return get_incidents(limit=50)

@router.get("/{incident_id}", response_model=IncidentResponse)
def read_incident(incident_id: UUID):
    """Public endpoint to get a single incident by ID."""
    return get_incident_by_id(incident_id)

@router.post("", response_model=IncidentResponse, status_code=status.HTTP_201_CREATED)
def create_new_incident(
    payload: IncidentCreateRequest,
    current_user: UserAuthContext = Depends(get_current_user)
):
    """Protected endpoint to create an incident. Authorization enforced by DB RLS."""
    auth_client = get_authenticated_supabase_client(current_user.access_token)
    return create_incident(client=auth_client, payload=payload)

@router.patch("/{incident_id}", response_model=IncidentResponse)
def update_existing_incident(
    incident_id: UUID,
    payload: IncidentUpdateRequest,
    current_user: UserAuthContext = Depends(get_current_user)
):
    """Protected endpoint to update an incident. Authorization enforced by DB RLS."""
    auth_client = get_authenticated_supabase_client(current_user.access_token)
    return update_incident(client=auth_client, incident_id=incident_id, payload=payload)

@router.delete("/{incident_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_existing_incident(
    incident_id: UUID,
    current_user: UserAuthContext = Depends(get_current_user)
):
    """Protected endpoint to delete an incident. Authorization enforced by DB RLS."""
    auth_client = get_authenticated_supabase_client(current_user.access_token)
    delete_incident(client=auth_client, incident_id=incident_id)
    return None
