"use client";

import { useState } from "react";
//import { useUser } from "@stackframe/stack";
import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, Text } from "@chakra-ui/react";

interface NeonAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NeonAuthModal({ isOpen, onClose }: NeonAuthModalProps) {
  const user = useUser({ or: "redirect" });
  const [authError, setAuthError] = useState<string | null>(null);

  // Function to handle Google login
  const handleGoogleLogin = async () => {
    try {
      const account = user.useConnectedAccount("google", { or: "redirect" });
      // account is automatically connected & token is synced
      console.log("Google account connected:", account);
      onClose();
    } catch (error: any) {
      console.error("OAuth error:", error);
      setAuthError("Failed to connect Google account. Please try again.");
    }
  };

  // Function to handle Microsoft login (example)
  const handleMicrosoftLogin = async () => {
    try {
      const account = user.useConnectedAccount("microsoft", { or: "redirect" });
      console.log("Microsoft account connected:", account);
      onClose();
    } catch (error: any) {
      console.error("OAuth error:", error);
      setAuthError("Failed to connect Microsoft account. Please try again.");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Sign in with your account</ModalHeader>
        <ModalCloseButton />
        <ModalBody display="flex" flexDirection="column" gap={4}>
          {authError && <Text color="red.500">{authError}</Text>}

          <Button colorScheme="red" onClick={handleGoogleLogin}>
            Continue with Google
          </Button>

          <Button colorScheme="blue" onClick={handleMicrosoftLogin}>
            Continue with Microsoft
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
