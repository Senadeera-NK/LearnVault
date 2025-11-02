from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.qa_selection_service import save_qa_selection

router = APIRouter(prefix="/qa",tags=["QA Selection"])

class QASelectionRequest(BaseModel):
    userId:int
    fileURL: str
    category:str

@router.post("/selection")
async def create_qa_selection(data:QASelectionRequest):
    try:
        result = await save_qa_selection(data.userId, data.fileURL, data.category)
        return{"message":"data saved successfully", "result":result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))