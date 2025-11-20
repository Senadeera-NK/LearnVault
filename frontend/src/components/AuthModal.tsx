"use client";

import * as Chakra from "@chakra-ui/react";

// Cast Chakra components to `any` where typings differ in installed @chakra-ui/react
const Modal: any = Chakra.DialogRoot;
const ModalOverlay: any = Chakra.DialogBackdrop;
const ModalContent: any = Chakra.DialogContent;
const ModalHeader: any = Chakra.DialogHeader;
const ModalCloseButton: any = Chakra.DialogCloseTrigger;
const ModalBody: any = Chakra.DialogBody;
const ModalFooter: any = Chakra.DialogFooter;
const Button: any = Chakra.Button;
const Input: any = Chakra.Input;
const FormControl: any = null;
const FormLabel: any = null;

import { useState, useEffect } from "react";
import { signup, signin, fetchUsers} from "../../api/api";
import {useAuth} from "./AuthContext";

type AuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const[signupName, setSignupName] = useState("");
  const[signupEmail, setSignupEmail] = useState("");
  const[signupPassword, setSignupPassword] = useState("");

  const[signinPassword, setSigninPassword] = useState("");
  const[signinEmail, setSigninEmail] = useState("");

  // simple fallback toast replacement while aligning to Chakra v3 types
  const showToast = (opts: { title?: string; description?: string; status?: string }) => {
    try {
      if (typeof window !== 'undefined') {
        // basic alert as a fallback
        window.alert(`${opts.title || ''}\n${opts.description || ''}`);
      } else {
        console.log('TOAST', opts);
      }
    } catch (e) {
      console.log('TOAST', opts);
    }
  };

  // creating a variable for AuthContext
  const {login} = useAuth();

   useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await fetchUsers();
        console.log("📌 Users from backend:", data.users);
      } catch (err) {
        console.error("❌ Failed to fetch users:", err);
      }
    };

    loadUsers();
  }, []);
  
  const SignupResetFields = () => {
    setSignupName("");
    setSignupEmail("");
    setSignupPassword("");
  };
  const SigninResetFields = () => {
    setSigninEmail("");
    setSigninPassword("");
  };

  const handleSignup = async () => {
      try {
        const response = await signup(signupName, signupEmail, signupPassword);
        console.log("Signup response:", response);

        if (response.message=='user created successfully') {
          showToast({ title: "Account created.", description: "You have signed up successfully!", status: "success" });
          login({name:response.user.name, email:response.user.email, id:response.user.id})
          onClose();
          SignupResetFields();
        } else if(response.error && response.error.includes("already exists")) {
          showToast({ title: "user already exists, try login", description: "Please try login instead", status: "error" });
        } else {
          showToast({ title: "Signup failed", description: response.error || "Please try again", status: "error" });
        }
      } catch (err: any) {
        showToast({ title: "Error", description: err.message || "Signup failed", status: "error" });
      }
    };

    const handleSignin = async () => {
      try {
        const response = await signin(signinEmail, signinPassword);
        console.log("Signin response:", response);

        if (response.message=='signin successful') {
          showToast({ title: "Login successful.", description: "You have logged in successfully!", status: "success" });
          login({name:response.user.name, email:response.user.email, id:response.user.id})
          onClose();
          SigninResetFields();
        } else {
          showToast({ title: "Login failed", description: response.error || "Please try again", status: "error" });
          SigninResetFields();
        }
      } catch (err: any) {
        showToast({ title: "Error", description: err.message || "Login failed", status: "error" });
          SigninResetFields();
      }
    };

  const [activeTab, setActiveTab] = useState<'login'|'signup'>('login');

  return (
    <Modal open={isOpen} onOpenChange={(open: boolean) => { if (!open) onClose(); }} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Welcome</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <div style={{ display: 'flex', gap: 8, marginBottom: '1em' }}>
            <Button colorScheme={activeTab === 'login' ? 'teal' : undefined} onClick={() => setActiveTab('login')}>Login</Button>
            <Button colorScheme={activeTab === 'signup' ? 'teal' : undefined} onClick={() => setActiveTab('signup')}>Sign Up</Button>
          </div>

          {activeTab === 'login' ? (
            <div>
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', marginBottom: 6 }}>Email</label>
                <Input value={signinEmail} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSigninEmail(e.target.value)} type="email" placeholder="Enter email" />
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', marginBottom: 6 }}>Password</label>
                <Input value={signinPassword} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSigninPassword(e.target.value)} type="password" placeholder="Enter password" />
              </div>
              <Button colorScheme="teal" width="100%" onClick={handleSignin}>Login</Button>
            </div>
          ) : (
            <div>
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', marginBottom: 6 }}>Full Name</label>
                <Input value={signupName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSignupName(e.target.value)} placeholder="Your name" />
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', marginBottom: 6 }}>Email</label>
                <Input value={signupEmail} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSignupEmail(e.target.value)} type="email" placeholder="Enter email" />
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', marginBottom: 6 }}>Password</label>
                <Input value={signupPassword} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSignupPassword(e.target.value)} type="password" placeholder="Create password" />
              </div>
              <Button colorScheme="teal" width="100%" onClick={handleSignup}>Sign Up</Button>
            </div>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
