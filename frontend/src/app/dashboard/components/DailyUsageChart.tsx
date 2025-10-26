"use client";

import { Box, Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface DailyUsageChartProps {
  userId: string;
}

interface DailyUsageData {
  day: string;
  hours: number;
}

export default function DailyUsageChart({ userId }: DailyUsageChartProps) {
  const [data, setData] = useState<DailyUsageData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const today = new Date();
      const dummyData = Array.from({ length: 30 }, (_, i) => ({
        day: `Day ${today.getDate() - i}`,
        hours: Math.floor(Math.random() * 5),
      })).reverse(); // Optional: oldest to newest
      setData(dummyData);
      setLoading(false);
    };
    fetchData();
  }, [userId]);

  if (loading) return <Spinner />;

  return (
    <Box width="100%" height="100%">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="hours" stroke="#38A169" />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
}