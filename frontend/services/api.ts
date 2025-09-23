// services/api.ts

// Use your Codespaces-provided forwarded URL here
const API_URL = "https://bookish-space-spoon-q69vx4j4qr42696p-8000.app.github.dev";
// "proxy": "http://localhost:8000"

export async function signup(name: string, email: string, password: string) {
  const response = await fetch(`${API_URL}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password }),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || "Failed to sign up");
  }

  return response.json();
}

export async function fetchUsers() {
  const res = await fetch(`${API_URL}/users`);
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || "Failed to fetch users");
  }
  return res.json();
}
