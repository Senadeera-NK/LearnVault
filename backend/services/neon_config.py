import os
from dotenv import load_dotenv
import psycopg2

load_dotenv()

def get_db_connection():
  conn = psycopg2.connect(os.getenv("NEON_URL"))
  return conn