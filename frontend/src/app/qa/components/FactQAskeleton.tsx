"use client";

import {   Box,VStack,Text,Textarea } from "@chakra-ui/react";
import { useState } from "react";

interface FactQAItem {
    question:string;
    answer:string;
}
interface FactQAskeletonProps{
    data:FactQAItem[];
    checkAnswerTrigger:number;
}
export default function FactQAskeleton({ data, checkAnswerTrigger }:FactQAskeletonProps){
    const [userAnswer, setUserAnswer] = useState<Record<number, string>>({});
    return(
            <VStack align="stretch" spacing={3}>
                {data.map((qa,index)=>(
                    <Box key={index} p={3} border="1px solid" borderColor="gray.200" w="100%">
                        <Text fontWeight="semibold" pb={3}>{index+1}. {qa.question}</Text>
                            <Textarea
                                placeholder="Write the answer here..."
                                size="md"
                                minH="40px"
                                />
                    </Box>
                ))}
            </VStack>
    );
}