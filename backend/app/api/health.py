from fastapi import APIRouter, HTTPException
from app.core.supabase import supabase

router = APIRouter(prefix="/health", tags=["Health"])

@router.get("")
def health_check():
    return {
        "status": "healthy",
        "service": "PowerWatch FastAPI Backend",
        "version": "1.0.0"
    }

@router.get("/supabase")
def supabase_health_check():
    try:
        # Verify communication with Supabase Auth/REST endpoint
        res = supabase.auth.get_session()
        return {
            "status": "healthy",
            "service": "Supabase connection"
        }
    except Exception as err:
        raise HTTPException(
            status_code=503,
            detail={
                "status": "unhealthy",
                "service": "Supabase connection",
                "message": "Failed to communicate with Supabase service."
            }
        )


