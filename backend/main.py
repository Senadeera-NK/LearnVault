from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import users
from services import supabase_service_users  # ✅ import here

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router)

# ✅ Run Supabase connection + print users when server starts
@app.on_event("startup")
def startup_event():
    supabase_service_users.test_connection_and_users()
