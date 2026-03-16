import json
import asyncio
import re
import google.generativeai as genai

async def agentic_chunk_processor(chunk: str, qa_type: str, count: int, max_retries: int = 10):
    """
    Processes a single chunk of text agentically.
    Includes Exponential Backoff to handle 429 Rate Limit errors (Free Tier).
    """
    model = genai.GenerativeModel("gemini-2.0-flash")
    
    schemas = {
        "mcq": '[{"question": "...", "options": ["A", "B", "C", "D"], "answer": "A"}]',
        "true_false": '[{"question": "...", "answer": "True"}]',
        "fact": '[{"question": "...", "answer": "..."}]'
    }

    prompt = f"""
    You are an academic expert. Extract exactly {count} {qa_type} questions from the text below.
    
    RETURN RULES:
    1. Output MUST be a valid JSON array.
    2. Format: {schemas.get(qa_type)}
    3. Return ONLY the JSON content. No conversational text or extra markdown.

    Text:
    {chunk}
    """

    for attempt in range(max_retries):
        try:
            # We use asyncio.to_thread because the Gemini SDK call is blocking
            res = await asyncio.to_thread(model.generate_content, prompt)
            
            if not res or not res.text:
                return []

            raw = res.text.strip()
            
            # 1. Clean up markdown wrappers
            clean_json = re.sub(r'^```json\s*|```$', '', raw, flags=re.IGNORECASE).strip()
            
            # 2. Extract strictly between the first [ and last ]
            start_idx = clean_json.find('[')
            end_idx = clean_json.rfind(']')
            
            if start_idx != -1 and end_idx != -1:
                clean_json = clean_json[start_idx:end_idx + 1]
            else:
                # Fallback: if it's not a list, look for an object
                start_obj = clean_json.find('{')
                end_obj = clean_json.rfind('}')
                if start_obj != -1 and end_obj != -1:
                    clean_json = "[" + clean_json[start_obj:end_obj + 1] + "]"

            data = json.loads(clean_json)
            return data if isinstance(data, list) else []

        except Exception as e:
            err_msg = str(e).lower()
            # If we hit a Rate Limit (429)
            if "429" in err_msg or "quota" in err_msg or "limit" in err_msg:
                wait_time = (2 ** attempt) + 2  # Exponential backoff: 2s, 4s, 10s...
                print(f"[RATE LIMIT] Hit 429 in Orchestrator. Retrying in {wait_time}s (Attempt {attempt+1}/{max_retries})...")
                await asyncio.sleep(wait_time)
                continue
            else:
                print(f"[AGENT ERROR] Logic failed: {e}")
                break
    
    return [{"error":"Max retried exceeded due to rate limits"}]