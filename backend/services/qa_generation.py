import os
import asyncio
from typing import List, Literal
from utils import extract_text
from qa_utils import download_file_from_url_qa
import google.generativeai as genai
import math

# Configure Gemini API
GENAI_API_KEY = os.environ.get("GENAI_API_KEY")
if not GENAI_API_KEY:
    raise RuntimeError("GENAI_API_KEY env variable is not set")
genai.configure(api_key=GENAI_API_KEY)

# -------------------------
# Chunking function
# -------------------------
def chunk_text(text: str, chunk_size: int = 15000) -> List[str]:
    return [text[i:i + chunk_size] for i in range(0, len(text), chunk_size)]

# -------------------------
# QA Generation functions
# -------------------------
def generate_mcq_qa(text_chunk: str, num_questions: int = 20) -> str:
    prompt = f"""
    You are an exam MCQ generator.
    Read the following text and create {num_questions} multiple-choice questions.
    Text:
    {text_chunk}
    Instructions:
    - Each question must have 4 options (A,B,C,D)
    - Indicate the correct answer clearly (e.g., "Answer:B")
    - Keep questions meaningful and diverse
    """
    model = genai.GenerativeModel("gemini-2.0-flash")
    response = model.generate_content(prompt)
    return response.text

def generate_true_false_qa(text_chunk: str, num_questions: int = 20) -> str:
    prompt = f"""
    You are a quiz generator.
    Read the following text and create {num_questions} True/False questions with answers.
    Text:
    {text_chunk}
    Instructions:
    - Format each question clearly
    - Provide the answer after each question (e.g., "Answer: True" or "Answer: False")
    - Keep questions meaningful and cover different parts of the text
    """
    model = genai.GenerativeModel("gemini-2.0-flash")
    response = model.generate_content(prompt)
    return response.text

def generate_fact_qa(text_chunk: str, num_questions: int = 20) -> str:
    prompt = f"""
    You are a quiz generator.
    Read the following text and create {num_questions} fact-based questions with answers.
    Text:
    {text_chunk}
    Instructions:
    - Format each question clearly
    - Ensure questions are factual and checkable
    - Provide the correct answer after each question (e.g., "Answer: ...")
    - Cover different parts of the text
    """
    model = genai.GenerativeModel("gemini-2.0-flash")
    response = model.generate_content(prompt)
    return response.text

# -------------------------
# Parallel QA generation with per-chunk allocation
# -------------------------
async def generate_qa_from_file(file_url: str, qa_type: Literal["fact", "true_false", "mcq"], num_questions_total: int = 20) -> dict:
    """
    Downloads a PDF, extracts text, splits into chunks, and generates QA.
    The total number of questions is distributed evenly across chunks.
    Returns a single combined QA string.
    """
    local_path = download_file_from_url_qa(file_url)
    if not local_path:
        return {"error": "Failed to download the file"}

    text = extract_text(local_path)
    if text in ["EMPTY", "READ_ERROR", "PHOTO_ONLY"]:
        return {"error": f"Could not extract meaningful text: {text}"}

    chunks = chunk_text(text)
    num_chunks = len(chunks)
    if num_chunks == 0:
        return {"error": "No text chunks to process"}

    # Determine how many questions per chunk
    qa_per_chunk = math.ceil(num_questions_total / num_chunks)

    # Limit concurrency to avoid memory spikes
    semaphore = asyncio.Semaphore(5)

    async def process_chunk(chunk: str) -> str:
        async with semaphore:
            if qa_type == "fact":
                return await asyncio.to_thread(generate_fact_qa, chunk, qa_per_chunk)
            elif qa_type == "true_false":
                return await asyncio.to_thread(generate_true_false_qa, chunk, qa_per_chunk)
            elif qa_type == "mcq":
                return await asyncio.to_thread(generate_mcq_qa, chunk, qa_per_chunk)
            else:
                raise ValueError(f"Invalid QA type: {qa_type}")

    try:
        results = await asyncio.gather(*[process_chunk(c) for c in chunks])
        combined_qa = "\n".join(results)
        return {"qa_output": combined_qa}
    except Exception as e:
        return {"error": f"QA generation failed: {e}"}
