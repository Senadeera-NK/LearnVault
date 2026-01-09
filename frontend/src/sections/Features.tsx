'use client'
import React from 'react'
import { Box, Heading, Text, Flex, Image, defineKeyframes } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { useLenis } from '@studio-freight/react-lenis'

const Features = () => {
    const lenis = useLenis();
    
    const handleScroll = () => {
        lenis?.scrollTo('#howItWorks', {
            duration: 1.5,
            offset: -100,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });
    };

    // Animation Variants for Cards
    const cardVariants = {
        initial: (yValue: number) => ({ opacity: 0, y: yValue }),
        whileInView: { opacity: 1, y: 0 },
    };

    return (
        <Box 
            id="features" 
            as="section" 
            pt={{ base: "10", lg: "20" }} 
            pb="10"
            bg="white" 
            px={{ base: "6", md: "10" }}
        >
            {/* Main Heading */}
            <Heading 
                as="h2" 
                fontSize={{ base: "5xl", lg: "6xl" }} 
                fontWeight="semibold" 
                textTransform="uppercase" 
                color="teal.800"
            >
                Features
            </Heading>
            <Text 
                mt="3" 
                fontSize={{ base: "base", md: "xl", lg: "2xl" }} 
                fontWeight="extrabold" 
                letterSpacing="tight"
            >
                Built for teams that actually get things done.
            </Text>

            {/* Feature Cards Container */}
            <Flex direction="column" gap="20" mt="20">
                
                {/* 1st Card - Slide Up */}
                <Box
                    as={motion.section}
                    display="flex"
                    flexDirection={{ base: "column", md: "row" }}
                    p="8"
                    width={{ base: "100%", lg: "75%" }}
                    ml="auto"
                    height={{ base: "auto", md: "450px" }}
                    bgGradient="to-br"
                    gradientFrom="gray.400"
                    gradientVia="slate.100"
                    gradientTo="neutral.500"
                    borderWidth="1px"
                    borderColor="gray.300"
                    borderRadius="40px"
                    shadow="xl"
                    overflow="hidden"
                >
                    <Box order={{ base: 2, md: 1 }} width={{ base: "100%", md: "60%" }} display="flex" flexDirection="column" justifyContent="center" pr={{ md: "6" }}>
                        <Heading as="h3" fontSize="3xl" mb="8" fontWeight="bold">Escape the Noise with Dedicated Workspaces</Heading>
                        <Text fontWeight="semibold" mb="4">
                            Stop searching through endless global channels. Group your conversations, files, and milestones by project. 
                            Everything has its own home.
                        </Text>
                        <Text display={{ base: "none", md: "block" }} fontWeight="semibold" fontSize="sm" opacity="0.8">
                            Focus on one project at a time, zero distractions.
                        </Text>
                    </Box>
                    <Box order={{ base: 1, md: 2 }} h={{ base: "48", md: "full" }} width={{ base: "100%", md: "40%" }} borderRadius="3xl" overflow="hidden">
                        <Image src="/images/groupsection.png" alt="Workspace" w="full" h="full" />
                    </Box>
                </Box>

                {/* 2nd Card - Slide Down */}
                <Box
                    as={motion.section}
                    variants={cardVariants}
                    display="flex"
                    flexDirection={{ base: "column", md: "row" }}
                    p="8"
                    width={{ base: "100%", lg: "75%" }}
                    mr="auto"
                    height={{ base: "auto", md: "450px" }}
                    bgGradient="to-br"
                    gradientFrom="gray.400"
                    gradientVia="slate.100"
                    gradientTo="neutral.500"
                    borderWidth="1px"
                    borderColor="gray.300"
                    borderRadius="40px"
                    shadow="xl"
                    overflow="hidden"
                >
                    <Box width={{ base: "100%", md: "40%" }} h={{ base: "48", md: "full" }} borderRadius="3xl" overflow="hidden">
                        <Image src="/images/groupsection.png" alt="Tasks" w="full" h="full" />
                    </Box>
                    <Box width={{ base: "100%", md: "60%" }} display="flex" flexDirection="column" justifyContent="center" pl={{ md: "10" }} mt={{ base: "6", md: "0" }}>
                        <Heading as="h3" fontSize="3xl" mb="8" fontWeight="bold">Turn "We should do this" into "Done."</Heading>
                        <Text fontWeight="semibold" mb="4">
                            Ideas often die in the chat thread. With CollabChat, you can turn any message into a tracked task with a single click.
                        </Text>
                        <Text display={{ base: "none", md: "block" }} fontWeight="semibold" fontSize="sm" opacity="0.8">
                            Close the gap between talking about work and actually doing it.
                        </Text>
                    </Box>
                </Box>

            </Flex>

            {/* Scroll Button */}
            <Flex justify="center" w="full" mt="20">
                <Box as="button" onClick={handleScroll} cursor="pointer" bg="transparent" border="none">
                    <Flex
                        style={{
                            animationDuration: "2s",
                            animationIterationCount: "infinite"
                        } as React.CSSProperties}
                        borderWidth="1px"
                        borderStyle="solid"
                        borderColor="teal.700"
                        borderRadius="full"
                        p="2"
                        h="10"
                        w="10"
                        color="teal.700"
                        alignItems="center"
                        justifyContent="center"
                    >
                         <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M19 13l-7 7-7-7m14-8l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </Flex>
                </Box>
            </Flex>
        </Box>
    )
}

export default Features;