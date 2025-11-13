from services.supabase_config import SUPABASE_KEY, SUPABASE_URL
from supabase import create_client
from services.qa_json import parse_qa_to_json
import json

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)


async def save_qa_incremental(user_id: str, file_url: str, category: str, qa_chunks: list):
    """
    Saves all QA chunks into a single Supabase record incrementally.
    """
    try:
        # Check if a record already exists for this user/file/category
        existing = supabase.table("qa_files").select("*").eq("user_id", user_id)\
            .eq("file_url", file_url).eq("category", category).single().execute()
        qa_content = []
        if existing.data:
            qa_content = existing.data.get("qa_content", [])
            if isinstance(qa_content, str):
                qa_content = json.loads(qa_content)

        # Parse and append new chunks
        qa_chunks = [str(chunk) for chunk in qa_chunks if chunk and chunk.strip()]
        for chunk in qa_chunks:
            qa_json = parse_qa_to_json(chunk, category)
            qa_content.extend(qa_json)

        # Upsert (update or insert) the combined QA
        response = supabase.table("qa_files").upsert({
            "user_id": user_id,
            "file_url": file_url,
            "category": category,
            "qa_content": json.dumps(qa_content)
        }).execute()

        if not response.data:
            return {"error": "Failed to save QA to database"}

        return {
            "id": response.data[0].get("id"),
            "category": category,
            "file_url": file_url,
            "success": True
        }

    except Exception as e:
        print(f"Error saving QA: {e}")
        return {"error": str(e)}


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

