import os
import json
import asyncio
import math
import re
from typing import Literal
import google.generativeai as genai
from utils import extract_text
from qa_utils import download_file_from_url_qa
from services.save_qa_selection import (
    save_qa_incremental,
    check_file_processed,
    get_existing_qa_for_user
)
from services.qa_json import parse_qa_to_json, normalize_mcq_answer

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
            f"You will produce exactly {count} multiple-choice questions (MCQs) based ONLY on the provided Text.\n\n"
            "RETURN RULES (MCQ):\n"
            "1) Return ONLY valid JSON — a single JSON array of objects with this exact schema:\n"
            "[\n"
            "  {\n"
            "    \"question\": \"<question text>\",\n"
            "    \"options\": [\"<opt1>\", \"<opt2>\", \"<opt3>\", \"<opt4>\"],\n"
            "    \"answer\": \"A\"\n"
            "  }\n"
            "]\n"
            "2) Options array MUST have 4 strings. 'answer' MUST be one of 'A','B','C','D'.\n"
            "3) Do NOT include extra text, numbering, explanation, or commentary — ONLY the JSON array.\n"
        )
    elif qa_type == "true_false":
        rule = (
            f"Generate exactly {count} True/False questions.\n"
            "Format MUST be (plain text):\n"
            "Q: <question>\nAnswer: True\nOR\nAnswer: False\n"
        )
    else:  # fact
        rule = (
            f"Generate exactly {count} fact-based QA pairs.\n"
            "Use ONLY this exact format:\n"
            "Q: <question>\nAnswer: <answer>\n"
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
    # --- Cached QA check ---
    if await check_file_processed(user_id, file_url, qa_type, num_questions_total):
        print("[DEBUG] Cached QA available.")
        cached = await get_existing_qa_for_user(user_id, file_url, qa_type, num_questions_total)
        return {"message": "cached", "results": cached}

    print(f"[DEBUG] Generating QA for user={user_id}, type={qa_type}")

    # --- Download and extract text ---
    local = download_file_from_url_qa(file_url)
    if not local:
        return {"error": "download-failed"}

    text = extract_text(local)
    if text in ["EMPTY", "READ_ERROR", "PHOTO_ONLY"]:
        return {"error": text}

    # ------------------------------
    # MCQ MODE — Single Call Strategy
    # ------------------------------
    if qa_type == "mcq":
        excerpt = text[:6000]  # reasonable limit
        prompt = make_prompt("mcq", excerpt, num_questions_total)

        raw = await asyncio.to_thread(generate_qa, prompt)
        print("[DEBUG] RAW MODEL OUTPUT (repr):", repr(raw))

        if not raw or not raw.strip():
            return {"message": "QA generation complete", "results": []}

        # ---- CLEAN BACKTICKS AND NOISE ----
        raw_clean = raw.strip().replace("\ufeff", "")
        raw_clean = re.sub(r'^```json\s*', '', raw_clean, flags=re.IGNORECASE)
        raw_clean = re.sub(r'^```', '', raw_clean)
        raw_clean = re.sub(r'```$', '', raw_clean)
        raw_clean = re.sub(r',\s*]', ']', raw_clean)   # Fix trailing comma issues

        # ---- JSON PARSING ----
        parsed_items = []
        try:
            data = json.loads(raw_clean)

            for obj in data:
                if (
                    isinstance(obj, dict)
                    and "question" in obj
                    and "options" in obj
                    and isinstance(obj["options"], list)
                    and len(obj["options"]) == 4
                    and "answer" in obj
                ):
                    parsed_items.append({
                        "question": str(obj["question"]).strip(),
                        "options": [str(o).strip() for o in obj["options"]],
                        "answer": normalize_mcq_answer(obj["answer"])
                    })

        except Exception as e:
            print("[WARN] JSON parse failed, falling back:", e)
            parsed_items = parse_qa_to_json(raw_clean, "mcq")

        # --- Save incremental ---
        if parsed_items:
            await save_qa_incremental(
                user_id=user_id,
                file_url=file_url,
                category="mcq",
                qa_items=parsed_items,
                total=num_questions_total
            )

        return {"message": "QA generation complete", "results": parsed_items}

    # ------------------------------
    # FACT / TRUE-FALSE (old behavior)
    # ------------------------------
    chunks = chunk_text(text, 2000)
    per_chunk = math.ceil(num_questions_total / len(chunks))

    final = []

    for idx, chunk in enumerate(chunks):
        prompt = make_prompt(qa_type, chunk, per_chunk)
        raw = await asyncio.to_thread(generate_qa, prompt)
        print(f"[DEBUG] Chunk {idx+1}/{len(chunks)} raw:", repr(raw))

        items = parse_qa_to_json(raw, qa_type)
        if items:
            final.extend(items)

    # trim to total count
    final = final[:num_questions_total]

    if final:
        await save_qa_incremental(
            user_id=user_id,
            file_url=file_url,
            category=qa_type,
            qa_items=final,
            total=num_questions_total
        )

    return {"message": "QA generation complete", "results": final}

