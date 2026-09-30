class PowerWatchException(Exception):
    """Base exception for PowerWatch backend application."""
    def __init__(self, message: str = "An unexpected error occurred."):
        self.message = message
        super().__init__(self.message)

class ResourceNotFoundException(PowerWatchException):
    """Raised when a requested resource is not found."""
    def __init__(self, resource_name: str = "Resource", resource_id: str = ""):
        message = f"{resource_name} with id '{resource_id}' was not found." if resource_id else f"{resource_name} not found."
        super().__init__(message)

class DatabaseServiceException(PowerWatchException):
    """Raised when an internal database or external service failure occurs."""
    def __init__(self, message: str = "Service temporarily unavailable due to database or external service error."):
        super().__init__(message)

class AuthenticationException(PowerWatchException):
    """Raised when authentication fails due to missing, malformed, or invalid tokens."""
    def __init__(self, message: str = "Authentication required to access this resource."):
        super().__init__(message)

class ResourceAlreadyExistsException(PowerWatchException):
    """Raised when a resource creation fails because it already exists."""
    def __init__(self, message: str = "Resource already exists."):
        super().__init__(message)
