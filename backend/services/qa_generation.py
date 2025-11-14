import os
import asyncio
import math
from typing import List, Literal
from utils import extract_text
from qa_utils import download_file_from_url_qa
import google.generativeai as genai
from services.save_qa_selection import save_qa_incremental, check_file_processed, check_chunk_processed

# -------------------------
# Gemini Configuration
# -------------------------
GENAI_API_KEY = os.environ.get("GENAI_API_KEY")
if not GENAI_API_KEY:
    raise RuntimeError("GENAI_API_KEY environment variable not set")
genai.configure(api_key=GENAI_API_KEY)

# -------------------------
# Text Chunking (simple split)
# -------------------------
def chunk_text(text: str, chunk_size: int = 500) -> List[str]:
    return [text[i:i + chunk_size] for i in range(0, len(text), chunk_size)]

# -------------------------
# Gemini QA Generation with exponential backoff
# -------------------------
def generate_qa(prompt: str, max_retries: int = 5) -> str:
    retries = 0
    while retries <= max_retries:
        try:
            model = genai.GenerativeModel("gemini-2.0-flash")
            response = model.generate_content(
                prompt,
                safety_settings={"HARM_CATEGORY_DANGEROUS_CONTENT": "block_none"}
            )
            return response.text or ""
        except Exception as e:
            error_msg = str(e).lower()
            if "quota" in error_msg or "429" in error_msg:
                retries += 1
                wait_time = 2 ** retries
                print(f"[WARN] Gemini quota hit, retrying in {wait_time}s ({retries}/{max_retries})")
                # blocking sleep inside thread context is ok here
                import time
                time.sleep(wait_time)
            else:
                print(f"[ERROR] Gemini generation failed: {e}")
                return ""
    raise RuntimeError("GEMINI_QUOTA_EXCEEDED")

# -------------------------
# Prompt Creation (explicit exact count)
# -------------------------
def make_prompt(qa_type: str, text_chunk: str, num_questions: int) -> str:
    # make the prompt strict so model returns exact count
    body = text_chunk.strip()
    if qa_type == "mcq":
        instr = f"Create exactly {num_questions} multiple-choice questions (A, B, C, D). Clearly mark the correct answer with 'Answer: <option>'."
    elif qa_type == "true_false":
        instr = f"Create exactly {num_questions} True/False questions. Format: 'Q: ...' then 'Answer: True' or 'Answer: False'."
    elif qa_type == "fact":
        instr = f"Create exactly {num_questions} fact-based question-answer pairs. Format: 'Q: ...' then 'Answer: ...'."
    else:
        raise ValueError(f"Invalid QA type: {qa_type}")

    return f"{instr}\n\nText:\n{body}\n\nReturn only the questions and answers in a plain, parseable format."

