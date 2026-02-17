from .auth import router as auth_router
from .posts import router as posts_router
from .ai import router as ai_router

__all__ = ["auth_router", "posts_router", "ai_router"]
