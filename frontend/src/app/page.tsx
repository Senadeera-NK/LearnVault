"use client";
import React, { useState } from "react";
import AuthModal from "../components/AuthModal";
import { Box, Button, Heading, Text, VStack, Container } from "@chakra-ui/react";

export default function Home() {
  const [showAuth, setShowAuth] = useState(false);

  return (
    <Box as="main" minH="100vh" bg="white">
      {/* Hero Section */}
      <Container maxW="container.lg" pt={20} textAlign="center">
        <VStack gap={6}>
          <Heading fontSize="5xl" fontWeight="extrabold">
            Welcome to LearnVault
          </Heading>
          <Text fontSize="xl" color="gray.600" maxW="2xl">
            A powerful platform for managing your documents, generating Q&A using AI, 
            and tracking your learning progress in real-time.
          </Text>
          
          <Box pt={10}>
            <Button 
              size="lg" 
              colorScheme="teal" 
              onClick={() => setShowAuth(true)}
              fontSize="xl"
              px={10}
            >
              Get Started
            </Button>
          </Box>
        </VStack>
      </Container>

      {/* Recruiter Note Section */}
      <Box bg="gray.50" mt={20} py={20}>
        <Container maxW="container.md">
          <Heading size="md" mb={4}>Why LearnVault?</Heading>
          <Text>
            Built with Next.js, Chakra UI, and a dedicated backend, this project 
            demonstrates full-stack capabilities including real-time data visualization, 
            secure authentication, and automated file classification.
          </Text>
        </Container>
      </Box>

      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
    </Box>
  );
}