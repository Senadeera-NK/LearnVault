"use client";

import { Box, Text, HStack, VStack } from "@chakra-ui/react";
import { PieChart } from "@mui/x-charts";
import { useState, useEffect, useRef } from "react";

export default function FileCategoryChart() {
  const desktopOS = [
    { label: "Windows", value: 72.72 },
    { label: "OS X", value: 16.38 },
    { label: "Linux", value: 3.83 },
    { label: "Chrome OS", value: 2.42 },
    { label: "Other", value: 4.65 },
  ];

  const colors = ["#1976d2", "#9c27b0", "#43a047", "#ff9800", "#9e9e9e"];
  const containerRef = useRef<HTMLDivElement>(null);
  const [chartWidth, setChartWidth] = useState(400);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        // Container width minus some padding
        let width = containerRef.current.offsetWidth - 32;
        // Cap max width
        width = Math.min(width, 500);
        setChartWidth(width);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Donut sizing
  const outerRadius = chartWidth / 2.5; // smaller proportion so it doesn't get huge
  const innerRadius = outerRadius / 2;
  const cx = chartWidth / 2;
  const cy = outerRadius + 20; // enough space for half-donut
  const chartHeight = cy + 60; // leave extra room for bottom legend

  return (
    <Box
      p={4}
      display="flex"
      flexDirection="column"
      alignItems="center"
      ref={containerRef}
      width="100%"
    >
      <Box
        sx={{
          overflow: "visible",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          "& .MuiChartsLegend-root": { display: "none" }, // hide built-in legend
        }}
      >
        <PieChart
          series={[
            {
              type: "pie" as const,
              data: desktopOS,
              startAngle: -90,
              endAngle: 90,
              innerRadius,
              outerRadius,
              cx,
              cy,
              highlightScope: { fade: "global", highlight: "item" },
              valueFormatter: (item: any) => `${item.value}%`,
            },
          ]}
          width={chartWidth}
          height={chartHeight}
        />
      </Box>

      {/* <Text fontWeight="bold" mt={1}>
        OS Share
      </Text> */}

      {/* Bottom legend */}
      <VStack spacing={1} mt={-2} width="100%">
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
