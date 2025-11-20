"use client";

import * as Chakra from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { signup, signin, fetchUsers } from "../../api/api";
import { useAuth } from "./AuthContext";

// Chakra v3 dialog mappings
const Modal: any = Chakra.DialogRoot;
const ModalOverlay: any = Chakra.DialogBackdrop;
const ModalContent: any = Chakra.DialogContent;
const ModalHeader: any = Chakra.DialogHeader;
const ModalCloseButton: any = Chakra.DialogCloseTrigger;
const ModalBody: any = Chakra.DialogBody;
const Button: any = Chakra.Button;
const Input: any = Chakra.Input;

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function AuthModal({ isOpen, onClose }: Props) {
  const { login } = useAuth();

  const [tab, setTab] = useState<"login" | "signup">("login");

  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  const [signinEmail, setSigninEmail] = useState("");
  const [signinPassword, setSigninPassword] = useState("");

  // Simple fallback toast
  const toast = (msg: string) => {
    if (typeof window !== "undefined") alert(msg);
  };

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

      if (res.message === "user created successfully") {
        toast("Signup Successful");
        login({
          name: res.user.name,
          email: res.user.email,
          id: res.user.id,
        });
        resetSignup();
        onClose();
      } else {
        toast(res.error || "Signup failed");
      }
    } catch (e) {
      toast("Signup failed");
    }
  };

  const handleSignin = async () => {
    try {
      const res = await signin(signinEmail, signinPassword);

      if (res.message === "signin successful") {
        toast("Login Successful");
        login({
          name: res.user.name,
          email: res.user.email,
          id: res.user.id,
        });
        resetSignin();
        onClose();
      } else {
        toast(res.error || "Login failed");
      }
    } catch (e) {
      toast("Login failed");
    }
  };

  return (
    <Modal open={isOpen} onOpenChange={(o: boolean) => !o && onClose()}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Welcome</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <div style={{ display: "flex", gap: "8px", marginBottom: "1rem" }}>
            <Button
              colorScheme={tab === "login" ? "teal" : undefined}
              onClick={() => setTab("login")}
            >
              Login
            </Button>
            <Button
              colorScheme={tab === "signup" ? "teal" : undefined}
              onClick={() => setTab("signup")}
            >
              Sign Up
            </Button>
          </div>

          {tab === "login" ? (
            <div>
              <label>Email</label>
              <Input
                value={signinEmail}
                onChange={(e: any) => setSigninEmail(e.target.value)}
                type="email"
                placeholder="Email"
                style={{ marginBottom: 10 }}
              />

              <label>Password</label>
              <Input
                value={signinPassword}
                onChange={(e: any) => setSigninPassword(e.target.value)}
                type="password"
                placeholder="Password"
                style={{ marginBottom: 10 }}
              />

              <Button width="100%" colorScheme="teal" onClick={handleSignin}>
                Login
              </Button>
            </div>
          ) : (
            <div>
              <label>Full Name</label>
              <Input
                value={signupName}
                onChange={(e: any) => setSignupName(e.target.value)}
                placeholder="Full name"
                style={{ marginBottom: 10 }}
              />

              <label>Email</label>
              <Input
                value={signupEmail}
                onChange={(e: any) => setSignupEmail(e.target.value)}
                type="email"
                placeholder="Email"
                style={{ marginBottom: 10 }}
              />

              <label>Password</label>
              <Input
                value={signupPassword}
                onChange={(e: any) => setSignupPassword(e.target.value)}
                type="password"
                placeholder="Password"
                style={{ marginBottom: 10 }}
              />

              <Button width="100%" colorScheme="teal" onClick={handleSignup}>
                Sign Up
              </Button>
            </div>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
