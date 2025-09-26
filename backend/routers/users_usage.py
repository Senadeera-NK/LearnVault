from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.supabase_service_users_usage import insert_files
from services import supabase_service_users_usage

router = APIRouter()

@router.post("/insert_user_usage")
def insert_users_usage(user_id:str, pageName:str, durationseconds:int):
    result = supabase_service_users_usage.insert_user_usage(user_id, pageName, durationseconds)
    if result.get('success'):
        return {"message": "usage inserted successful", "user": result['user']}
    else:
        raise HTTPException(status_code=401, detail=result.get("error", "usage uploading failed"))