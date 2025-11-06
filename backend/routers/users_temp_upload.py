from fastapi import APIRouter, Form, File, UploadFile,HTTPException
from services.supabase_service_temp_files import upload_temp_file

router = APIRouter()

@router.post("/temp_upload")
async def temp_upload(user_id:int = Form(...), file:UploadFile=File(...)):
    # only inserting into the supabase storage
    try:
        result = await upload_temp_file(user_id, file)
        if result.get("success"):
            return {"message":"temporary file uploaded", "file_url":result["file_url"]}
        raise HTTPException(status_code=400, detail=result.get("error", "Upload failed"))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))