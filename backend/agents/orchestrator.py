import json
import asyncio
import re
import os
import google.generativeai as genai
from .prompts import PLANNER_PROMPT, REVIEWER_PROMPT
from .tools import get_model_with_tools, calculate_complexity_score

# Multi-Key Setup - Updated to match your .env (GENAI_API_KEY_2)
KEY_1 = os.environ.get("GENAI_API_KEY")
KEY_2 = os.environ.get("GENAI_API_KEY_2") 

# The specific model string required by the current SDK version
MODEL_ID = "models/gemini-2.5-flash"

def parse_json_safely(raw_text: str):
    """Clean and parse JSON from LLM markdown response."""
    clean = re.sub(r'^```json\s*|```$', '', raw_text, flags=re.IGNORECASE).strip()
    match = re.search(r'\[.*\]', clean, re.DOTALL)
    if match:
        try:
            return json.loads(match.group(0))
        except json.JSONDecodeError:
            return []
    return []

async def agentic_chunk_processor(chunk: str, qa_type: str, count: int, max_retries: int = 5):
    """
    CV-READY AGENTIC WORKFLOW with fixed model paths.
    """
    
    #the planner
    genai.configure(api_key=KEY_1)
    # Added models/ prefix
    planner = genai.GenerativeModel(MODEL_ID)
    
    plan_res = await asyncio.to_thread(
        planner.generate_content, 
        PLANNER_PROMPT.format(count=count, text=chunk)
    )
    concepts = plan_res.text
    print(f"[PLANNER] Strategy: {concepts[:50]}...")

    await asyncio.sleep(2) 

    # THE GENERATOR (Action + Tools)
    # Ensure your tools.py also uses the "models/gemini-1.5-flash" string
    model_with_tools = get_model_with_tools(KEY_2 or KEY_1, model_name=MODEL_ID)
    chat = model_with_tools.start_chat(enable_automatic_function_calling=True)
    
    gen_prompt = f"""
    Using these concepts: {concepts}
    1. Call 'calculate_complexity_score' to verify text density.
    2. Generate {count} {qa_type} questions in JSON format.
    Source Text: {chunk}
    """
    
    gen_res = await asyncio.to_thread(chat.send_message, gen_prompt)
    raw_json = gen_res.text
    print(f"[GENERATOR] Produced raw QA content.")

    await asyncio.sleep(2) 

    # THE REVIEWER (Quality Control)
    genai.configure(api_key=KEY_1)
    # Added models/ prefix
    reviewer = genai.GenerativeModel(MODEL_ID)
    
    rev_res = await asyncio.to_thread(
        reviewer.generate_content,
        REVIEWER_PROMPT.format(text=chunk, quiz_json=raw_json)
    )
    
    validation = rev_res.text
    if "PASSED" in validation.upper():
        print("[REVIEWER] Check Passed.")
        return parse_json_safely(raw_json)
    else:
        print(f"[REVIEWER] Refinement suggested: {validation[:50]}")
        return parse_json_safely(raw_json)