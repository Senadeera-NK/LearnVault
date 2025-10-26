"use client";

import { Box, VStack, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";

interface PageUsageData {
  page: string;
  views: number;
}

interface PageUsageChartProps {
  userId: string;
}

export default function PageUsageChart({ userId }: PageUsageChartProps) {
  const [data, setData] = useState<PageUsageData[]>([]);

  useEffect(() => {
    // Simulate fetching data
    const fetchData = async () => {
      const dummyData: PageUsageData[] = [
        { page: "Dashboard", views: 120 },
        { page: "Shelf", views: 75 },
        { page: "Q & A", views: 45 },
        { page: "Settings", views: 30 },
      ];

      // Sort descending by views
      setData(dummyData.sort((a, b) => b.views - a.views));
    };

    fetchData();
  }, [userId]);

  const maxViews = Math.max(...data.map((d) => d.views), 1);

  return (
    <VStack spacing={4} align="stretch" p={4} width="100%" mt={6}>
      {data.map((d) => {
        const barWidthPercent = (d.views / maxViews) * 100;

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
              width={`${barWidthPercent}%`}
              height="100%"
              borderRadius="md"
              transition="width 0.3s"
              display="flex"
              alignItems="center"
              px={2}
              position="relative" // keep above background
            >
              <Text fontSize="sm" color="white" fontWeight="bold" noOfLines={1}>
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
              {d.views}
            </Text>
          </Box>
        );
      })}
    </VStack>
  );
}
