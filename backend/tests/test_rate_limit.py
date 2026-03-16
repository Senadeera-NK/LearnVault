import asyncio
import httpx
import time

# Change this to your local URL or your Render URL
BASE_URL = "https://learnvault-jdbg.onrender.com" 

async def test_qa_generation():
    payload = {
        "user_id": 2,
        "fileURL": "https://uomksagzyiittforjxsb.supabase.co/storage/v1/object/public/user_pdfs/user_2/Week 1.pdf",
        "category": "mcq",
        "num_questions": 10
    }

    print(f"🚀 Starting Rate Limit Test at {time.strftime('%X')}...")
    
    async with httpx.AsyncClient(timeout=300.0) as client:
        try:
            start_time = time.time()
            response = await client.post(f"{BASE_URL}/qa/selection", json=payload)
            duration = time.time() - start_time

            if response.status_code == 200:
                data = response.json()
                results_count = len(data.get("results", []))
                print(f"✅ Success! Received {results_count} questions.")
                print(f"⏱️ Total processing time: {duration:.2f} seconds.")
                # If duration is > 10-15 seconds, our intentional delays are working!
            else:
                print(f"❌ Failed with status: {response.status_code}")
                print(f"Detail: {response.text}")

        except Exception as e:
            print(f"⚠️ Test Error: {e}")

if __name__ == "__main__":
    asyncio.run(test_qa_generation())