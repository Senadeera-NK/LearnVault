import os
import asyncio
import math
from typing import List, Literal
from utils import extract_text
from qa_utils import download_file_from_url_qa
import google.generativeai as genai
from services.save_qa_selection import save_qa_incremental

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
def chunk_text(text: str, chunk_size: int = 3000) -> List[str]:
    """Splits text into manageable chunks."""
    return [text[i:i + chunk_size] for i in range(0, len(text), chunk_size)]


# -------------------------
# QA Generation Helpers
# -------------------------
def generate_mcq_qa(text_chunk: str, num_questions: int = 20) -> str:
    prompt = f"""
    You are an exam MCQ generator.
    Create {num_questions} multiple-choice questions (A, B, C, D) from this text.
    Clearly mark the correct answer with 'Answer: <option>'.
    Text:
    {text_chunk}
    """
    model = genai.GenerativeModel("gemini-2.0-flash")
    response = model.generate_content(prompt)
    return response.text


def generate_true_false_qa(text_chunk: str, num_questions: int = 20) -> str:
    prompt = f"""
    You are a True/False question generator.
    Create {num_questions} True/False questions with answers.
    Format each as:
    Q: ...
    Answer: True/False
    Text:
    {text_chunk}
    """
    model = genai.GenerativeModel("gemini-2.0-flash")
    response = model.generate_content(prompt)
    return response.text


def generate_fact_qa(text_chunk: str, num_questions: int = 20) -> str:
    prompt = f"""
    You are a factual QA generator.
    Create {num_questions} fact-based questions with concise answers.
    Format each as:
    Q: ...
    Answer: ...
    Text:
    {text_chunk}
    """
    model = genai.GenerativeModel("gemini-2.0-flash")
    response = model.generate_content(prompt)
    return response.text


# -------------------------
# Main QA Generation
# -------------------------
async def generate_qa_from_file(
    file_url: str,
    qa_type: Literal["fact", "true_false", "mcq"],
    num_questions_total: int = 20,
    user_id: int = None
) -> dict:
    """
    Downloads a file, extracts text, splits into chunks, generates QA for each chunk,
    and saves incrementally to Supabase to avoid memory/time overload.
    """
    print(f"[DEBUG] Starting QA generation for user={user_id}, type={qa_type}, total={num_questions_total}")

    # 1️⃣ Download and extract text
    local_path = download_file_from_url_qa(file_url)
    if not local_path:
        return {"error": "Failed to download the file"}

    text = extract_text(local_path)
    if text in ["EMPTY", "READ_ERROR", "PHOTO_ONLY"]:
        return {"error": f"Could not extract meaningful text: {text}"}

    # 2️⃣ Chunking
    chunks = chunk_text(text)
    if not chunks:
        return {"error": "No text chunks to process"}

    qa_per_chunk = max(1, math.ceil(num_questions_total / len(chunks)))
    semaphore = asyncio.Semaphore(3)  # limit concurrency

    print(f"[DEBUG] Total chunks: {len(chunks)}, QA per chunk: {qa_per_chunk}")

    async def process_and_save_chunk(chunk_index: int, chunk: str):
        async with semaphore:
            print(f"[DEBUG] Generating QA for chunk {chunk_index + 1}/{len(chunks)} (len={len(chunk)})")
            try:
                # Run blocking model call in separate thread
                if qa_type == "fact":
                    qa_text = await asyncio.to_thread(generate_fact_qa, chunk, qa_per_chunk)
                elif qa_type == "true_false":
                    qa_text = await asyncio.to_thread(generate_true_false_qa, chunk, qa_per_chunk)
                elif qa_type == "mcq":
                    qa_text = await asyncio.to_thread(generate_mcq_qa, chunk, qa_per_chunk)
                else:
                    raise ValueError(f"Invalid QA type: {qa_type}")

                print(f"[DEBUG] QA text generated for chunk {chunk_index + 1}, len={len(qa_text)}")

                # Save incrementally
                result = await save_qa_incremental(
                    user_id=int(user_id),
                    file_url=file_url,
                    category=qa_type,
                    qa_chunks=[qa_text]
                )
                print(f"[DEBUG] Chunk {chunk_index + 1} saved result: {result}")
                return result

            except Exception as e:
                print(f"[ERROR] Chunk {chunk_index + 1} failed: {e}")
                return {"error": str(e)}

    # 3️⃣ Concurrent processing
    try:
        results = await asyncio.gather(
            *[process_and_save_chunk(i, chunk) for i, chunk in enumerate(chunks)]
        )
        print("[DEBUG] All chunks processed successfully")
        return {"message": "QA generation complete", "results": results}

    except Exception as e:
        print("[FATAL] QA generation failed:", e)
        return {"error": f"QA generation failed: {e}"}
