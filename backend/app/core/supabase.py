import sys
from supabase import create_client, Client
from app.core.config import settings

def get_supabase_client() -> Client:
    url = settings.SUPABASE_URL
    key = settings.SUPABASE_KEY

    if not url or not key:
        print("[ERROR] Supabase credentials missing from configuration!", file=sys.stderr)
        raise ValueError("Supabase configuration error: SUPABASE_URL and SUPABASE_KEY must be set.")

    return create_client(url, key)

supabase: Client = get_supabase_client()
