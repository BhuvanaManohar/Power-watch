from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.health import router as health_router
from app.api.locations import router as locations_router
from app.api.incidents import router as incidents_router
from app.api.reports import router as reports_router
from app.api.notifications import router as notifications_router
from app.api.auth import router as auth_router
from app.api.profile import router as profile_router
from app.core.exceptions import PowerWatchException
from app.core.error_handlers import powerwatch_exception_handler

app = FastAPI(
    title="PowerWatch Backend API",
    description="Backend API for PowerWatch Civic Utility & Incident Management",
    version="1.0.0"
)

# Exception handlers
app.add_exception_handler(PowerWatchException, powerwatch_exception_handler)

# CORS Middleware setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(health_router)
app.include_router(locations_router)
app.include_router(incidents_router)
app.include_router(reports_router)
app.include_router(notifications_router)
app.include_router(auth_router)
app.include_router(profile_router)





@app.get("/")
def root():
    return {
        "message": "Welcome to PowerWatch FastAPI Backend Service API",
        "docs_url": "/docs",
        "health_check": "/health"
    }
