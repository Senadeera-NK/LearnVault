from services.supabase_config import SUPABASE_KEY, SUPABASE_URL
from supabase import create_client
from services.qa_json import parse_qa_to_json

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

async def save_qa_selection(user_id:str, file_url:str, category:str, qa_content:str):
    # logic
    qa_json = parse_qa_to_json(qa_content, category)
    response = supabase.table("qa_files").insert({
        "user_id":user_id,
        "file_url":file_url,
        "category":category,
        "qa_content":qa_json
    }).execute()

    if not response.data:
        return {"error":"failed to save QA to database"}

    return response.data[0]