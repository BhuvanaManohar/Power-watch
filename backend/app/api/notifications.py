from fastapi import APIRouter
from typing import List
from app.services.notification_service import get_notifications
from app.schemas.notification import NotificationResponse

router = APIRouter(prefix="/api/notifications", tags=["Notifications"])

@router.get("", response_model=List[NotificationResponse])
def read_notifications():
    return get_notifications(limit=50)
