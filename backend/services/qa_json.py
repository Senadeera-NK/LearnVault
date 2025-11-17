import re
import json

# -------------------------
# Fact-based QA
# -------------------------
def parse_fact_qa(qa_text: str):
    pattern = r"(?:Q:|^\d+\.)\s*(.*?)\s*Answer:\s*(.*?)(?=\n\d+\.|$)"
    matches = re.findall(pattern, qa_text, re.DOTALL | re.IGNORECASE | re.MULTILINE)
    return [{"question": q.strip(), "answer": a.strip()} for q, a in matches]

# -------------------------
# True/False QA  (UPDATED)
# -------------------------
def parse_true_false_qa(qa_text: str):
    pattern = r"(?:Question\s*\d*:|Question:)\s*(.*?)\s*\*\*Answer:\*\*\s*(True|False)"
    matches = re.findall(pattern, qa_text, flags=re.IGNORECASE | re.DOTALL)

    qa_pairs = []
    for q, a in matches:
        qa_pairs.append({
            "question": q.strip(),
            "answer": a.strip()
        })

    return qa_pairs

# -------------------------
# MCQ QA
# -------------------------
def parse_mcq_qa(qa_text: str):
    pattern = (
        r"(?:Q:|^\d+\.)\s*(.*?)\s*"
        r"A\)\s*(.*?)\s*"
        r"B\)\s*(.*?)\s*"
        r"C\)\s*(.*?)\s*"
        r"D\)\s*(.*?)\s*"
        r"Answer:\s*([A-D])"
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
