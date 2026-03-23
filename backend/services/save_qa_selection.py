import json
from supabase import create_client
from services.supabase_config import SUPABASE_KEY, SUPABASE_URL
from services.qa_json import parse_qa_to_json

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)


async def check_file_processed(user_id: int, file_url: str, category: str, min_questions: int = 1) -> bool:
    try:
        resp = (
            supabase.table("qa_files")
            .select("qa_content")
            .eq("user_id", user_id)
            .eq("file_url", file_url)
            .eq("category", category)
            .execute()
        )
        rows = resp.data or []
        if not rows:
            return False

        qa_content = rows[0].get("qa_content", [])
        if isinstance(qa_content, str):
            qa_content = json.loads(qa_content)

        return len(qa_content) >= min_questions
    except Exception as e:
        print(f"[ERROR] check_file_processed: {e}")
        return False


async def save_qa_incremental(
    user_id: int,
    file_url: str,
    category: str,
    qa_chunks: list = None,          # existing param kept for backward compatibility
    parsed_items: list = None,      # NEW optional param: already-parsed QA dicts
    max_questions: int = 20
):
    """
    Append-only save.
    - If parsed_items is provided, it will be used directly (a list of QA dicts).
    - Otherwise, qa_chunks (raw strings) will be parsed via parse_qa_to_json.
    - Trims to max_questions before inserting.
    """
    try:
        all_qas = []

        # If parsed_items provided, use them directly
        if parsed_items:
            if not isinstance(parsed_items, list):
                return {"error": "parsed_items must be a list"}
            all_qas = list(parsed_items)
        else:
            # Parse incoming raw chunks (backwards compatible)
            for raw in qa_chunks or []:
                if not raw or not raw.strip():
                    continue
                parsed = parse_qa_to_json(raw, category) or []
                all_qas.extend(parsed)

        # Deduplicate within this batch (optional)
        seen = set()
        unique = []
        for item in all_qas:
            try:
                key = json.dumps(item, sort_keys=True)
            except Exception:
                key = str(item)
            if key not in seen:
                seen.add(key)
                unique.append(item)

        trimmed = unique[:max_questions]

        new_row = {
            "user_id": user_id,
            "file_url": file_url,
            "category": category,
            "qa_content": trimmed
        }

        response = (
            supabase.table("qa_files")
            .upsert(new_row, on_conflict="user_id,file_url,category")
            .execute()
        )

        if not response.data:
            return {"error": "Insert failed"}

        row = response.data[0]

        return {
            "success": True,
            "qa": trimmed,
            "qa_count": len(trimmed),
            "id": row.get("id")
        }

    except Exception as e:
        print(f"[ERROR] save_qa_incremental: {e}")
        return {"error": str(e)}


# FETCH existing QA

async def get_existing_qa_for_user(user_id: int, file_url: str, category: str, num_questions: int = 20):
    try:
        resp = (
            supabase.table("qa_files")
            .select("qa_content")
            .eq("user_id", user_id)
            .eq("file_url", file_url)
            .eq("category", category)
            .execute()
        )
        rows = resp.data or []
        if not rows:
            return []

        qa_content = rows[0].get("qa_content", [])
        if isinstance(qa_content, str):
            qa_content = json.loads(qa_content)

        return qa_content[:num_questions]
    except Exception as e:
        print(f"[ERROR] get_existing_qa_for_user: {e}")
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


