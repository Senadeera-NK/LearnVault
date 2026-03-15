import os
import json
import asyncio
import math
import re
from typing import Literal
import google.generativeai as genai

# Internal imports
from utils import extract_text
from qa_utils import download_file_from_url_qa
from services.save_qa_selection import (
    save_qa_incremental,
    check_file_processed,
    get_existing_qa_for_user
)
from services.qa_json import normalize_mcq_answer
# This import is key - it moves the "thinking" logic to your new agent
from agents.orchestrator import agentic_chunk_processor 

GENAI_API_KEY = os.environ.get("GENAI_API_KEY")
if not GENAI_API_KEY:
    raise RuntimeError("GENAI_API_KEY is missing")

genai.configure(api_key=GENAI_API_KEY)

# -------------------------
# Text chunking
# -------------------------
def chunk_text(text: str, chunk_size: int = 2500):
    """
    Chunks text to ensure Render doesn't timeout and 
    Gemini stays focused on context.
    """
    return [text[i:i + chunk_size] for i in range(0, len(text), chunk_size)]

# -------------------------
# Main generator
# -------------------------
async def generate_qa_from_file(
    file_url: str,
    qa_type: Literal["fact", "true_false", "mcq"],
    num_questions_total: int = 20,
    user_id: int = None
):
    # --- 1. Cached QA check ---
    if await check_file_processed(user_id, file_url, qa_type, num_questions_total):
        print("[DEBUG] Cached QA available.")
        cached = await get_existing_qa_for_user(user_id, file_url, qa_type, num_questions_total)
        return {"message": "cached", "results": cached}

    print(f"[DEBUG] Generating QA for user={user_id}, type={qa_type}")

    # --- 2. Download and extract text ---
    local = download_file_from_url_qa(file_url)
    if not local:
        return {"error": "download-failed"}

    text = extract_text(local)
    if text in ["EMPTY", "READ_ERROR", "PHOTO_ONLY"]:
        return {"error": text}

    # --- 3. Determine Chunks ---
    chunks = chunk_text(text, 2500) 
    questions_per_chunk = math.ceil(num_questions_total / len(chunks))
    
    final_results = []

    # --- 4. Sequential Agentic Processing ---
    for idx, chunk in enumerate(chunks):
        if len(final_results) >= num_questions_total:
            break
            
        print(f"[DEBUG] Agent processing chunk {idx+1}/{len(chunks)}")
        
        # The agentic_chunk_processor handles the model call and JSON formatting
        chunk_items = await agentic_chunk_processor(
            chunk=chunk, 
            qa_type=qa_type, 
            count=questions_per_chunk
        )
        
        if chunk_items:
            # We still normalize MCQ answers to be safe
            if qa_type == "mcq":
                for item in chunk_items:
                    if "answer" in item:
                        item["answer"] = normalize_mcq_answer(item["answer"])
            
            final_results.extend(chunk_items)

    # --- 5. Final Trimming ---
    final_results = final_results[:num_questions_total]

    # --- 6. Save results incrementally ---
    if final_results:
        await save_qa_incremental(
            user_id=user_id,
            file_url=file_url,
            category=qa_type,
            parsed_items=final_results,
            max_questions=num_questions_total
        )

    return {"message": "QA generation complete", "results": final_results}