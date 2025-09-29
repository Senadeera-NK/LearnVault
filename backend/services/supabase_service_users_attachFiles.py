from services.supabase_config import SUPABASE_URL, SUPABASE_KEY
import logging
from datetime import date
from supabase import create_client

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)    

def insert_user_files(user_id: str, files: list):
    try:
        # Ensure user_id is added to each file dict
        files_with_user = [{**file, "user_id": int(user_id)} for file in files]

        # Print payload for debugging
        print("📤 Sending files to Supabase:", files_with_user)

        # Insert array of files as multiple rows
        new_files = supabase.table("users_pdfs").insert(files_with_user).execute()

        return {"success": True, "files": new_files.data}

    except Exception as e:
        print("❌ Error during insert:", str(e))
        return {"success": False, "error": str(e)}
