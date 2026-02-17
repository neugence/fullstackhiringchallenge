from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi
import google.generativeai as genai

from app.config import settings
from app.database import db_instance
from app.routers.auth import router as auth_router
from app.routers.posts import router as posts_router
from app.routers.ai import router as ai_router
from app.routers.health import router as health_router  

genai.configure(api_key=settings.GEMINI_API_KEY)

@asynccontextmanager
async def lifespan(app: FastAPI):
    db_instance.connect_db()
    yield
    db_instance.close_db()

app = FastAPI(
    title="Smart Blog Editor API",
    version="1.0.0",
    description="Production-ready FastAPI backend for Smart Blog Editor with JWT authentication",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# --- CORS ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL, "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*", "Authorization", "Content-Type"],
)

# --- Register Routers ---
app.include_router(auth_router)
app.include_router(posts_router)
app.include_router(ai_router)
app.include_router(health_router)

def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    
    openapi_schema = get_openapi(
        title=app.title,
        version=app.version,
        openapi_version="3.1.0", # OAS 3.1
        description=app.description,
        routes=app.routes,
    )

    openapi_schema["components"]["securitySchemes"] = {
        "BearerAuth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT",
            "description": "Enter your JWT token in the format: Bearer <token>"
        }
    }

    openapi_schema["security"] = [{"BearerAuth": []}]

    app.openapi_schema = openapi_schema
    return app.openapi_schema

app.openapi = custom_openapi