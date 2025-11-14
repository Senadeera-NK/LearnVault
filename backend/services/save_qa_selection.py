import json
from supabase import create_client
from services.supabase_config import SUPABASE_KEY, SUPABASE_URL
from services.qa_json import parse_qa_to_json

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# -------------------------
# Check if file already processed (enough questions)
# -------------------------
async def check_file_processed(user_id: int, file_url: str, category: str, min_questions: int = 1) -> bool:
    """
    Return True if a row exists for this file/category AND it already contains
    at least `min_questions` QA items.
    """
    try:
        resp = supabase.table("qa_files") \
            .select("qa_content") \
            .eq("user_id", user_id) \
            .eq("file_url", file_url) \
            .eq("category", category) \
            .execute()
        rows = resp.data or []
        if not rows:
            return False

        qa_content = rows[0].get("qa_content", [])
        if isinstance(qa_content, str):
            qa_content = json.loads(qa_content)
        return len(qa_content) >= min_questions
    except Exception as e:
        print(f"[ERROR] check_file_processed failed: {e}")
        return False

# -------------------------
# Check if a specific chunk has been processed
# -------------------------
async def check_chunk_processed(user_id: int, file_url: str, category: str, chunk_index: int) -> bool:
    """
    Return True if the specific chunk index is present in processed_chunks for the row.
    """
    try:
        resp = supabase.table("qa_files") \
            .select("processed_chunks") \
            .eq("user_id", user_id) \
            .eq("file_url", file_url) \
            .eq("category", category) \
            .execute()
        rows = resp.data or []
        if not rows:
            return False

        processed_chunks = rows[0].get("processed_chunks", []) or []
        return chunk_index in processed_chunks
    except Exception as e:
        print(f"[ERROR] check_chunk_processed failed: {e}")
        return False

# -------------------------
# Save QA incrementally and merge to a single row
# -------------------------
async def save_qa_incremental(user_id: int, file_url: str, category: str, qa_chunks: list, chunk_index: int = None, max_questions: int = 20):
    """
    Merge QA chunks into a single row (single row per user/file/category).
    - qa_chunks is a list of raw chunk responses (strings) from the model.
    - We parse them using parse_qa_to_json then merge and trim to max_questions.
    - We track processed_chunks (list of ints).
    """
    try:
        # read existing row (if any)
        resp = supabase.table("qa_files") \
            .select("*") \
            .eq("user_id", user_id) \
            .eq("file_url", file_url) \
            .eq("category", category) \
            .execute()
        existing_rows = resp.data or []

        merged_qa = []
        processed_chunks = []

        if existing_rows:
            row = existing_rows[0]
            qas = row.get("qa_content", [])
            if isinstance(qas, str):
                try:
                    qas = json.loads(qas)
                except Exception:
                    qas = []
            merged_qa.extend(qas)
            processed_chunks = row.get("processed_chunks", []) or []

        # parse and append new QA chunks
        for raw_chunk in qa_chunks:
            if not raw_chunk or not raw_chunk.strip():
                continue
            parsed = parse_qa_to_json(raw_chunk, category) or []
            # extend merged list
            merged_qa.extend(parsed)

        # deduplicate lightly (optional): keep first occurrence order
        seen = set()
        unique_merged = []
        for item in merged_qa:
            # create a dedupe key (stringify). This works for dicts and strings.
            key = json.dumps(item, sort_keys=True) if isinstance(item, dict) else str(item)
            if key not in seen:
                seen.add(key)
                unique_merged.append(item)
        merged_qa = unique_merged

        # Trim to max_questions
        if len(merged_qa) > max_questions:
            merged_qa = merged_qa[:max_questions]

        # update processed_chunks
        if chunk_index is not None and chunk_index not in processed_chunks:
            processed_chunks.append(chunk_index)
            processed_chunks.sort()

        payload = {
            "user_id": user_id,
            "file_url": file_url,
            "category": category,
            "qa_content": json.dumps(merged_qa),
            "processed_chunks": processed_chunks
        }

        # upsert single row using unique conflict keys
        response = supabase.table("qa_files") \
            .upsert(payload, on_conflict=["user_id", "file_url", "category"]) \
            .execute()

        if not response or not getattr(response, "data", None):
            print(f"[ERROR] Upsert returned no data: {response}")
            return {"error": "Failed to upsert QA row"}

        row_id = response.data[0].get("id") if response.data else None

        return {
            "id": row_id,
            "category": category,
            "file_url": file_url,
            "success": True,
            "qa_count": len(merged_qa),
            "qa": merged_qa
        }
    except Exception as e:
        print(f"[ERROR] Error saving QA incrementally: {e}")
        return {"error": str(e)}

# -------------------------
# Fetch cached QA (trim to requested)
# -------------------------
async def get_existing_qa_for_user(user_id: int, file_url: str, category: str, num_questions: int = 20):
    try:
        resp = supabase.table("qa_files") \
            .select("qa_content") \
            .eq("user_id", user_id) \
            .eq("file_url", file_url) \
            .eq("category", category) \
            .execute()
        rows = resp.data or []
        if not rows:
            return []

        qa_content = rows[0].get("qa_content", [])
        if isinstance(qa_content, str):
            qa_content = json.loads(qa_content)
        return qa_content[:num_questions]
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


