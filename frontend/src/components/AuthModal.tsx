"use client";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  FormControl,
  FormLabel,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,useToast,
} from "@chakra-ui/react";
import {useState, useEffect} from "react";
import { signup, signin, fetchUsers} from "../../services/api";

type AuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const[name, setName] = useState("");
  const[email, setEmail] = useState("");
  const[password, setPassword] = useState("");
  const toast = useToast();

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
  
  const resetFields = () => {
    setName("");
    setEmail("");
    setPassword("");
  };

  const handleSignup = async () => {
      try {
        const response = await signup(name, email, password);
        console.log("Signup response:", response);

        if (response.message=='user created successfully') {
          toast({
            title: "Account created.",
            description: "You have signed up successfully!",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          onClose();
          resetFields();
        } else if(response.error && response.error.includes("already exists")) {
          toast({
            title: "user already exists, try login",
            description: "Please try login instead",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        } else {
          toast({
            title: "Signup failed",
            description: response.error || "Please try again",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      } catch (err: any) {
        toast({
          title: "Error",
          description: err.message || "Signup failed",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    };

    const handleSignin = async () => {
      try {
        const response = await signin(email, password);
        console.log("Signin response:", response);

        if (response.message=='signin successful') {
          toast({
            title: "Login successful.",
            description: "You have logged in successfully!",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          onClose();
          resetFields();
        } else {
          toast({
            title: "Login failed",
            description: response.error || "Please try again",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
          resetFields();
        }
      } catch (err: any) {
        toast({
          title: "Error",
          description: err.message || "Login failed",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
          resetFields();
      }
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
                  <Input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" placeholder="Enter email" />
                </FormControl>
                <FormControl mb={4}>
                  <FormLabel>Password</FormLabel>
                  <Input value={password} onChange={(e)=>setPassword(e.target.value)}type="password" placeholder="Enter password" />
                </FormControl>
                <Button colorScheme="teal" width="100%" onClick={handleSignin}>
                  Login
                </Button>
              </TabPanel>
              <TabPanel>

                <FormControl mb={4}>
                  <FormLabel>Full Name</FormLabel>
                  <Input value={name} onChange={(e)=> setName(e.target.value)} placeholder="Your name" />
                </FormControl>
                <FormControl mb={4}>
                  <FormLabel>Email</FormLabel>
                  <Input value={email} onChange={(e)=> setEmail(e.target.value)} type="email" placeholder="Enter email" />
                </FormControl>
                <FormControl mb={4}>
                  <FormLabel>Password</FormLabel>
                  <Input value={password} onChange={(e)=> setPassword(e.target.value)} type="password" placeholder="Create password" />
                </FormControl>
                <Button colorScheme="teal" width="100%" onClick={handleSignup}>
                  Sign Up
                </Button>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
