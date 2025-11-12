# services/supabase_service_users_attachFiles.py
import logging, os, tempfile, threading
from io import BytesIO
from fastapi import UploadFile
from services.supabase_config import SUPABASE_URL, SUPABASE_KEY
from supabase import create_client
from models.classifier import classify_document

logging.basicConfig(level=logging.INFO)
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)


def background_classification(file_path, pdf_id):
    """Classify a single file in background and update Supabase table"""
    try:
        category = classify_document(file_path)
        supabase.table("users_pdfs").update({
            "category": category,
            "classification_status": "done"
        }).eq("id", pdf_id).execute()
    except Exception as e:
        logging.error(f"Background classification error for id {pdf_id}: {e}")
        supabase.table("users_pdfs").update({
            "classification_status": "error"
        }).eq("id", pdf_id).execute()
    finally:
        if os.path.exists(file_path):
            os.remove(file_path)


def checking_duplicate_files(user_id: str, filename: str) -> bool:
    """Check if a file with the same name already exists for this user"""
    try:
        res = supabase.table("users_pdfs").select("file_url").eq("user_id", user_id).execute()
        existing_filenames = [os.path.basename(item.get("file_url", "")) for item in res.data or []]
        return filename in existing_filenames
    except Exception as e:
        logging.error(f"Error checking duplicates for user {user_id}: {e}")
        return False


async def insert_user_files(user_id, files: list):
    """Upload multiple files to Supabase and start background classification"""
    user_id = str(user_id)  # Ensure consistent string type
    uploaded_urls, skipped_files, file_urls = [], [], []

    try:
        for file in files:
            if checking_duplicate_files(user_id, file.filename):
                skipped_files.append(file.filename)
                logging.info(f"[Duplicate Skipped] File already exists for user {user_id}: {file.filename}")
                continue

            # Read entire file content at once
            try:
                content = await file.read()
            except Exception as e:
                logging.error(f"Failed to read file {file.filename}: {e}")
                skipped_files.append(file.filename)
                continue

            # Save temporarily
            temp_dir = tempfile.gettempdir()
            temp_path = os.path.join(temp_dir, file.filename)
            with open(temp_path, "wb") as f:
                f.write(content)

            # Upload to Supabase storage
            storage_path = f"user_{user_id}/{file.filename}"
            try:
                supabase.storage.from_("user_pdfs").upload(storage_path, temp_path, {"upsert": "true"})
            except Exception as e:
                logging.error(f"Supabase storage upload failed for {file.filename}: {e}")
                skipped_files.append(file.filename)
                continue

            # Get public URL
            try:
                file_url = supabase.storage.from_("user_pdfs").get_public_url(storage_path)
            except Exception as e:
                logging.error(f"Failed to get public URL for {file.filename}: {e}")
                skipped_files.append(file.filename)
                continue

            # Insert metadata into Supabase table
            try:
                res = supabase.table("users_pdfs").insert({
                    "user_id": user_id,
                    "file_url": file_url,
                    "classification_status": "pending"
                }).execute()
                if not res.data or len(res.data) == 0:
                    logging.error(f"Insert returned empty data for {file.filename}")
                    skipped_files.append(file.filename)
                    continue
                pdf_id = res.data[0]["id"]
            except Exception as e:
                logging.error(f"Failed to insert PDF metadata for {file.filename}: {e}")
                skipped_files.append(file.filename)
                continue

            # Start background classification
            threading.Thread(target=background_classification, args=(temp_path, pdf_id), daemon=True).start()

            file_urls.append(file_url)
            uploaded_urls.append(file.filename)

        return {
            "success": True,
            "file_urls": file_urls,
            "uploaded_files": uploaded_urls,
            "skipped_files": skipped_files
        }

    except Exception as e:
        logging.error(f"Unexpected error in insert_user_files: {e}", exc_info=True)
        return {"success": False, "error": str(e)}


def get_user_file_status(user_id: int):
    """
    Fetch all files for a user with their classification status and predicted category.
    """
    try:
        res = supabase.table("users_pdfs").select("*").eq("user_id", user_id).execute()
        if res.data:
            return {"success": True, "files": res.data}
        else:
            return {"success": True, "files": []}  # no files yet
    except Exception as e:
        return {"success": False, "error": str(e)}


# function to convert the added text to a PDF, with the title, and classify it as a usual, with a classification
async def txt_file_convert_service(user_id:int, title:str, text:str):
    try:
        pdf = FPDF()
        pdf.add_page()
        pdf.set_font("Arial", size=12)
        for line in text.split("\n"):
            pdf.cell(0,10, txt=line, ln=True)

        pdf_data = pdf.output(dest='S').encode('latin1')
        pdf_bytes = BytesIO(pdf_data)
        pdf_bytes.seek(0)

        converted_pdf = UploadFile(filename=f"{title}.pdf", file=pdf_bytes)
        res = await insert_user_files(user_id, [converted_pdf])
        return {'success':True, "message":"file added successfully", "result":res}
    except Exception as e:
        return {"success":False, "error":str(e)}