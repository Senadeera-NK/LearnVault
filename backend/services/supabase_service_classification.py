from services.supabase_config import SUPABASE_KEY, SUPABASE_URL
from supabase import create_client
from models.classifier import classify_document
from utils import download_file_from_url

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)


# Classify all uncategorized files for a user
async def classify_user_files(user_id: int):
    try:
        # Get uncategorized files
        res = supabase.table("users_pdfs").select("*").eq("user_id", user_id)\
               .or_("category.is.NULL,category.eq.").execute()
        files_to_classify = res.data

        print(f"Found{len(res.data)} uncategorized files: ", res.data)
        if not files_to_classify:
            return {"success": True, "message": "All files already categorized"}

        for file in files_to_classify:
            file_url = file["file_url"]
            local_file = download_file_from_url(file_url)
            if local_file:
                category = classify_document(local_file)
            else:
                category = "Download/Error"

            # Update Supabase table
            supabase.table("users_pdfs").update({"category": category})\
                    .eq("id", file["id"]).execute()

        return {"success": True, "classified_files": len(files_to_classify)}

    except Exception as e:
        print("classification error", str(e))
        return {"success": False, "error": str(e)}


def get_user_files(user_id: int):
    try:
        res = supabase.table("users_pdfs").select("*").eq("user_id", user_id).execute()
        if res.data:
            return {
                "success": True,
                "message": "Retrieved user files successfully",
                "data": res.data,
            }
        else:
            return {"success": False, "message": "No files found", "data": []}
    except Exception as e:
        return {"success": False, "error": str(e)}


# def classify_file_with_colab(file_url):
#     """
#     Send the raw Supabase file URL to Colab.
#     """
#     colab_api_url = "https://kristeen-wholehearted-quotably.ngrok-free.dev/classify_url"

#     # Remove trailing ? if exists
#     if file_url.endswith('?'):
#         file_url = file_url[:-1]

#     print("DEBUG: Sending URL to Colab:", file_url)
#     print("DEBUG: Type of file_url:", type(file_url))

#     try:
#         resp = requests.post(colab_api_url, json={"url": file_url}, timeout=30)
#         if resp.ok:
#             return resp.json().get("category")
#         else:
#             print("DEBUG: Colab response:", resp.status_code, resp.text)
#             return "ERROR"
#     except Exception as e:
#         print("DEBUG: Colab request error:", str(e))
#         return "ERROR"



