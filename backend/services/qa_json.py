import re
import json

# -------------------------
# Fact-based QA
# -------------------------
def parse_fact_qa(qa_text: str):
    """
    Matches patterns like:
    Q: Question text
    Answer: Answer text
    """
    pattern = r"(?:Q:|^\d+\.)\s*(.*?)\s*Answer:\s*(.*?)(?=\n\d+\.|$)"
    matches = re.findall(pattern, qa_text, re.DOTALL | re.IGNORECASE | re.MULTILINE)
    return [{"question": q.strip(), "answer": a.strip()} for q, a in matches]

# -------------------------
# True/False QA
# -------------------------
def parse_true_false_qa(qa_text: str):
    """
    Matches patterns like:
    Q: Question text
    Answer: True/False
    """
    pattern = r"(?:Q:|^\d+\.)\s*(.*?)\s*Answer:\s*(True|False)"
    matches = re.findall(pattern, qa_text, re.DOTALL | re.IGNORECASE | re.MULTILINE)
    return [{"question": q.strip(), "answer": a.strip().capitalize()} for q, a in matches]

# -------------------------
# MCQ QA
# -------------------------
def parse_mcq_qa(qa_text: str):
    """
    Matches multiple-choice questions:
    1. Question text
    A) Option1
    B) Option2
    C) Option3
    D) Option4
    Answer: B
    """
    pattern = (
        r"(?:Q:|^\d+\.)\s*(.*?)\s*"      # Question
        r"A\)\s*(.*?)\s*"                 # Option A
        r"B\)\s*(.*?)\s*"                 # Option B
        r"C\)\s*(.*?)\s*"                 # Option C
        r"D\)\s*(.*?)\s*"                 # Option D
        r"Answer:\s*([A-D])"              # Correct answer
    )
    matches = re.findall(pattern, qa_text, re.DOTALL | re.MULTILINE | re.IGNORECASE)
    qa_list = []
    for q, a, b, c, d, ans in matches:
        qa_list.append({
            "question": q.strip(),
            "options": [a.strip(), b.strip(), c.strip(), d.strip()],
            "answer": ans.strip().upper()
        })
    return qa_list

# -------------------------
# Main Parser
# -------------------------
def parse_qa_to_json(qa_text: str, category: str):
    """
    Dispatch parser based on category.
    Returns a list of QA dictionaries.
    """
    if not qa_text or not qa_text.strip():
        return []

    if category == "fact":
        return parse_fact_qa(qa_text)
    elif category == "true_false":
        return parse_true_false_qa(qa_text)
    elif category == "mcq":
        return parse_mcq_qa(qa_text)
    else:
        raise ValueError(f"Invalid QA category: {category}")
