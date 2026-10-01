from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, status
from app.services.notification_service import (
    get_my_notifications,
    mark_notification_read,
    create_notification
)
from app.schemas.notification import NotificationResponse, NotificationCreateRequest
from app.core.auth import get_current_user
from app.schemas.auth import UserAuthContext
from app.core.supabase_auth import get_authenticated_supabase_client

router = APIRouter(prefix="/api/notifications", tags=["Notifications"])

@router.get("", response_model=List[NotificationResponse])
@router.get("/me", response_model=List[NotificationResponse])
def read_my_notifications(current_user: UserAuthContext = Depends(get_current_user)):
    """
    Protected endpoint to list authenticated user's notifications.
    Both GET /api/notifications and GET /api/notifications/me map to recipient-owned listing.
    """
    auth_client = get_authenticated_supabase_client(current_user.access_token)
    return get_my_notifications(client=auth_client, user_id=current_user.user_id, limit=50)

@router.patch("/{notification_id}/read", response_model=NotificationResponse)
def mark_as_read(
    notification_id: UUID,
    current_user: UserAuthContext = Depends(get_current_user)
):
    """Protected endpoint allowing a recipient to mark their notification as read."""
    auth_client = get_authenticated_supabase_client(current_user.access_token)
    return mark_notification_read(client=auth_client, notification_id=notification_id, user_id=current_user.user_id)

@router.post("", response_model=NotificationResponse, status_code=status.HTTP_201_CREATED)
def create_new_notification(
    payload: NotificationCreateRequest,
    current_user: UserAuthContext = Depends(get_current_user)
):
    """Protected officer/admin endpoint to issue a system notification. Authorization enforced by DB RLS."""
    auth_client = get_authenticated_supabase_client(current_user.access_token)
    return create_notification(client=auth_client, payload=payload)
