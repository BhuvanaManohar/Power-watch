from fastapi import APIRouter, Depends, status
from app.services.profile_service import get_my_profile, create_profile
from app.schemas.profile import ProfileResponse, ProfileCreateRequest
from app.core.auth import get_current_user
from app.schemas.auth import UserAuthContext

router = APIRouter(prefix="/api/profile", tags=["Profile"])

@router.get("/me", response_model=ProfileResponse)
def read_my_profile(current_user: UserAuthContext = Depends(get_current_user)):
    return get_my_profile(user_id=current_user.user_id)

@router.post("", response_model=ProfileResponse, status_code=status.HTTP_201_CREATED)
def submit_profile(
    payload: ProfileCreateRequest,
    current_user: UserAuthContext = Depends(get_current_user)
):
    return create_profile(user_id=current_user.user_id, payload=payload)
