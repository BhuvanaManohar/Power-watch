from typing import List, Dict, Any
from uuid import UUID
from supabase import Client
from app.core.exceptions import DatabaseServiceException, ResourceNotFoundException
from app.schemas.notification import NotificationCreateRequest

NOTIFICATION_FIELDS = (
    "id, user_id, incident_id, report_id, title, message, category, is_read, created_at"
)

def get_my_notifications(client: Client, user_id: UUID, limit: int = 50) -> List[Dict[str, Any]]:
    """
    Fetch up to `limit` notification records from public.notifications belonging to the authenticated user_id,
    ordered by created_at descending, using the request-scoped authenticated client.
    """
    try:
        response = (
            client.table("notifications")
            .select(NOTIFICATION_FIELDS)
            .eq("user_id", str(user_id))
            .order("created_at", desc=True)
            .limit(limit)
            .execute()
        )
        return response.data
    except Exception as err:
        err_msg = str(err)
        if "42501" in err_msg or "row-level security" in err_msg.lower() or "permission denied" in err_msg.lower():
            raise DatabaseServiceException("Permission denied by security policy.")
        raise DatabaseServiceException("Failed to retrieve user notifications from service.")

def get_notification_by_id(client: Client, notification_id: UUID, user_id: UUID) -> Dict[str, Any]:
    """
    Fetch a single notification by ID belonging to the authenticated user_id using the request-scoped client.
    """
    try:
        response = (
            client.table("notifications")
            .select(NOTIFICATION_FIELDS)
            .eq("id", str(notification_id))
            .eq("user_id", str(user_id))
            .execute()
        )
        if not response.data or len(response.data) == 0:
            raise ResourceNotFoundException("Notification", str(notification_id))
        return response.data[0]
    except ResourceNotFoundException:
        raise
    except Exception as err:
        err_msg = str(err)
        if "42501" in err_msg or "row-level security" in err_msg.lower() or "permission denied" in err_msg.lower():
            raise DatabaseServiceException("Permission denied by security policy.")
        raise DatabaseServiceException("Failed to retrieve notification from service.")

def mark_notification_read(client: Client, notification_id: UUID, user_id: UUID) -> Dict[str, Any]:
    """
    Mark a notification as read (is_read=True) for the recipient using the request-scoped client.
    RLS policy 'Notifications recipient update' ensures users can only update their own notifications.
    """
    try:
        response = (
            client.table("notifications")
            .update({"is_read": True})
            .eq("id", str(notification_id))
            .eq("user_id", str(user_id))
            .execute()
        )
        if not response.data or len(response.data) == 0:
            # Verify if record actually exists vs RLS/permission failure
            get_notification_by_id(client, notification_id, user_id)
            raise DatabaseServiceException("Permission denied by security policy.")
        return response.data[0]
    except ResourceNotFoundException:
        raise
    except DatabaseServiceException:
        raise
    except Exception as err:
        err_msg = str(err)
        if "42501" in err_msg or "row-level security" in err_msg.lower() or "permission denied" in err_msg.lower():
            raise DatabaseServiceException("Permission denied by security policy.")
        raise DatabaseServiceException("Failed to update notification in database service.")

def create_notification(client: Client, payload: NotificationCreateRequest) -> Dict[str, Any]:
    """
    Create a new notification using the request-scoped authenticated Supabase client.
    RLS policy 'Notifications officer insert' enforces officer/admin insert authorization.
    """
    insert_data = payload.model_dump(exclude_unset=True)
    insert_data["user_id"] = str(insert_data["user_id"])
    if "incident_id" in insert_data and insert_data["incident_id"] is not None:
        insert_data["incident_id"] = str(insert_data["incident_id"])
    if "report_id" in insert_data and insert_data["report_id"] is not None:
        insert_data["report_id"] = str(insert_data["report_id"])

    insert_data["is_read"] = False

    try:
        response = (
            client.table("notifications")
            .insert(insert_data)
            .execute()
        )
        if not response.data or len(response.data) == 0:
            raise DatabaseServiceException("Failed to create notification: Empty response from service.")
        return response.data[0]
    except Exception as err:
        err_msg = str(err)
        if "42501" in err_msg or "row-level security" in err_msg.lower() or "permission denied" in err_msg.lower():
            raise DatabaseServiceException("Permission denied by security policy.")
        raise DatabaseServiceException("Failed to create notification in database service.")
