"use client";

import {Box,Button,VStack,Text,HStack, Stack} from "@chakra-ui/react";
import { useState } from "react";

interface TrueFalseItem {
    question:string;
    answer:string;
}

interface TrueFalseSkeletonProps{
    data:TrueFalseItem[];
}
export default function TrueFalseSkeleton({ data }:TrueFalseSkeletonProps){
    const [selectedAnswer, setSelectedAnswer] = useState<Record<number, string>>({});
    const handleSelect = (index:number, value:string) =>{
        setSelectedAnswer((prev)=>({...prev,[index]:value,}));
    };

    return(
        <VStack align="stretch" spacing={3}>
            {data.map((qa,index)=>(
                <Box key={index} p={3} border="1px solid" borderColor="gray.200">
                    <Text fontWeight="semibold" pb={2}>{index+1}. {qa.question}</Text>
                    <HStack align="stretch" spacing={2}>
                        <Button value="true" colorScheme={selectedAnswer[index]==="true"?"blue":"gray"} onClick={()=>handleSelect(index, "true")}>True</Button>
                        <Button value="true" colorScheme={selectedAnswer[index]==="false"?"brown":"gray"} onClick={()=>{handleSelect(index, "false")}}>False</Button>
                    </HStack>
                </Box>
            ))}
        </VStack>
    );
}