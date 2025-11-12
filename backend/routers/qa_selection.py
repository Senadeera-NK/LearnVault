from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.qa_generation import generate_qa_from_file
from services.save_qa_selection import save_qa_incremental, user_qa_count_service

router = APIRouter(prefix="/qa", tags=["QA Selection"])

class QASelectionRequest(BaseModel):
    userId: int
    fileURL: str
    category: str  # "fact", "true_false", or "mcq"
    num_questions: int = 20  # default number of questions

@router.post("/selection")
async def create_qa_selection(data: QASelectionRequest):
    try:
        # Step 1: Generate QA per chunk
        result = await generate_qa_from_file(
            file_url=data.fileURL,
            qa_type=data.category,
            num_questions_total=data.num_questions  # match the param in qa_generation.py
        )

        if "error" in result:
            raise HTTPException(status_code=400, detail=result["error"])

        qa_output = result.get("qa_output")
        if not qa_output:
            raise HTTPException(status_code=400, detail="No QA generated")

        # Wrap the output as a single chunk for incremental save
        qa_chunks = [qa_output]

        # Step 2: Save all QA chunks into a single record
        saved_record = await save_qa_incremental(
            user_id=str(data.userId),
            file_url=data.fileURL,
            category=data.category,
            qa_chunks=qa_chunks
        )

        if "error" in saved_record:
            raise HTTPException(status_code=500, detail=saved_record["error"])

        return {
            "message": "QA generated and saved successfully",
            "record_id": saved_record.get("id"),
            "total_questions": len(saved_record.get("qa_content", []))
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


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
