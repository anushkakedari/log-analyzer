from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
import models
from routers import router
import traceback

app = FastAPI(title="Log Analyzer API", version="1.0.0")

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    print(f"GLOBAL ERROR: {traceback.format_exc()}")
    return JSONResponse(status_code=500, content={"detail": str(exc)})
    
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://laudable-respect-production-f4f1.up.railway.app",
        "https://log-analyzer-steel.vercel.app",
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