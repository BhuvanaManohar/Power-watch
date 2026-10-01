from fastapi import APIRouter, Depends, status
from app.services.profile_service import get_my_profile, create_profile, update_my_profile
from app.schemas.profile import ProfileResponse, ProfileCreateRequest, ProfileUpdateRequest
from app.core.auth import get_current_user
from app.schemas.auth import UserAuthContext
from app.core.supabase_auth import get_authenticated_supabase_client

router = APIRouter(prefix="/api/profile", tags=["Profile"])

@router.get("/me", response_model=ProfileResponse)
def read_my_profile(current_user: UserAuthContext = Depends(get_current_user)):
    """Protected endpoint to retrieve current authenticated user's profile using request-scoped client."""
    auth_client = get_authenticated_supabase_client(current_user.access_token)
    return get_my_profile(client=auth_client, user_id=current_user.user_id)

@router.post("", response_model=ProfileResponse, status_code=status.HTTP_201_CREATED)
def submit_profile(
    payload: ProfileCreateRequest,
    current_user: UserAuthContext = Depends(get_current_user)
):
    """Protected endpoint to create initial citizen profile using request-scoped client."""
    auth_client = get_authenticated_supabase_client(current_user.access_token)
    return create_profile(client=auth_client, user_id=current_user.user_id, payload=payload)

@router.patch("/me", response_model=ProfileResponse)
def update_profile(
    payload: ProfileUpdateRequest,
    current_user: UserAuthContext = Depends(get_current_user)
):
    """Protected endpoint to update authenticated user's profile attributes using request-scoped client."""
    auth_client = get_authenticated_supabase_client(current_user.access_token)
    return update_my_profile(client=auth_client, user_id=current_user.user_id, payload=payload)
