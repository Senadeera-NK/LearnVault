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
  TabPanel,
} from "@chakra-ui/react";
import {useState} from "react";
import { signup } from "../../services/api";

type AuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const[name, setName] = useState("");
  const[email, setEmail] = useState("");
  const[password, setPassword] = useState("");

  const handleSignup = async () => {
    // Handle sign up logic here
    try {
    const response = await signup(name, email, password);
    console.log("Signing up with:", { name, email, password });
    if(response.message) alert(response.message);
    } catch (err: any){
      alert(err.message || "signup failed");
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
