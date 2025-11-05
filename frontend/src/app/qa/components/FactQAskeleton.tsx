"use client";

import {   Box,Heading,Button,VStack,Text,IconButton,Portal, } from "@chakra-ui/react";

interface FactQAItem {
    question:string;
    answer:string;
}

interface FactQAskeletonProps{
    data:FactQAItem[];
}
export default function FactQAskeleton({ data }:FactQAskeletonProps){
    return(
        <Box w="100%">
            <VStack align="stretch" spacing={3}>
                {data.map((qa,index)=>(
                    <Box key={index} p={3} border="1px solid" borderColor="gray.200" w="100%">
                        <Text fontWeight="semibold">{qa.question}</Text>
                        <Text color="green.600" mt={2}>{qa.answer}</Text>
                    </Box>
                ))}
            </VStack>
        </Box>
    );
}