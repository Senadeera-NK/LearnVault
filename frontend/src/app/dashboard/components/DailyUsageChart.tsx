"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useEffect, useState } from "react";
import { fetchUserUsage } from "../../../../services/api";
import { Heading } from "@chakra-ui/react/typography";

// Type for usage data
interface Usage {
  day: string;       // For X-axis
  display: string;   // For tooltip: "1st September"
  hours: number;
}

interface Props {
  userId: number;
}

// Helper to get ordinal suffix for day
function getOrdinal(day: number) {
  if (day > 3 && day < 21) return `${day}th`;
  switch (day % 10) {
    case 1: return `${day}st`;
    case 2: return `${day}nd`;
    case 3: return `${day}rd`;
    default: return `${day}th`;
  }
}

export default function DailyUsageChart({ userId }: Props) {
  const [usageData, setUsageData] = useState<Usage[]>([]);

  useEffect(() => {
    async function loadUsage() {
      try {
        const data = await fetchUserUsage(userId);
        const today = new Date();

        // Map last 30 days
        const last30Days = Array.from({ length: 30 }, (_, i) => {
          const date = new Date();
          date.setDate(today.getDate() - i);
          const dayWithOrdinal = getOrdinal(date.getDate());
          const month = date.toLocaleString("default", { month: "long" });
          const dateStr = date.toISOString().split("T")[0]; // YYYY-MM-DD

          const usageForDay = data.usage.filter((u: any) => u.date === dateStr).reduce((sum:number, u:any)=> sum +u.hours, 0);

          return {
            day: dayWithOrdinal,                    // X-axis
            display: `${dayWithOrdinal} ${month}`,  // Tooltip
            hours: usageForDay ? usageForDay : 0,
          };
        }).reverse();

        setUsageData(last30Days);
      } catch (err) {
        console.error("Failed to load user usage:", err);
      }
    }

    loadUsage();
  }, [userId]);

  const dailyBarColor = "#1528dbff";

  return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={usageData} margin={{ left: 10, right: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="day"
          tick={{ fontSize: 10 }}
          interval={0}          // show all labels
          angle={30}             // horizontal labels
          textAnchor="middle"
        />
        <YAxis tick={{ fontSize: 10 }} />
        <Tooltip
          formatter={(value: number, name: string, props: any) => {
            const { payload } = props;
            return [`${value} hours`, payload.display]; // show "1st September — 2 hours"
          }}
        />
        <Bar
          dataKey="hours"
          fill={dailyBarColor}
          barSize={Math.floor(window.innerWidth / usageData.length) - 5}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
