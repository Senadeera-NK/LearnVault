from services.supabase_config import SUPABASE_KEY, SUPABASE_URL
from supabase import create_client
import requests
import os
import tempfile

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# Call your Colab model for classification
def classify_file_with_colab(file_url):
    from requests import post

    # Download file temporarily
    tmp_dir = tempfile.gettempdir()
    local_path = os.path.join(tmp_dir, os.path.basename(file_url))
    r = requests.get(file_url)
    with open(local_path, "wb") as f:
        f.write(r.content)

    # Send file to Colab Flask server
    colab_api_url = "https://kristeen-wholehearted-quotably.ngrok-free.dev/classify"
    with open(local_path, "rb") as f:
        files = {"file": f}
        resp = post(colab_api_url, files=files)
        if resp.ok:
            return resp.json().get("category")
        else:
            return "ERROR"

# Classify all uncategorized files for a user
async def classify_user_files(user_id: int):
    try:
        # Get uncategorized files
        res = supabase.table("users_pdfs").select("*").eq("user_id", user_id)\
               .or_("category.eq.NULL,category.eq.''").execute()
        files_to_classify = res.data

        if not files_to_classify:
            return {"success": True, "message": "All files already categorized"}

        for file in files_to_classify:
            file_url = file["file_url"]
            category = classify_file_with_colab(file_url)

            # Update Supabase table
            supabase.table("users_pdfs").update({"category": category})\
                    .eq("id", file["id"]).execute()

        return {"success": True, "classified_files": len(files_to_classify)}

    except Exception as e:
        return {"success": False, "error": str(e)}
