# services/supabase_service_users_attachFiles.py
from services.supabase_config import SUPABASE_URL, SUPABASE_KEY
from supabase import create_client
import tempfile, os, threading, logging
from models.classifier import classify_document
from fpdf import FPDF
from fastapi import UploadFile
from io import BytesIO

logging.basicConfig(level=logging.INFO)
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)


def background_classification(file_path, pdf_id):
    """Classify a single file in background and update Supabase table"""
    try:
        logging.info(f"Starting background classification for pdf_id={pdf_id}")
        category = classify_document(file_path)
        supabase.table("users_pdfs").update({
            "category": category,
            "classification_status": "done"
        }).eq("id", pdf_id).execute()
        logging.info(f"Classification done for pdf_id={pdf_id}, category={category}")
    except Exception as e:
        logging.error(f"Background classification error for id {pdf_id}: {e}")
        supabase.table("users_pdfs").update({
            "classification_status": "error"
        }).eq("id", pdf_id).execute()
    finally:
        if os.path.exists(file_path):
            os.remove(file_path)
            logging.info(f"Temporary file removed: {file_path}")


def checking_duplicate_files(user_id: str, filename: str) -> bool:
    """Check if a file with the same name already exists for this user"""
    try:
        res = supabase.table("users_pdfs").select("file_url").eq("user_id", user_id).execute()
        existing_filenames = [os.path.basename(item.get("file_url", "")) for item in res.data or []]
        is_duplicate = filename in existing_filenames
        logging.info(f"Checking duplicate for {filename}: {is_duplicate}")
        return is_duplicate
    except Exception as e:
        logging.error(f"Error checking duplicates for user {user_id}: {e}")
        return False


async def insert_user_files(user_id, files: list):
    """Upload multiple files to Supabase and start background classification"""
    user_id = str(user_id)
    uploaded_files, skipped_files, file_urls = [], [], []

    try:
        for file in files:
            logging.info(f"Processing file: {file.filename}")
            if checking_duplicate_files(user_id, file.filename):
                skipped_files.append(file.filename)
                logging.info(f"[Duplicate Skipped] {file.filename}")
                continue

            # Read file content
            try:
                content = await file.read()
                logging.info(f"Read {len(content)} bytes from {file.filename}")
            except Exception as e:
                logging.error(f"Failed to read {file.filename}: {e}")
                skipped_files.append(file.filename)
                continue

            # Save temporarily
            temp_dir = tempfile.gettempdir()
            temp_path = os.path.join(temp_dir, file.filename)
            try:
                with open(temp_path, "wb") as f:
                    f.write(content)
                logging.info(f"Saved temporary file: {temp_path}")
            except Exception as e:
                logging.error(f"Failed to save temporary file {temp_path}: {e}")
                skipped_files.append(file.filename)
                continue

            # Upload to Supabase storage
            storage_path = f"user_{user_id}/{file.filename}"
            try:
                supabase.storage.from_("user_pdfs").upload(storage_path, temp_path, {"upsert": "true"})
                logging.info(f"Uploaded {file.filename} to Supabase at {storage_path}")
            except Exception as e:
                logging.error(f"Supabase upload failed for {file.filename}: {e}")
                skipped_files.append(file.filename)
                continue

            # Get public URL
            try:
                file_url = supabase.storage.from_("user_pdfs").get_public_url(storage_path)
                logging.info(f"Public URL obtained for {file.filename}: {file_url}")
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
                logging.info(f"Inserted metadata for {file.filename}, pdf_id={pdf_id}")
            except Exception as e:
                logging.error(f"Failed to insert metadata for {file.filename}: {e}")
                skipped_files.append(file.filename)
                continue

            # Start classification in background
            threading.Thread(target=background_classification, args=(temp_path, pdf_id), daemon=True).start()

            uploaded_files.append(file.filename)
            file_urls.append(file_url)

        return {
            "success": True,
            "file_urls": file_urls,
            "uploaded_files": uploaded_files,
            "skipped_files": skipped_files
        }

    except Exception as e:
        logging.error(f"Unexpected error in insert_user_files: {e}", exc_info=True)
        return {"success": False, "error": str(e)}


def get_user_file_status(user_id: int):
    """Fetch all files for a user with classification status"""
    try:
        res = supabase.table("users_pdfs").select("*").eq("user_id", user_id).execute()
        files = res.data if res.data else []
        logging.info(f"Retrieved {len(files)} files for user {user_id}")
        return {"success": True, "files": files}
    except Exception as e:
        logging.error(f"Error fetching files for user {user_id}: {e}")
        return {"success": False, "error": str(e)}


async def txt_file_convert_service(user_id: int, title: str, text: str):
    """Convert text to PDF and classify it like a normal upload"""
    try:
        pdf = FPDF()
        pdf.add_page()
        pdf.set_font("Arial", size=12)
        for line in text.split("\n"):
            pdf.cell(0, 10, txt=line, ln=True)

        pdf_data = pdf.output(dest='S').encode('latin1')
        pdf_bytes = BytesIO(pdf_data)
        pdf_bytes.seek(0)

        converted_pdf = UploadFile(filename=f"{title}.pdf", file=pdf_bytes)
        res = await insert_user_files(user_id, [converted_pdf])
        logging.info(f"Text converted to PDF for {title}, result: {res}")
        return {'success': True, "message": "file added successfully", "result": res}
    except Exception as e:
        logging.error(f"txt_file_convert_service error: {e}", exc_info=True)
        return {"success": False, "error": str(e)}
