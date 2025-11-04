import google.generativeai as genai
import pdfplumber
# from qa_utils import download_file_from_url_qa
from utils import extract_text
from qa_utils import download_file_from_url_qa
import os, requests
from urllib.parse import urlsplit, unquote

# gemini client securely
GENAI_API_KEY = os.environ.get("GENAI_API_KEY")
if not GENAI_API_KEY:
    raise RuntimeError("GENAI_API_KEY env variable is not set")

genai.configure(api_key=GENAI_API_KEY)

# mcq generation function
def generate_mcq_qa(text:str, num_questions:int=20)->str:
    chunk = text[:16000]
    prompt = f"""
    You are an exam MXQ generator.
    Read the following text and create {num_questions} multiple-choice questions.
    Text:{chunk}
    Instructions:
    - Each question must have 4 options (A,B,C,D)
    - Indicate the correct answer clearly (e.g., "Answer:B")
    - Keep questions meaningful and diverse
    """
    model = genai.GenerativeModel("gemini-2.0-flash")
    response = model.generate_content(prompt)
    return response.text

def generate_true_false_qa(text:str,num_questions=20)->str:
    chunk = text[:16000]
    prompt = f"""
    You are a quiz generator.
    Read the following text and create {num_questions} True/False questions with answers.

    Text:
    {chunk}

    Instructions:
    - Format each question clearly
    - Provide the answer after each question (e.g., "Answer: True" or "Answer: False")
    - Keep questions meaningful and cover different parts of the text
    """
    model = genai.GenerativeModel("gemini-2.0-flash")
    response = model.generate_content(prompt)
    return response.text

def generate_fact_qa(text:str, num_questions=20)->str:
    chunk = text[:16000]  # Limit to model context
    prompt = f"""
    You are a quiz generator.
    Read the following text and create {num_questions} fact-based questions with answers.

    Text:
    {chunk}

    Instructions:
    - Format each question clearly
    - Provide the correct answer after each question (e.g., "Answer: ...")
    - Ensure questions are factual and checkable
    - Cover different parts of the text
    """
    model = genai.GenerativeModel("gemini-2.0-flash")
    response = model.generate_content(prompt)
    return response.text


# main function to generate qa
async def generate_qa_from_file(file_url:str, qa_type:str):
    # downloads a PDF, extract text and generates QA using the model
    local_path = download_file_from_url_qa(file_url)
    if not local_path:
        print("DEBUG ERROR: File not downloaded")
        return {"error":"failed to download the file"}
    
    text = extract_text(local_path)
    print("DEBUG : Extracted text length: ", len(text) if text else 0)
    if text in ["EMPTY", "READ_ERROR", "PHOTO_ONLY"]:
        print("DEBUG ERROR: Text extraction failed with", text)
        return {"error", f"Could not extract meaningful text: {text}"}
    
    
    try:
        if qa_type == "fact":
            qa_output = generate_fact_qa(text)
        elif qa_type == "true_false":
            qa_output = generate_true_false_qa(text)
        elif qa_type =="mcq":
            qa_output = generate_mcq_qa(text)
        else:
            print("DEBUG ERROR: Invalid QA type", qa_type)
            return {"error":"Invalid QA type"}
        
        print("DEBUG: LLM output preview:", qa_output[:500])
        return {"qa_output":qa_output}
    except Exception as e:
        print("DEBUG ERROR: Exception while generating QA: ", str(e))
        return {"error": f"QA generation failed: {e}"}