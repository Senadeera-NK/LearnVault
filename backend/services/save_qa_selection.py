import json
from supabase import create_client
from services.supabase_config import SUPABASE_KEY, SUPABASE_URL
from services.qa_json import parse_qa_to_json

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# ----------------------------------------------------
# Check if file already processed enough
# ----------------------------------------------------
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


# ----------------------------------------------------
# MAIN SAVE FUNCTION — NO processed_chunks
# ----------------------------------------------------
async def save_qa_incremental(
    user_id: int,
    file_url: str,
    category: str,
    qa_chunks: list,
    max_questions: int = 20
):
    """
    Saves QA data incrementally in a single-row-per-file/category model.
    - Takes list of raw QA chunk strings
    - Parses them into JSON
    - Merges with current DB content
    - Trims to max_questions
    """
    try:
        # Read existing row
        resp = (
            supabase.table("qa_files")
            .select("*")
            .eq("user_id", user_id)
            .eq("file_url", file_url)
            .eq("category", category)
            .execute()
        )
        rows = resp.data or []

        existing_qas = []
        if rows:
            qas = rows[0].get("qa_content", [])
            if isinstance(qas, str):
                try:
                    qas = json.loads(qas)
                except:
                    qas = []
            existing_qas = qas

        merged = list(existing_qas)

        # Parse new raw chunks
        for raw in qa_chunks:
            if not raw or not raw.strip():
                continue
            parsed = parse_qa_to_json(raw, category) or []
            merged.extend(parsed)

        # Deduplicate by converting each QA block into a sorted JSON string
        seen = set()
        unique = []
        for item in merged:
            key = json.dumps(item, sort_keys=True)
            if key not in seen:
                seen.add(key)
                unique.append(item)

        # Trim
        merged = unique[:max_questions]

        data_to_upsert = {
            "user_id": user_id,
            "file_url": file_url,
            "category": category,
            "qa_content": merged
        }

        response = (
            supabase.table("qa_files")
            .upsert(data_to_upsert, on_conflict=["user_id", "file_url", "category"])
            .execute()
        )

        if not response.data:
            return {"error": "Upsert failed"}

        return {
            "success": True,
            "qa": merged,
            "qa_count": len(merged),
            "id": response.data[0].get("id")
        }

    except Exception as e:
        print(f"[ERROR] save_qa_incremental: {e}")
        return {"error": str(e)}


# ----------------------------------------------------
# FETCH existing QA
# ----------------------------------------------------
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


