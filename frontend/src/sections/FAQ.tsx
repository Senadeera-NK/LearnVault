'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
// Note: Container and Collapse may need to be imported from specific locations 
// or replaced with Box in v3
import { Box, Heading, Text, VStack, Button } from '@chakra-ui/react'

const faqs = [
    {
        q: "Is my 'LearnVault' dashboard private?",
        a: "Yes. Your personal dashboard is designed for individual focus. Your data remains yours."
    },
    {
        q: "How do I upload documents?",
        a: "You can use the floating '+' button in your dashboard to upload PDFs or create notes instantly."
    }
]

const FAQ = () => {
    const [active, setActive] = useState<number | null>(null);

    return (
        <Box as="section" id="faq" py="24" bg="white" px="6">
            {/* Using Box with maxW instead of Container if Container export is missing */}
            <Box maxW="1000px" mx="auto">
                <Box mb="16">
                    <Heading 
                        fontSize={{ base: "4xl", lg: "6xl" }} 
                        color="teal.600" 
                    >
                        COMMON QUESTIONS
                    </Heading>
                    <Text mt="3" fontSize="2xl" fontWeight="extrabold">
                        Everything you need to know.
                    </Text>
                </Box>

                <VStack gap="4" align="stretch" maxW="80%" mx="auto">
                    {faqs.map((faq, i) => (
                        <Box key={i} borderBottom="1px solid" borderColor="gray.200" pb="4">
                            <Button
                                variant="ghost"
                                width="full"
                                display="flex"
                                justifyContent="space-between"
                                py="8"
                                fontSize="xl"
                                fontWeight="bold"
                                onClick={() => setActive(active === i ? null : i)}
                                _hover={{ bg: "gray.50" }}
                            >
                                <Text as="span">{faq.q}</Text>
                                <Box as="span" color="teal.500">
                                    {active === i ? '−' : '+'}
                                </Box>
                            </Button>
                            
                            <AnimatePresence>
                                {active === i && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        style={{ overflow: 'hidden' }}
                                    >
                                        <Box pb="6" pt="2" color="gray.600" fontSize="lg">
                                            {faq.a}
                                        </Box>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </Box>
                    ))}
                </VStack>
            </Box>
        </Box>
    )
}

export default FAQ;