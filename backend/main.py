from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from services import supabase_service_users  # ✅ import here
from services import supabase_service_users_usage
from routers import users_files_classification, users_attachFiles, users, users_usage

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#Commenteefe

app.include_router(users.router)
app.include_router(users_usage.router)
app.include_router(users_attachFiles.router)
app.include_router(users_files_classification.router)

# ✅ Run Supabase connection + print users when server starts
@app.on_event("startup")
def startup_event():
    supabase_service_users.test_connection_and_users()

# # in main.py or routes file
# from services.supabase_service_classification import classify_file_with_colab
# from fastapi import FastAPI, Body

# app = FastAPI()

# @app.post("/test_colab")
# def test_colab(file_url: str = Body(..., embed=True)):
#     result = classify_file_with_colab(file_url)
#     return {"category": result}