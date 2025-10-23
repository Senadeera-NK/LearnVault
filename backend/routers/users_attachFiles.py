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
            "files_url": result["file_urls"],
            "skipped_files":result["skipped_files"],
            "uploaded_urls":result['uploaded_urls']
        }
    else:
        raise HTTPException(status_code=400, detail=result.get("error", "Failed to upload files"))

@router.post("/txt_file_convert/{user_id}")
async def txt_file_convert(user_id:int, title:str, text:str):
    result = await txt_file_convert(user_id, title, text)
    if result.get("success"):
        return{
            "message":"Files converted to PDF successfully"
        }
    else:
        raise HTTPException(status_code=400, detail=result.get("error", "Failed to convert text to PDF"))
