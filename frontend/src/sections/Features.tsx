'use client'
import React from 'react'
import { Box, Grid, GridItem, Heading, Text, Badge, Stack } from '@chakra-ui/react'

const Features = () => {
  return (
    <Box id="features" py="32" px={{ base: "6", md: "20" }} bg="white" maxW="1200px" mx="auto">
      {/* Centered Heading Section */}
      <Stack gap="4" mb="16" textAlign="center" align="center">
        <Badge colorPalette="teal" variant="surface" px="3" py="1" borderRadius="full">
          Capabilities
        </Badge>
        <Heading 
          fontSize={{ base: "3xl", md: "5xl" }} 
          fontWeight="bold" 
          letterSpacing="tight"
          lineHeight="1.1"
        >
          Master Any <Text as="span" color="teal.600">Subject.</Text>
        </Heading>
        <Text color="gray.500" fontSize="xl" maxW="2xl">
          LearnVault combines Gemini AI with intuitive organization to turn raw notes into a personal knowledge base.
        </Text>
      </Stack>

      {/* Bento Box Grid - Centered */}
      <Grid
        templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
        gap="6"
      >
        <GridItem colSpan={2} bg="teal.600" borderRadius="3xl" p="10" color="white">
          <Heading size="lg" mb="4">AI Auto-Categorization</Heading>
          <Text opacity="0.9" fontSize="lg">Gemini analyzes your uploads and organizes them into logical folders automatically.</Text>
        </GridItem>
        
        <GridItem bg="gray.900" borderRadius="3xl" p="8" color="white">
          <Heading size="md" mb="2">OCR Support</Heading>
          <Text fontSize="sm" color="gray.400">Scan handwritten notes with 99% accuracy.</Text>
        </GridItem>
        
        <GridItem bg="gray.50" borderRadius="3xl" p="8" border="1px solid" borderColor="gray.200">
          <Heading size="md" mb="2">Flashcards</Heading>
          <Text fontSize="sm" color="gray.600">Spaced repetition built directly into your vault.</Text>
        </GridItem>
        
        <GridItem colSpan={2} bg="teal.50" borderRadius="3xl" p="10" border="1px solid" borderColor="teal.100">
          <Heading size="lg" color="teal.800" mb="4">Instant Q&A Generation</Heading>
          <Text color="teal.700" fontSize="lg">Transform any PDF into a full-scale mock exam tailored to your material.</Text>
        </GridItem>
      </Grid>
    </Box>
  )
}

export default Features;