'use client'
import React from 'react'
import NextLink from 'next/link' // Import Next.js Link with a different name
import { Box, Flex, Grid, Heading, List, Text, Link as ChakraLink } from '@chakra-ui/react'

const Footer = () => {
    return (
        <Box as="footer" bg="white" borderTopWidth="1px" borderColor="gray.100" pt="20" pb="10" px={{ base: "6", md: "10" }}>
            <Box maxW="1600px" mx="auto">
                <Grid templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }} gap="12">
                    {/* Brand Block */}
                    <Box gridColumn={{ lg: "span 2" }} display="flex" flexDirection="column" alignItems={{ base: "center", sm: "start" }} textAlign={{ base: "center", sm: "left" }}>
                        <Heading size="md" color="teal.700">LearnVault</Heading>
                        <Text color="gray.500" maxW="sm" mt="6">
                            The ultimate AI-powered study companion. Upload your notes, let Gemini organize your knowledge, and master any subject.
                        </Text>
                    </Box>

                    {/* Product Column */}
                    <Box>
                        <Heading as="h4" fontSize="xs" fontWeight="bold" color="gray.900" mb="6" textTransform="uppercase">
                            Product
                        </Heading>
                        <List.Root gap="3" variant="plain" listStyle="none" color="gray.600" fontSize="sm">
                            <List.Item>
                                {/* Use asChild to merge Chakra styling with Next.js navigation */}
                                <ChakraLink asChild _hover={{ color: 'teal.600' }}>
                                    <NextLink href="#features">Features</NextLink>
                                </ChakraLink>
                            </List.Item>
                            <List.Item>
                                <ChakraLink asChild _hover={{ color: 'teal.600' }}>
                                    <NextLink href="#howItWorks">How it works</NextLink>
                                </ChakraLink>
                            </List.Item>
                            <List.Item>
                                <ChakraLink asChild _hover={{ color: 'teal.600' }}>
                                    <NextLink href="#faq">FAQ</NextLink>
                                </ChakraLink>
                            </List.Item>
                        </List.Root>
                    </Box>

                    {/* Get Started Column */}
                    <Box>
                        <Heading as="h4" fontSize="xs" fontWeight="bold" color="gray.900" mb="6" textTransform="uppercase">
                            Join Us
                        </Heading>
                        <List.Root gap="3" variant="plain" listStyle="none" color="gray.600" fontSize="sm">
                            <List.Item>
                                <ChakraLink asChild _hover={{ color: 'teal.600' }}>
                                    <NextLink href="/auth/signin">Sign In</NextLink>
                                </ChakraLink>
                            </List.Item>
                            <List.Item>
                                <ChakraLink asChild _hover={{ color: 'teal.600' }}>
                                    <NextLink href="/auth/signup">Create Account</NextLink>
                                </ChakraLink>
                            </List.Item>
                        </List.Root>
                    </Box>
                </Grid>

                {/* Bottom Bar */}
                <Flex mt="20" pt="8" borderTopWidth="1px" borderColor="gray.100" direction={{ base: "column", md: "row" }} justifyContent="space-between" alignItems="center" gap="6" color="gray.400" fontSize="xs">
                    <Text>© 2026 LearnVault AI. Built for the future of education.</Text>
                    <Flex wrap="wrap" justifyContent="center" gap="8">
                        <Flex alignItems="center" gap="2">
                            <Box w="1.5" h="1.5" bg="green.400" borderRadius="full" />
                            AI Engines Online
                        </Flex>
                        <Text cursor="pointer" _hover={{ color: "gray.600" }}>Privacy Policy</Text>
                        <Text cursor="pointer" _hover={{ color: "gray.600" }}>Terms</Text>
                    </Flex>
                </Flex>
            </Box>
        </Box>
    )
}

export default Footer