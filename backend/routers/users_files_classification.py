from services.supabase_service_classification import get_user_files
from fastapi import APIRouter, HTTPException

router = APIRouter()

@router.get("/get_user_pdfs/{user_id}")
def get_user_pdfs(user_id:int):
  result = get_user_files(user_id)
  if result.get('success'):
    return {"message":"successful", "details":result.get("data",[])}

  else:
    raise HTTPException(status_code=401, detail=result.get("error", "retreivable issue of the files"))
