'use client'
import React from 'react'
import Link from 'next/link'
import { Box, Flex, Grid, Heading, List, Text, defineKeyframes } from '@chakra-ui/react'


const Footer = () => {
    return (
        <Box 
            as="footer" 
            bg="gray.50" 
            borderTopWidth="1px" 
            borderColor="gray.200" 
            pt="20" 
            pb="10" 
            px={{ base: "6", md: "10" }}
        >
            <Box maxW="1200px" mx="auto">
                <Grid 
                    templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(5, 1fr)" }} 
                    gap="12"
                >
                    {/* Brand Block */}
                    <Box 
                        gridColumn={{ lg: "span 2" }} 
                        display="flex"
                        flexDirection="column" 
                        alignItems={{ base: "center", sm: "start" }}
                        textAlign={{ base: "center", sm: "left" }}
                    >
                        <Heading size="md">CollabChat</Heading>
                        <Text color="gray.500" maxW="sm" mt="6">
                            The workspace that combines real-time chat with structured project management.
                            Stop chatting about work and start finishing it.
                        </Text>
                    </Box>

                    {/* Product Column */}
                    <Box>
                        <Heading as="h4" fontSize="sm" fontWeight="bold" color="gray.900" mb="6" textTransform="uppercase" letterSpacing="wider">
                            Product
                        </Heading>
                        <List.Root gap="4" variant="plain" listStyle="none">
                            <List.Item><Link href="#features">Features</Link></List.Item>
                            <List.Item><Link href="#howItWorks">How it works</Link></List.Item>
                            <List.Item><Link href="#faq">FAQ</Link></List.Item>
                        </List.Root>
                    </Box>

                    {/* Company Column */}
                    <Box>
                        <Heading as="h4" fontSize="sm" fontWeight="bold" color="gray.900" mb="6" textTransform="uppercase" letterSpacing="wider">
                            Company
                        </Heading>
                        <List.Root gap="4" variant="plain" listStyle="none">
                            {/* Use standard anchor tags inside List.Item for external links to avoid href errors */}
                            <List.Item><a href="#" style={{ color: 'inherit' }}>Instagram</a></List.Item>
                            <List.Item><a href="#" style={{ color: 'inherit' }}>Facebook</a></List.Item>
                            <List.Item><a href="#" style={{ color: 'inherit' }}>Twitter (X)</a></List.Item>
                        </List.Root>
                    </Box>

                    {/* Get Started Column */}
                    <Box>
                        <Heading as="h4" fontSize="sm" fontWeight="bold" color="gray.900" mb="6" textTransform="uppercase" letterSpacing="wider">
                            Get Started
                        </Heading>
                        <List.Root gap="4" variant="plain" listStyle="none">
                            <List.Item><Link href="/auth/signin">Sign In</Link></List.Item>
                            <List.Item><Link href="/auth/signup">Create Account</Link></List.Item>
                            <List.Item><Link href="#pricing">Pricing</Link></List.Item>
                        </List.Root>
                    </Box>
                </Grid>

                {/* Bottom Bar */}
                <Flex 
                    mt="20" 
                    pt="8" 
                    borderTopWidth="1px" 
                    borderColor="gray.200" 
                    direction={{ base: "column", md: "row" }} 
                    justifyContent="space-between" 
                    alignItems="center" 
                    gap="6" 
                    color="gray.400" 
                    fontSize="sm"
                >
                    <Text textAlign={{ base: "center", md: "left" }} order={{ base: 2, md: 1 }}>
                        © 2026 CollabChat. All rights reserved.
                    </Text>

                    <Flex wrap="wrap" justifyContent="center" gap={{ base: "6", md: "8" }} order={{ base: 1, md: 2 }}>
                        <Flex alignItems="center" gap="2">
                            <Box 
                                w="2" 
                                h="2" 
                                bg="green.500" 
                                borderRadius="full" 
                            />
                            Systems Normal
                        </Flex>
                        <Text cursor="pointer">Privacy</Text>
                        <Text cursor="pointer">Terms</Text>
                    </Flex>
                </Flex>
            </Box>
        </Box>
    )
}

export default Footer