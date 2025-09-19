# backend/services/supabase_service.py
import requests
import hashlib
from services.supabase_config import SUPABASE_URL, SUPABASE_KEY, HEADERS

TABLE_NAME = "Users";

async def signup_user(name:str, email:str, password:str):
    existing_user = supabase.table("users").select("*").eq("email", email).execute()
    if existing_user.data:
        return {"success": False, "error": "Email already registered"}
    
    hashed_password = hashed_password(password)

    new_user = supabase.table("users").insert({
        "name": name,
        "email": email,
        "password": hashed_password
    }).execute()

    return {"success": True, "user": new_user.data}