"use client";

import { useEffect, useState, Suspense, lazy } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../components/AuthContext";
import { Heading, Box } from "@chakra-ui/react";
import { usePageTimer } from "../../components/UsePageTimer";
import { recordUsage, fetchUserUsage } from "../../../api/api";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import styles from "../page.module.css";

// Lazy loaded charts (must be client components themselves)
const DailyUsageChart = lazy(() => import("./components/DailyUsageChart"));
const PageUsageChart = lazy(() => import("./components/PageUsageChart"));

const pieData = [
  { name: "Group A", value: 400 },
  { name: "Group B", value: 300 },
  { name: "Group C", value: 300 },
  { name: "Group D", value: 200 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
const RADIAN = Math.PI / 180;

// Pie chart labels
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-(midAngle ?? 0) * RADIAN);
  const y = cy + radius * Math.sin(-(midAngle ?? 0) * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central">
      {`${((percent ?? 1) * 100).toFixed(0)}%`}
    </text>
  );
};

export default function Dashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [dailyUsageData, setDailyUsageData] = useState<{ day: string; hours: number }[]>([]);

  const userName = user?.name || "Guest";

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      router.push("/");
    }
  }, [user, router]);

  // Generate dummy 30-day usage data client-side
  useEffect(() => {
    const today = new Date();
    const day = today.getDate();
    const generated = Array.from({ length: 30 }, (_, i) => ({
      day: `Day ${day - i}`,
      hours: Math.floor(Math.random() * 5),
    }));
    setDailyUsageData(generated);
  }, []);

  // Fetch user usage data client-side
  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      try {
        const data = await fetchUserUsage(user.id);
        console.log("Fetched user usage data:", data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [user]);

  // Track page usage
  usePageTimer("Dashboard", async (duration) => {
    if (!user) return;
    try {
      await recordUsage(user.id, "Dashboard", duration);
    } catch (err) {
      console.error(err);
    }
  });

  if (!user) return null; // hide content while redirecting

  return (
    <div className={styles.page}>
      <Heading position="absolute" top={5}>
        Welcome, Back! {userName}
      </Heading>

      <Box width="100%" display="flex" justifyContent="center" alignItems="flex-start" gap="60px" flexWrap="wrap" marginTop="400px">
        {/* PIE CHART */}
        <Box flex="1 1 400px" height="400px">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="45%"
                outerRadius={150}
                fill="#8884d8"
                dataKey="value"
                label={renderCustomizedLabel}
                labelLine={false}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend layout="horizontal" verticalAlign="bottom" align="center" iconSize={14} wrapperStyle={{ marginTop: -20 }} />
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

      {/* Daily usage chart */}
      <Suspense fallback={<p>Loading...</p>}>
        <Box width="100%" height="250px" marginTop="480px" padding="0 10px" zIndex={0}>
          {user && dailyUsageData.length > 0 && <DailyUsageChart userId={user.id} />}
        </Box>
      </Suspense>
    </div>
  );
}
