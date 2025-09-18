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

type AuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
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
                  <Input placeholder="Your name" />
                </FormControl>
                <FormControl mb={4}>
                  <FormLabel>Email</FormLabel>
                  <Input type="email" placeholder="Enter email" />
                </FormControl>
                <FormControl mb={4}>
                  <FormLabel>Password</FormLabel>
                  <Input type="password" placeholder="Create password" />
                </FormControl>
                <Button colorScheme="teal" width="100%">
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
