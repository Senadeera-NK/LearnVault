import asyncpg
import os
import asyncio
from dotenv import load_dotenv

load_dotenv()  # loads .env
DATABASE_URL = os.environ.get("SUPABASE_DB_URL")

async def run_migrations():
    conn = await asyncpg.connect(DATABASE_URL)
    with open("../../db/migrations/001_initial.sql", "r") as f:
        sql = f.read()
    await conn.execute(sql)
    await conn.close()
    print("Migrations applied successfully.")

asyncio.run(run_migrations())
