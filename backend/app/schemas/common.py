from typing import Generic, TypeVar, Optional, Any
from pydantic import BaseModel

T = TypeVar("T")

class APIResponse(BaseModel, Generic[T]):
    """Standardized API response wrapper for successful data responses."""
    success: bool = True
    data: T
    message: Optional[str] = None

class ErrorDetail(BaseModel):
    """Structured error detail model."""
    code: str
    message: str

class ErrorResponse(BaseModel):
    """Standardized API response wrapper for error responses."""
    success: bool = False
    error: ErrorDetail
