"use client";

import React, { useEffect, useState, Suspense, lazy } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../components/AuthContext";
import { recordUsage } from "../../../api/api";

// Chakra UI imports
import {
  Box,
  Grid,
  Card,
  Text,
  Spinner,
  Heading,
} from "@chakra-ui/react";

// Lazy load charts
const PageUsageChart = lazy(() => import("./components/PageUsageChart"));
const DailyUsageChart = lazy(() => import("./components/DailyUsageChart"));
const FileCategoryChart = lazy(()=> import("./components/FileCategoryChart"));

// Sample Pie Chart Data (Chakra + Recharts Pie)
import {
  PieChart as RePieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const pieData = [
  { name: "Reports", value: 40 },
  { name: "Invoices", value: 30 },
  { name: "Letters", value: 20 },
  { name: "Other", value: 10 },
];

const COLORS = ["#3182CE", "#38A169", "#E53E3E", "#D69E2E"];

export default function Dashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [dailyUsageData, setDailyUsageData] = useState<{ day: string; hours: number }[]>([]);

  const userName = user?.name || "Guest";
  const totalFiles = pieData.reduce((sum, item) => sum + item.value, 0);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) router.push("/");
  }, [user, router]);

  // Generate dummy daily usage
  useEffect(() => {
    const today = new Date();
    const generated = Array.from({ length: 30 }, (_, i) => ({
      day: `Day ${today.getDate() - i}`,
      hours: Math.floor(Math.random() * 5),
    })).reverse();
    setDailyUsageData(generated);
  }, []);

  // Track page usage
  useEffect(() => {
    if (!user) return;
    const trackUsage = async () => {
      await recordUsage(user.id, "Dashboard", Math.floor(Math.random() * 5));
    };
    trackUsage();
  }, [user]);

  if (!user) return null;

  return (
    <Box p={6} bg="gray.50" minH="100vh">
      {/* Welcome */}
      <Heading mb={6}>Welcome back, {userName}!</Heading>

      {/* Top Stats */}
      <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={4} mb={6}>
        <Card p={4}>
          <Text fontSize="sm" color="gray.500">Total Files</Text>
          <Text fontSize="2xl" fontWeight="bold">{totalFiles}</Text>
        </Card>
        <Card p={4}>
          <Text fontSize="sm" color="gray.500">Total QA Generated</Text>
          <Text fontSize="2xl" fontWeight="bold">75</Text>
        </Card>
        <Card p={4}>
          <Text fontSize="sm" color="gray.500">Active Days</Text>
          <Text fontSize="2xl" fontWeight="bold">
            {dailyUsageData.filter(d => d.hours > 0).length}
          </Text>
        </Card>
      </Grid>

      {/* Charts */}
      <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4}>
        {/* Pie Chart */}
        <Card p={4} height="350px" position="relative">
          <ResponsiveContainer width="100%" height="100%">
            <RePieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                innerRadius={70}
                outerRadius={120}
                startAngle={180}
                endAngle={0}
                paddingAngle={2}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </RePieChart>
          </ResponsiveContainer>
          <Text
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            fontSize="lg"
            fontWeight="bold"
          >
            {totalFiles} Files
          </Text>
        </Card>

        {/* Page Usage Bar Chart */}
        <Card p={4} height="350px">
          <Suspense fallback={<Spinner />}>
            <PageUsageChart userId={user.id.toString()} />
          </Suspense>
        </Card>
      </Grid>

      {/* Daily Usage Line Chart */}
      <Card mt={4} p={4} height="300px">
        <Suspense fallback={<Spinner />}>
          <DailyUsageChart userId={user.id.toString()} />
        </Suspense>
      </Card>
    </Box>
  );
}
