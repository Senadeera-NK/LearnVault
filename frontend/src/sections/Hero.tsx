'use client'
import { Box, Button, Flex, Heading, Text, Image, Badge, Stack } from '@chakra-ui/react'
import AuthModal from '../components/AuthModal'; 
import { useState } from 'react';

interface HeroProps {
  onOpenAuth: () => void;
}
const Hero = ({onOpenAuth}:HeroProps) => {
    const [isAuthOpen, setIsAuthOpen] = useState(false);

  return (
    <Box bg="white" pt="32" pb="20" px={{ base: "6", md: "20" }}>
      <Flex direction={{ base: "column", lg: "row" }} align="center" maxW="1200px" mx="auto" gap="12">
        {/* Left Side: Content */}
        <Stack gap="6" flex="1" align={{ base: "center", lg: "start" }} textAlign={{ base: "center", lg: "left" }}>
          <Badge variant="subtle" colorPalette="teal" alignSelf={{ base: "center", lg: "start" }} px="3" py="1">
            Now Powered by Gemini 2.0
          </Badge>
          <Heading as="h1" size="4xl" lineHeight="tight" fontWeight="extrabold">
            Your Notes, <Text as="span" color="teal.600">Reimagined</Text> by AI.
          </Heading>
          <Text fontSize="lg" color="gray.600" maxW="lg">
            Stop scrolling through endless PDFs. LearnVault automatically categorizes your study materials and generates interactive quizzes to help you master concepts 3x faster.
          </Text>
          <Flex gap="4" direction={{ base: "column", sm: "row" }}>
            <Button size="xl" colorPalette="teal" px="8" onClick={onOpenAuth} >Start Learning Free</Button>
            <Button size="xl" variant="outline" px="8">Watch Demo</Button>
          </Flex>
        </Stack>

        {/* Right Side: Decorative Mockup */}
        <Box flex="1" w="full" position="relative">
          <Box 
            bg="teal.50" 
            borderRadius="3xl" 
            p="8" 
            borderWidth="1px" 
            borderColor="teal.100"
            boxShadow="2xl"
          >
            {/* You can replace this with a real image of your dashboard */}
            <Box bg="white" h="300px" borderRadius="xl" borderStyle="dashed" borderWidth="2px" borderColor="gray.200" display="flex" alignItems="center" justifyContent="center">
                <Text color="gray.400">App Dashboard Mockup</Text>
            </Box>
          </Box>
        </Box>
      </Flex>
            {/* <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} /> */}
    </Box>
  )
}
export default Hero;