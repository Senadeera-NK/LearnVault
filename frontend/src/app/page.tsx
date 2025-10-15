"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AuthModal from "../components/AuthModal";
import { useAuth } from "../components/AuthContext";

export default function Home() {
  const { user } = useAuth();
  const [visible, setVisible] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
      return;
    }

    setVisible(true);
    const authTimer = setTimeout(() => setShowAuth(true), 3000);
    return () => clearTimeout(authTimer);
  }, [user, router]);

  if (user) return null;

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "2.5rem",
          fontFamily: "monospace",
          fontWeight: "bold",
          zIndex: 0, // make sure it's under Sidebar
        }}
      >
        <span
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(-50px)",
            transition: "opacity 10s ease, transform 5s ease",
          }}
        >
          LearnVault!
        </span>
      </div>

      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
    </div>
  );
}
