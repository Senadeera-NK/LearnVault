'use client'
import React, {useRef,useEffect} from 'react'
import { Box, Flex, Heading, Text, Circle, Stack, Icon } from '@chakra-ui/react'
import { useLenis } from '@studio-freight/react-lenis'

const HowItWorks = () => {
    const lenis = useLenis();
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
    if (videoRef.current) {
        videoRef.current.play().catch(error => {
        console.error("Autoplay failed:", error);
        });
    }
    }, []);
    
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
            src:"/videos/shelf.mp4",
            title: "Feed the Vault",
            desc: "Drag and drop your PDFs, lecture notes, or ebooks. Gemini AI reads your content and categorizes it instantly.",
            color: "teal.500"
        },
        {
            tag: "Analyze",
            src:"/videos/qa.mp4",
            title: "Deep Dive Analysis",
            desc: "Our AI extracts the most important concepts and creates a structured knowledge graph of your files.",
            color: "blue.500"
        },
        {
            tag: "Master",
            src:"/videos/dashboard.mp4",
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
                    <Heading fontSize={{ base: "3xl", lg: "5xl" }} fontWeight="bold" letterSpacing="tighter" color="gray.900">
                        HOW IT <Text as="span" color="teal.600">WORKS</Text>
                    </Heading>
                    <Text mt="6" fontSize="xl" color="gray.500" maxW="md">
                        Your path from messy notes to subject mastery in three automated steps.
                    </Text>
                    
                    {/* Scroll Button */}
                    <Box mt="12" display={{ base: "none", lg: "block" }}>
        
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
                                h="68" 
                                bg="white"
                                overflow="hidden" 
                                borderRadius="2xl" 
                                borderStyle="dashed" 
                                borderWidth="2px" 
                                borderColor="gray.200"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                            >
                            <video
                                src={step.src}
                                ref={videoRef}
                                loop
                                muted
                                autoPlay
                                playsInline
                                style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover', 
                                }}
                            />                            
                            </Box>
                            </Box>
                            ))}
                </Stack>
            </Flex>
        </Box>
    )
}

export default HowItWorks;