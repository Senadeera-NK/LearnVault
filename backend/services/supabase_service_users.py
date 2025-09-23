# backend
import hashlib
from supabase import create_client
from services.supabase_config import SUPABASE_URL, SUPABASE_KEY

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)    

def hash_password(password: str) -> str:
  return hashlib.sha256(password.encode()).hexdigest() 

async def signup_user(name: str, email: str, password: str):
  existing_user = supabase.table("users").select("*").eq("email", email).execute()
  if existing_user.data:
    return {"error": "User already exists"}
  
  hashed_password = hash_password(password)

  new_user = supabase.table("users").insert({
    "name": name,
    "email": email,
    "password": hashed_password
  }).execute()

  return {"success": True, "user": new_user.data}

async def signin_user(email: str, password: str):
    hashed_password = hash_password(password)
    
    user = supabase.table("users").select("*").eq("email", email).eq("password", hashed_password).execute()  

    if user.data:
        return {"success": True, "user": user.data[0]}
    else:   
        return {"error": "Invalid email or password"}