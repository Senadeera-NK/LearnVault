SUPABASE_URL = "https://uomksagzyiittforjxsb.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvbWtzYWd6eWlpdHRmb3JqeHNiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODA4OTgyMiwiZXhwIjoyMDczNjY1ODIyfQ.xJqTnjtOBinSBMrRZbdKEvi_obGbPspx6hJmw33mrp4"  # better to load via .env

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