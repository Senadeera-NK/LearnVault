import json
from supabase import create_client
from services.supabase_config import SUPABASE_KEY, SUPABASE_URL
from services.qa_json import parse_qa_to_json

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)


async def save_qa_incremental(user_id: int, file_url: str, category: str, qa_chunks: list):
    """
    Saves generated QA chunks incrementally into 'qa_files' table.
    Combines existing data with new QAs and upserts.
    """
    try:
        print(f"[DEBUG] Saving QA incrementally for user={user_id}, category={category}")

        # 1️⃣ Fetch existing record if any
        existing = supabase.table("qa_files").select("*") \
            .eq("user_id", user_id).eq("file_url", file_url).eq("category", category).single().execute()

        print(f"[DEBUG] Existing record: {existing.data}")

        qa_content = []
        if existing.data:
            qa_content = existing.data.get("qa", [])
            if isinstance(qa_content, str):
                qa_content = json.loads(qa_content)

        # 2️⃣ Parse and merge new QA data
        for chunk in qa_chunks:
            if chunk and chunk.strip():
                parsed = parse_qa_to_json(chunk, category)
                qa_content.extend(parsed)

        # 3️⃣ Upsert (update or insert)
        payload = {
            "user_id": user_id,
            "file_url": file_url,
            "category": category,
            "qa": json.dumps(qa_content)
        }

        print(f"[DEBUG] Upserting payload (len={len(json.dumps(qa_content))} chars)")
        response = supabase.table("qa_files").upsert(payload).execute()
        print(f"[DEBUG] Upsert response: {response}")

        if not response.data:
            return {"error": "Failed to save QA to database"}

        return {
            "id": response.data[0].get("id"),
            "category": category,
            "file_url": file_url,
            "success": True
        }

    except Exception as e:
        print(f"[ERROR] Error saving QA: {e}")
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

