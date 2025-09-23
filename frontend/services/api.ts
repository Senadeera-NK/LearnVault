const API_URL = "https://bookish-space-spoon-q69vx4j4qr42696p-8000.app.github.dev/"

export async function signup(name: string, email: string, password: string) {
    const response = await fetch(`${API_URL}/users/signup`, {
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