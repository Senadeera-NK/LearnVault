'use client'
import React from 'react'
import { Box, Grid, GridItem, Heading, Text, Badge, Stack } from '@chakra-ui/react'

const Features = () => {
  return (
    <Box py="32" px="6" maxW="1200px" mx="auto" id="features">
      {/* Highlighted Header Section */}
      <Stack gap="4" mb="16" textAlign="center" align="center">
        <Badge colorPalette="teal" variant="surface" px="3" py="1" borderRadius="full">
          Capabilities
        </Badge>
        <Heading 
          fontSize={{ base: "4xl", md: "6xl" }} 
          fontWeight="extrabold" 
          letterSpacing="tight"
          lineHeight="1.1"
        >
          Everything you need to <br />
          <Text 
            as="span" 
            bgGradient="to-r" 
            gradientFrom="teal.500" 
            gradientTo="blue.600" 
            bgClip="text"
          >
            master any subject.
          </Text>
        </Heading>
        <Text color="gray.500" fontSize="xl" maxW="2xl">
          LearnVault combines powerful AI engines with intuitive organization to turn your raw notes into a personal knowledge base.
        </Text>
      </Stack>

      {/* Bento Box Grid */}
      <Grid
        templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
        templateRows={{ base: "auto", md: "repeat(2, 280px)" }}
        gap="6"
      >
        {/* Feature 1: The Big One */}
        <GridItem 
          colSpan={{ base: 1, md: 2 }} 
          bg="teal.600" 
          borderRadius="3xl" 
          p="10" 
          color="white"
          position="relative"
          overflow="hidden"
          _hover={{ transform: "translateY(-5px)", transition: "0.3s" }}
        >
          <Stack gap="4" maxW="md">
            <Heading size="xl">AI Auto-Categorization</Heading>
            <Text fontSize="lg" opacity="0.9">
              Gemini automatically analyzes the context of your uploads and organizes them into logical folders, so you never lose a document again.
            </Text>
          </Stack>
          {/* Subtle Decorative Circle */}
          <Box position="absolute" right="-10" bottom="-10" w="40" h="40" bg="whiteAlpha.200" borderRadius="full" />
        </GridItem>

        {/* Feature 2: Dark Accent */}
        <GridItem 
          bg="gray.900" 
          borderRadius="3xl" 
          p="8" 
          color="white"
          _hover={{ transform: "translateY(-5px)", transition: "0.3s" }}
        >
          <Heading size="md" mb="3">OCR Support</Heading>
          <Text color="gray.400" fontSize="sm">
            Handwritten notes? No problem. Our OCR engine extracts text from images and sketches with 99% accuracy.
          </Text>
        </GridItem>

        {/* Feature 3: Minimalist */}
        <GridItem 
          bg="gray.50" 
          borderWidth="1px" 
          borderColor="gray.200" 
          borderRadius="3xl" 
          p="8"
          _hover={{ bg: "white", shadow: "xl", transform: "translateY(-5px)", transition: "0.3s" }}
        >
          <Heading size="md" mb="3">Flashcards</Heading>
          <Text color="gray.600" fontSize="sm">
            Spaced repetition algorithms built directly into your vault. Master concepts while you sleep.
          </Text>
        </GridItem>

        {/* Feature 4: The Highlight */}
        <GridItem 
          colSpan={{ base: 1, md: 2 }} 
          bg="teal.50" 
          borderRadius="3xl" 
          p="10" 
          border="2px solid" 
          borderColor="teal.100"
          _hover={{ transform: "translateY(-5px)", transition: "0.3s" }}
        >
          <Stack gap="4">
            <Heading size="lg" color="teal.800">Instant Q&A Generation</Heading>
            <Text color="teal.700" fontSize="lg">
              Transform any PDF into a full-scale mock exam. Custom tailored questions based on your specific learning material.
            </Text>
          </Stack>
        </GridItem>
      </Grid>
    </Box>
  )
}

export default Features;