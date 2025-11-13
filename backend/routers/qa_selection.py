from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Literal
from services.qa_generation import generate_qa_from_file
from services.save_qa_selection import user_qa_count_service

router = APIRouter()

class QASelectionRequest(BaseModel):
    user_id: int
    fileURL: str
    category: Literal["fact", "true_false", "mcq"]
    num_questions: int = 20

@router.post("/qa/selection")
async def generate_qa_selection(data: QASelectionRequest):
    try:
        print(f"[DEBUG] QA request user={data.user_id}, category={data.category}")
        result = await generate_qa_from_file(
            file_url=data.fileURL,
            qa_type=data.category,
            num_questions_total=data.num_questions,
            user_id=str(data.user_id),
        )

        if "error" in result:
            raise HTTPException(status_code=400, detail=result["error"])

        return {"message": "QA generated and saved incrementally", **result}

    except Exception as e:
        print(f"[FATAL] QA selection failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/qa/user_qa_count/{user_id}")
async def user_qa_count(user_id: int):
    result = await user_qa_count_service(user_id)
    if result.get("success"):
        return {
            "message": "User QA count retrieved successfully",
            "details": result.get("count")
        }
    else:
        raise HTTPException(status_code=400, detail=result.get("error", "Failed to fetch user QA count"))
