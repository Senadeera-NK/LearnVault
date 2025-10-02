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
    console.log("❌ Signup failed:", errData);
    const message = errData.detail || errData.error || "Failed to sign up";
    throw new Error(message);
  }

  return response.json();
}

export async function signin(email: string, password: string) {
  const response = await fetch(`${API_URL}/signin?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    console.log("❌ Signin failed:", errData);
    const message = errData.detail || errData.error || "Failed to sign in";
    throw new Error(message);
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


// function for recoding the usage of the user
export async function recordUsage(userId: number, pageName: string, durationseconds: number ) {
  const response = await fetch (`${API_URL}/insert_user_usage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ user_id: userId, page_name: pageName, duration_seconds: durationseconds }),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    console.log("❌ Recording usage failed:", errData);
    const message = errData.detail || errData.error || "Failed to record usage";
    throw new Error(message);
  }

  return response.json();
}

export async function fetchUserUsage(userId: number) {
  const response = await fetch(`${API_URL}/user_usage/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    console.log("❌ Fetching user usage failed:", errData);
    const message = errData.detail || errData.error || "Failed to fetch user usage";
    throw new Error(message);
  }

  return response.json();
}

export async function insertPdfFiles(userId: number, files: File[]) {
  const formData = new FormData();
  files.forEach(file => formData.append("files", file));
  formData.append("user_id", String(userId));

  const response = await fetch(`${API_URL}/insert_pdf_file`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    let message = "Failed to upload PDF";
    try {
      const errData = await response.json();
      message = errData?.detail || errData?.error || message;
    } catch {}
    throw new Error(message);
  }

  return response.json();
}


// Example usage:
// (async () => {
//   try {
//     const signupData = await signup("Alice", "alice@example.com", "password123");
//     console.log("✅ Signup successful:", signupData);
//   } catch (error) {
//     console.error("❌ Signup failed:", error);
//   }
// })();  