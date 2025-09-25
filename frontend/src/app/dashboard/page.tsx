"use client";

import Image from "next/image";
import styles from "../page.module.css";
import {useAuth} from "./../../components/AuthContext"
import { Heading } from "@chakra-ui/react"
import{Cell, Pie, PieChart, BarChart, Bar, XAxis, YAxis, Legend, ResponsiveContainer, CartesianGrid, Tooltip} from "recharts";
import {Box} from "@chakra-ui/react"


const data = [
  { name: 'Group A', value: 400 },
  { name: 'Group B', value: 300 },
  { name: 'Group C', value: 300 },
  { name: 'Group D', value: 200 },
];

const barData = [
  {name: 'Q & A', value:500},
  {name: 'Dashboard', value:300},
  {name: 'Settings', value:200},
  {name: 'Shelf', value:100},
]

const barCOLORS =  ['#0e6abbff', '#29917eff', '#d33852ff', '#e91fc7ff'];
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-(midAngle ?? 0) * RADIAN);
  const y = cy + radius * Math.sin(-(midAngle ?? 0) * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${((percent ?? 1) * 100).toFixed(0)}%`}
    </text>
  );
};

export default function Dashboard() {
      const {user} = useAuth();
      const userName = user?.name || "Guest";
  return (
    <div className={styles.page}>
      <Heading position="absolute" top={5}>Welcome, Back! {userName}</Heading>

  <Box
  width="100%"
  height="auto"
  marginTop="400px"
  display="flex"
  justifyContent="center"
  alignItems="center"
  gap="60px"
  flexWrap="wrap"   // ✅ allows stacking on small screens
>
  {/* PIE CHART */}
  <Box flex="1 1 400px" height="400px">
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="45%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={180}   // ✅ scale down for smaller screens
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Legend layout="vertical" verticalAlign="middle" align="right" />
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
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={barCOLORS[index % barCOLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </Box>
</Box>



      {/* DAILY USAGE BAR CHART -> For the users's to show their hours of daily usage for 30 days */}
    </div>
  );
}
