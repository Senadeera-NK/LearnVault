# routers/users_attachFiles.py
from fastapi import APIRouter, HTTPException, File, Form, UploadFile
from services.supabase_service_users_attachFiles import insert_user_files
from typing import List

router = APIRouter()

@router.post("/insert_pdf_file")
async def user_attach_files(user_id: int = Form(...), files: List[UploadFile] = File(...)):
    """
    Upload multiple files for a user.
    Each file is classified in background automatically.
    Returns public URLs and initial status.
    """
    if not files:
        raise HTTPException(status_code=400, detail="No files provided")

    result = await insert_user_files(user_id, files)

    if result.get("success"):
        return {
            "message": "Files uploaded successfully. Classification is running in background.",
            "files_url": result["file_urls"]
        }
    else:
        raise HTTPException(status_code=400, detail=result.get("error", "Failed to upload files"))
