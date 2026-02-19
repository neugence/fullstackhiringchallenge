import os
import logging
from datetime import datetime, timezone
from typing import List

from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from sqlalchemy import text

from database import engine, Base, get_db
from models import Post, PostStatus
from schemas import (
    PostCreate,
    PostUpdate,
    PostResponse,
    AISummarizeRequest,
    AISummarizeResponse,
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Create database tables
try:
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables created successfully")
except Exception as e:
    logger.error(f"Failed to create database tables: {e}")
    raise

app = FastAPI(
    title="Smart Blog Editor API",
    description="Backend API for the Notion-style Smart Blog Editor",
    version="1.0.0",
)

# ─── CORS ────────────────────────────────────────────────────────────────────
# Build allowed origins: always include localhost dev servers,
# plus any production frontend URL set via FRONTEND_URL env var.
_allowed_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

# Accept comma-separated list of production URLs, e.g.
#   FRONTEND_URL=https://my-app.vercel.app,https://my-app.com
_frontend_url = os.environ.get("FRONTEND_URL", "")
if _frontend_url:
    for url in _frontend_url.split(","):
        url = url.strip()
        if url and url not in _allowed_origins:
            _allowed_origins.append(url)

logger.info(f"CORS allowed origins: {_allowed_origins}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=_allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Request logging middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    logger.info(f"Request: {request.method} {request.url.path}")
    try:
        response = await call_next(request)
        logger.info(f"Response: {response.status_code}")
        return response
    except Exception as e:
        logger.error(f"Request failed: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={"detail": "Internal server error", "error": str(e)}
        )


# ─── Posts CRUD ──────────────────────────────────────────────────────────────


@app.post("/api/posts/", response_model=PostResponse, status_code=201)
def create_post(post: PostCreate, db: Session = Depends(get_db)):
    """Create a new draft post."""
    try:
        logger.info(f"Creating new post with title: {post.title or 'Untitled'}")
        db_post = Post(
            title=post.title or "Untitled",
            content=post.content or "{}",
            status=PostStatus.DRAFT,
        )
        db.add(db_post)
        db.commit()
        db.refresh(db_post)
        logger.info(f"Post created successfully with ID: {db_post.id}")
        return db_post
    except Exception as e:
        db.rollback()
        logger.error(f"Failed to create post: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to create post: {str(e)}"
        )


@app.get("/api/posts/", response_model=List[PostResponse])
def get_posts(
    status: str = None,
    db: Session = Depends(get_db),
):
    """Fetch all posts, optionally filtered by status."""
    try:
        logger.info(f"Fetching posts with status filter: {status}")
        query = db.query(Post).order_by(Post.updated_at.desc())
        if status:
            query = query.filter(Post.status == status)
        posts = query.all()
        logger.info(f"Found {len(posts)} posts")
        return posts
    except Exception as e:
        logger.error(f"Failed to fetch posts: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch posts: {str(e)}"
        )


@app.get("/api/posts/{post_id}", response_model=PostResponse)
def get_post(post_id: int, db: Session = Depends(get_db)):
    """Fetch a single post by ID."""
    try:
        logger.info(f"Fetching post with ID: {post_id}")
        post = db.query(Post).filter(Post.id == post_id).first()
        if not post:
            logger.warning(f"Post not found: {post_id}")
            raise HTTPException(status_code=404, detail=f"Post with ID {post_id} not found")
        logger.info(f"Post found: {post.title}")
        return post
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to fetch post {post_id}: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch post: {str(e)}"
        )


@app.patch("/api/posts/{post_id}", response_model=PostResponse)
def update_post(
    post_id: int, post_update: PostUpdate, db: Session = Depends(get_db)
):
    """Update a post (auto-save endpoint)."""
    try:
        logger.info(f"Updating post {post_id}")
        post = db.query(Post).filter(Post.id == post_id).first()
        if not post:
            logger.warning(f"Post not found for update: {post_id}")
            raise HTTPException(status_code=404, detail=f"Post with ID {post_id} not found")

        if post_update.title is not None:
            post.title = post_update.title
        if post_update.content is not None:
            post.content = post_update.content

        post.updated_at = datetime.now(timezone.utc)
        db.commit()
        db.refresh(post)
        logger.info(f"Post {post_id} updated successfully")
        return post
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Failed to update post {post_id}: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to update post: {str(e)}"
        )


