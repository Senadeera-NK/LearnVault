"use client";

import * as React from "react";
import { Box, Card, Text } from "@chakra-ui/react";
import { PieChart } from "@mui/x-charts";

export default function FileCategoryChart() {
  const desktopOS = [
    { label: "Windows", value: 72.72 },
    { label: "OS X", value: 16.38 },
    { label: "Linux", value: 3.83 },
    { label: "Chrome OS", value: 2.42 },
    { label: "Other", value: 4.65 },
  ];

  const valueFormatter = (item: { value: number }) => `${item.value}%`;

  return (
    <Card p={4} height="250px" width="250px" position="relative">
      <Box
        sx={{
          transform: "rotate(-90deg)", // Rotate to make it appear as half donut
          overflow: "hidden",
          height: "125px", // half height
        }}
      >
        <PieChart
          series={[
            {
              type: "pie" as const,
              data: desktopOS,
              highlightScope: { fade: "global", highlight: "item" },
              faded: { innerRadius: 40, additionalRadius: -40, color: "gray" },
              valueFormatter,
            },
          ]}
          height={250}
          width={250}
        />
      </Box>
      <Text
        fontWeight="bold"
        position="absolute"
        top="75%"
        left="50%"
        transform="translate(-50%, -50%)"
      >
        OS Share
      </Text>
    </Card>
  );
}
