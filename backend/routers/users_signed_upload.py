from fastapi import APIRouter, HTTPException, Query
from services.supabase_config import SUPABASE_URL, SUPABASE_KEY
from supabase import create_client
import uuid

router = APIRouter()
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

@router.get("/generate_signed_url")
def generate_signed_url(user_id: int = Query(...), filename: str = Query(...)):
    """
    Generates a temporary (10 min) signed upload URL for Supabase Storage.
    """
    try:
        file_path = f"user_{user_id}/{uuid.uuid4()}_{filename}"
        res = supabase.storage.from_("user_pdfs").create_signed_upload_url(file_path)

        if not res:
            raise HTTPException(status_code=500, detail="Failed to generate signed URL")

        return {
            "upload_url": res["signedURL"],
            "file_path": file_path
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
