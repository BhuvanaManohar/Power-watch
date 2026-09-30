from typing import Optional
from uuid import UUID
from fastapi import Header
from app.core.supabase import supabase
from app.core.exceptions import AuthenticationException
from app.schemas.auth import UserAuthContext

def get_current_user(authorization: Optional[str] = Header(None)) -> UserAuthContext:
    """
    FastAPI dependency that extracts and validates the Supabase access token
    from the HTTP Authorization header.
    Format required: Bearer <Supabase access token>
    """
    if not authorization:
        raise AuthenticationException("Authorization header missing.")

    parts = authorization.strip().split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        raise AuthenticationException("Invalid authorization header format. Expected 'Bearer <token>'.")

    token = parts[1].strip()
    if not token:
        raise AuthenticationException("Access token is empty.")

    try:
        # Validate token using Supabase Auth get_user
        user_response = supabase.auth.get_user(token)
        if not user_response or not user_response.user or not user_response.user.id:
            raise AuthenticationException("Invalid or expired access token.")
        
        user_id = UUID(user_response.user.id)
        return UserAuthContext(user_id=user_id)
    except AuthenticationException:
        raise
    except Exception:
        # Catch unexpected Supabase client authentication failures (e.g. invalid signature/expired token)
        raise AuthenticationException("Could not validate credentials.")
