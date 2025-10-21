from fastapi import APIRouter, HTTPException
from services.supabase_service_classification import classify_user_files, get_user_files
from services.supabase_service_users_attachFiles import get_user_file_status

router = APIRouter()

# Endpoint to classify all uncategorized files of a user
@router.get("/user_files_status/{user_id}")
def user_files_status(user_id: int):
    """
    Returns all user files with classification status and predicted category.
    """
    result = get_user_file_status(user_id)
    if result.get("success"):
        return {
            "message": "User files status retrieved successfully",
            "files": result["files"]
        }
    else:
        raise HTTPException(status_code=500, detail=result.get("error", "Failed to fetch status"))

# Endpoint to fetch all user files
@router.get("/get_user_pdfs/{user_id}")
def get_user_pdfs(user_id: int):
    result = get_user_files(user_id)
    if result.get('success'):
        return {"message": "successful", "details": result.get("data", [])}
    else:
        raise HTTPException(status_code=401, detail=result.get("error", "Could not retrieve files"))
