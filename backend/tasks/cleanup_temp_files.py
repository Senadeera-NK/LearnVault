import os
import re
from datetime import datetime, timedelta, timezone
from supabase import create_client, Client

url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_SERVICE_KEY")
supabase: Client = create_client(url,key)

BUCKET_NAME = "user_pdfs"
TEMP_PREFIX = "temp_"
TIME_FORMAT = "%Y-%m-%dT%H-%M"

def cleanup_temp_folders():
    print("starting temporary file cleanup job....")
    try:
        response = supabase.storage.from_(BUCKET_NAME).list(path="", options={"limit":1000})
        now = datetime.now(timezone.utc)
        deleted = 0

        for item in response:
            name = item["name"]
            if not name.startswith(TEMP_PREFIX):
                continue

            match = re.search(r"temp_(\d{4}-\d{2}-\d{2}T\d{2}-\d{2})_user_", name)
            if not match:
                continue
            timestamp_str = match.group(1)
            try:
                folder_time = datetime.strptime(timestamp_str, TIME_FORMAT).replace(tzinfo=timezone.utc)
            except ValueError:
                continue
                
            # checking if the folder is older than 24hrs
            if now - folder_time > timedelta(hours=24):
                print(f"deleting old temp folder: {name}")
                supabase.storage.from_(BUCKET_NAME).remove([name])
                deleted+=1
        print(f"cleanup complete. Deleted{deleted} folders.")
    except Exception as e:
        print(f"cleanup failed: {e}")

if __name__ == "__main__":
    cleanup_temp_folders()
