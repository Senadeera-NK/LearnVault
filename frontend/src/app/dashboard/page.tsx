"use client";

import Image from "next/image";
import styles from "../page.module.css";
import { useAuth } from "./../../components/AuthContext";
import { Heading } from "@chakra-ui/react";
import {usePageTimer} from "../../components/UsePageTimer";
import {recordUsage, fetchUserUsage} from "../../../services/api";
import {
  Cell,
  Pie,
  PieChart,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { Box } from "@chakra-ui/react";
import { Suspense, lazy } from 'react';
const DailyUsageChart = lazy(()=>import("./components/DailyUsageChart"));
const PageUsageChart = lazy(()=>import("./components/PageUsageChart"));

const data = [
  { name: "Group A", value: 400 },
  { name: "Group B", value: 300 },
  { name: "Group C", value: 300 },
  { name: "Group D", value: 200 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
const RADIAN = Math.PI / 180;

// Example 30-day usage data
const today = new Date();
const day = today.getDate();
const dailyUsageData = Array.from({ length: 30 }, (_, i) => ({
  day: `Day ${day - 1}`,
  hours: Math.floor(Math.random() * 5),
}));
const dailyBarColor = "#1528dbff";

// Percentage label inside slices
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-(midAngle ?? 0) * RADIAN);
  const y = cy + radius * Math.sin(-(midAngle ?? 0) * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${((percent ?? 1) * 100).toFixed(0)}%`}
    </text>
  );
};

export default function Dashboard() {
  const { user } = useAuth();
  const userName = user?.name || "Guest";

  if(user){
  const fetched_user_duration = fetchUserUsage(user.id);
  fetched_user_duration.then((data) => {
    console.log("Fetched user usage data:", data);
  });
}
  // Using the custom hook to track time spent on this page
  // Track page usage
  usePageTimer("Dashboard", async (duration) => {
    if (!user) return; // skip if not logged in
    console.log("Dashboard page timer callback, duration:", duration);
    console.log("user logged in, recording usage...");
    try {
      await recordUsage(user.id, "Dashboard", duration);
      console.log("✅ Recorded usage:", duration, "seconds");
    } catch (err) {
      console.error("❌ Failed to record usage", err);
    }
  });

  console.log("Rendering Dashboard for user:", user);


  return (
    <div className={styles.page}>
      <Heading position="absolute" top={5}>
        Welcome, Back! {userName}
      </Heading>

      {/* Top half: Pie + Bar */}
      <Box
        width="100%"
        display="flex"
        justifyContent="center"
        alignItems="flex-start"
        gap="60px"
        flexWrap="wrap"
        marginTop="400px"
      >
        {/* PIE CHART */}
        <Box flex="1 1 400px" height="400px">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="45%"
                outerRadius={150}
                fill="#8884d8"
                dataKey="value"
                label={renderCustomizedLabel}
                labelLine={false}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
                iconSize={14}
                wrapperStyle={{ marginTop: -20 }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Box>

        {/* BAR CHART */}
        <Suspense fallback={<p>Loading...</p>}>
          <Box flex="1 1 400px" height="400px">
            {user && <PageUsageChart userId={user.id} />}
          </Box>
        </Suspense>
      </Box>
        {/* Bottom half: 30-day daily usage chart */}
        <Suspense fallback={<p>Loading...</p>}>
          <Box
            width="100%"
            height="250px"
            marginTop="480px"
            padding="0 10px"
            zIndex={0}   // <-- use camelCase, lower value puts it below floating button
          >
              {user && <DailyUsageChart userId={user.id} />}
              {/* <Heading size="sm" paddingTop={30} paddingLeft={50}>Daily Usage</Heading> */}
          </Box>
        </Suspense>
    </div>
  );
}
