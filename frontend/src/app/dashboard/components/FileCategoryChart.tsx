"use client";

import { Box, Text, HStack, VStack } from "@chakra-ui/react";
import { PieChart } from "@mui/x-charts";
import { useState, useEffect, useRef } from "react";
import {fetch_user_pdfs} from "../../../../api/api";

interface fileRecord{
  id: number;
  user_id:number;
  file_url:string;
  category:string;
  uploaded_at:string;
  classification_status:string;
}
interface fileCategory{
  file_url:string;
  category:string;
}

interface FileCategoryChartProps{
  userId:string;
  onStats?:(stats:{totalFiles:number})=>void;
}
export default function FileCategoryChart({userId, onStats}: FileCategoryChartProps) {
  const [data, setData] = useState<{label:string; value:number}[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [chartWidth, setChartWidth] = useState(400);

  const colors = ["#1976d2", "#9c27b0", "#43a047", "#ff9800", "#9e9e9e"];

  useEffect(() => {
    const fetchData = async ()=>{
      try{
        const result = await fetch_user_pdfs(parseInt(userId));
        const files: fileRecord[]=result.details ||[];

        //count files per category
        const counts: Record<string, number> = {};
        files.forEach((f)=>{
          if(f.category) counts[f.category] = (counts[f.category] ||0) +1;
        });
        const total = files.length;
        if (onStats) onStats({totalFiles:total});
        //convert to array of, label, and value(percentage)
        const formatted = Object.entries(counts).map(([category, count])=>({
          label:category,
          value:total? (count/total)*100:0,
        }));
        setData(formatted);
      }
      catch(err){
        console.error(err);
      }
    };

    fetchData();
    //resizing function
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
  }, [userId]);

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
              data: data,
              startAngle: -90,
              endAngle: 90,
              innerRadius,
              outerRadius,
              cx,
              cy,
              highlightScope: { fade: "global", highlight: "item" },
              valueFormatter: (item: any) => `${item.value.toFixed(1)}%`,
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
          {data.map((d, i) => (
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
