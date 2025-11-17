import os
import asyncio
import math
from typing import Literal, List
import google.generativeai as genai
from utils import extract_text
from qa_utils import download_file_from_url_qa
from services.save_qa_selection import (
    save_qa_incremental,
    check_file_processed,
    get_existing_qa_for_user
)

GENAI_API_KEY = os.environ.get("GENAI_API_KEY")
if not GENAI_API_KEY:
    raise RuntimeError("GENAI_API_KEY is missing")

genai.configure(api_key=GENAI_API_KEY)


# -------------------------
# Text chunking
# -------------------------
def chunk_text(text: str, chunk_size: int = 500):
    return [text[i:i + chunk_size] for i in range(0, len(text), chunk_size)]


# -------------------------
# Prompt builder
# -------------------------
def make_prompt(qa_type: str, chunk: str, count: int):
    if qa_type == "mcq":
        rule = f"Generate exactly {count} MCQs with 4 options and 'Answer:' line."
    elif qa_type == "true_false":
        rule = f"Generate exactly {count} True/False questions with answers."
    else:
        rule = f"Generate exactly {count} fact-based QA pairs."

    return f"{rule}\n\nText:\n{chunk}\n\nReturn only questions and answers."


# -------------------------
# Model call with retries
# -------------------------
def generate_qa(prompt: str, max_retries: int = 5) -> str:
    for attempt in range(max_retries):
        try:
            model = genai.GenerativeModel("gemini-2.0-flash")
            res = model.generate_content(prompt)
            return res.text or ""
        except Exception as e:
            if "429" in str(e) or "quota" in str(e).lower():
                import time
                wait = 2 ** (attempt + 1)
                print(f"[WARN] Quota hit. Retrying in {wait}s…")
                time.sleep(wait)
                continue
            print(f"[ERROR] Gemini error: {e}")
            return ""
    return ""


# -------------------------
# Main generator
# -------------------------
async def generate_qa_from_file(
    file_url: str,
    qa_type: Literal["fact", "true_false", "mcq"],
    num_questions_total: int = 20,
    user_id: int = None
):
    # Check cached first
    if await check_file_processed(user_id, file_url, qa_type, num_questions_total):
        print("[DEBUG] Cached QA available.")
        cached = await get_existing_qa_for_user(user_id, file_url, qa_type, num_questions_total)
        return {"message": "cached", "results": cached}

    print(f"[DEBUG] Generating QA for user={user_id}, type={qa_type}")

    # Download and extract
    local = download_file_from_url_qa(file_url)
    if not local:
        return {"error": "download-failed"}

    text = extract_text(local)
    if text in ["EMPTY", "READ_ERROR", "PHOTO_ONLY"]:
        return {"error": text}

    chunks = chunk_text(text, 500)
    if not chunks:
        return {"error": "no-text"}

    # Calculate evenly distributed questions per chunk
    per_chunk = max(1, math.ceil(num_questions_total / len(chunks)))

    # SERIAL PROCESSING for stability
    all_qa = []

    for idx, chk in enumerate(chunks):
        print(f"[DEBUG] Chunk {idx+1}/{len(chunks)}")

        prompt = make_prompt(qa_type, chk, per_chunk)
        raw = await asyncio.to_thread(generate_qa, prompt)
        print("RAW MODEL OUTPUT:\n", raw)

        if not raw.strip():
            print(f"[WARN] Empty chunk output {idx+1}")
            continue

        save_res = await save_qa_incremental(
            user_id,
            file_url,
            qa_type,
            [raw],
            max_questions=num_questions_total
        )

        if "error" in save_res:
            print("[ERROR] Save failed:", save_res["error"])
            continue

        all_qa = save_res["qa"]

        print(f"[DEBUG] Total QA so far: {len(all_qa)}")

        # Stop early if fully filled
        if len(all_qa) >= num_questions_total:
            break

    return {
        "message": "QA generation complete",
        "results": all_qa
    }
