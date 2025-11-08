from starlette import status
from starlette.exceptions import HTTPException


class BadRequestException(HTTPException):
    def __init__(self, detail: str | None = None) -> None:
        super().__init__(status_code=status.HTTP_400_BAD_REQUEST, detail=detail)


class ForbiddenException(HTTPException):
    def __init__(self, detail: str | None = None) -> None:
        super().__init__(status_code=status.HTTP_403_FORBIDDEN, detail=detail)


class NotFoundException(HTTPException):
    def __init__(
        self,
        detail: str | None = None,
        obj: str | None = None,
    ) -> None:
        detail = detail or f"{obj} not found"
        super().__init__(status_code=status.HTTP_404_NOT_FOUND, detail=detail)


class ConflictException(HTTPException):
    def __init__(self, detail: str | None = None) -> None:
        super().__init__(status_code=status.HTTP_409_CONFLICT, detail=detail)


class FailedDependencyException(HTTPException):
    def __init__(self, detail: str | None = None) -> None:
        super().__init__(
            status_code=status.HTTP_424_FAILED_DEPENDENCY,
            detail=detail,
        )
