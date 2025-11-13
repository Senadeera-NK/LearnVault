from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.save_qa_selection import get_existing_qa_for_user

router = APIRouter()

class CheckQARequest(BaseModel):
    user_id: int
    fileURL: str
    category: str

@router.post("/qa/check_existing")
async def check_existing_qa(data: CheckQARequest):
    try:
        qa = await get_existing_qa_for_user(data.user_id, data.fileURL, data.category)
        return {"exists": bool(qa), "qa": qa if qa else []}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
