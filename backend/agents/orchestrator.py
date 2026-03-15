import json
import asyncio
import google.generativeai as genai

async def agentic_chunk_processor(chunk: str, qa_type: str, count: int):
    """
    Processes a single chunk of text agentically.
    """
    model = genai.GenerativeModel("gemini-2.0-flash")
    
    # Define schemas for the agent to follow
    schemas = {
        "mcq": '[{"question": "...", "options": ["A", "B", "C", "D"], "answer": "A"}]',
        "true_false": '[{"question": "...", "answer": "True"}]',
        "fact": '[{"question": "...", "answer": "..."}]'
    }

    prompt = f"""
    You are an academic assistant. Extract exactly {count} {qa_type} questions from the text below.
    Format your response as a VALID JSON array: {schemas.get(qa_type)}
    
    Text: {chunk}
    """

    try:
        # We use a shorter timeout/retry logic for Render stability
        res = await asyncio.to_thread(model.generate_content, prompt)
        raw = res.text.strip()
        
        # Fast JSON cleaning
        clean_json = re.sub(r'^```json\s*|```$', '', raw, flags=re.IGNORECASE).strip()
        data = json.loads(clean_json)
        
        # Agent Logic: Internal validation
        if isinstance(data, list) and len(data) > 0:
            return data
    except Exception as e:
        print(f"[AGENT ERROR] Chunk processing failed: {e}")
        return []
    
    return []