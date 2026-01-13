'use client'
import React from 'react'
import { Box, Flex, Heading, Text, Circle, Stack, Icon } from '@chakra-ui/react'
import { useLenis } from '@studio-freight/react-lenis'

const HowItWorks = () => {
    const lenis = useLenis();

    const handleScroll = () => {
        lenis?.scrollTo('#faq', {
            duration: 1.5,
            offset: -100,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });
    };

    const steps = [
        {
            tag: "Upload",
            title: "Feed the Vault",
            desc: "Drag and drop your PDFs, lecture notes, or ebooks. Gemini AI reads your content and categorizes it instantly.",
            color: "teal.500"
        },
        {
            tag: "Analyze",
            title: "Deep Dive Analysis",
            desc: "Our AI extracts the most important concepts and creates a structured knowledge graph of your files.",
            color: "blue.500"
        },
        {
            tag: "Master",
            title: "Track Your Growth",
            desc: "Monitor accuracy trends and study hours on a beautiful, data-driven dashboard.",
            color: "purple.500"
        }
    ];

    return (
        <Box id="howItWorks" py="32" px={{ base: "6", md: "20" }} bg="white">
            <Flex direction={{ base: "column", lg: "row" }} align="start" gap="20">
                
                {/* Left Side: Sticky Header */}
                <Box position={{ lg: "sticky" }} top="32" flex="1">
                    <Heading fontSize={{ base: "4xl", lg: "6xl" }} fontWeight="bold" letterSpacing="tighter" color="gray.900">
                        HOW IT <Text as="span" color="teal.600">WORKS</Text>
                    </Heading>
                    <Text mt="6" fontSize="xl" color="gray.500" maxW="md">
                        Your path from messy notes to subject mastery in three automated steps.
                    </Text>
                    
                    {/* Scroll Button */}
                    <Box mt="12" display={{ base: "none", lg: "block" }}>
                        <Box 
                            as="button" 
                            onClick={handleScroll}
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            w="12"
                            h="12"
                            borderRadius="full"
                            border="2px solid"
                            borderColor="teal.600"
                            color="teal.600"
                            cursor="pointer"
                            transition="all 0.3s"
                            _hover={{ bg: "teal.50", transform: "translateY(5px)" }}
                        >
                             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                <path d="M19 13l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </Box>
                    </Box>
                </Box>

                {/* Right Side: Step Content */}
                <Stack gap="20" flex="1.2">
                    {steps.map((step, i) => (
                        <Box 
                            key={i} 
                            p="10" 
                            borderRadius="3xl" 
                            bg="gray.50" 
                            borderWidth="1px" 
                            borderColor="gray.100"
                            transition="transform 0.4s"
                            _hover={{ transform: "scale(1.02)", shadow: "xl" }}
                        >
                            <Circle size="12" bg={step.color} color="white" fontWeight="bold" mb="6">
                                {i + 1}
                            </Circle>
                            <Text color={step.color} fontWeight="bold" textTransform="uppercase" fontSize="xs" letterSpacing="widest" mb="2">
                                {step.tag}
                            </Text>
                            <Heading size="lg" mb="4">{step.title}</Heading>
                            <Text fontSize="lg" color="gray.600" lineHeight="tall">
                                {step.desc}
                            </Text>
                            
                            {/* Visual Placeholder for a "Mockup" or Image */}
                            <Box 
                                mt="8" 
                                h="48" 
                                bg="white" 
                                borderRadius="2xl" 
                                borderStyle="dashed" 
                                borderWidth="2px" 
                                borderColor="gray.200"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                            >
                                <Text fontSize="xs" color="gray.400" textTransform="uppercase">Visual for {step.tag}</Text>
                            </Box>
                        </Box>
                    ))}
                </Stack>
            </Flex>
        </Box>
    )
}

export default HowItWorks;