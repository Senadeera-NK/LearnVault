import re
import json

def parse_fact_qa(qa_text: str):
    pattern = r"Q:\s*(.*?)\s*A:\s*(.*?)(?=Q:|$)"
    matches = re.findall(pattern, qa_text, re.DOTALL)
    return [{"question": q.strip(), "answer": a.strip()} for q, a in matches]


def parse_true_false_qa(qa_text: str):
    pattern = r"Q:\s*(.*?)\s*Answer:\s*(True|False)"
    matches = re.findall(pattern, qa_text, re.DOTALL | re.IGNORECASE)
    return [{"question": q.strip(), "answer": a.strip().capitalize()} for q, a in matches]


def parse_mcq_qa(qa_text: str):
    """
    Expected pattern:
    Q: What is AI?
    A) Automated Interface
    B) Artificial Intelligence
    C) Algorithmic Input
    D) Applied Innovation
    Answer: B
    """
    pattern = r"Q:\s*(.*?)\s*A\)\s*(.*?)\s*B\)\s*(.*?)\s*C\)\s*(.*?)\s*D\)\s*(.*?)\s*Answer:\s*([A-D])"
    matches = re.findall(pattern, qa_text, re.DOTALL)

    qa_list = []
    for q, a, b, c, d, ans in matches:
        qa_list.append({
            "question": q.strip(),
            "options": [a.strip(), b.strip(), c.strip(), d.strip()],
            "answer": ans.strip().upper()
        })
    return qa_list


def parse_qa_to_json(qa_text: str, category: str):
    """Pick the right parser based on QA type."""
    if category == "fact":
        return parse_fact_qa(qa_text)
    elif category == "true_false":
        return parse_true_false_qa(qa_text)
    elif category == "mcq":
        return parse_mcq_qa(qa_text)
    else:
        raise ValueError(f"Invalid category: {category}")
