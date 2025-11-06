from services.supabase_config import SUPABASE_URL, SUPABASE_KEY
from supabase import create_client
import tempfile, os
import datetime
from urllib.parse import urlparse
import re

supabase = create_client(SUPABASE_URL,SUPABASE_KEY)

async def upload_temp_file(user_id:int, file):
    try:
        temp_dir = tempfile.gettempdir()
        temp_path = os.path.join(temp_dir,file.filename)
        
        with open(temp_path, "wb") as buffer:
            while chunk:= await file.read(1042*1024):
                buffer.write(chunk)
        
        storage_path = f"temp_user_{user_id}/{file.filename}"
        with open(temp_path, "rb") as f:
            supabase.storage.from_("users_pdfs").upload(storage_path,f,{"upsert":"true"})
        
        file_url = supabase.storage.from_("users_pdfs").get_public_url(storage_path)
        os.remove(temp_path)
        
        return {"success":True, "file_url":file_url}
    except Exception as e:
        return {"success":False, "error":str(e)}


def delete_supabase_file(public_url: str):
    """Delete file from Supabase storage given its public URL"""
    try:
        parts = urlparse(public_url)
        # Extract path after bucket name
        match = re.search(r'/storage/v1/object/public/([^/]+)/(.+)', parts.path)
        if not match:
            print("DEBUG: Could not parse URL for deletion:", public_url)
            return
        bucket, file_path = match.groups()
        supabase.storage.from_(bucket).remove([file_path])
        print(f"DEBUG: Deleted temp file from {bucket}/{file_path}")
    except Exception as e:
        print(f"DEBUG: Error deleting file: {e}")