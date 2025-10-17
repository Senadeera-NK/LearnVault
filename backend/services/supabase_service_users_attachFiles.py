from services.supabase_config import SUPABASE_URL, SUPABASE_KEY
import logging
from supabase import create_client
from services.supabase_service_classification import classify_user_files

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

async def insert_user_files(user_id: str, files: list):
    try:
        file_urls = []

        # 1️⃣ Upload all files first
        for file in files:
            file_path = f"user_{user_id}/{file.filename}"
            content = await file.read()  # async read
            supabase.storage.from_("user_pdfs").upload(file_path, content, {"upsert": "true"})
            file_url = supabase.storage.from_("user_pdfs").get_public_url(file_path)
            supabase.table("users_pdfs").insert({"user_id": user_id, "file_url": file_url}).execute()
            file_urls.append(file_url)

        # 2️⃣ Trigger classification once after all uploads
        await classify_user_files(user_id)

        return {"success": True, "file_urls": file_urls}

    except Exception as e:
        logging.error(f"Error inserting user files: {str(e)}")
        return {"success": False, "error": str(e)}
