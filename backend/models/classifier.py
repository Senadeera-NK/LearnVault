# models/classifier.py
from utils import extract_text, rule_based_check
from sentence_transformers import SentenceTransformer, util
import threading
import subprocess, sys

# Install sentence-transformers at runtime if not present
try:
    import sentence_transformers
except ImportError:
    subprocess.check_call([sys.executable, "-m", "pip", "install", "sentence-transformers"])
    import sentence_transformers

# Categories mapping
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

# Thread-safe lazy loading
model = None
category_embeddings = None
load_lock = threading.Lock()

def load_model():
    """Load the SentenceTransformer model and encode categories if not loaded yet."""
    global model, category_embeddings
    with load_lock:
        if model is None:
            print("⚡ Loading SentenceTransformer model...")
            model = SentenceTransformer('all-MiniLM-L6-v2')
            category_embeddings = model.encode(category_texts, convert_to_tensor=True)
            print("✅ Model loaded successfully!")

def classify_text_with_embeddings(text):
    """Classify text using embeddings, with rule-based fallback."""
    global model, category_embeddings
    # Load model lazily
    if model is None:
        load_model()

    # First check rule-based
    rule_label = rule_based_check(text)
    if rule_label:
        return rule_label

    # Embed text and compute similarity
    text_embedding = model.encode(text[:1500], convert_to_tensor=True)
    similarity_scores = util.cos_sim(text_embedding, category_embeddings)
    best_idx = similarity_scores.argmax()
    return category_names[best_idx]

def classify_document(file_path):
    """Extract text from a document and classify it."""
    text = extract_text(file_path)
    category = classify_text_with_embeddings(text)
    return category
