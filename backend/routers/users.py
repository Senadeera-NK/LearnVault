from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.supabase_service_users import signup_user
from services import supabase_service_users

router = APIRouter()

# Request Schema
class SignupRequest(BaseModel):
    name: str
    email: str
    password: str

@router.post("/signup")
def signup(request: SignupRequest):
    result =  signup_user(request.name, request.email, request.password)
    if result['success']:
        print("Singup successful", result)
        return {"message": "user created successfully"}
    else:
        print("Signup failed", result)
        raise HTTPException(status_code=400, detail=result["error"])


@router.get("/users")
def get_users():
    users = supabase_service_users.supabase.table("users").select("*").execute()
    return {"users": users.data}
