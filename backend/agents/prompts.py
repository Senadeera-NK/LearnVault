PLANNER_PROMPT = """
You are a Learning Architect. Given the text below, identify the {count} most critical concepts 
that a student must master. Output a brief list of these concepts so the Generator knows what to focus on.
TEXT: {text}
"""

REVIEWER_PROMPT = """
You are a Senior Technical Reviewer. I will provide a generated JSON quiz and the source text.
Your task:
1. Validate JSON format.
2. Fact-check: Ensure the answer exists in the text.
3. Quality: Ensure questions aren't repetitive.

If there are errors, provide specific feedback. If perfect, return "PASSED".
TEXT: {text}
QUIZ: {quiz_json}
"""