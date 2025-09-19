SUPABASE_URL = "https://uomksagzyiittforjxsb.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvbWtzYWd6eWlpdHRmb3JqeHNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwODk4MjIsImV4cCI6MjA3MzY2NTgyMn0.uLk0ypA11b46pQeeXWVzH33nraGzalprte7ATmrgcxU"  # better to load via .env

HEADERS = {
    "apikey":SUPABASE_KEY,
    "Authorization":f"Bearer {SUPABASE_KEY}",
    "Content-Type":"application/json",
    "Accept":"application/json"
}