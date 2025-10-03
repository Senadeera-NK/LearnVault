from fastapi import APIRouter, HTTPException, File, Form, UploadFile
from pydantic import BaseModel
from services.supabase_service_users_attachFiles import insert_user_files
from typing import List

router = APIRouter()


@router.post("/insert_pdf_file")
async def user_attach_files(user_id:int = Form(...), files:List[UploadFile] = File(...)):
    if not files:
        raise HTTPException(status_code=400, detail="No files provided")
    
    result = await insert_user_files(user_id, files)  # ✅ await here
    
    if result["success"]:
        return {"message": "Files uploaded successfully", "files_url": result["file_urls"]}
    else:
        raise HTTPException(status_code=400, detail=result["error"])

    
