from services.supabase_config import SUPABASE_URL, SUPABASE_KEY
import logging
from datetime import date
from supabase import create_client

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)    

async def insert_user_files(user_id: str, files: list):
    try:
        file_urls = []
        for file in files:
            file_path = f"user_{user_id}/{file.filename}"
            content = await file.read()  # async read
            supabase.storage.from_("user_pdfs").upload(file_path, content, {"upsert": "true"})
            file_url = supabase.storage.from_("user_pdfs").get_public_url(file_path)
            supabase.table("users_pdfs").insert({"user_id": user_id, "file_url": file_url}).execute()
            file_urls.append(file_url)
        return {"success": True, "file_urls": file_urls}
    except Exception as e:
        return {"success": False, "error": str(e)}

