"use client";

import { Box, VStack, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {fetchUserUsage} from "../../../../api/api";
import { selectorChartDrawingArea } from "@mui/x-charts/internals";

interface UsageRecord{
  id:number;
  user_id:number;
  date: string;
  hours: number;
  page_name:string;
  created_at:string;
}

interface PageUsageData {
  page: string;
  hours: number;
}

interface PageUsageChartProps {
  userId: string;
}

export default function PageUsageChart({ userId }: PageUsageChartProps) {
  const [data, setData] = useState<PageUsageData[]>([]);

  useEffect(() => {
    // Simulate fetching data
    const fetchData = async () => {
      try{
        const result= await fetchUserUsage(parseInt(userId));
        const response: UsageRecord[] = result.usage ||[];

        //group and sub hours by page_name
        const grouped: Record<string, number> = {};
        response.forEach((record)=>{
          if(record.page_name){
            grouped[record.page_name]=(grouped[record.page_name]||0) + record.hours;
          }
        });

        // convert to array
        const formattedData = Object.entries(grouped).map(([page,hours])=>({
          page,hours,
        }));
        //sort by total hours descending
        formattedData.sort((a,b)=>b.hours - a.hours);

        setData(formattedData);
      }catch(err){
        console.error(err);
      }
    };
      fetchData();
    }, [userId]);

//total hours
const totalHours = data.reduce((sum,d)=>sum + d.hours, 0);
  return (
    <VStack spacing={4} align="stretch" p={4} width="100%" mt={6}>
      {data.map((d) => {
        const percent = totalHours ? (d.hours/totalHours) * 100:0;

        return (
          <Box
            key={d.page}
            position="relative"
            height="48px"
            borderRadius="md"
            overflow="hidden"
            role="group" // allows hover styles inside
          >
            {/* Background bar only visible on hover */}
            <Box
              position="absolute"
              top={0}
              left={0}
              width="100%"
              height="100%"
              bg="gray.200"
              borderRadius="md"
              opacity={0} // hidden by default
              _groupHover={{ opacity: 1 }} // show on hover
              transition="opacity 0.3s"
            />

            {/* Filled Bar */}
            <Box
              bg="teal.400"
              width={`${percent}%`}
              height="100%"
              borderRadius="md"
              transition="width 0.3s"
              display="flex"
              alignItems="center"
              px={2}
              position="relative" // keep above background
            >
              <Text
              position="absolute"
              left="8px"
              top="40%"
              transform="translateY(-50%)"
              fontSize="sm"
              fontWeight="bold"
              color="blackAlpha.800"
              zIndex={2}
              whiteSpace="nowrap" //to prevent line breaks
              overflow="hidden" //optional, cut off if too long
              textOverflow="ellipsis"
              >
                {d.page}
              </Text>
            </Box>

            {/* Value at end */}
            <Text
              position="absolute"
              right="8px"
              top="50%"
              transform="translateY(-50%)"
              fontSize="sm"
              fontWeight="bold"
              color="blackAlpha.800"
            >
              {d.hours.toFixed(2)} hrs ({percent.toFixed(1)}%)
            </Text>
          </Box>
        );
      })}
      {totalHours > 0 && (
        <Text fontSize="sm" color="gray.500" textAlign="right" mt={2}>
          Total: {totalHours.toFixed(2)} hrs
        </Text>
      )}
    </VStack>
  );
}