@app.post("/api/posts/{post_id}/publish", response_model=PostResponse)
def publish_post(post_id: int, db: Session = Depends(get_db)):
    """Publish a draft post."""
    try:
        logger.info(f"Publishing post {post_id}")
        post = db.query(Post).filter(Post.id == post_id).first()
        if not post:
            logger.warning(f"Post not found for publishing: {post_id}")
            raise HTTPException(status_code=404, detail=f"Post with ID {post_id} not found")

        post.status = PostStatus.PUBLISHED
        post.updated_at = datetime.now(timezone.utc)
        db.commit()
        db.refresh(post)
        logger.info(f"Post {post_id} published successfully")
        return post
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Failed to publish post {post_id}: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to publish post: {str(e)}"
        )


@app.delete("/api/posts/{post_id}", status_code=204)
def delete_post(post_id: int, db: Session = Depends(get_db)):
    """Delete a post permanently."""
    try:
        logger.info(f"Deleting post {post_id}")
        post = db.query(Post).filter(Post.id == post_id).first()
        if not post:
            logger.warning(f"Post not found for deletion: {post_id}")
            raise HTTPException(status_code=404, detail=f"Post with ID {post_id} not found")

        db.delete(post)
        db.commit()
        logger.info(f"Post {post_id} deleted successfully")
        return None
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Failed to delete post {post_id}: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to delete post: {str(e)}"
        )


# ─── AI Summarize ────────────────────────────────────────────────────────────


@app.post("/api/ai/summarize", response_model=AISummarizeResponse)
async def summarize_text(request: AISummarizeRequest):
    """Generate an AI summary of the given text using Gemini API."""
    logger.info("AI summarization requested")
    api_key = os.environ.get("GEMINI_API_KEY")

    if not api_key:
        logger.info("No API key found, using fallback summarization")
        try:
            sentences = request.text.replace("\n", " ").split(". ")
            summary_sentences = []
            char_count = 0
            for sentence in sentences[:5]:
                if char_count + len(sentence) > 200:
                    break
                summary_sentences.append(sentence)
                char_count += len(sentence)

            summary = ". ".join(summary_sentences).strip()
            if summary and not summary.endswith("."):
                summary += "."

            if not summary:
                summary = request.text[:200] + "..." if len(request.text) > 200 else request.text

            logger.info("Fallback summary generated successfully")
            return AISummarizeResponse(summary=summary)
        except Exception as e:
            logger.error(f"Fallback summarization failed: {str(e)}")
            return AISummarizeResponse(summary="Unable to generate summary.")

    try:
        logger.info("Using Gemini API for summarization")
        try:
            import google.generativeai as genai
        except ImportError:
            logger.warning("google-generativeai not installed, using fallback")
            return AISummarizeResponse(summary=request.text[:200] + "..." if len(request.text) > 200 else request.text)

        genai.configure(api_key=api_key)
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(
            f"Please provide a concise summary (2-3 sentences) of the following text:\n\n{request.text}"
        )
        logger.info("AI summary generated successfully")
        return AISummarizeResponse(summary=response.text)
    except Exception as e:
        logger.error(f"AI summarization failed: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"AI summarization failed: {str(e)}"
        )


# ─── Health Check ────────────────────────────────────────────────────────────


@app.get("/api/health")
def health_check(db: Session = Depends(get_db)):
    """Health check endpoint with database connectivity test."""
    try:
        db.execute(text("SELECT 1"))
        logger.info("Health check passed")
        return {
            "status": "healthy",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "database": "connected"
        }
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        return {
            "status": "unhealthy",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "database": "disconnected",
            "error": str(e)
        }
