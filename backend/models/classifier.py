from sentence_transformers import SentenceTransformer, util
from utils import extract_text,rule_based_check

# categories
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

category_texts = list(categories.values())
category_names = list(categories.keys())

# Load model
model = SentenceTransformer('all-MiniLM-L6-v2')
category_embeddings = model.encode(category_texts, convert_to_tensor=True)

def classify_text_with_embeddings(text):
    # rule-based first
    rule_label = rule_based_check(text)
    if rule_label:
        return rule_label

    text_embedding = model.encode(text[:1500], convert_to_tensor=True)
    similarity_scores = util.cos_sim(text_embedding, category_embeddings)
    bext_idx = similarity_scores.argmax()
    return category_names[bext_idx]


def classify_document(fle_path):
    text = extract_text(fle_path)
    category = classify_text_with_embeddings(text)
    return category