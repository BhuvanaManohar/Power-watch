import sys
from supabase import create_client, Client
from app.core.config import settings

def get_authenticated_supabase_client(access_token: str) -> Client:
    """
    Creates and returns a new Supabase client using configured credentials,
    with the user's access token applied to the PostgREST Authorization header
    so that queries execute in the user's RLS security context.
    """
    url = settings.SUPABASE_URL
    key = settings.SUPABASE_KEY

    if not url or not key:
        print("[ERROR] Supabase credentials missing from configuration!", file=sys.stderr)
        raise ValueError("Supabase configuration error: SUPABASE_URL and SUPABASE_KEY must be set.")

    client = create_client(url, key)
    client.postgrest.auth(access_token)
    return client
