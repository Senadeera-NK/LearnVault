from services.supabase_config import SUPABASE_KEY, SUPABASE_URL
from supabase import create_client
from services.qa_json import parse_qa_to_json
from json import dumps

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

async def save_qa_selection(user_id:str, file_url:str, category:str, qa_content:str):
    # logic
    print("DEBUG: saving qa selection...")
    print("DEBUG: QA content length: ", len(qa_content)if qa_content else 0)
    
    qa_json = parse_qa_to_json(qa_content, category)
    print("DEBUG: Parsed QA JSON sample:", str(qa_json)[:500])
    response = supabase.table("qa_files").insert({
        "user_id":user_id,
        "file_url":file_url,
        "category":category,
        "qa_content":dumps(qa_json)
    }).execute()

    if not response.data:
        return {"error":"failed to save QA to database"}

    return {
        "id":response.data[0].get("id"),
        "qa_content":qa_json,
        "category":category,
        "file_url":file_url
    }

async def user_qa_count_service(user_id: int):
    try:
        response = supabase.table("qa_files").select("id").eq("user_id", user_id).execute()
        data = getattr(response, "data", None)

        if data is None:
            return {"success": False, "error": "No data returned from Supabase"}

        count = len(data)
        return {"success": True, "count": count}
    except Exception as e:
        print("Error in user_qa_count_service:", e)
        return {"success": False, "error": str(e)}
