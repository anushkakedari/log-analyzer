import logging

from fastapi import Request
from fastapi.responses import JSONResponse

from app.core.request_id import get_request_id


logger = logging.getLogger(__name__)


async def global_exception_handler(
    request: Request,
    exc: Exception,
) -> JSONResponse:
    request_id = get_request_id()

    logger.exception(
        "Unhandled exception | request_id=%s | method=%s | path=%s",
        request_id,
        request.method,
        request.url.path,
    )

    return JSONResponse(
        status_code=500,
        content={
            "detail": "An unexpected error occurred. Please try again.",
            "request_id": request_id,
        },
    )