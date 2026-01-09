'use client'
import React, { useState } from 'react';
import { Box, Flex, HStack, List, BoxProps, IconButton, Image, Button } from '@chakra-ui/react';
import Link from 'next/link';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Box
      as="header"
      position="fixed"
      top="0"
      zIndex="50"
      w="full"
      py={{ base: "4", lg: "6" }}
      px="4"
      bg="white"
      borderBottom="1px solid"
      borderColor="zinc.100"
      transition="all 500ms"
    >
      <Flex
        mx="auto"
        h="14"
        alignItems="center"
        maxW="7xl"
        justifyContent="space-between"
      >
        {/* LOGO Placeholder */}
        <Box zIndex="60" p="1" mr="10" border="2px solid"  fontWeight="bold">LearnVault</Box>

        {/* NAVIGATION - Desktop */}
        <Flex display={{ base: "none", lg: "flex" }} flex="1" alignItems="center" justifyContent="space-between">
          <Box as="nav">
            <HStack as="ul" gap={{ lg: "8", xl: "12" }} listStyleType="none">
              <Link href="#features">
                <Box as="li" fontWeight="medium" cursor="pointer" _hover={{ color: "teal.600" }} whiteSpace="nowrap">
                  Features
                </Box>
              </Link>
              <Link href="#howItWorks">
                <Box as="li" fontWeight="medium" cursor="pointer" _hover={{ color: "teal.600" }} whiteSpace="nowrap">
                  How It Works
                </Box>
              </Link>
              <Link href="#faq">
                <Box as="li" fontWeight="medium" cursor="pointer" _hover={{ color: "teal.600" }} whiteSpace="nowrap">
                  FAQ
                </Box>
              </Link>
            </HStack>
          </Box>

          {/* Auth Buttons */}
          <HStack gap={{ base: "5", xl: "8" }}>
            <Link href="/auth/signin">
              <Box as="button" fontWeight="bold" fontSize="sm" cursor="pointer" _hover={{ color: "teal.600" }} whiteSpace="nowrap">
                SIGN IN
              </Box>
            </Link>
            <Link href="/auth/signup">
              <Box 
                as="button"
                border="2px solid" 
                borderColor="teal.700" 
                fontWeight="bold" 
                fontSize="sm" 
                px="6" 
                py="2"
                transition="300ms"
                whiteSpace="nowrap"
                _hover={{ bg: "teal.700", color: "white" }}
              >
                GET STARTED
              </Box>
            </Link>
          </HStack>
        </Flex>

        {/* MOBILE TOGGLE */}
        <Box 
          display={{ base: "block", lg: "none" }} 
          ml="auto" 
          zIndex="60" 
          cursor="pointer" 
          onClick={() => setIsOpen(!isOpen)}
        >
          <Image 
            src={`/images/${isOpen ? "delete" : "menu"}.png`} 
            alt="menu" 
            w="30px" 
            h="30px" 
          />
        </Box>

        {/* MOBILE MENU */}
        {isOpen && (
          <Box
            position="fixed"
            inset="0"
            display={{ base: "block", lg: "none" }}
            w="full"
            h="100vh"
            bg="white"
            zIndex="50"
            transition="500ms"
          >
            <Flex as="nav" flexDirection="column" alignItems="center" justifyContent="center" h="full">
              <Flex as="ul" flexDirection="column" gap={{ base: "10", md: "20" }} alignItems="center" listStyleType="none">
                <Link href="#features" onClick={() => setIsOpen(false)}>
                  <Box as="li" cursor="pointer" fontWeight="bold" fontSize={{ base: "2xl", md: "4xl" }}>Features</Box>
                </Link>
                <Link href="#howItWorks" onClick={() => setIsOpen(false)}>
                  <Box as="li" cursor="pointer" fontWeight="bold" fontSize={{ base: "2xl", md: "4xl" }}>How It Works</Box>
                </Link>
                <Link href="#faq" onClick={() => setIsOpen(false)}>
                  <Box as="li" cursor="pointer" fontWeight="bold" fontSize={{ base: "2xl", md: "4xl" }}>FAQ</Box>
                </Link>
                
                <Box as="hr" w="20" borderColor="gray.200" />

                <Link href="auth/signin" onClick={() => setIsOpen(false)}>
                  <Box as="li" cursor="pointer" fontSize={{ base: "xl", md: "4xl" }} fontWeight="bold" color="teal.700">Sign In</Box>
                </Link>
                <Link href="auth/signup" onClick={() => setIsOpen(false)}>
                  <Box as="li" cursor="pointer" fontSize={{ base: "xl", md: "4xl" }} fontWeight="bold" color="teal.700">Get Started</Box>
                </Link>
              </Flex>
            </Flex>
          </Box>
        )}
      </Flex>
    </Box>
  );
};

export default Header;