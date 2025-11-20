"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AuthModal from "../components/AuthModal";
import { useAuth } from "../components/AuthContext";

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  const [visible, setVisible] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    // already logged in → redirect instantly
    if (user) {
      router.push("/dashboard");
      return;
    }

    // trigger animation
    setVisible(true);

    const t = setTimeout(() => setShowAuth(true), 3000);
    return () => clearTimeout(t);
  }, [user]);

  if (user) return null;

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "2.8rem",
          fontFamily: "monospace",
          fontWeight: "bold",
        }}
      >
        <span
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(-40px)",
            transition: "opacity 1.8s ease, transform 1s ease",
          }}
        >
          LearnVault!
        </span>
      </div>

      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
    </div>
  );
}
