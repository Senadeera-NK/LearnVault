"use client";

import { useEffect, useState } from "react";
import { Button, VStack, Input } from "@chakra-ui/react";

interface GoogleSignInProps{
  onUser:(data:{userName:String;userEmail:string})=>void;
}
export default function Googlesignin({ onUser }: GoogleSignInProps) {
  const [showButton, setShowButton] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");

  // Show button after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowButton(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleGoogleSignIn = () => {
    // For now, just store values in variables
    const name = "Test User"; // simulate getting name from Google
    const email = "test@example.com"; // simulate getting email from Google

    setUserName(name);
    setUserEmail(email);

    // send back to parent
    onUser({ userName: name, userEmail: email });
  };

  if (!showButton) return null;

  return (
    <VStack spacing={4}>
      <Button colorScheme="blue" onClick={handleGoogleSignIn}>
        Sign in with Google
      </Button>
      {userName && userEmail && (
        <div>
          <p>Name: {userName}</p>
          <p>Email: {userEmail}</p>
        </div>
      )}
    </VStack>
  );
}