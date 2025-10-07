import os
import pdfplumber
import pytesseract
from PIL import Image
import docxtxt
import fitz
from sentence_transformers import SentenceTransformer, util
from .categories import categories

# Load the SentenceTransformers for once
model = SentenceTransformer('all-MiniLM-L6-v2')
category_text = list(categories.values())
category_names = list(categories.keys())
category_embeddings = model.encode(category_texts, convert_to_tensor=True)

# Text Extraction
def extract_text(file_path):
  ext = file_path.lower().split('.')[-1]
  text=""
  try:
    if ext == "pdf":
      try:
        with pdfplumber.open(file_path) as pdf:
          for page in pdf.pages:
            text += page.extract_text() or ""
      except:
        pass
    if not text.strip():
      try:
        doc = fitz.open(file_path)
        for page in doc:
          text += page.get_text("text")
      except:
        pass
    if not text.strip():
      from pdf2image import convert_from_path
      pages = convert_from_path(file_path)
      for page in pages:
        text += pytesseract.image_to_string(page)
    elif ext == "docx":
      text = docxtxt.process(file_path)
    elif ext in ["jpg", "png", "jpeg"]:
      img = Image.open(file_path)
      text = pytesseract.image_to_string(img)
      if not text.strip():
        return "PHOTO_ONLY"
    elif ext == "txt":
      with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
        text = f.read()
    else:
      return "UNSUPPORTED"
  
  except Exception as e:
    print(f"Could not read{file_path}:{e}")
  return text.strip() if text.strip() else "EMPTY"

  # Rule based classification
def rule_based_check(text):
    lowered = text.lower()
    if any(word in lowered for word in ["question", "answer", "q.", "marks", "mcq"]):
      return "Exam Paper/Q&A"
    if any(word in lowered for word in ["curriculum vitea", "resume", "skills", "experience"]):
      return "Resume/CV"
    if any(word in lowered for word in ["invoice", "bill", "total amount"]):
      return "Invoice"
    if any(word in lowered for word in ["receipt", "paid to", "received from"]):
      return "Payment Receipt"
    if any(word in lowered for word in ["certificate", "achievement", "participation"]):
      return "Certificate/Award"
    if any(word in lowered for word in ["goverment","ministry", "department"]):
      return "Government Document"
    if any(word in lowered for word in ["coursework", "assigment", "submission", "proejct report"]):
      return "Coursework"
    if len(lowered.strip()) < 50:
      return "Photo/Image"
    return None

# Hybrid sementic + rule classification
def classify_text_with_embeddings(text):
  if text in ["PHOTO_ONLY"]:
    return "Photo/Image"
  if text in ["READ_ERROR", "EMPTY", "UNSUPPORTED"]:
    return "Read/Error"
  
  # first rule-based
  rule_label = rule_based_check(text)
  if rule_label:
    return rule_label
  
  # fallback to embeddings
  text_embedding = model.encode(text[:1500], convert_to_tensor=True)
  similarity_scores = util.cos_sim(text_embedding, category_embeddings)
  best_idx = similarity_scores.argmax()
  return category_names[best_idx]

def classify_document(file_path):
  text = extract_text(file_path)
  category = classify_text_with_embeddings(text)
  return category
