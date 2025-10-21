# services/supabase_service_users_attachFiles.py
from services.supabase_config import SUPABASE_URL, SUPABASE_KEY
from supabase import create_client
import tempfile, os, threading
from models.classifier import classify_document

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

def background_classification(file_path, pdf_id):
    """Classify a single file in background and update Supabase table"""
    try:
        category = classify_document(file_path)
        supabase.table("users_pdfs").update({
            "predicted_category": category,
            "classification_status": "done"
        }).eq("id", pdf_id).execute()
    except Exception as e:
        supabase.table("users_pdfs").update({
            "classification_status": "error"
        }).eq("id", pdf_id).execute()
    finally:
        if os.path.exists(file_path):
            os.remove(file_path)

async def insert_user_files(user_id: str, files: list):
    """Upload files to Supabase and start background classification"""
    try:
        file_urls = []

        for file in files:
            temp_dir = tempfile.gettempdir()
            temp_path = os.path.join(temp_dir, file.filename)

            # Save file in chunks
            with open(temp_path, "wb") as buffer:
                while chunk := await file.read(1024 * 1024):  # 1 MB chunks
                    buffer.write(chunk)

            # Upload to Supabase storage
            storage_path = f"user_{user_id}/{file.filename}"
            with open(temp_path, "rb") as f:
                supabase.storage.from_("user_pdfs").upload(storage_path, f, {"upsert": "true"})

            # Get public URL
            file_url = supabase.storage.from_("user_pdfs").get_public_url(storage_path)

            # Insert row with pending status
            res = supabase.table("users_pdfs").insert({
                "user_id": user_id,
                "file_url": file_url,
                "classification_status": "pending"
            }).execute()

            pdf_id = res.data[0]["id"]
            file_urls.append(file_url)

            # Start classification in background thread
            threading.Thread(target=background_classification, args=(temp_path, pdf_id)).start()

        return {"success": True, "file_urls": file_urls}

    except Exception as e:
        return {"success": False, "error": str(e)}