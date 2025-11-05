"use client";

import {   Box,Heading,Button,VStack,Text,IconButton,Portal, } from "@chakra-ui/react";

interface TrueFalseItem {
    question:string;
    answer:string;
}

interface TrueFalseSkeletonProps{
    data:TrueFalseItem[];
}
export default function MCQskeleton({ data }:TrueFalseSkeletonProps){
    return(
        <VStack>
            {data.map((qa,index)=>(
                <Box key={index} p={3} border="1px solid" borderColor="gray.200">
                    <Text fontWeight="semibold">{qa.question}</Text>
                    <Text color="green.600" mt={2}>{qa.answer}</Text>
                </Box>
            ))}
        </VStack>
    );
}