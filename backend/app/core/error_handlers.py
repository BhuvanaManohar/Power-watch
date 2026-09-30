from fastapi import Request
from fastapi.responses import JSONResponse
from app.core.exceptions import (
    PowerWatchException,
    ResourceNotFoundException,
    DatabaseServiceException,
    AuthenticationException,
    ResourceAlreadyExistsException
)
from app.schemas.common import ErrorResponse, ErrorDetail

async def powerwatch_exception_handler(request: Request, exc: PowerWatchException):
    status_code = 500
    code = "INTERNAL_SERVER_ERROR"
    message = "An unexpected error occurred."

    if isinstance(exc, ResourceNotFoundException):
        status_code = 404
        code = "RESOURCE_NOT_FOUND"
        message = exc.message
    elif isinstance(exc, DatabaseServiceException):
        status_code = 500
        code = "DATABASE_SERVICE_ERROR"
        message = exc.message
    elif isinstance(exc, AuthenticationException):
        status_code = 401
        code = "AUTHENTICATION_REQUIRED"
        message = exc.message
    elif isinstance(exc, ResourceAlreadyExistsException):
        status_code = 409
        code = "RESOURCE_ALREADY_EXISTS"
        message = exc.message

    error_body = ErrorResponse(
        success=False,
        error=ErrorDetail(code=code, message=message)
    )
    headers = {"WWW-Authenticate": "Bearer"} if status_code == 401 else None
    return JSONResponse(status_code=status_code, content=error_body.model_dump(), headers=headers)
