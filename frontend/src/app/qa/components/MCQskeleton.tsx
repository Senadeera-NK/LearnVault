"use client";

import {   Box,Button,VStack,Text } from "@chakra-ui/react";
import { useState } from "react";

interface MCQItem {
    question:string;
    options:string[];
    answer:string;
}

interface MCQskeletonProps{
    data:MCQItem[];
}
export default function MCQskeleton({ data }:MCQskeletonProps){
    const [selectedAnswer, setSelectedAnswer]=useState<Record<number, string>>({});
    const handleclick = (questionIndex:number, value:string) =>{
        setSelectedAnswer((prev)=>({...prev, [questionIndex]:value}));
    };

    return(
        <VStack align="stretch" spacing={3}>
            {data.map((qa,index)=>(
                <Box key={index} p={3} border="1px solid" borderColor="gray.200">
                    <Text fontWeight="semibold" pb={3}>{index+1}. {qa.question}</Text>
                    <VStack align="stretch" spacing={2}>
                    {qa.options?.map((opt,i)=>{
                        const isSelected = selectedAnswer[index]===opt;
                        return(
                        <Button key={i}
                        width="100%"
                        pb="2"
                        justifyContent="flex-start"
                        variant="solid"
                        white-space="normal"
                        wordBreak="break-word"
                        colorScheme={isSelected?"blue":"gray"}
                        onClick={()=>handleclick(index,opt)}
                        >{i+1}. {opt}</Button>
                        );
                    }
                    )}
                    </VStack>
                </Box>
            ))}
        </VStack>
    );
}