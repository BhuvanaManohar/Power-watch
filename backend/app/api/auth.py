from fastapi import APIRouter, Depends
from app.core.auth import get_current_user
from app.schemas.auth import UserAuthContext
from app.schemas.common import APIResponse

router = APIRouter(prefix="/api/auth", tags=["Auth"])

@router.get("/me", response_model=APIResponse[UserAuthContext])
def get_me(current_user: UserAuthContext = Depends(get_current_user)):
    """
    Temporary protected endpoint returning current authenticated user details.
    """
    return APIResponse(
        success=True,
        data=current_user
    )
