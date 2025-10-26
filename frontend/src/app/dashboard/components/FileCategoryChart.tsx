"use client";

import { Box, Text, HStack, VStack } from "@chakra-ui/react";
import { PieChart } from "@mui/x-charts";

export default function FileCategoryChart() {
  const desktopOS = [
    { label: "Windows", value: 72.72 },
    { label: "OS X", value: 16.38 },
    { label: "Linux", value: 3.83 },
    { label: "Chrome OS", value: 2.42 },
    { label: "Other", value: 4.65 },
  ];

  const colors = ["#1976d2", "#9c27b0", "#43a047", "#ff9800", "#9e9e9e"];

  return (
    <Box p={4} display="flex" flexDirection="column" alignItems="center">
      <Box
        sx={{
          overflow: "visible",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          // hide built-in legend
          "& .MuiChartsLegend-root": {
            display: "none",
          },
        }}
      >
        <PieChart
          series={[
            {
              type: "pie" as const,
              data: desktopOS,
              startAngle: -90,
              endAngle: 90,
              innerRadius: 100,
              outerRadius: 220,
              cx: 400,
              cy: 220,
              highlightScope: { fade: "global", highlight: "item" },
              valueFormatter: (item: any) => `${item.value}%`,
            },
          ]}
          height={240}
          width={800}
        />
      </Box>

      {/* Chart title */}
      <Text fontWeight="bold" mt={1}>
        OS Share
      </Text>

      {/* Bottom custom legend — only labels */}
      <VStack spacing={1} mt={1} width="100%">
        <HStack wrap="wrap" spacing={3} justify="center">
          {desktopOS.map((d, i) => (
            <HStack key={d.label} spacing={1}>
              <Box
                w="12px"
                h="12px"
                borderRadius="2px"
                bg={colors[i % colors.length]}
              />
              <Text fontSize="sm">{d.label}</Text>
            </HStack>
          ))}
        </HStack>
      </VStack>
    </Box>
  );
}
