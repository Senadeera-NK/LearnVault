"use client";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Button,
  FormControl,
  FormLabel,
  Input,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useToast
} from "@chakra-ui/react";
import { useState } from "react";
import { neon_signup, neon_signin,neon_oauth } from "../../services/api";
import { useAuth } from "./AuthContext";

type AuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function NeonAuthModal({ isOpen, onClose }: AuthModalProps) {
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signinEmail, setSigninEmail] = useState("");
  const [signinPassword, setSigninPassword] = useState("");

  const toast = useToast();
  const { login } = useAuth();

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
      const response = await neon_signup(signupName, signupEmail, signupPassword);
      if (response.message === "user created successfully") {
        login({ name: response.user.name, email: response.user.email, id: response.user.id });
        toast({ title: "Account created.", status: "success", duration: 3000 });
        onClose();
        SignupResetFields();
      } else {
        toast({ title: "Signup failed", description: response.error, status: "error", duration: 3000 });
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message, status: "error", duration: 3000 });
    }
  };

  const handleSignin = async () => {
    try {
      const response = await neon_signin(signinEmail, signinPassword);
      if (response.message === "signin successful") {
        login({ name: response.user.name, email: response.user.email, id: response.user.id });
        toast({ title: "Login successful", status: "success", duration: 3000 });
        onClose();
        SigninResetFields();
      } else {
        toast({ title: "Login failed", description: response.error, status: "error", duration: 3000 });
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message, status: "error", duration: 3000 });
    }
  };

  const handleOAuthLogin = (provider: "google" | "github") => {
    // This opens the backend OAuth route in a new tab
    window.open(`${process.env.NEXT_PUBLIC_API_URL}/oauth/${provider}`, "_blank");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Welcome</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Tabs isFitted variant="enclosed">
            <TabList mb="1em">
              <Tab>Login</Tab>
              <Tab>Sign Up</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <FormControl mb={4}>
                  <FormLabel>Email</FormLabel>
                  <Input value={signinEmail} onChange={(e) => setSigninEmail(e.target.value)} type="email" placeholder="Enter email" />
                </FormControl>
                <FormControl mb={4}>
                  <FormLabel>Password</FormLabel>
                  <Input value={signinPassword} onChange={(e) => setSigninPassword(e.target.value)} type="password" placeholder="Enter password" />
                </FormControl>
                <Button colorScheme="teal" width="100%" mb={2} onClick={handleSignin}>Login</Button>
                <Button colorScheme="red" width="100%" mb={2} onClick={() => neon_oauth("google")}>Login with Google</Button>
                <Button colorScheme="gray" width="100%" onClick={() => neon_oauth("github")}>Login with GitHub</Button>
              </TabPanel>
              <TabPanel>
                <FormControl mb={4}>
                  <FormLabel>Full Name</FormLabel>
                  <Input value={signupName} onChange={(e) => setSignupName(e.target.value)} placeholder="Your name" />
                </FormControl>
                <FormControl mb={4}>
                  <FormLabel>Email</FormLabel>
                  <Input value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} type="email" placeholder="Enter email" />
                </FormControl>
                <FormControl mb={4}>
                  <FormLabel>Password</FormLabel>
                  <Input value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} type="password" placeholder="Create password" />
                </FormControl>
                <Button colorScheme="teal" width="100%" onClick={handleSignup}>Sign Up</Button>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
