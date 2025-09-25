"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [visible, setVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Start animation
    setVisible(true);

    // Redirect after 8 seconds
    const timer = setTimeout(() => {
      router.push("/dashboard");
    }, 20000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        fontSize: "2.5rem",
        fontFamily: "monospace",
        fontWeight: "bold",
        overflow: "hidden",
      }}
    >
      <span
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(-50px)",
          transition: "opacity 10s ease, transform 5s ease",
        }}
      >
        Welcome to LearnVault!
      </span>
    </div>
  );
}
