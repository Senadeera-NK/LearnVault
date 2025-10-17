import os

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

HEADERS = {
    "apikey":SUPABASE_KEY,
    "Authorization":f"Bearer {SUPABASE_KEY}",
    "Content-Type":"application/json",
    "Accept":"application/json"
}

# SUPABASE_URL = "https://idarabphqsrgaazkavon.supabase.co"
# SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlkYXJhYnBocXNyZ2Fhemthdm9uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg0NTk1MjUsImV4cCI6MjA2NDAzNTUyNX0.5nF0hIxOTqojoIlU5UKEUemCR3EcgHu4CUbXD64yBKo"  # better to load via .env

# HEADERS = {
#     "apikey":SUPABASE_KEY,
#     "Authorization":f"Bearer {SUPABASE_KEY}",
#     "Content-Type":"application/json",
#     "Accept":"application/json"
# }

