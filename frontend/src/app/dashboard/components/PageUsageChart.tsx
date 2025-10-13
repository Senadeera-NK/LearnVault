"use client";
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar, Cell } from 'recharts';
import { useEffect, useState } from "react";
import { fetchUserUsage } from "../../../../api/api";

const barCOLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#8dd1e1'];

interface Usage {
  page: string;
  value: number;
}

interface Props {
  userId: number;
}

export default function PageUsageChart({ userId }: Props) {
  const [barData, setBarData] = useState<Usage[]>([]);

  useEffect(() => {
    async function loadUsage() {
      try {
        const data = await fetchUserUsage(userId);
        
        // Aggregate total hours by page
        const usageByPage: { [key: string]: number } = {};
        data.usage.forEach((u: any) => {
          if (!usageByPage[u.page_name]) usageByPage[u.page_name] = 0;
          usageByPage[u.page_name] += u.hours;
        });

        // Transform to array for Recharts
        const chartData: Usage[] = Object.entries(usageByPage).map(([page, value]) => ({ page, value }));
        setBarData(chartData);
      } catch (err) {
        console.error("Failed to load user usage:", err);
      }
    }

    loadUsage();
  }, [userId]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={barData}
        layout="vertical"
        margin={{ top: 20, right: 30, left: 30, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis type="category" dataKey="page" /> {/* <-- Correct key */}
        <Tooltip formatter={(value: number) => value.toFixed(2) + " hrs"} />
        <Bar dataKey="value">
          {barData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={barCOLORS[index % barCOLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
