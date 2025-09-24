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
import { signup, fetchUsers} from "../../services/api";

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
        } else if(response.error=='user already exists') {
          toast({
            title: "Signup failed",
            description: response.error || "Please try again",
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
                  <Input type="email" placeholder="Enter email" />
                </FormControl>
                <FormControl mb={4}>
                  <FormLabel>Password</FormLabel>
                  <Input type="password" placeholder="Enter password" />
                </FormControl>
                <Button colorScheme="teal" width="100%">
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
