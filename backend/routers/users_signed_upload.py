# routers/users_signed_upload.py
import urllib
from fastapi import APIRouter, UploadFile, Form, HTTPException
from services.supabase_config import SUPABASE_URL, SUPABASE_KEY
from supabase import create_client
import uuid, tempfile, os, requests

router = APIRouter()
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

@router.post("/upload_file")
async def upload_file(user_id: int = Form(...), file: UploadFile = Form(...)):
    """
    Upload a file to Supabase Storage and insert a record in users_pdfs.
    """
    try:
        # ✅ Generate unique file path
        file_path = f"user_{user_id}/{uuid.uuid4()}_{file.filename}"

        # ✅ Save file temporarily in chunks to avoid memory overload
        temp_dir = tempfile.gettempdir()
        temp_file_path = os.path.join(temp_dir, file.filename)

        with open(temp_file_path, "wb") as buffer:
            while chunk := await file.read(1024 * 1024):  # 1 MB chunks
                buffer.write(chunk)

        # ✅ Get signed upload URL (latest SDK returns 'signed_url')
        signed_url_res = supabase.storage.from_("user_pdfs").create_signed_upload_url(file_path)
        print("DEBUG: signed_url_res =", signed_url_res)

        signed_url = signed_url_res.get("signed_url")
        if not signed_url:
            raise HTTPException(status_code=500, detail="Failed to generate signed URL")

        signed_url = urllib.parse.quote(signed_url, safe=':/?&=%')
        # ✅ Upload file using signed URL
        with open(temp_file_path, "rb") as f:
            upload_resp = requests.put(signed_url, data=f)
        if upload_resp.status_code not in [200, 201, 204]:
            raise HTTPException(status_code=500, detail=f"Supabase upload failed: {upload_resp.text}")

        # ✅ Insert record into Supabase table
        file_url = supabase.storage.from_("user_pdfs").get_public_url(file_path)
        supabase.table("users_pdfs").insert({"user_id": user_id, "file_url": file_url}).execute()

        # ✅ Clean up temp file
        os.remove(temp_file_path)

        return {"success": True, "file_url": file_url, "file_path": file_path}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))