'use client'
import React from 'react'
import { Box, Flex, Heading, Text, Circle, defineKeyframes, Image } from '@chakra-ui/react'
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

    const StepCard = ({ step, title, subtitle, items, videoPlaceholder }: any) => (
        <Box 
            w="full" 
            maxW="80%" 
            mb="20" 
            borderWidth="1px" 
            borderColor="gray.200" 
            borderRadius="40px" 
            p="8" 
            bg="gray.50" 
            position="relative" 
            overflow="hidden" 
            shadow="0 32px 64px -15px rgba(22, 101, 52, 0.2)"
        >
            <Box mb="10">
                <Text color="teal.600" fontWeight="bold" textTransform="uppercase" letterSpacing="widest" fontSize="sm">
                    {step}
                </Text>
                <Heading as="h2" size="xl" color="gray.900" mt="2" display={{ base: "none", md: "block" }}>
                    {title}
                </Heading>
            </Box>

            <Flex direction={{ base: "column", lg: "row" }} gap="12" alignItems="center">
                {/* Left Side: Media */}
                <Box 
                    w={{ base: "full", lg: "60%" }} 
                    aspectRatio="16/9" 
                    bg="gray.200" 
                    borderRadius="2xl" 
                    borderWidth="2px" 
                    borderStyle="dashed" 
                    borderColor="gray.300" 
                    display="flex" 
                    alignItems="center" 
                    justifyContent="center"
                >
                    <Text color="gray.400" fontWeight="medium">{videoPlaceholder}</Text>
                </Box>

                {/* Right Side: Steps */}
                <Box w={{ base: "full", lg: "40%" }} position="relative">
                    {/* Vertical Connecting Line */}
                    <Box 
                        position="absolute" 
                        left={{ base: "3", md: "4" }} 
                        top="2" 
                        bottom="2" 
                        w="2px" 
                        bg="green.200" 
                        zIndex="0" 
                    />

                    <Flex direction="column" gap={{ base: "10", lg: "20" }}>
                        {items.map((item: any, index: number) => (
                            <Flex key={index} gap="4" position="relative" zIndex="1">
                                <Circle 
                                    size={{ base: "6", md: "8" }} 
                                    bg="teal.700" 
                                    color="white" 
                                    fontSize="sm" 
                                    fontWeight="bold" 
                                    ring="6px" 
                                    ringColor="gray.50"
                                >
                                    {index + 1}
                                </Circle>
                                <Box>
                                    <Heading as="h4" size="md" color="gray.900">
                                        {item.label}
                                    </Heading>
                                    <Text color="gray.600" display={{ base: "none", lg: "block" }} mt="1" fontSize="lg">
                                        {item.desc}
                                    </Text>
                                </Box>
                            </Flex>
                        ))}
                    </Flex>
                </Box>
            </Flex>
            
            <Box position="absolute" bottom="-10" left="-10" w="40" h="40" bg="teal.300" opacity="0.1" borderRadius="full" filter="blur(40px)" />
        </Box>
    );

    return (
        <Flex id="howItWorks" direction="column" alignItems="center" py="24" bg="white" px={{ base: "6", md: "10" }}>
            <Box mb="16" w="full">
                <Heading fontSize={{ base: "5xl", lg: "6xl" }} fontWeight="semibold" textTransform="uppercase" color="teal.800">
                    How it Works?
                </Heading>
                <Text mt="3" fontSize={{ base: "lg", lg: "2xl" }} fontWeight="extrabold" letterSpacing="tight">
                    Your path from idea to done.
                </Text>
            </Box>

            <StepCard 
                step="Step 1: Set the Stage"
                title="Create Your Command Center"
                videoPlaceholder="Video Demonstration Placeholder"
                items={[
                    { label: "Secure Sign-up", desc: "Create your account in seconds via email or Google." },
                    { label: "Define Workspace", desc: "Set your Company and Project names to build your secure environment." },
                    { label: "Initialize", desc: "CollabChat auto-configures your channels and task boards instantly." }
                ]}
            />

            <StepCard 
                step="Step 2: Assemble the Team"
                title="Invite & Sync Instantly"
                videoPlaceholder="Video Demonstration Placeholder"
                items={[
                    { label: "Direct Invites", desc: "Add team members via email or a secure magic link." },
                    { label: "Automated Sync", desc: "New users are instantly mapped to your Company." }
                ]}
            />

            <StepCard 
                step="Step 3: Ship with Precision"
                title="Convert Talk into Tasks"
                videoPlaceholder="Video Demonstration Placeholder"
                items={[
                    { label: "Dynamic Assignment", desc: "Managers and Owners can create and assign tasks directly." },
                    { label: "Real-time Execution", desc: "Members receive task notifications in their personal dashboard." },
                    { label: "Verified Completion", desc: "Project status updates for everyone once marked as 'Done'." }
                ]}
            />

            <Box mt="16">
                <Box as="button" onClick={handleScroll} cursor="pointer" bg="transparent" border="none">
                    <Flex
                        style={{
                            animationDuration: "2s",
                            animationIterationCount: "infinite"
                        } as React.CSSProperties}
                        borderWidth="1px"
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
            </Box>
        </Flex>
    )
}

export default HowItWorks;