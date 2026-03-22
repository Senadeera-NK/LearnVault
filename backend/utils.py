import os, sys
import requests
from urllib.parse import urlsplit, quote
from pdf2image import convert_from_path
import pdfplumber, fitz, pytesseract, docx2txt
from PIL import Image

def clean_url(url):
    return urlsplit(url)._replace(query="").geturl()

def download_file_from_url(file_url, save_dir="/tmp"):
    file_url = urlsplit(file_url)._replace(query="").geturl()
    file_url_encoded = quote(file_url, safe=':/')
    ext = os.path.splitext(file_url_encoded)[1]
    local_filename = os.path.join(save_dir, f"downloaded_file_{ext}")

    print("DEBUG: Downloading file from URL:", file_url_encoded)
    print("DEBUG: Saving to local path:", local_filename)

    try:
        r = requests.get(file_url_encoded, stream=True, timeout=30)
        r.raise_for_status()
        with open(local_filename, 'wb') as f:
            for chunk in r.iter_content(chunk_size=8192):
                f.write(chunk)
        print("DEBUG: File downloaded successfully")
        return local_filename
    except Exception as e:
        print("Error downloading file:", str(e))
        return None

# add extract_text
def extract_text(file_path):
    ext = os.path.splitext(file_path)[1].lower().replace(".", "")
    text = ""

    try:
        if ext == "pdf":
            #  pdfplumber
            try:
                with pdfplumber.open(file_path) as pdf:
                    for page in pdf.pages:
                        text += page.extract_text() or ""
            except: pass

            # fitz fallback
            if not text.strip():
                try:
                    doc = fitz.open(file_path)
                    for page in doc:
                        text += page.get_text("text")
                except: pass

            # OCR fallback
            if not text.strip():
                try:
                    pages = convert_from_path(file_path)
                    for page in pages:
                        text += pytesseract.image_to_string(page)
                except: pass

        elif ext == "docx":
            text = docx2txt.process(file_path)

        elif ext in ["jpg", "jpeg", "png"]:
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
        print(f"Could not read {file_path}: {e}")
        return "READ_ERROR"

    return text.strip() if text.strip() else "EMPTY"


# rule_based_check here...
def rule_based_check(text):
    lowered = text.lower()
    if any(word in lowered for word in ["question", "answer", "q.", "marks", "mcq"]):
        return "Exam Paper / Q&A"
    if any(word in lowered for word in ["curriculum vitae", "resume", "skills", "experience"]):
        return "Resume / CV"
    if any(word in lowered for word in ["invoice", "bill", "total amount"]):
        return "Invoice"
    if any(word in lowered for word in ["receipt", "paid to", "received from"]):
        return "Payment Receipt"
    if any(word in lowered for word in ["certificate", "achievement", "participation"]):
        return "Certificate / Award"
    if any(word in lowered for word in ["government", "ministry", "department"]):
        return "Government Document"
    if any(word in lowered for word in ["coursework", "assignment", "submission", "project report"]):
        return "Coursework"
    if len(lowered.strip()) < 50:
        return "Photo / Image"
    return None

