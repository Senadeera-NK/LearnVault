import os
import asyncio
import math
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
from agents.orchestrator import agentic_chunk_processor 

GENAI_API_KEY = os.environ.get("GENAI_API_KEY")
if not GENAI_API_KEY:
    raise RuntimeError("GENAI_API_KEY is missing from environment")

genai.configure(api_key=GENAI_API_KEY)

# --- OPTIMIZATION 1: LARGER CHUNKS ---
# Increasing to 10,000 characters reduces the number of API calls.
# This prevents Render from timing out and saves memory.
def chunk_text(text: str, chunk_size: int = 10000):
    return [text[i:i + chunk_size] for i in range(0, len(text), chunk_size)]

async def generate_qa_from_file(
    file_url: str,
    qa_type: Literal["fact", "true_false", "mcq"],
    num_questions_total: int = 20,
    user_id: int = None
):
    # --- 1. Check the db ---
    if await check_file_processed(user_id, file_url, qa_type, num_questions_total):
        print(f"[DEBUG] Cache hit for user={user_id}")
        cached = await get_existing_qa_for_user(user_id, file_url, qa_type, num_questions_total)
        return {"message": "cached", "results": cached}

    # --- 2. Extract Text ---
    local_path = download_file_from_url_qa(file_url)
    if not local_path:
        return {"error": "download-failed"}

    text = extract_text(local_path)
    if text in ["EMPTY", "READ_ERROR", "PHOTO_ONLY"]:
        return {"error": text}

    # --- 3. Divide work ---
    chunks = chunk_text(text, 10000) 
    questions_per_chunk = math.ceil(num_questions_total / len(chunks))
    
    final_results = []

    # --- 4. Optimized Processing Loop ---
    for idx, chunk in enumerate(chunks):
        if len(final_results) >= num_questions_total:
            break
            
        print(f"[DEBUG] Processing large chunk {idx+1}/{len(chunks)}")

        await asyncio.sleep(3.0)
        
        # --- OPTIMIZATION 2: SMART DELAY ---
        # Increased to 4s but happens fewer times due to larger chunks.
        if idx > 0:
            await asyncio.sleep(4.0)
            
        chunk_items = await agentic_chunk_processor(
            chunk=chunk, 
            qa_type=qa_type, 
            count=questions_per_chunk
        )
        
        if chunk_items:
            if qa_type == "mcq":
                for item in chunk_items:
                    if "answer" in item:
                        item["answer"] = normalize_mcq_answer(item["answer"])
            
            final_results.extend(chunk_items)
            
            # --- OPTIMIZATION 3: MEMORY RELEASE ---
            # Explicitly clear the chunk string from memory
            del chunk

    # --- 5. Clean up and Save ---
    final_results = final_results[:num_questions_total]

    if final_results:
        await save_qa_incremental(
            user_id=user_id,
            file_url=file_url,
            category=qa_type,
            parsed_items=final_results,
            max_questions=num_questions_total
        )

    return {"message": "QA generation complete", "results": final_results}