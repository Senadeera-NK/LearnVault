"use client";

import Image from "next/image";
import styles from "../page.module.css";
import { useAuth } from "./../../components/AuthContext";
import { Heading } from "@chakra-ui/react";
import {usePageTimer} from "../../components/UsePageTimer";
import {recordUsage} from "../../../services/api";
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

const data = [
  { name: "Group A", value: 400 },
  { name: "Group B", value: 300 },
  { name: "Group C", value: 300 },
  { name: "Group D", value: 200 },
];

const barData = [
  { name: "Q & A", value: 500 },
  { name: "Dashboard", value: 300 },
  { name: "Settings", value: 200 },
  { name: "Shelf", value: 100 },
];

const barCOLORS = ["#0e6abbff", "#29917eff", "#d33852ff", "#e91fc7ff"];
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
const RADIAN = Math.PI / 180;

// Example 30-day usage data
const dailyUsageData = Array.from({ length: 30 }, (_, i) => ({
  day: `Day ${i + 1}`,
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

  // Using the custom hook to track time spent on this page
  usePageTimer("Dashboard", async (duration) => {
    if(!user) return; // no user, no record{
      try {
        await recordUsage(user.id, "Dashboard", duration);
        console.log(`⏱️ Recorded ${duration} seconds on Dashboard for user ${user.id}`);
      } catch (err) {
        console.error("❌ Failed to record usage:", err);
      }
    });


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
        <Box flex="1 1 400px" height="400px">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={barData}
              layout="vertical"
              margin={{ top: 20, right: 30, left: 30, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" />
              <Tooltip />
              <Bar dataKey="value">
                {barData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={barCOLORS[index % barCOLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Box>
        {/* Bottom half: 30-day daily usage chart */}
        <Box
          width="100%"
          height="250px"
          marginTop="480px"
          padding="0 10px"
          zIndex={0}   // <-- use camelCase, lower value puts it below floating button
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dailyUsageData} margin={{ left: 10, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 10 }}
                interval={0} // show all labels
              />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Bar
                dataKey="hours"
                fill={dailyBarColor}
                barSize={Math.floor(window.innerWidth / dailyUsageData.length) - 5}
              />
            </BarChart>
          </ResponsiveContainer>
        </Box>


    </div>
  );
}
