from services.supabase_config import SUPABASE_URL, SUPABASE_KEY
import logging
from supabase import create_client

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)    

def insert_user_usage(user_id:str, pageName:str, durationseconds:int):
    try:
        new_usage = supabase.table("users_usage").insert({
            "user_id": int(user_id),
            "page_name": pageName,
            "hours": durationseconds
        }).execute()
        logging.info(f"New usage record created: {new_usage.data}")
        return {"success": True, "usage": new_usage.data}

    except Exception as e:
        logging.error(f"Error during inserting user usage: {str(e)}")
        return {"success": False, "error": str(e)}


def user_usage(user_id: str):
    try:
        usage = supabase.table("users_usage").select("*").eq("user_id", user_id).execute()
        if usage.data:
            return {"success": True, "usage": usage.data}
        else:
            return {"success": False, "error": "No usage data found for this user"}

    except Exception as e:
        logging.error(f"Error during fetching user usage: {str(e)}")
        return {"success": False, "error": str(e)}

  