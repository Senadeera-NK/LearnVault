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
from services.qa_json import parse_qa_to_json  # parser will handle MCQ fallback

GENAI_API_KEY = os.environ.get("GENAI_API_KEY")
if not GENAI_API_KEY:
    raise RuntimeError("GENAI_API_KEY is missing")

genai.configure(api_key=GENAI_API_KEY)


# -------------------------
# Text chunking (kept for fact/TF fallback)
# -------------------------
def chunk_text(text: str, chunk_size: int = 500):
    return [text[i:i + chunk_size] for i in range(0, len(text), chunk_size)]


# -------------------------
# Prompt builder
# -------------------------
def make_prompt(qa_type: str, chunk: str, count: int):
    if qa_type == "mcq":
        # Strict JSON schema prompt for MCQs
        rule = (
            f"You will produce exactly {count} multiple-choice questions (MCQs) based ONLY on the provided Text.\n\n"
            "RETURN RULES (MCQ):\n"
            "1) Return ONLY valid JSON — a single JSON array of objects with this exact schema:\n\n"
            "[\n"
            "  {\n"
            "    \"question\": \"<question text>\",\n"
            "    \"options\": [\"<opt1>\", \"<opt2>\", \"<opt3>\", \"<opt4>\"],\n"
            "    \"answer\": \"A\"  // ONE of: A, B, C, D\n"
            "  },\n"
            "  ...\n"
            "]\n\n"
            "2) Options array MUST have 4 strings. 'answer' MUST be one of 'A','B','C','D'.\n"
            "3) Do NOT include extra text, numbering, explanation, or commentary — ONLY the JSON array.\n"
            "4) If you cannot create {count} high-quality MCQs from the text, still return as many as you can as JSON.\n\n"
        )
    elif qa_type == "true_false":
        rule = (
            f"Generate exactly {count} True/False questions.\n"
            "Format MUST be (plain text):\n"
            "Q: <question>\n"
            "Answer: True\n"
            "OR\n"
            "Answer: False\n"
            "Return only the Q/A lines for each pair (no numbering or extra commentary)."
        )
    else:  # fact
        rule = (
            f"Generate exactly {count} fact-based QA pairs.\n"
            "Use ONLY this exact format for each pair:\n"
            "Q: <question>\n"
            "Answer: <answer>\n"
            "Do not include numbering, bullet points, titles, or anything else."
        )

    return f"{rule}\n\nText:\n{chunk}\n\nReturn only the requested format."

# -------------------------
# Model call with retries
# -------------------------
def generate_qa(prompt: str, max_retries: int = 4) -> str:
    for attempt in range(max_retries):
        try:
            model = genai.GenerativeModel("gemini-2.0-flash")
            res = model.generate_content(prompt)
            return res.text or ""
        except Exception as e:
            # transient handling
            txt = str(e).lower()
            if "429" in txt or "quota" in txt or "rate limit" in txt:
                import time
                wait = 2 ** (attempt + 1)
                print(f"[WARN] Quota/Rate hit. Retrying in {wait}s…")
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
    # Cache check
    if await check_file_processed(user_id, file_url, qa_type, num_questions_total):
        print("[DEBUG] Cached QA available.")
        cached = await get_existing_qa_for_user(user_id, file_url, qa_type, num_questions_total)
        return {"message": "cached", "results": cached}

    print(f"[DEBUG] Generating QA for user={user_id}, type={qa_type}")

    local = download_file_from_url_qa(file_url)
    if not local:
        return {"error": "download-failed"}

    text = extract_text(local)
    if text in ["EMPTY", "READ_ERROR", "PHOTO_ONLY"]:
        return {"error": text}

    # --- MCQ: single-call mode using a document excerpt ---
    if qa_type == "mcq":
        # use a reasonable excerpt length (e.g., 6000 chars) to keep token cost down
        excerpt = text[:6000]
        prompt = make_prompt(qa_type, excerpt, num_questions_total)
        raw = await asyncio.to_thread(generate_qa, prompt)
        print("RAW MODEL OUTPUT (MCQ):\n", raw)

        # Try to parse JSON first (preferred)
        parsed_items = []
        try:
            parsed_items = json.loads(raw)
            # Validate basic structure
            valid = []
            for obj in parsed_items:
                if (
                    isinstance(obj, dict)
                    and "question" in obj
                    and "options" in obj
                    and isinstance(obj["options"], list)
                    and len(obj["options"]) == 4
                    and "answer" in obj
                ):
                    valid.append({
                        "question": str(obj["question"]).strip(),
                        "options": [str(o).strip() for o in obj["options"]],
                        "answer": str(obj["answer"]).strip().upper()
                    })
            parsed_items = valid
        except Exception as e:
            print("[WARN] MCQ JSON parse failed, falling back to regex parser:", e)
            # fallback: use existing parser which handles multiple formats
            parsed_items = parse_qa_to_json(raw, "mcq")

        # Normalize answers & drop invalids
        final = []
        from services.qa_json import normalize_mcq_answer
        for p in parsed_items:
            ans = normalize_mcq_answer(p.get("answer", ""))
            if ans is None:
                continue
            final.append({
                "question": p.get("question", "").strip(),
                "options": p.get("options", []),
                "answer": ans
            })

        # Trim to requested number
        final = final[:num_questions_total]

        # Save one snapshot row
        save_res = await save_qa_incremental(
            user_id=user_id,
            file_url=file_url,
            category=qa_type,
            qa_chunks=None,
            parsed_items=final,
            max_questions=num_questions_total
        )

        if "error" in save_res:
            print("[ERROR] Save failed:", save_res["error"])

        return {"message": "QA generation complete", "results": final}

    # --- non-MCQ (keep chunking but stop early) ---
    chunks = chunk_text(text, 500)
    if not chunks:
        return {"error": "no-text"}

    per_chunk = max(1, math.ceil(num_questions_total / len(chunks)))
    all_qa = []
    seen = set()

    for idx, chk in enumerate(chunks):
        if len(all_qa) >= num_questions_total:
            break

        print(f"[DEBUG] Chunk {idx+1}/{len(chunks)}")
        prompt = make_prompt(qa_type, chk, per_chunk)
        raw = await asyncio.to_thread(generate_qa, prompt)
        print("RAW MODEL OUTPUT:\n", raw)

        if not raw.strip():
            print(f"[WARN] Empty chunk output {idx+1}")
            continue

        parsed_items = parse_qa_to_json(raw, qa_type) or []
        for item in parsed_items:
            key = json.dumps(item, sort_keys=True)
            if key not in seen:
                seen.add(key)
                all_qa.append(item)

        if len(all_qa) > num_questions_total:
            all_qa = all_qa[:num_questions_total]

        # save snapshot
        save_res = await save_qa_incremental(
            user_id=user_id,
            file_url=file_url,
            category=qa_type,
            qa_chunks=None,
            parsed_items=all_qa,
            max_questions=num_questions_total
        )
        if "error" in save_res:
            print("[ERROR] Save failed:", save_res["error"])

        print(f"[DEBUG] Total QA so far (in memory): {len(all_qa)}")

    final = all_qa[:num_questions_total]
    # final save
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

    return {"message": "QA generation complete", "results": final}
