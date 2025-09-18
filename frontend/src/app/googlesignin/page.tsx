// src/components/SignInButton.tsx
"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export default function Googlesignin() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div style={{ display: "flex", gap: "1rem" }}>
        <p>
          Logged in as: <b>{session.user?.name}</b>
        </p>
        <button onClick={() => signOut()}>Sign Out</button>
      </div>
    );
  }

  return (
    <button onClick={() => signIn("google")}>
      <img
        src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png"
        alt="Google logo"
        style={{ width: "20px", marginRight: "10px" }}
      />
      Continue with Google
    </button>
  );
}