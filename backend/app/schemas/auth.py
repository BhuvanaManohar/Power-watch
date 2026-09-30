from uuid import UUID
from pydantic import BaseModel

class UserAuthContext(BaseModel):
    """Authenticated user context object extracted from valid Supabase access token."""
    user_id: UUID
