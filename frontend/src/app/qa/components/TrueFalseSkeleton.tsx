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
        <VStack align="stretch" spacing={3}>
            {data.map((qa,index)=>(
                <Box key={index} p={3} border="1px solid" borderColor="gray.200">
                    <Text fontWeight="semibold" pb={2}>{index+1}. {qa.question}</Text>
                    <Button value="true">True</Button>
                    <Button value="false">False</Button>
                </Box>
            ))}
        </VStack>
    );
}