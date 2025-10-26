"use client";

import { Box, Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface PageUsageChartProps {
  userId: string;
}

interface PageUsageData {
  page: string;
  views: number;
}

export default function PageUsageChart({ userId }: PageUsageChartProps) {
  const [data, setData] = useState<PageUsageData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching data
    const fetchData = async () => {
      setLoading(true);
      // Replace this with your real API call
      const dummyData = Array.from({ length: 10 }, (_, i) => ({
        page: `Page ${i + 1}`,
        views: Math.floor(Math.random() * 50),
      }));
      setData(dummyData);
      setLoading(false);
    };
    fetchData();
  }, [userId]);

  if (loading) return <Spinner />;

  return (
    <Box width="100%" height="100%">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="page" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="views" fill="#3182CE" />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}
