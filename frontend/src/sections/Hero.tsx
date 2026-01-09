'use client'

import React from 'react'
import Link from 'next/link'
import {
  Box,
  Heading,
  Text,
  Flex,
  defineKeyframes,
} from '@chakra-ui/react'
import { useLenis } from '@studio-freight/react-lenis'

// Keyframes (Chakra v3–correct)

const Hero = () => {
  const lenis = useLenis()

  const handleScroll = () => {
    lenis?.scrollTo('#features', {
      duration: 1.5,
      offset: -100,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    })
  }

  return (
    <Box
      as="section"
      position="relative"
      minH="80vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      p="5"
      overflow="hidden"
    >
      {/* Background Ripples */}
      <Box
        position="absolute"
        inset="0"
        display={{ base: 'none', lg: 'flex' }}
        pointerEvents="none"
        zIndex="0"
      >
        <Box position="absolute" top="50%" right="-20" transform="translateY(-50%)">
          {[0, 1, 2].map((i) => (
            <Box
              key={i}
              position="absolute"
              h="64"
              w="64"
              borderRadius="full"
              borderWidth="30px"
              borderStyle="solid"
              borderColor={
                i === 0 ? 'green.100' : i === 1 ? 'green.200' : 'green.300'
              }

            />
          ))}
        </Box>
      </Box>

      {/* Content */}
      <Flex
        position="relative"
        zIndex="10"
        direction="column"
        align="center"
      >
        <Heading
          as="h1"
          fontSize={{ base: '4xl', md: '7xl' }}
          mt="40"
          fontWeight="bold"
        >
          <Box as="span" color="teal.600">
            Upload once. {' '}
          </Box>
          
          <Box as="span" color="green.500">
            {' '}
             Learn Forever.{' '}
          </Box>
        </Heading>

        <Text mt="8" maxW="2xl" fontSize="xl" color="gray.600">
LearnVault transforms your PDFs and notes into interactive study sessions. Generate deep-dive questions from your own materials and verify your understanding with instant feedback.        </Text>

        <Box mt="20" mb="20">
          <Link href="/auth/signup">
            <Box
              as="button"
              px="8"
              py="4"
              borderWidth="2px"
              borderColor="green.500"
              color="green.500"
              fontWeight="bold"
              transition="all 0.3s"
              _hover={{ bg: 'green.500', color: 'white' }}
            >
              GET STARTED for Free
            </Box>
          </Link>
        </Box>

        {/* Scroll Indicator */}
        <Box as="button" onClick={handleScroll} bg="transparent" border="none">
          <Flex
            borderWidth="1px"
            borderColor="teal.600"
            borderRadius="full"
            p="2"
            h="10"
            w="10"
            color="teal.600"
            align="center"
            justify="center"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                d="M19 13l-7 7-7-7m14-8l-7 7-7-7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Flex>
        </Box>
      </Flex>
    </Box>
  )
}

export default Hero
