import requests, os
from urllib.parse import urlsplit, unquote
from qa_utils import download_file_from_url_qa
from utils import extract_text

def download_file_from_url(file_url, save_dir="."):
    clean_url = urlsplit(file_url)._replace(query="").geturl()
    clean_url = unquote(clean_url)
    ext = os.path.splitext(clean_url)[1] or ".pdf"
    local_filename = os.path.join(save_dir, f"downloaded_file{ext}")
    print("DEBUG: Downloading file from:", clean_url)
    response = requests.get(clean_url, stream=True)
    print("STATUS:", response.status_code)
    if response.status_code != 200:
        raise Exception("Failed to download file")
    with open(local_filename, "wb") as f:
        for chunk in response.iter_content(8192):
            f.write(chunk)
    print("File saved to:", local_filename)
    return local_filename  #  ADD THIS LINE


# test with your public Supabase file URL
file_url = "https://uomksagzyiittforjxsb.supabase.co/storage/v1/object/public/user_pdfs/user_2/eom%20u01introtobiology.pdf"
local_path = download_file_from_url(file_url)
print(local_path)

text = extract_text(local_path)
print(text[:1000])
