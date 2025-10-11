from fastapi import APIRouter
from services.neon_config import get_db_connection

router = APIRouter(prefix="/neon")

@router.get("/test-db")
def test_db_connection():
  try:
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT 1;")
    result = cur.fetchone()
    conn.close()
    return {"status":"success", "result":result}
  except Exception as e:
    return {"status":"error", "message":str(e)}

@router.get("/users")
def get_users():
  try:
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM users;")
    rows = cur.fetchall()
    conn.close()
    return {"status":"success","result":rows}
  except Exception as e:
    return {"status":"error","message":str(e)}  

@router.get("/users_usage")
def get_users_usage():
  try:
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM users_usage;")
    rows = cur.fetchall()
    conn.close()
    return {"status":"succes", "users_usage":rows}
  except Exception as e:
    return {"status":"error","message":str(e)}

@router.get("/users_files")
def get_users_files():
  try:
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM users_files;")
    rows = cur.fetchall()
    conn.close()
    return {"status":"success", "users_files":rows}
  except Exception as e:
    return {"status":"error", "message":str(e)}


