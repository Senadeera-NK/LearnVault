from services.supabase_config import SUPABASE_URL, SUPABASE_KEY
from supabase import create_client
import tempfile, os
import datetime

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
        
        file_url = supabase.storage.from_("users_pdpfs").get_public_url(storage_path)
        os.remove(temp_path)
        
        return {"success":True, "file_url":file_url}
    except Exception as e:
        return {"success":False, "error":str(e)}

def cleanup_temp_files():
    try:
        all_files = supabase.storage.from_("user_pdfs").list("temp_user_")
        cutoff_time = datetime.utcnow() - datetime.timedelta(hours=24)
        for f in all_files:
            if f["created_at"] < cutoff_time.isoformat():
                supabase.storage.from_("users_pdfs").remove(f["name"])
        print("old temp files cleaned")
    except Exception as e:
        print("cleanup error: ", e)