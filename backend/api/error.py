from typing import Annotated, Callable
from pydantic import Field
from starlette import status

NonEmptyString = Annotated[
    str,
    Field(
        min_length=1, description="Не пустая строка", examples=["string", "s"]
    ),
]

class HTTPError:
    detail: Annotated[NonEmptyString, Field(examples=["Service error"])]


def error_response_factory(status_code: int) -> Callable[[str], dict[int, dict[str, type[HTTPError]]]]:
    """A factory that creates a function for generating errors with a custom message."""
    def response(example_detail: str = "Service error") -> dict[int, dict[str, type[HTTPError]]]:
        class CustomHTTPError(HTTPError):
            detail: Annotated[NonEmptyString, Field(examples=[example_detail])]

        return {
            status_code: {
                "model": CustomHTTPError,
            }
        }
    return response

internal_server_error = error_response_factory(status.HTTP_500_INTERNAL_SERVER_ERROR)