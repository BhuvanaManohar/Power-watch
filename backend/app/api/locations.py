from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, status
from app.services.location_service import (
    get_locations,
    get_location_by_id,
    create_location,
    update_location,
    delete_location
)
from app.schemas.location import LocationResponse, LocationCreateRequest, LocationUpdateRequest
from app.core.auth import get_current_user
from app.schemas.auth import UserAuthContext
from app.core.supabase_auth import get_authenticated_supabase_client

router = APIRouter(prefix="/api/locations", tags=["Locations"])

@router.get("", response_model=List[LocationResponse])
def read_locations():
    """Public endpoint to list locations."""
    return get_locations(limit=50)

@router.get("/{location_id}", response_model=LocationResponse)
def read_location(location_id: UUID):
    """Public endpoint to get a single location by ID."""
    return get_location_by_id(location_id)

@router.post("", response_model=LocationResponse, status_code=status.HTTP_201_CREATED)
def create_new_location(
    payload: LocationCreateRequest,
    current_user: UserAuthContext = Depends(get_current_user)
):
    """Protected officer/admin endpoint to create a location. Authorization enforced by DB RLS."""
    auth_client = get_authenticated_supabase_client(current_user.access_token)
    return create_location(client=auth_client, payload=payload)

@router.patch("/{location_id}", response_model=LocationResponse)
def update_existing_location(
    location_id: UUID,
    payload: LocationUpdateRequest,
    current_user: UserAuthContext = Depends(get_current_user)
):
    """Protected officer/admin endpoint to update a location. Authorization enforced by DB RLS."""
    auth_client = get_authenticated_supabase_client(current_user.access_token)
    return update_location(location_id=location_id, client=auth_client, payload=payload)

@router.delete("/{location_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_existing_location(
    location_id: UUID,
    current_user: UserAuthContext = Depends(get_current_user)
):
    """Protected admin endpoint to delete a location. Authorization enforced by DB RLS."""
    auth_client = get_authenticated_supabase_client(current_user.access_token)
    delete_location(location_id=location_id, client=auth_client)
    return None
