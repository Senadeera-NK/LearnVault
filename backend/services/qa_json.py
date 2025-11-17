import re
import json

# -------------------------
# Helpers
# -------------------------
def normalize_mcq_answer(ans: str):
    """
    Normalize various answer formats to 'A'|'B'|'C'|'D' or return None if impossible.
    Accepts: 'A', 'a', 'C)', '3', 'Answer: C', '"B"', etc.
    """
    if not ans:
        return None
    s = str(ans).strip()
    # Remove quotes and extraneous characters
    s = re.sub(r'[“”"\'\)\(\.\-]', '', s).strip()
    s = s.upper()
    # Direct letter
    if s in {"A", "B", "C", "D"}:
        return s
    # If numeric (1..4) => map to A..D
    if s.isdigit():
        n = int(s)
        if 1 <= n <= 4:
            return "ABCD"[n - 1]
    # Extract first A-D letter if present
    m = re.search(r'([A-D])', s)
    if m:
        return m.group(1)
    return None


# -------------------------
# Fact-based QA (unchanged but keep tolerant)
# -------------------------
def parse_fact_qa(qa_text: str):
    pattern = r"(?:Q:|^\d+[\.\)])\s*(.*?)\s*(?:Answer:|Ans:)\s*(.*?)(?=\n\s*\d+[\.\)]|\n\s*Q:|$)"
    matches = re.findall(pattern, qa_text, re.DOTALL | re.IGNORECASE | re.MULTILINE)
    return [{"question": q.strip(), "answer": a.strip()} for q, a in matches]


# -------------------------
# True/False QA
# -------------------------
def parse_true_false_qa(qa_text: str):
    # Accept both markdown-styled output and Q:/1. formats
    pattern = r"(?:Question\s*\d*:|Question:|(?:Q:|^\d+[\.\)]))\s*(.*?)\s*(?:\*\*Answer:\*\*|Answer:|Ans:)\s*(True|False)"
    matches = re.findall(pattern, qa_text, flags=re.IGNORECASE | re.DOTALL | re.MULTILINE)
    qa_pairs = []
    for q, a in matches:
        qa_pairs.append({
            "question": re.sub(r'^\*+|\*+$', '', q.strip()).strip(),
            "answer": a.strip().capitalize()
        })
    return qa_pairs


# -------------------------
# MCQ QA
# -------------------------
# 1) Try to parse if generator returned JSON
def parse_mcq_json(qa_text: str):
    try:
        data = json.loads(qa_text)
        parsed = []
        if isinstance(data, list):
            for obj in data:
                if not isinstance(obj, dict):
                    continue
                q = obj.get("question") or obj.get("q") or ""
                options = obj.get("options") or obj.get("opts") or []
                ans = obj.get("answer") or obj.get("ans") or ""
                if isinstance(options, list) and len(options) == 4:
                    parsed.append({
                        "question": str(q).strip(),
                        "options": [str(o).strip() for o in options],
                        "answer": normalize_mcq_answer(ans)
                    })
        return [p for p in parsed if p.get("answer")]
    except Exception:
        return []


# 2) Fallback regex parser (tolerant)
def parse_mcq_qa(qa_text: str):
    # First try JSON
    parsed = parse_mcq_json(qa_text)
    if parsed:
        return parsed

    # Regex tolerant for many possible formats (A), A., A:, A) etc.
    pattern = (
        r"(?:Q:|^\d+[\.\)])\s*(.*?)\s*"
        r"(?:A[\)\.\:]\s*(.*?)\s*)"
        r"(?:B[\)\.\:]\s*(.*?)\s*)"
        r"(?:C[\)\.\:]\s*(.*?)\s*)"
        r"(?:D[\)\.\:]\s*(.*?)\s*)"
        r"(?:Answer[:\s]*([A-D1-4a-d]))"
    )
    matches = re.findall(pattern, qa_text, re.DOTALL | re.MULTILINE | re.IGNORECASE)
    qa_list = []
    for q, a, b, c, d, ans in matches:
        q = re.sub(r'^\*+|\*+$', '', q.strip()).strip()
        options = [a.strip(), b.strip(), c.strip(), d.strip()]
        normalized = normalize_mcq_answer(ans)
        if normalized:
            qa_list.append({
                "question": q,
                "options": options,
                "answer": normalized
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
