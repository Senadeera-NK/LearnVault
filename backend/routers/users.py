from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.supabase_service_users import signup_user

router = APIRouter()

# Request Schema
class SignupRequest(BaseModel):
    name: str
    email: str
    password: str

@router.post("/signup")
async def signup(request: SignupRequest):
    result = await signup_user(request.name, request.email, request.password)
    if result["success"]:
        return {"message": "User created successfully"}
    else:
        raise HTTPException(status_code=400, detail=result["error"])