# -------------------------
# Main QA Generation (returns parsed QA list)
# -------------------------
async def generate_qa_from_file(
    file_url: str,
    qa_type: Literal["fact", "true_false", "mcq"],
    num_questions_total: int = 20,
    user_id: int = None
) -> dict:
    """
    Generate QA for a file, merge into a single DB row, print each QA to console,
    and return the final parsed QA list (trimmed to num_questions_total).
    """

    # First: if there's already enough cached QA, skip generation
    if await check_file_processed(user_id=int(user_id), file_url=file_url, category=qa_type, min_questions=num_questions_total):
        print("[DEBUG] File already has required QA count; returning cached.")
        return {"message": "File already processed", "results": await __fetch_cached(user_id, file_url, qa_type, num_questions_total)}

    print(f"[DEBUG] Starting QA generation for user={user_id}, type={qa_type}, target={num_questions_total}")

    local_path = download_file_from_url_qa(file_url)
    if not local_path:
        return {"error": "Failed to download the file"}

    text = extract_text(local_path)
    if text in ["EMPTY", "READ_ERROR", "PHOTO_ONLY"]:
        return {"error": f"Text extraction failed: {text}"}

    # split text into small chunks
    chunks = chunk_text(text, chunk_size=500)
    if not chunks:
        return {"error": "No text chunks to process"}

    # calculate questions per chunk; ensure we do not request more than total needed
    # distribute evenly but the generator will be asked for exact number per chunk
    qa_per_chunk = max(1, math.ceil(num_questions_total / len(chunks)))
    qa_per_chunk = min(qa_per_chunk, num_questions_total)  # do not exceed total

    semaphore = asyncio.Semaphore(1)
    all_parsed = []  # will collect parsed QA objects across chunks

    async def process_chunk(index: int, chunk_text_str: str):
        nonlocal all_parsed
        async with semaphore:
            if await check_chunk_processed(user_id, file_url, qa_type, index):
                print(f"[DEBUG] Skipping already processed chunk {index + 1}")
                return

            print(f"[DEBUG] Processing chunk {index + 1}/{len(chunks)} (len={len(chunk_text_str)})")
            prompt = make_prompt(qa_type, chunk_text_str, qa_per_chunk)
            raw = await asyncio.to_thread(generate_qa, prompt)

            if not raw:
                print(f"[WARN] No QA returned for chunk {index + 1}")
                return

            # Save incrementally (save_qa_incremental will parse and trim)
            save_resp = await save_qa_incremental(user_id, file_url, qa_type, [raw], chunk_index=index, max_questions=num_questions_total)
            if save_resp.get("error"):
                print(f"[ERROR] Failed to save chunk {index}: {save_resp['error']}")
                return

            # The save response includes the merged QA list (trimmed)
            merged_qa = save_resp.get("qa", []) or []

            # Print any newly added items (determine new by comparing previous length)
            # To keep things simple: print full merged_qa each time but only once per item
            # We track all_parsed to avoid re-printing duplicates
            # Build keys to compare
            existing_keys = {json_key(item) for item in all_parsed}
            printed = 0
            for item in merged_qa:
                k = json_key(item)
                if k not in existing_keys:
                    print(f"[QA OUTPUT] {k}\n{item}\n")
                    all_parsed.append(item)
                    printed += 1

            if printed == 0:
                # nothing new (maybe trimmed or duplicate)
                print(f"[DEBUG] No new QA added by chunk {index + 1}")
            else:
                print(f"[DEBUG] Added {printed} new QA items from chunk {index + 1}")

    # helper to create stable json key for dedupe
    def json_key(item):
        try:
            return json.dumps(item, sort_keys=True)
        except Exception:
            return str(item)

    # small helper to fetch cached (internal)
    async def __fetch_cached(user_id, file_url, category, num_q):
        from services.save_qa_selection import get_existing_qa_for_user
        return await get_existing_qa_for_user(user_id, file_url, category, num_q)

    # run chunks sequentially with rate limiting (avoids hitting per-minute quota)
    for i, c in enumerate(chunks):
        try:
            await process_chunk(i, c)
        except RuntimeError as e:
            if str(e) == "GEMINI_QUOTA_EXCEEDED":
                return {"error": "Gemini API quota exceeded. Please try again later."}
            else:
                print(f"[ERROR] Exception processing chunk {i}: {e}")
                return {"error": str(e)}
        # rate limit delay between chunks (tune as needed)
        await asyncio.sleep(1.5)

        # if we've already collected the desired number, stop early
        if len(all_parsed) >= num_questions_total:
            print(f"[DEBUG] Reached target of {num_questions_total} QA items; stopping early.")
            break

    # final fetch to ensure database is authoritative and trimmed
    final_list = await __fetch_cached(user_id, file_url, qa_type, num_questions_total)

    # console log final list compactly
    print(f"[DEBUG] Final QA count returned: {len(final_list)}")
    for idx, item in enumerate(final_list, start=1):
        print(f"[QA FINAL {idx}] {item}")

    return {"message": "QA generation complete", "results": final_list}
