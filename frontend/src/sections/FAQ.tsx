'use client'
import { Accordion, Box, Heading } from '@chakra-ui/react'

const FAQ = () => {
  const faqs = [
    { q: "How does the automatic categorization work?", a: "We use the Gemini API to analyze the text content of your uploads and match them with existing categories automatically." },
    { q: "What file formats are supported?", a: "Currently, LearnVault supports PDF and standard text files for question generation." },
    { q: "Can I track my progress over time?", a: "Yes! Your home dashboard shows your study hours and accuracy trends." }
  ];

  return (
    <Box id="faq" py="20" px={{ base: "6", md: "10" }} maxW="8xl" mx="auto">
      <Heading mb="10" textAlign="center">Frequently Asked Questions</Heading>
      
      {/* In v3, allowToggle is now 'collapsible' */}
      <Accordion.Root collapsible defaultValue={[]}>
        {faqs.map((item, i) => (
          <Accordion.Item key={i} value={`item-${i}`} borderBottomWidth="1px">
            <Accordion.ItemTrigger py="4" cursor="pointer" _hover={{ bg: "gray.50" }} w="full">
              <Box flex="1" textAlign="left" fontWeight="bold">
                {item.q}
              </Box>
              <Accordion.ItemIndicator />
            </Accordion.ItemTrigger>
            
            <Accordion.ItemContent>
              <Box pb="4" pt="2" color="gray.600">
                {item.a}
              </Box>
            </Accordion.ItemContent>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </Box>
  )
}

export default FAQ;