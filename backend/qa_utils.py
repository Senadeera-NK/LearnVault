import os
import requests
from urllib.parse import urlsplit, quote

def download_file_from_url_qa(file_url, save_dir="/tmp"):
    try:
        # Clean and encode URL (handles spaces like %20)
        file_url = urlsplit(file_url)._replace(query="").geturl()
        file_url_encoded = quote(file_url, safe=':/')

        # Create save directory if not exists
        os.makedirs(save_dir, exist_ok=True)

        # Derive extension and local path
        ext = os.path.splitext(file_url_encoded)[1] or ".pdf"
        local_filename = os.path.join(save_dir, f"downloaded_file{ext}")

        print(f"DEBUG: Downloading file from URL: {file_url_encoded}")
        print(f"DEBUG: Saving to local path: {local_filename}")

        # Attempt to download
        response = requests.get(file_url_encoded, stream=True, timeout=30, allow_redirects=True)

        if response.status_code != 200:
            print(f"DEBUG: Failed to download file (status {response.status_code})")
            return None

        with open(local_filename, "wb") as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)

        print("DEBUG: File successfully downloaded")
        return local_filename

    except Exception as e:
        print("DEBUG: Exception during download:", e)
        return None
