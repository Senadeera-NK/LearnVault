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

def chunk_text(text: str, chunk_size: int = 2500):
    """
    Splits text into chunks. 2500 chars is a safe balance for
    context window and Render stability.
    """
    return [text[i:i + chunk_size] for i in range(0, len(text), chunk_size)]

async def generate_qa_from_file(
    file_url: str,
    qa_type: Literal["fact", "true_false", "mcq"],
    num_questions_total: int = 20,
    user_id: int = None
):
    # --- 1. Check if we already processed this exact request ---
    if await check_file_processed(user_id, file_url, qa_type, num_questions_total):
        print(f"[DEBUG] Cache hit for user={user_id}, url={file_url}")
        cached = await get_existing_qa_for_user(user_id, file_url, qa_type, num_questions_total)
        return {"message": "cached", "results": cached}

    # --- 2. Acquire and Extract Text ---
    local_path = download_file_from_url_qa(file_url)
    if not local_path:
        return {"error": "download-failed"}

    text = extract_text(local_path)
    if text in ["EMPTY", "READ_ERROR", "PHOTO_ONLY"]:
        return {"error": text}

    # --- 3. Divide work into Chunks ---
    chunks = chunk_text(text, 2500) 
    questions_per_chunk = math.ceil(num_questions_total / len(chunks))
    
    final_results = []

    # --- 4. Process Chunks with Rate-Limit Awareness ---
    for idx, chunk in enumerate(chunks):
        if len(final_results) >= num_questions_total:
            break
            
        print(f"[DEBUG] Processing chunk {idx+1}/{len(chunks)}")
        
        # Intentional delay (2s) to stay under Free Tier RPM limits
        if idx > 0:
            await asyncio.sleep(2.0)
            
        chunk_items = await agentic_chunk_processor(
            chunk=chunk, 
            qa_type=qa_type, 
            count=questions_per_chunk
        )
        
        if chunk_items:
            # Post-process normalization (especially for MCQ answers)
            if qa_type == "mcq":
                for item in chunk_items:
                    if "answer" in item:
                        item["answer"] = normalize_mcq_answer(item["answer"])
            
            final_results.extend(chunk_items)

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