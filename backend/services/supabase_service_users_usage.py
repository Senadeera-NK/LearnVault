from services.supabase_config import SUPABASE_URL, SUPABASE_KEY
import logging
from datetime import date
from supabase import create_client

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)    

def insert_user_usage(user_id: str, pageName: str, durationseconds: int):
    try:
        today = date.today().isoformat()
        payload = {
            "user_id": int(user_id),
            "page_name": pageName,
            "date": today,
            "hours": durationseconds / 3600.0  # store as float hours
        }

        # Print to console before sending to Supabase
        print("📤 Sending payload to Supabase:", payload)

        # First check if a record exists for (user, page, date)
        existing = (
            supabase.table("users_usage")
            .select("id, hours")
            .eq("user_id", int(user_id))
            .eq("page_name", pageName)
            .eq("date", today)
            .execute()
        )

        if existing.data:
            record_id = existing.data[0]["id"]
            new_hours = existing.data[0]["hours"] + payload["hours"]

            update_payload = {"hours": new_hours}
            print("♻️ Updating existing record:", update_payload)

            updated = (
                supabase.table("users_usage")
                .update(update_payload)
                .eq("id", record_id)
                .execute()
            )
            return {"success": True, "usage": updated.data}

        else:
            print("➕ Inserting new record:", payload)
            new_usage = (
                supabase.table("users_usage")
                .insert(payload)
                .execute()
            )
            return {"success": True, "usage": new_usage.data}

    except Exception as e:
        print("❌ Error during insert/update:", str(e))
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

  