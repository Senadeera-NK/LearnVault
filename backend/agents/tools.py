import os
import google.generativeai as genai

# the actions agent can take

def calculate_complexity_score(text: str) -> int:
    """
    Analyzes text density to suggest the ideal number of questions.
    Args:
        text: The raw text content to analyze.
    Returns:
        An integer representing the recommended question count.
    """
    word_count = len(text.split())
    # 1 question per 100 words
    return max(1, word_count // 100)

def search_academic_context(query: str) -> str:
    """
    Uses Google Search grounding to find additional academic context 
    if the provided text is insufficient for high-quality questions.
    Args:
        query: The search term or concept to look up.
    """
    # This is a placeholder for the actual tool registration 
    # handled in the orchestrator.
    return f"Search result for: {query}"


# tool registration for the gemini model
STUDY_TOOLS = [
    calculate_complexity_score,
    # TODO: Add more tools(optinal)
]


def get_model_with_tools(api_key: str, model_name: str = "gemini-1.5-flash"):
    genai.configure(api_key=api_key)
    return genai.GenerativeModel(model_name=model_name, tools=[calculate_complexity_score])