from fastapi import APIRouter, UploadFile, Form, HTTPException
from services.supabase_config import SUPABASE_URL, SUPABASE_KEY
from supabase import create_client
import uuid, tempfile, os, requests

router = APIRouter()
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

@router.post("/upload_file")
async def upload_file(user_id: int = Form(...), file: UploadFile = Form(...)):
    try:
        # Generate unique file path
        safe_filename = "".join(c if c.isalnum() or c in "-_." else "_" for c in file.filename)
        file_path = f"user_{user_id}/{uuid.uuid4()}_{safe_filename}"

        # Save file temporarily
        temp_file_path = os.path.join(tempfile.gettempdir(), file.filename)
        with open(temp_file_path, "wb") as f:
            while chunk := await file.read(1024 * 1024):
                f.write(chunk)

        # Get signed upload URL (path only)
        signed_url_res = supabase.storage.from_("user_pdfs").create_signed_upload_url(file_path)
        signed_path = signed_url_res.get("signed_url")
        if not signed_path:
            raise HTTPException(status_code=500, detail="Failed to generate signed URL")

        # ✅ Prepend full storage URL
        full_signed_url = f"{SUPABASE_URL}/storage/v1/{signed_path.lstrip('/')}"
        
        # Upload file
        with open(temp_file_path, "rb") as f:
            upload_resp = requests.put(full_signed_url, data=f)
        if upload_resp.status_code not in [200, 201, 204]:
            raise HTTPException(status_code=500, detail=f"Supabase upload failed: {upload_resp.text}")

        # Insert record
        file_url = supabase.storage.from_("user_pdfs").get_public_url(file_path)
        supabase.table("users_pdfs").insert({"user_id": user_id, "file_url": file_url}).execute()

        # Clean up
        os.remove(temp_file_path)

        return {"success": True, "file_url": file_url, "file_path": file_path}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
