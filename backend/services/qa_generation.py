import os
import asyncio
import math
from typing import List, Literal
from utils import extract_text
from qa_utils import download_file_from_url_qa
import google.generativeai as genai
from services.save_qa_selection import save_qa_incremental, check_file_processed

# -------------------------
# Gemini Configuration
# -------------------------
GENAI_API_KEY = os.environ.get("GENAI_API_KEY")
if not GENAI_API_KEY:
    raise RuntimeError("GENAI_API_KEY environment variable not set")

genai.configure(api_key=GENAI_API_KEY)

# -------------------------
# Chunking Function
# -------------------------
def chunk_text(text: str, chunk_size: int = 500) -> List[str]:
    return [text[i:i + chunk_size] for i in range(0, len(text), chunk_size)]

# -------------------------
# Gemini QA Generation
# -------------------------
def generate_qa(prompt: str) -> str:
    try:
        model = genai.GenerativeModel("gemini-2.0-flash")
        response = model.generate_content(
            prompt,
            safety_settings={"HARM_CATEGORY_DANGEROUS_CONTENT": "block_none"}
        )
        return response.text or ""
    except Exception as e:
        print(f"[ERROR] Gemini generation failed: {e}")
        return ""

def make_prompt(qa_type: str, text_chunk: str, num_questions: int) -> str:
    if qa_type == "mcq":
        return f"""
        You are an exam MCQ generator.
        Create {num_questions} multiple-choice questions (A, B, C, D) from this text.
        Clearly mark the correct answer with 'Answer: <option>'.
        Text:
        {text_chunk}
        """
    elif qa_type == "true_false":
        return f"""
        You are a True/False question generator.
        Create {num_questions} True/False questions with answers.
        Format each as:
        Q: ...
        Answer: True/False
        Text:
        {text_chunk}
        """
    elif qa_type == "fact":
        return f"""
        You are a factual QA generator.
        Create {num_questions} fact-based questions with concise answers.
        Format each as:
        Q: ...
        Answer: ...
        Text:
        {text_chunk}
        """
    else:
        raise ValueError(f"Invalid QA type: {qa_type}")

# -------------------------
# Main QA Generation
# -------------------------
async def generate_qa_from_file(
    file_url: str,
    qa_type: Literal["fact", "true_false", "mcq"],
    num_questions_total: int = 20,
    user_id: int = None
) -> dict:
    """Generate QA for a file, skip if already processed, save once."""
    
    # Check if file already processed
    if await check_file_processed(user_id=int(user_id), file_url=file_url, category=qa_type):
        return {"message": "File already processed", "results": []}

    print(f"[DEBUG] Starting QA generation for user={user_id}, type={qa_type}")

    # Download and extract text
    local_path = download_file_from_url_qa(file_url)
    if not local_path:
        return {"error": "Failed to download the file"}

    text = extract_text(local_path)
    if text in ["EMPTY", "READ_ERROR", "PHOTO_ONLY"]:
        return {"error": f"Text extraction failed: {text}"}

    # Chunk text
    chunks = chunk_text(text)
    if not chunks:
        return {"error": "No text chunks to process"}

    qa_per_chunk = max(1, math.ceil(num_questions_total / len(chunks)))
    semaphore = asyncio.Semaphore(1)  # single-threaded for memory control

    results = []

    async def process_chunk(index: int, chunk: str):
        async with semaphore:
            print(f"[DEBUG] Processing chunk {index + 1}/{len(chunks)} (len={len(chunk)})")
            prompt = make_prompt(qa_type, chunk, qa_per_chunk)
            qa_text = await asyncio.to_thread(generate_qa, prompt)
            if not qa_text.strip():
                print(f"[WARN] Empty QA for chunk {index + 1}")
                return ""
            return qa_text

    # Sequentially process all chunks
    qa_chunks = []
    for i, chunk in enumerate(chunks):
        qa_text = await process_chunk(i, chunk)
        if qa_text:
            qa_chunks.append(qa_text)
        await asyncio.sleep(0.5)

    if not qa_chunks:
        return {"error": "No QA generated from file"}

    # Save all QA chunks at once
    save_result = await save_qa_incremental(
        user_id=int(user_id),
        file_url=file_url,
        category=qa_type,
        qa_chunks=qa_chunks
    )

    print("[DEBUG] QA generation complete and saved")
    return {"message": "QA generation complete", "results": save_result}
