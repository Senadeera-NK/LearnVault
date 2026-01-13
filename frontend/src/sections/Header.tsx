'use client'
import React, { useState } from 'react';
import { Box, Flex, HStack, Heading, Link as ChakraLink, Stack } from '@chakra-ui/react';
import NextLink from 'next/link';
import AuthModal from '../components/AuthModal'; 

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  return (
    <>
      <Box
        as="header"
        position="fixed"
        top="4"
        left="50%"
        transform="translateX(-50%)"
        zIndex="100"
        w={{ base: "90%", md: "80%", lg: "90%" }}
        minW={{ lg: "1200px" }}
        bg="rgba(255, 255, 255, 0.8)"
        backdropFilter="blur(10px)"
        borderRadius="full"
        border="1px solid"
        borderColor="gray.200"
        boxShadow="0 4px 20px rgba(0, 0, 0, 0.05)"
        px="6"
        py="3"
      >
        <Flex align="center" justify="space-between">
          <Heading size="md" color="teal.700" letterSpacing="tight">
            LearnVault
          </Heading>

          <HStack as="nav" gap="8" display={{ base: "none", lg: "flex" }} mx="10">
            <ChakraLink asChild fontSize="sm" fontWeight="semibold" color="gray.600" _hover={{ color: "teal.600" }}>
              <NextLink href="#features">Features</NextLink>
            </ChakraLink>
            <ChakraLink asChild fontSize="sm" fontWeight="semibold" color="gray.600" _hover={{ color: "teal.600" }}>
              <NextLink href="#howItWorks">How It Works</NextLink>
            </ChakraLink>
            <ChakraLink asChild fontSize="sm" fontWeight="semibold" color="gray.600" _hover={{ color: "teal.600" }}>
              <NextLink href="#faq">FAQ</NextLink>
            </ChakraLink>
          </HStack>

          <HStack gap="4" display={{ base: "none", lg: "flex" }}>
            {/* SIGN IN - Triggers Modal */}
            <Box 
              as="button" 
              onClick={() => setIsAuthOpen(true)} 
              fontSize="sm" 
              fontWeight="bold" 
              cursor="pointer"
              _hover={{ color: "teal.600" }}
            >
              Sign In
            </Box>

            {/* GET STARTED - Triggers Modal */}
            <Box 
              as="button"
              onClick={() => setIsAuthOpen(true)}
              bg="teal.600" 
              color="white" 
              px="5" 
              py="2" 
              borderRadius="full" 
              fontSize="sm" 
              fontWeight="bold"
              _hover={{ bg: "teal.700" }}
              cursor="pointer"
            >
              Get Started
            </Box>
          </HStack>

          <Box display={{ base: "block", lg: "none" }} onClick={() => setIsOpen(!isOpen)} cursor="pointer">
              <Box w="6" h="0.5" bg="gray.800" mb="1.5" transition="0.3s" transform={isOpen ? "rotate(45deg) translate(5px, 5px)" : "none"} />
              <Box w="6" h="0.5" bg="gray.800" mb="1.5" opacity={isOpen ? 0 : 1} />
              <Box w="6" h="0.5" bg="gray.800" transition="0.3s" transform={isOpen ? "rotate(-45deg) translate(5px, -5px)" : "none"} />
          </Box>
        </Flex>

        {isOpen && (
          <Stack 
            display={{ base: "flex", lg: "none" }}
            position="absolute"
            top="120%"
            left="0"
            w="full"
            bg="white"
            p="6"
            borderRadius="2xl"
            border="1px solid"
            borderColor="gray.100"
            boxShadow="xl"
            gap="4"
          >
            <NextLink href="#features" onClick={() => setIsOpen(false)}>Features</NextLink>
            <NextLink href="#howItWorks" onClick={() => setIsOpen(false)}>How it Works</NextLink>
            <NextLink href="#faq" onClick={() => setIsOpen(false)}>FAQ</NextLink>
            <Box h="1px" bg="gray.100" />
            
            {/* MOBILE AUTH LINKS */}
            <Box as="button" textAlign="left" onClick={() => { setIsAuthOpen(true); setIsOpen(false); }}>
              Sign In
            </Box>
            <Box 
              as="button" 
              bg="teal.600" 
              color="white" 
              p="3" 
              textAlign="center" 
              borderRadius="xl"
              onClick={() => { setIsAuthOpen(true); setIsOpen(false); }}
            >
              Get Started
            </Box>
          </Stack>
        )}
      </Box>

      {/* --- ATTACHED MODAL --- */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
};

export default Header;