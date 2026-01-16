"use client";

import { useState, useEffect } from "react";
import { signup, signin, fetchUsers } from "../../api/api";
import { useAuth } from "./AuthContext";
import {useRouter} from "next/navigation";
import { Portal } from "@chakra-ui/react"; // Add this

type AuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const router = useRouter();
  const { login } = useAuth();

  const [tab, setTab] = useState<"login" | "signup">("login");

  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  const [signinEmail, setSigninEmail] = useState("");
  const [signinPassword, setSigninPassword] = useState("");

  // simple fallback toast
  const toast = (text: string) => {
    if (typeof window !== "undefined") alert(text);
  };

  useEffect(() => {
    // optional: just to mirror previous behaviour (keeps console visibility)
    (async () => {
      try {
        const data = await fetchUsers();
        console.log("Users from backend:", data?.users);
      } catch (err) {
        console.warn("fetchUsers failed", err);
      }
    })();
  }, []);

  const resetSignup = () => {
    setSignupName("");
    setSignupEmail("");
    setSignupPassword("");
  };

  const resetSignin = () => {
    setSigninEmail("");
    setSigninPassword("");
  };

  const handleSignup = async () => {
    try {
      const res = await signup(signupName, signupEmail, signupPassword);
      console.log("signup res", res);
      if (res?.message === "user created successfully") {
        toast("Signup successful");
        login({ name: res.user.name, email: res.user.email, id: res.user.id });
        resetSignup();
        onClose();
      } else {
        toast(res.error || "Signup failed");
      }
    } catch (e: any) {
      toast(e?.message || "Signup failed");
    }
  };

  const handleSignin = async () => {
    try {
      const res = await signin(signinEmail, signinPassword);
      console.log("signin res", res);
      if (res?.message === "signin successful") {
        toast("Login successful");
        login({ name: res.user.name, email: res.user.email, id: res.user.id });
        resetSignin();
        onClose();
        router.push("/dashboard");
      } else {
        toast(res.error || "Login failed");
      }
    } catch (e: any) {
      toast(e?.message || "Login failed");
    }
  };

  if (!isOpen) return null;

  return (
    <Portal>
    <div
      aria-modal="true"
      role="dialog"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(255, 255, 255, 0.4)", 
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
        padding: 16,
      }}
      onMouseDown={(e) => {
        // click on overlay closes
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          width: "min(720px, 96vw)",
          maxHeight: "90vh",
          overflowY: "auto",
          background: "white",
          borderRadius: 12,
          padding: 20,
          boxShadow: "0 10px 40px rgba(0,0,0,0.25)",
          position: "relative",
        }}
      >
        {/* Close button */}
        <button
          aria-label="Close"
          onClick={onClose}
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            background: "transparent",
            border: "1px solid gray",
            padding:3,
            fontSize: 18,
            cursor: "pointer",
          }}
        >
          ×
        </button>


        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <button
            onClick={() => setTab("login")}
            style={{
              padding: "8px 12px",
              borderRadius: 6,
              border: "1px solid #ddd",
              background: tab === "login" ? "#090a0aff" : "white",
              color: tab === "login" ? "white" : "black",
              cursor: "pointer",
            }}
          >
            Login
          </button>
          <button
            onClick={() => setTab("signup")}
            style={{
              padding: "8px 12px",
              borderRadius: 6,
              border: "1px solid #ddd",
              background: tab === "signup" ? "#090a0aff" : "white",
              color: tab === "signup" ? "white" : "black",
              cursor: "pointer",
            }}
          >
            Sign Up
          </button>
        </div>

        {tab === "login" ? (
          <div>
            <label style={{ display: "block", marginBottom: 6 }}>Email</label>
            <input
              value={signinEmail}
              onChange={(e) => setSigninEmail(e.target.value)}
              type="email"
              placeholder="Email"
              style={{
                width: "100%",
                padding: "10px 12px",
                marginBottom: 12,
                borderRadius: 6,
                border: "1px solid #ddd",
              }}
            />

            <label style={{ display: "block", marginBottom: 6 }}>Password</label>
            <input
              value={signinPassword}
              onChange={(e) => setSigninPassword(e.target.value)}
              type="password"
              placeholder="Password"
              style={{
                width: "100%",
                padding: "10px 12px",
                marginBottom: 12,
                borderRadius: 6,
                border: "1px solid #ddd",
              }}
            />

            <button
              onClick={handleSignin}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 8,
                border: "none",
                background: "#070808ff",
                color: "white",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Login
            </button>
          </div>
        ) : (
          <div>
            <label style={{ display: "block", marginBottom: 6 }}>Full name</label>
            <input
              value={signupName}
              onChange={(e) => setSignupName(e.target.value)}
              placeholder="Full name"
              style={{
                width: "100%",
                padding: "10px 12px",
                marginBottom: 12,
                borderRadius: 6,
                border: "1px solid #ddd",
              }}
            />

            <label style={{ display: "block", marginBottom: 6 }}>Email</label>
            <input
              value={signupEmail}
              onChange={(e) => setSignupEmail(e.target.value)}
              type="email"
              placeholder="Email"
              style={{
                width: "100%",
                padding: "10px 12px",
                marginBottom: 12,
                borderRadius: 6,
                border: "1px solid #ddd",
              }}
            />

            <label style={{ display: "block", marginBottom: 6 }}>Password</label>
            <input
              value={signupPassword}
              onChange={(e) => setSignupPassword(e.target.value)}
              type="password"
              placeholder="Password"
              style={{
                width: "100%",
                padding: "10px 12px",
                marginBottom: 12,
                borderRadius: 6,
                border: "1px solid #ddd",
              }}
            />

            <button
              onClick={handleSignup}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 8,
                border: "none",
                background: "#0e0f0fff",
                color: "white",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Sign Up
            </button>
          </div>
        )}
      </div>
    </div>
    </Portal>
  );
}
