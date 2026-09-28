from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.health import router as health_router

app = FastAPI(
    title="PowerWatch Backend API",
    description="Backend API for PowerWatch Civic Utility & Incident Management",
    version="1.0.0"
)

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

@app.get("/")
def root():
    return {
        "message": "Welcome to PowerWatch FastAPI Backend Service API",
        "docs_url": "/docs",
        "health_check": "/health"
    }
