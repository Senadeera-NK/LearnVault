from fastapi import APIRouter, HTTPException
from fastapi.responses import RedirectResponse
import requests
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter(prefix="/neon")

# Load from .env file
NEON_AUTH_URL = os.getenv("NEON_AUTH_URL")  # e.g. https://api.stack-auth.com
NEON_CLIENT_KEY = os.getenv("NEON_CLIENT_KEY")
NEON_SECRET_KEY = os.getenv("NEON_SECRET_KEY")
REDIRECT_URI = os.getenv("NEON_REDIRECT_URI")
NEON_PROJECT_ID = os.getenv("NEON_PROJECT_ID")

@router.post("/signup")
def neon_signup(name: str, email: str, password: str):
    payload = {"email": email, "password": password, "name": name}
    headers = {
        "Authorization": f"Bearer {NEON_CLIENT_KEY}",
        "Content-Type": "application/json"
    }
    response = requests.post(f"{NEON_AUTH_URL}/v1/signup", json=payload, headers=headers)
    if response.status_code == 201:
        return {"message": "User created successfully", "user": response.json()}
    else:
        raise HTTPException(status_code=response.status_code, detail=response.json())

@router.post("/signin")
def neon_signin(email: str, password: str):
    payload = {"email": email, "password": password}
    headers = {
        "Authorization": f"Bearer {NEON_CLIENT_KEY}",
        "Content-Type": "application/json"
    }
    response = requests.post(f"{NEON_AUTH_URL}/v1/signin", json=payload, headers=headers)
    if response.status_code == 200:
        return {"message": "Signin successful", "user": response.json()}
    else:
        raise HTTPException(status_code=response.status_code, detail=response.json())

@router.get("/oauth/{provider}")
def oauth_redirect(provider: str):
    """Redirect user to Google or GitHub login."""
    auth_url = (
        f"{NEON_AUTH_URL}/oauth/authorize"
        f"?client_id={NEON_CLIENT_KEY}"
        f"&provider={provider}"
        f"&redirect_uri={REDIRECT_URI}"
        f"&response_type=code"
    )
    print("NEON_AUTH_URL", NEON_AUTH_URL)
    return RedirectResponse(auth_url)

@router.get("/oauth/callback")
def oauth_callback(code: str, state: str = None):
    """Handle callback from OAuth provider."""
    token_url = f"{NEON_AUTH_URL}/api/v1/projects/{NEON_PROJECT_ID}/oauth/token"

    data = {
        "client_id": NEON_CLIENT_KEY,
        "client_secret": NEON_SECRET_KEY,
        "code": code,
        "grant_type": "authorization_code",
        "redirect_uri": REDIRECT_URI,
    }

    response = requests.post(token_url, data=data)
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail=response.text)

    token_info = response.json()
    return {"user": token_info}
