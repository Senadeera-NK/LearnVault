from fastapi import APIRouter, HTTPException
from services.supabase_service_classification import classify_user_files, get_user_files

router = APIRouter()

# Endpoint to classify all uncategorized files of a user
@router.post("/classify_user_files/{user_id}")
async def classify_all_user_files(user_id: int):
    result = await classify_user_files(user_id)
    if result.get("success"):
        return {"message": "Classification done", "details": result}
    else:
        raise HTTPException(status_code=500, detail=result.get("error", "Error classifying files"))

# Endpoint to fetch all user files
@router.get("/get_user_pdfs/{user_id}")
def get_user_pdfs(user_id: int):
    result = get_user_files(user_id)
    if result.get('success'):
        return {"message": "successful", "details": result.get("data", [])}
    else:
        raise HTTPException(status_code=401, detail=result.get("error", "Could not retrieve files"))
