import os, requests
from urllib.parse import urlsplit, unquote

def download_file_from_url_qa(file_url, save_dir="."):
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
    print("✅ File saved to:", local_filename)
    return local_filename  # ✅ ADD THIS LINE
