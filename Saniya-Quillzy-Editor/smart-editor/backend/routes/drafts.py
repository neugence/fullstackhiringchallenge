from fastapi import APIRouter, HTTPException
from database import db
from bson import ObjectId
from datetime import datetime

router = APIRouter(prefix="/api/drafts")


@router.post("/save")
def save_draft(body: dict):
    """
    Auto-save endpoint — uses upsert logic:
    - If draft_id is provided and exists, update it
    - If no draft_id, create a new draft and return its ID
    This prevents creating duplicate drafts on every save.
    """
    draft_id = body.get("draft_id")
    content = body.get("content", "")
    plain_text = body.get("plain_text", "")
    title = body.get("title", "Untitled")
    word_count = body.get("word_count", 0)

    draft_data = {
        "content": content,
        "plain_text": plain_text,
        "title": title,
        "word_count": word_count,
        "status": "draft",
        "updated_at": datetime.utcnow(),
    }

    if draft_id:
        # Update existing draft
        try:
            result = db.drafts.update_one(
                {"_id": ObjectId(draft_id)},
                {"$set": draft_data}
            )
            if result.matched_count == 0:
                raise HTTPException(status_code=404, detail="Draft not found")
            return {
                "draft_id": draft_id,
                "message": "Draft saved",
                "saved_at": datetime.utcnow().isoformat()
            }
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))
    else:
        # Create new draft
        draft_data["created_at"] = datetime.utcnow()
        result = db.drafts.insert_one(draft_data)
        return {
            "draft_id": str(result.inserted_id),
            "message": "Draft created",
            "saved_at": datetime.utcnow().isoformat()
        }


@router.get("/{draft_id}")
def get_draft(draft_id: str):
    """Retrieve a specific draft by ID."""
    try:
        draft = db.drafts.find_one({"_id": ObjectId(draft_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid draft ID")

    if not draft:
        raise HTTPException(status_code=404, detail="Draft not found")

    draft["_id"] = str(draft["_id"])
    return draft


@router.get("/")
def list_drafts():
    """List all drafts, sorted by most recently updated."""
    drafts = list(
        db.drafts.find({"status": "draft"})
        .sort("updated_at", -1)
        .limit(20)
    )
    for d in drafts:
        d["_id"] = str(d["_id"])
    return drafts


@router.delete("/{draft_id}")
def delete_draft(draft_id: str):
    """Delete a draft by ID."""
    try:
        result = db.drafts.delete_one({"_id": ObjectId(draft_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid draft ID")

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Draft not found")

    return {"message": "Draft deleted"}
