# models/classifier.py

import os
from utils import extract_text, rule_based_check
from huggingface_hub import InferenceClient

# Initialize Hugging Face client
HF_TOKEN = os.environ.get("HF_TOKEN")
if not HF_TOKEN:
    raise RuntimeError("HF_TOKEN environment variable is not set.")

hf_client = InferenceClient(
    provider="hf-inference",
    api_key=HF_TOKEN
)

# Define categories
categories = {
    "Math Notes": "Mathematics, formulas, algebra, geometry, calculus, theorems",
    "Physics Paper": "Physics, mechanics, thermodynamics, optics, electricity, waves",
    "Chemistry Notes": "Chemistry, reactions, elements, periodic table, organic, inorganic",
    "Biology Notes": "Biology, genetics, anatomy, ecology, cell biology",
    "Science Assignment": "Science homework, lab report, experiment, observations",
    "Coursework": "University coursework, assignment, project, submission, report",
    "Exam Paper / Q&A": "question paper, Q and A, multiple choice, MCQ, answers, marks, exam, test",
    "Certificate / Award": "Certificate, awarded to, achievement, completion, participation",
    "Government Document": "Government, ministry, official, passport, ID, registration form",
    "Invoice": "Invoice, bill, payment due, amount, supplier, item, total",
    "Payment Receipt": "Receipt, paid to, received from, transaction, payment confirmation",
    "Resume / CV": "Resume, CV, skills, experience, education, work history",
    "Cover Letter": "Cover letter, applying for, motivation letter, position, dear hiring manager",
    "Project Report": "Project report, system design, UML, architecture, implementation",
    "Research Paper": "Research paper, abstract, methodology, experiment, results, conclusion",
    "Photo / Image": "Photograph, image, picture, landscape, scenery",
    "General Document": "Miscellaneous text, general notes"
}

category_names = list(categories.keys())
category_texts = list(categories.values())


def classify_text_with_hf(text: str):
    """
    Use Hugging Face sentence-transformers API to classify text
    """
    try:
        response = hf_client.sentence_similarity(
            {
                "source_sentence": text[:1500],  # truncate long text for API
                "sentences": category_texts
            },
            model="sentence-transformers/all-MiniLM-L6-v2"
        )
        # response is a list of dicts with 'score'
        best_idx = max(range(len(response)), key=lambda i: response[i]['score'])
        return category_names[best_idx]
    except Exception as e:
        print("❌ Hugging Face classification error:", str(e))
        return "HF_ERROR"


def classify_document(file_path: str):
    """
    Classify a document:
    1. Extract text
    2. Apply rule-based check
    3. If rule-based fails, use Hugging Face similarity
    """
    text = extract_text(file_path)
    rule_label = rule_based_check(text)
    if rule_label:
        return rule_label

    return classify_text_with_hf(text)
