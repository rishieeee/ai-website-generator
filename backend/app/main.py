import logging
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
from pydantic import ValidationError
from .services.db_service import db
from .api.endpoints import router as api_router

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting up AI Website Generator API")
    db.connect()
    yield
    logger.info("Shutting down AI Website Generator API")
    db.close()

app = FastAPI(
    title="AI Website Generator API",
    description="Production-ready API for AI-powered website generation with project persistence",
    version="1.0.0",
    lifespan=lifespan
)

@app.exception_handler(ValidationError)
async def validation_exception_handler(request: Request, exc: ValidationError):
    logger.warning(f"Validation error: {exc.errors()}")
    return JSONResponse(
        status_code=422,
        content={
            "error": "Validation Error",
            "details": exc.errors()
        }
    )

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal Server Error",
            "message": "An unexpected error occurred. Please try again later."
        }
    )


origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
]

# Add production origins from environment variable
import os
prod_origins = os.getenv("CORS_ORIGINS", "").split(",")
if prod_origins:
    origins.extend([origin.strip() for origin in prod_origins if origin.strip()])

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api")

@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "ai-website-generator"}
