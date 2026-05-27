from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
import models
from routers import router

app = FastAPI(title="Log Analyzer API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://laudable-respect-production-f4f1.up.railway.app/",
        ],
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



# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
# from database import engine, Base
# import models


# app = FastAPI(title="Log Analyzer API", version="1.0.0")

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://localhost:5173"],  # React dev server
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# @app.get("/")
# def root():
#     return {"message": "Log Analyzer API is running 🚀"}

# @app.get("/health")
# def health():
#     return {"status": "ok"}

# # Create all tables on startup
# Base.metadata.create_all(bind=engine)