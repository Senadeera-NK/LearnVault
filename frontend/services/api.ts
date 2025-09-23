// services/api.ts

const API_URL = "http://localhost:8000"; // FastAPI backend base URL

export async function signup(name: string, email: string, password: string) {
  const response = await fetch(`${API_URL}/signup`, { // match endpoint in main.py
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password }),
  });

  if (!response.ok) {
    throw new Error("Failed to sign up");
  }

  return response.json();
}
