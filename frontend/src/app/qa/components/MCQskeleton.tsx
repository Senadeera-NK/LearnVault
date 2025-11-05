"use client";

import {   Box,Heading,Button,VStack,Text,IconButton,Portal, } from "@chakra-ui/react";

interface MCQItem {
    question:string;
    options:string[];
    answer:string;
}

interface MCQskeletonProps{
    data:MCQItem[];
}
export default function MCQskeleton({ data }:MCQskeletonProps){
    return(
        <VStack>
            {data.map((qa,index)=>(
                <Box key={index} p={3} border="1px solid" borderColor="gray.200">
                    <Text fontWeight="semibold">{qa.question}</Text>
                    {qa.options?.map((opt,i)=>(
                        <Text key={i}>{opt}</Text>
                    ))}
                    <Text color="green.600" mt={2}>{qa.answer}</Text>
                </Box>
            ))}
        </VStack>
    );
}