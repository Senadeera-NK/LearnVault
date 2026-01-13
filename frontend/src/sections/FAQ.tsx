'use client'
import { Accordion, Box, Heading, Text, Badge, Stack } from '@chakra-ui/react'

const FAQ = () => {
  const faqs = [
    { q: "How does the automatic categorization work?", a: "We use the Gemini API to analyze the text content of your uploads and match them with existing categories automatically." },
    { q: "What file formats are supported?", a: "Currently, LearnVault supports PDF and standard text files for question generation." },
    { q: "Can I track my progress over time?", a: "Yes! Your home dashboard shows your study hours and accuracy trends." }
  ];

  return (
    <Box id="faq" py="20" px={{ base: "6", md: "10" }} maxW="8xl" mx="auto">
      
      {/* --- ONLY HEADING CHANGED BELOW --- */}
      <Stack gap="4" mb="12" textAlign="center" align="center">
        <Badge colorPalette="teal" variant="outline" px="3" py="1" borderRadius="full">
          Support
        </Badge>
        <Heading 
          fontSize={{ base: "3xl", md: "5xl" }} 
          fontWeight="extrabold" 
          letterSpacing="tight"
        >
          Frequently Asked <Text as="span" color="teal.600">Questions</Text>
        </Heading>
        <Text color="gray.500" fontSize="lg" maxW="2xl">
          Everything you need to know about setting up your vault and mastering your studies with AI.
        </Text>
      </Stack>
      {/* --- END OF HEADING CHANGE --- */}

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