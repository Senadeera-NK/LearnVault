"use client";

import { Box, Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
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
      })).reverse();
      setData(dummyData);
      setLoading(false);
    };
    fetchData();
  }, [userId]);

  if (loading) return <Spinner />;

  return (
    <Box width="100%" height="100%">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
        >
          <defs>
            <linearGradient id="gradientHours" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38A169" stopOpacity={0.6} />
              <stop offset="100%" stopColor="#38A169" stopOpacity={0} />
            </linearGradient>
          </defs>

          {/* Only horizontal line */}
          <CartesianGrid horizontal={false} vertical={false} strokeDasharray="3 3" />

          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />

          <Area
            type="linear"          // straight lines instead of monotone curve
            dataKey="hours"
            stroke="#38A169"
            fill="url(#gradientHours)"
            strokeWidth={2}
            dot={{ r: 4, stroke: '#38A169', fill: '#38A169' }} // pointy dots
          />
        </AreaChart>
      </ResponsiveContainer>
    </Box>
  );
}
