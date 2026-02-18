# Smart Blog Editor - Backend

Production-ready FastAPI backend for the Smart Blog Editor with MongoDB and AI capabilities.

## Setup

1. **Install Dependencies**:
```bash
pip install -r requirements.txt
```

2. **Configure Environment**:
```bash
cp .env.example .env
# Edit .env with your MongoDB URL and Gemini API key
```

3. **Run the Server**:
```bash
uvicorn app.main:app --reload --port 8000
```

4. **Access API Documentation**:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## API Endpoints

### Posts
- `POST /api/posts/` - Create new post
- `GET /api/posts/` - Get all posts (with optional status filter)
- `GET /api/posts/{id}` - Get single post
- `PATCH /api/posts/{id}` - Update post (auto-save)
- `POST /api/posts/{id}/publish` - Publish post
- `DELETE /api/posts/{id}` - Delete post

## Database Schema

### Posts Collection
```json
{
  "_id": "ObjectId",
  "title": "string",
  "content": {}, // Lexical JSON state
  "content_html": "string",
  "status": "draft|published",
  "created_at": "datetime",
  "updated_at": "datetime",
  "published_at": "datetime|null"
}
```

## Architecture

- **Framework**: FastAPI (async)
- **Database**: MongoDB with Motor (async driver)
- **Validation**: Pydantic v2
- **AI**: Google Gemini API (bonus feature)
