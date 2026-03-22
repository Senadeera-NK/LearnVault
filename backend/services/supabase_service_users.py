# backend/services/supabase_service_users.py
# for the local run
import os
from dotenv import load_dotenv
load_dotenv()
# --------------------------------
import hashlib
from supabase import create_client
from services.supabase_config import SUPABASE_URL, SUPABASE_KEY
import logging

# for local run
# for local run
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

# Change 'or SUPABASE_KEY' to 'or not SUPABASE_KEY'
if not SUPABASE_URL or not SUPABASE_KEY:
    print(f"DEBUG: URL is {SUPABASE_URL}, KEY exists: {bool(SUPABASE_KEY)}")
    raise ValueError("Supabase credentials missing. Check your .env file")

# If it gets here, it means both exist
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def signup_user(name: str, email: str, password: str):
    try:
        existing_user = supabase.table("users").select("*").eq("email", email).execute()
        if existing_user.data:
            return {"success": False, "error": "user already exists"}

        hashed_password = hashlib.sha256(password.encode()).hexdigest()

        new_user = supabase.table("users").insert({
            "name": name,
            "email": email,
            "password": hashed_password
        }).execute()
        logging.info(f"New user created: {new_user.data}")
        return {"success": True, "user": new_user.data}

    except Exception as e:
        # Always return a dict with success key
        logging.error(f"Error during signup: {str(e)}")
        return {"success": False, "error": str(e)}

def signin_user(email: str, password: str):
    hashed_password = hash_password(password)
    
    user = supabase.table("users").select("*").eq("email", email).eq("password", hashed_password).execute()  

    if user.data:
        return {"success": True, "user": user.data[0]}
    else:
        return {"error": "Invalid email or password"}

#  Test and print users
def test_connection_and_users():
    try:
        response = supabase.table("users").select("*").execute()
        if response.data:
            print("Connected to Supabase successfully")
            print("Existing users:")
            for u in response.data:
                print(f"- ID: {u.get('id')}, Name: {u.get('name')}, Email: {u.get('email')}")
        else:
            print("Connected, but no users found in users table")
    except Exception as e:
        print("Failed to connect to Supabase:", str(e))
