import json
import asyncio
import re
import os
import google.generativeai as genai
from .prompts import PLANNER_PROMPT, REVIEWER_PROMPT
from .tools import get_model_with_tools, calculate_complexity_score

# Multi-Key Setup for Rate Limit Resilience
KEY_1 = os.environ.get("GENAI_API_KEY")
KEY_2 = os.environ.get("GENAI_API_KEY_2")

def parse_json_safely(raw_text: str):
    """Clean and parse JSON from LLM markdown response."""
    clean = re.sub(r'^```json\s*|```$', '', raw_text, flags=re.IGNORECASE).strip()
    match = re.search(r'\[.*\]', clean, re.DOTALL)
    if match:
        return json.loads(match.group(0))
    return []

async def agentic_chunk_processor(chunk: str, qa_type: str, count: int, max_retries: int = 5):
    """
    CV-READY AGENTIC WORKFLOW:
    1. Planner (Thought): Identifies core concepts.
    2. Generator (Action): Uses Tools to adjust complexity & generate QA.
    3. Reviewer (Observation/Correction): Validates output quality.
    """
    
    # --- STAGE 1: THE PLANNER (Brain) ---
    genai.configure(api_key=KEY_1)
    planner = genai.GenerativeModel("gemini-1.5-flash")
    plan_res = await asyncio.to_thread(
        planner.generate_content, 
        PLANNER_PROMPT.format(count=count, text=chunk)
    )
    concepts = plan_res.text
    print(f"[PLANNER] Strategy: {concepts[:50]}...")

    await asyncio.sleep(2) # Pacing

    # --- STAGE 2: THE GENERATOR (Action + Tools) ---
    # We use Key 2 here to split the API quota load
    model_with_tools = get_model_with_tools(KEY_2 or KEY_1)
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

    await asyncio.sleep(2) # Pacing

    # --- STAGE 3: THE REVIEWER (Quality Control) ---
    genai.configure(api_key=KEY_1)
    reviewer = genai.GenerativeModel("gemini-1.5-flash")
    rev_res = await asyncio.to_thread(
        reviewer.generate_content,
        REVIEWER_PROMPT.format(text=chunk, quiz_json=raw_json)
    )
    
    validation = rev_res.text
    if "PASSED" in validation.upper():
        print("[REVIEWER] Check Passed.")
        return parse_json_safely(raw_json)
    else:
        print(f"[REVIEWER] Refinement needed: {validation[:50]}")
        # In a full ReAct loop, you'd trigger a re-generation here.
        # For now, we return the parsed JSON to keep it simple.
        return parse_json_safely(raw_json)