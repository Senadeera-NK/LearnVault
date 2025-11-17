import os
import json
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
        rule = (
        f"Generate exactly {count} multiple-choice questions.\n"
        "Format MUST be:\n"
        "Q: <question>\n"
        "A) <option1>\n"
        "B) <option2>\n"
        "C) <option3>\n"
        "D) <option4>\n"
        "Answer: <A/B/C/D>\n"
        "Do not include numbering or extra text.")
    elif qa_type == "true_false":
        rule = (
        f"Generate exactly {count} True/False questions.\n"
        "Format MUST be:\n"
        "Q: <question>\n"
        "Answer: True\n"
        "OR\n"
        "Answer: False\n")
    else:
        rule = (
        f"Generate exactly {count} fact-based QA pairs.\n"
        "Use ONLY this exact format for each pair:\n"
        "Q: <question>\n"
        "Answer: <answer>\n"
        "Do not include numbering, bullet points, titles, or anything else.")

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
# at top of file, ensure parser import:
from services.qa_json import parse_qa_to_json

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

    # Questions per chunk used only as a suggestion to model:
    per_chunk = max(1, math.ceil(num_questions_total / len(chunks)))

    # SERIAL PROCESSING for stability
    all_qa = []
    seen = set()  # dedupe using JSON dumps

    for idx, chk in enumerate(chunks):
        # Stop early if enough collected
        if len(all_qa) >= num_questions_total:
            print(f"[DEBUG] Reached target of {num_questions_total} questions; stopping at chunk {idx}.")
            break

        print(f"[DEBUG] Chunk {idx+1}/{len(chunks)}")

        prompt = make_prompt(qa_type, chk, per_chunk)
        raw = await asyncio.to_thread(generate_qa, prompt)
        print("RAW MODEL OUTPUT:\n", raw)

        if not raw.strip():
            print(f"[WARN] Empty chunk output {idx+1}")
            continue

        # Parse model output here (once)
        parsed_items = parse_qa_to_json(raw, qa_type) or []

        # Add parsed items to the accumulated list (dedupe)
        for item in parsed_items:
            key = json.dumps(item, sort_keys=True)
            if key not in seen:
                seen.add(key)
                all_qa.append(item)

        # Trim in-memory list to requested length
        if len(all_qa) > num_questions_total:
            all_qa = all_qa[:num_questions_total]

        # Save the current trimmed list to DB (append-only; we pass parsed items so save can insert exact list)
        # We'll save the current snapshot (trimmed)
        save_res = await save_qa_incremental(
            user_id=user_id,
            file_url=file_url,
            category=qa_type,
            qa_chunks=None,               # no raw chunks
            parsed_items=all_qa,          # pass parsed list (current snapshot)
            max_questions=num_questions_total
        )

        if "error" in save_res:
            print("[ERROR] Save failed:", save_res["error"])
            # continue — don't abort entire generation, but keep going if possible
            continue

        print(f"[DEBUG] Total QA so far (in memory): {len(all_qa)}")

    # final trim (defensive)
    final = all_qa[:num_questions_total]

    # final save of the final snapshot (optional - you can keep previous saves)
    try:
        await save_qa_incremental(
            user_id=user_id,
            file_url=file_url,
            category=qa_type,
            qa_chunks=None,
            parsed_items=final,
            max_questions=num_questions_total
        )
    except Exception as e:
        print("[WARN] Final save failed:", e)

    return {
        "message": "QA generation complete",
        "results": final
    }
