from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.qa_generation import generate_qa_from_file
from services.save_qa_selection import save_qa_selection
router = APIRouter(prefix="/qa",tags=["QA Selection"])

class QASelectionRequest(BaseModel):
    userId:int
    fileURL: str
    category:str

@router.post("/selection")
async def create_qa_selection(data:QASelectionRequest):
    try:
        result = await generate_qa_from_file(data.fileURL, data.category)

        if "error" in result:
            raise HTTPException(status_code=400, detail=result["error"])

        # save QA result, to DB
        saved_record = await save_qa_selection(
            user_id = data.userId,
            file_url=data.fileURL,
            category=data.category,
            qa_content=result["qa_output"])

        if "error" in saved_record:
            raise HTTPException(status_code=500, detail=saved_record["error"])
        return{"message":"data saved successfully", "result":saved_record}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/user_qa_count/{user_id}")
async def user_qa_count(user_id:int):
    result = await user_qa_count_service(user_id)
    if result.get("success"):
        return {"message":"user qa count received successfully","details":result.get("count")}
    else:
        raise HTTPException(status_code=400, detail=result.get("error", "Failed to convert text to PDF"))
