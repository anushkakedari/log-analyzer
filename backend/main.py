from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.core.errors import global_exception_handler
from app.core.logging import setup_logging
from app.core.request_id import get_or_create_request_id, set_request_id

from database import engine, Base
import models
from routers import router


setup_logging()
settings = get_settings()

app = FastAPI(
    title="Log Analyzer API",
    version="1.0.0",
)


@app.middleware("http")
async def request_id_middleware(request: Request, call_next):
    request_id = get_or_create_request_id(request)
    set_request_id(request_id)

    response = await call_next(request)

    response.headers["X-Request-ID"] = request_id

    return response


app.add_exception_handler(Exception, global_exception_handler)


app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


Base.metadata.create_all(bind=engine)

app.include_router(router, prefix="/api")


@app.get("/")
def root():
    return {"message": "Log Analyzer API is running 🚀"}


@app.get("/health")
def health():
    return {"status": "ok"}
