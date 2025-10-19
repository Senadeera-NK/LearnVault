from services.supabase_config import SUPABASE_URL, SUPABASE_KEY
import logging, os, tempfile
from supabase import create_client
from services.supabase_service_classification import classify_user_files

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

async def insert_user_files(user_id: str, files: list):
    try:
        file_urls = []

        for file in files:
            # ✅ 1. Save file temporarily in chunks (no full read)
            temp_dir = tempfile.gettempdir()
            temp_path = os.path.join(temp_dir, file.filename)

            with open(temp_path, "wb") as buffer:
                while chunk := await file.read(1024 * 1024):  # Read 1 MB chunks
                    buffer.write(chunk)

            # ✅ 2. Upload from disk instead of memory
            file_path = f"user_{user_id}/{file.filename}"
            with open(temp_path, "rb") as f:
                supabase.storage.from_("user_pdfs").upload(file_path, f, {"upsert": "true"})

            file_url = supabase.storage.from_("user_pdfs").get_public_url(file_path)
            supabase.table("users_pdfs").insert({"user_id": user_id, "file_url": file_url}).execute()
            file_urls.append(file_url)

            # ✅ 3. Clean up temp file
            os.remove(temp_path)

        # ✅ 4. Classify after upload
        await classify_user_files(user_id)

        return {"success": True, "file_urls": file_urls}

    except Exception as e:
        logging.error(f"Error inserting user files: {str(e)}")
        return {"success": False, "error": str(e)}
