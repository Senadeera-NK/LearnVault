from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.supabase_service_users_usage import insert_user_usage
from services import supabase_service_users_usage

router = APIRouter()

class UsageRequest(BaseModel):
    user_id:int
    page_name:str
    duration_seconds:int

@router.post("/insert_user_usage")
def insert_user_usage(payload:UsageRequest):
    result = supabase_service_users_usage.insert_user_usage(payload.user_id, payload.page_name, payload.duration_seconds)
    if result.get('success'):
        return {"message": "usage inserted successful", "usage": result['usage']}
    else:
        raise HTTPException(status_code=401, detail=result.get("error", "usage uploading failed"))