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
    try:
        print(f"--- QA SELECTION REQUEST ---\nUser: {data.user_id}\nCategory: {data.category}\nFile: {data.fileURL}")
        result = await generate_qa_from_file(
            file_url=data.fileURL,
            qa_type=data.category,
            num_questions_total=data.num_questions,
            user_id=str(data.user_id),  # pass user_id as string to save_qa_incremental
        )
        print("QA generation result: ", result)

        if "error" in result:
            raise HTTPException(status_code=400, detail=result["error"])

        return {"message": "QA generated and saved incrementally", **result}
    except Exception as e:
        print("Fata error is generate_qa_selection: ",e)
        raise HTTPException(status_code=500,detail=str(e))


@router.get("/qa/user_qa_count/{user_id}")
async def user_qa_count(user_id: int):
    print(f"[DEBUG] /user_qa_count called with user_id={user_id}")
    result = await user_qa_count_service(user_id)
    print(f"[DEBUG] Service returned: {result}")

    if result.get("success"):
        return {
            "message": "User QA count received successfully",
            "details": result.get("count")
        }
    else:
        raise HTTPException(status_code=400, detail=result.get("error", "Failed to fetch user QA count"))
