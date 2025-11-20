"use client";

import {   Box,VStack,Text,Textarea } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import stringSimilarity from "string-similarity";

interface FactQAItem {
    question:string;
    answer:string;
}
interface FactQAskeletonProps{
    data:FactQAItem[];
    checkAnswerTrigger:number;
    refreshTrigger:number;
}
export default function FactQAskeleton({ data, checkAnswerTrigger,refreshTrigger }:FactQAskeletonProps){
    const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
    const [results, setResults] = useState<Record<number, string>>({});

    const handleChange = (index:number, value:string)=>{
        setUserAnswers((prev)=>({...prev,[index]:value}));
    };

    useEffect(()=>{
        if(checkAnswerTrigger>0){
            checkAnswer();
        }
    },[checkAnswerTrigger]);

    // useEffect for refreshing
    useEffect(()=>{
        setUserAnswers({});
        setResults({});
    },[refreshTrigger]);

    const checkAnswer = ()=>{
        const newResults: Record<number, string>={};
        data.forEach((qa,index)=>{
            const userAnswer = userAnswers[index]||"";
            const similarity = stringSimilarity.compareTwoStrings(
                userAnswer.toLowerCase(),
                qa.answer.toLowerCase()
            );

            if (similarity>0.9) newResults[index]="correct";
            else if (similarity>0.6) newResults[index]="nearly correct";
            else newResults[index] ="incorrect";
        });
        setResults(newResults);
    }

    return(
            <VStack align="stretch" gap={3}>
                {data.map((qa,index)=>(
                    <Box key={index} p={3} border="1px solid" borderRadius="md"
                    borderColor={
                        results[index]==="correct"
                        ?"green.400"
                        :results[index]==="nearly correct"
                        ?"yellow.400"
                        :results[index]==="incorrect"
                        ?"red.400"
                        :"gray.200"
                    }
                    bg={
                        results[index]==="correct"
                        ?"green.100"
                        :results[index]==="nearly correct"
                        ?"yellow.100"
                        :results[index]==="incorrect"
                        ?"red.100"
                        :"white"
                    }
                    w="100%">
                        <Text fontWeight="semibold" pb={3}>{index+1}. {qa.question}</Text>
                            <Textarea
                                value = {userAnswers[index]||""}
                                onChange={(e)=>handleChange(index,e.target.value)}
                                placeholder="Write the answer here..."
                                size="md"
                                minH="40px"
                                borderColor="gray.300"
                                _focus={{ borderColor: "gray.400", boxShadow: "none" }}
                                />
                    </Box>
                ))}
            </VStack>
    );
}