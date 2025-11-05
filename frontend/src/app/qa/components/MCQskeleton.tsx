"use client";

import {   Box,Button,VStack,Text,HStack } from "@chakra-ui/react";

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
        <VStack align="stretch" spacing={3}>
            {data.map((qa,index)=>(
                <Box key={index} p={3} border="1px solid" borderColor="gray.200">
                    <Text fontWeight="semibold">{index+1}. {qa.question}</Text>
                    {qa.options?.map((opt,i)=>(
                        <HStack align="stretch" spacing={2}>
                            <Button key={i} width="100%" pb="2" textAlign="left">{i+1}.{opt}</Button>
                        </HStack>
                    ))}
                </Box>
            ))}
        </VStack>
    );
}