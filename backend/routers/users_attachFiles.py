from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.supabase_service_users_attachFiles import insert_user_files

router = APIRouter()

class FilesRequest(BaseModel):
    user_id: int
    file_names: list[str]

@router.post("/insert_pdf_files")
async def user_attach_files(request: FilesRequest):
    if not request.file_names:
        raise HTTPException(status_code=400, detail="No files provided")

    files_payload = [{"name": name} for name in request.file_names]
    result = insert_user_files(request.user_id, files_payload)

    if result['success']:
        return {"message": "Files attached successfully"}
    else:
        raise HTTPException(status_code=400, detail=result["error"])
