from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Literal
from services.qa_generation import generate_qa_from_file
from services.save_qa_selection import user_qa_count_service

router = APIRouter()

class QASelectionRequest(BaseModel):
    user_id: int  # now frontend sends this
    fileURL: str
    category: Literal["fact", "true_false", "mcq"]
    num_questions: int = 20  # default to 20

@router.post("/qa/selection")
async def generate_qa_selection(data: QASelectionRequest):
    """
    Incremental QA generator:
    - Generates questions per chunk
    - Saves incrementally to Supabase
    - Prevents memory overload
    """
    result = await generate_qa_from_file(
        file_url=data.fileURL,
        qa_type=data.category,
        num_questions_total=data.num_questions,
        user_id=str(data.user_id),  # pass user_id as string to save_qa_incremental
    )

    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])

    return {"message": "QA generated and saved incrementally", **result}


@router.get("/user_qa_count/{user_id}")
async def user_qa_count(user_id: int):
    result = await user_qa_count_service(user_id)
    if result.get("success"):
        return {
            "message": "User QA count received successfully",
            "details": result.get("count")
        }
    else:
        raise HTTPException(status_code=400, detail=result.get("error", "Failed to fetch user QA count"))
