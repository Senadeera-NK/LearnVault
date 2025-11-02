from services.supabase_config import SUPABASE_KEY, SUPABASE_URL
from supabase import create_client

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

async def save_qa_selection(user_id:str, file_url:str, category:str):
    # logic
    
    response = supabase.table("qa_files").insert({
        "user_id":user_id,
        "file_url":file_url,
        "category":category
    }).execute()
    
    return response.data