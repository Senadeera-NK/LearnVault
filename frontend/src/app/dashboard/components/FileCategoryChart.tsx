"use client";

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

  return (
    <Card p={4} height="250px" width="250px" position="relative">
      <Box
        sx={{
          transform: "rotate(-90deg)",
          overflow: "hidden",
          height: "125px",
          width: "100%",
        }}
      >
        <PieChart
          series={[
            {
              type: "pie" as const,
              data: desktopOS,
              highlightScope: { fade: "global", highlight: "item" },
              faded: { innerRadius: 40, additionalRadius: -40, color: "gray" },
              valueFormatter: (item: any) => `${item.value}%`,
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
