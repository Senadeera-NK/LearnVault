from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from services import supabase_service_users
from services import supabase_service_users_usage
from routers import users_files_classification, users_attachFiles, users, users_usage, users_signed_upload, qa_selection, users_temp_upload
import os
import uvicorn

app = FastAPI()

# ✅ Debug print to confirm assigned port
print("⚙️ Running on PORT:", os.getenv("PORT"))

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Include routers
app.include_router(users.router)
app.include_router(users_usage.router)
app.include_router(users_attachFiles.router)
app.include_router(users_files_classification.router)
app.include_router(users_signed_upload.router)
app.include_router(qa_selection.router)
app.include_router(users_temp_upload.router)

# ✅ Startup event
@app.on_event("startup")
def startup_event():
    supabase_service_users.test_connection_and_users()

# ✅ Root route
@app.get("/")
def read_root():
    return {"message": "✅ LearnVault backend is running on Render!"}


# ✅ Run the app (Render requires this)
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    uvicorn.run(app, host="0.0.0.0", port=port)
