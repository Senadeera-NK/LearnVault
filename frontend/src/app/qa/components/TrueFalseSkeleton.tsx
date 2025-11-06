"use client";

import {Box,Button,VStack,Text,HStack, Stack} from "@chakra-ui/react";
import { useState,useEffect } from "react";

interface TrueFalseItem {
    question:string;
    answer:string;
}

interface TrueFalseSkeletonProps{
    data:TrueFalseItem[];
    checkAnswerTrigger:number;
}

export default function TrueFalseSkeleton({ data, checkAnswerTrigger }:TrueFalseSkeletonProps){
    const [selectedAnswer, setSelectedAnswer] = useState<Record<number, string>>({});
    const[result,setResult] = useState<Record<number, "correct"|"wrong"|"skipped">>({});

    const handleSelect = (index:number, value:string) =>{
        setSelectedAnswer((prev)=>({...prev,[index]:value,}));
    };

useEffect(()=>{
    if(checkAnswerTrigger===0) return;
    const newResults: Record<number, "correct"|"wrong"|"skipped">={};

    data.forEach((qa,index)=>{
        const userAnswer = selectedAnswer[index];

        if(!userAnswer){
            newResults[index] ="skipped";
        } else if(userAnswer.toLowerCase()===qa.answer.toLowerCase()){
            newResults[index] = "correct";
        }else{
            newResults[index] = "wrong";
        }
    });
    setResult(newResults);
},[checkAnswerTrigger]);

    return(
        <VStack align="stretch" spacing={3}>
            {data.map((qa,index)=>{
                const status = result[index];
                return(
                <Box key={index} p={3} border="1px solid"
                borderColor={
                    status === "correct"
                    ?"green.400"
                    :status==="wrong"
                    ?"red.400"
                    :"gray.200"
                }
                bg={
                    status==="correct"
                    ?"green.50"
                    :status==="wrong"
                    ?"red.50"
                    :"white"
                }
                >
                    <Text fontWeight="semibold" pb={2}>{index+1}. {qa.question}</Text>
                    <HStack align="stretch" spacing={2}>
                        <Button value="true" colorScheme={selectedAnswer[index]==="true"?"blue":"gray"} onClick={()=>handleSelect(index, "true")}>True</Button>
                        <Button value="true" colorScheme={selectedAnswer[index]==="false"?"blue":"gray"} onClick={()=>{handleSelect(index, "false")}}>False</Button>
                    </HStack>
                </Box>
            )})}
        </VStack>
    );
}