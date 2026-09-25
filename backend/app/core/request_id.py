import re
import uuid
from contextvars import ContextVar

from fastapi import Request


_request_id: ContextVar[str | None] = ContextVar(
    "request_id",
    default=None,
)

_REQUEST_ID_PATTERN = re.compile(r"^[A-Za-z0-9._-]{1,128}$")


def get_request_id() -> str | None:
    return _request_id.get()


def set_request_id(request_id: str) -> None:
    _request_id.set(request_id)


def generate_request_id() -> str:
    return str(uuid.uuid4())


def get_or_create_request_id(request: Request) -> str:
    incoming_request_id = request.headers.get("X-Request-ID")

    if incoming_request_id and _REQUEST_ID_PATTERN.fullmatch(incoming_request_id):
        return incoming_request_id

    return generate_request_id()