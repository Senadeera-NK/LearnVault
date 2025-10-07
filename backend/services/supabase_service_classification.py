from services.supabase_config import SUPABASE_KEY, SUPABASE_URL
from supabase import create_client
from models.models_classifier.file_classifier import classify_document
import os
import tempfile
import requests

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

async def classify_user_files(user_id:int):
  try:
    # fetch the files that dont have an assigned category
    res = supabase.table("users_pdfs").select("*").eq("user_id", user_id).or_("category.eq.NULL,category.eq.''").execute()
    files_to_classify = res.data

    if not files_to_classify:
      return {"success":True, "message":"No files to classify"}
    
    for file in files_to_classify:
      file_url = file["file_url"]

      # donwload the file temporarily
      tmp_dir = tempfile.gettempdir()
      local_path = os.path.join(tmp_dir, os.path.basename(file_url))

      # downloading the files from public URL
      r = requests.get(file_url)
      with open(local_path, "wb") as f:
        f.write(r.content)

      # classify
      category = classify_document(local_path)

      # update DB
      supabase.table("users_pdfs").update({"category":category}).eq("id", file["id"]).execute()
    
    return {"success":True, "classified_files":len(files_to_classify)}


  except Exception as e:
    return {"success": False, "error": str(e)}
  
# function to retreive the data of the already classified files of the user
def get_user_files(user_id):
  try:
    res = supabase.table("users_pdfs").select("*").eq("user_id", user_id).execute()
    if res.data:
      return {"success":True, "message":"retreived the data", "data":res.data}
    else:
      return {"success":False, "message":"Not successful", "data":[]}
  
  except Exception as e:
    return {"success":False, "error":str(e)}

