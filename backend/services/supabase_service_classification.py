from services.supabase_config import SUPABASE_KEY, SUPABASE_URL
from supabase import create_client
from models.models_classifier.file_classifier import classify_document
import os
import tempfile
import requests
from requests import post


supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

async def classify_user_files(file_url):
  tmp_dir = tempfile.gettempdir()
  local_path = os.path.join(tmp_dir, os.path.basename(file_url))
  r = requests.get(file_url)
  with open(local_path, "wb") as f
    f.write(r.content)


  return "ERROR"

