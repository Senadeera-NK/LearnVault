from services.supabase_config import SUPABASE_KEY, SUPABASE_URL
from supabase import create_client
from services.qa_json import parse_qa_to_json
from json import dumps

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)


async def save_qa_incremental(user_id: str, file_url: str, category: str, qa_chunks: list):
    """
    Saves all QA chunks into a single Supabase record.
    Appends each chunk’s QA to the existing qa_content if record already exists.
    """
    try:
        # Check if a record already exists for this user/file/category
        existing = supabase.table("qa_files").select("*").eq("user_id", user_id)\
            .eq("file_url", file_url).eq("category", category).single().execute()
        
        qa_content = []
        if existing.data:
            # Load existing QA content
            qa_content = existing.data.get("qa_content", [])
            if isinstance(qa_content, str):
                qa_content = qa_content if qa_content.startswith("[") else f"[{qa_content}]"
                qa_content = eval(qa_content)  # convert string to list

        # Parse and append new chunks
        for chunk in qa_chunks:
            if not chunk.strip():
                continue
            qa_json = parse_qa_to_json(chunk, category)
            qa_content.extend(qa_json)

        # Upsert (update or insert) the combined QA
        response = supabase.table("qa_files").upsert({
            "user_id": user_id,
            "file_url": file_url,
            "category": category,
            "qa_content": dumps(qa_content)
        }).execute()

        if not response.data:
            return {"error": "Failed to save QA to database"}

        return {
            "id": response.data[0].get("id"),
            "qa_content": qa_content,
            "category": category,
            "file_url": file_url
        }

    except Exception as e:
        print(f"Error saving QA: {e}")
        return {"error": str(e)}


async def user_qa_count_service(user_id: int):
    """
    Counts all QA records for a user (all chunks included).
    """
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
