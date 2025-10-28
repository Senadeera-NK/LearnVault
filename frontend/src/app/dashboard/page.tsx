"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../components/AuthContext";
import { recordUsage } from "../../../api/api";

// Chakra UI imports
import { Box, Grid, Card, Text, Heading, Spinner } from "@chakra-ui/react";

// Dynamic imports with SSR disabled
import dynamic from "next/dynamic";

const FileCategoryChart = dynamic(
  () => import("./components/FileCategoryChart"),
  { ssr: false }
);

const PageUsageChart = dynamic(
  () => import("./components/PageUsageChart"),
  { ssr: false }
);

const DailyUsageChart = dynamic(
  () => import("./components/DailyUsageChart"),
  { ssr: false }
);

export default function Dashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [dailyUsageData, setDailyUsageData] = useState<{ day: string; hours: number }[]>([]);

  const userName = user?.name || "Guest";

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
      <Box position="sticky" top="0" zIndex="999" px={8} py={4} mb={6} borderBottom="1px solid" borderColor="gray.200"  bg="gray.50">
        <Heading fontSize="2xl" fontWeight="bold">Welcome back, {userName}!</Heading>
      </Box>

      {/* Top Stats */}
      <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={4} mb={6}>
        <Card p={4}>
          <Text fontSize="sm" color="gray.500">Total Files</Text>
          <Text fontSize="2xl" fontWeight="bold">150</Text>
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
        {/* File Category Pie Chart (Half Donut) */}
        <Card p={4} height="350px">
          <FileCategoryChart userId={user.id.toString()} />
        </Card>

        {/* Page Usage Bar Chart */}
        <Card p={4} height="350px">
          <PageUsageChart userId={user.id.toString()} />
        </Card>
      </Grid>

      {/* Daily Usage Line Chart */}
      <Card mt={4} p={4} height="300px">
        <DailyUsageChart userId={user.id.toString()} />
      </Card>
    </Box>
  );
}
