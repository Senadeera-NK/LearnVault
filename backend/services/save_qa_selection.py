import json
from supabase import create_client
from services.supabase_config import SUPABASE_KEY, SUPABASE_URL
from services.qa_json import parse_qa_to_json

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

async def save_qa_incremental(user_id: int, file_url: str, category: str, qa_chunks: list):
    """
    Safely save QA chunks incrementally.
    Handles multiple existing rows and merges QA arrays.
    """
    try:
        print(f"[DEBUG] Saving QA for user={user_id}, category={category}")

        # Fetch all existing rows for this user/file/category
        existing_resp = supabase.table("qa_files") \
            .select("*") \
            .eq("user_id", user_id) \
            .eq("file_url", file_url) \
            .eq("category", category) \
            .execute()

        existing_rows = existing_resp.data or []

        qa_content = []
        for row in existing_rows:
            qas = row.get("qa", [])
            if isinstance(qas, str):
                qas = json.loads(qas)
            qa_content.extend(qas)

        # Parse new chunks and merge
        for chunk in qa_chunks:
            if chunk and chunk.strip():
                parsed = parse_qa_to_json(chunk, category)
                qa_content.extend(parsed)

        # Upsert merged QA (ensuring only one row)
        payload = {
            "user_id": user_id,
            "file_url": file_url,
            "category": category,
            "qa": json.dumps(qa_content)
        }

        response = supabase.table("qa_files").upsert(payload).execute()
        print(f"[DEBUG] Upsert response: {response}")

        if not response.data:
            return {"error": "Failed to save QA"}

        return {
            "id": response.data[0].get("id"),
            "category": category,
            "file_url": file_url,
            "success": True
        }

    except Exception as e:
        print(f"[ERROR] Error saving QA: {e}")
        return {"error": str(e)}

async def get_existing_qa_for_user(user_id: int, file_url: str, category: str):
    """Fetch cached QA if it exists."""
    try:
        resp = supabase.table("qa_files") \
            .select("*") \
            .eq("user_id", user_id) \
            .eq("file_url", file_url) \
            .eq("category", category) \
            .execute()

        rows = resp.data or []
        if not rows:
            return []

        qa_content = []
        for row in rows:
            qas = row.get("qa_content", [])
            if isinstance(qas, str):
                qas = json.loads(qas)
            qa_content.extend(qas)

        return qa_content

    except Exception as e:
        print(f"[ERROR] Fetching existing QA failed: {e}")
        return []


async def user_qa_count_service(user_id: int):
    """
    Counts all QA records for a user.
    """
    try:
        print(f"[DEBUG] Counting QA for user_id={user_id}")

        response = supabase.table("qa_files").select("id").eq("user_id", user_id).execute()
        print(f"[DEBUG] Supabase response raw: {response}")

        data = getattr(response, "data", None)
        print(f"[DEBUG] Data extracted: {data}")

        if data is None:
            return {"success": False, "error": "No data returned from Supabase"}

        count = len(data)
        print(f"[DEBUG] QA count = {count}")

        return {"success": True, "count": count}
    except Exception as e:
        print("Error in user_qa_count_service:", e)
        return {"success": False, "error": str(e)}

