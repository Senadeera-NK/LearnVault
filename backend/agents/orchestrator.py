import json
import asyncio
import re
import google.generativeai as genai

async def agentic_chunk_processor(chunk: str, qa_type: str, count: int):
    """
    Processes a single chunk of text agentically.
    """
    model = genai.GenerativeModel("gemini-2.0-flash")
    
    schemas = {
        "mcq": '[{"question": "...", "options": ["A", "B", "C", "D"], "answer": "A"}]',
        "true_false": '[{"question": "...", "answer": "True"}]',
        "fact": '[{"question": "...", "answer": "..."}]'
    }

    # Enhanced Prompt to force valid JSON only
    prompt = f"""
    Extract exactly {count} {qa_type} questions from the text below.
    
    REQUIRED JSON FORMAT:
    {schemas.get(qa_type)}

    RULES:
    1. Return ONLY the JSON array.
    2. No markdown, no "Here is your JSON", no explanations.
    3. Ensure the facts are strictly from the text provided.

    Text to process:
    {chunk}
    """

    try:
        res = await asyncio.to_thread(model.generate_content, prompt)
        if not res.text:
            return []

        # Robust cleaning
        raw = res.text.strip()
        clean_json = re.sub(r'^```json\s*|```$', '', raw, flags=re.IGNORECASE).strip()
        
        # If Gemini still adds noise before/after the [ ], find the boundaries
        start_idx = clean_json.find('[')
        end_idx = clean_json.rfind(']')
        if start_idx != -1 and end_idx != -1:
            clean_json = clean_json[start_idx:end_idx + 1]

        data = json.loads(clean_json)
        
        if isinstance(data, list):
            return data
            
    except Exception as e:
        # Check your Render logs - you will see this error now
        print(f"[AGENT ERROR] Logic failed: {e}")
        return []
    
    return []