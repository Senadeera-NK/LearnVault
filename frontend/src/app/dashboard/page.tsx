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

      {/* PIE CHART  => For the categorized files from the uploaded files */}
     <Box
      width="100%"
      height="400px"
      marginTop="400px"
      display="flex"
      justifyContent="center"   // pushes items apart
      alignItems="center"
      gap="400px"   // space between charts
>
  {/* PIE CHART */}
  <ResponsiveContainer width={500} height="100%">
    <PieChart style={{ marginLeft: "60px" }}>
      <Pie
        data={data}
        cx="40%"
        cy="50%"
        labelLine={false}
        label={renderCustomizedLabel}
        outerRadius={150}
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

  {/* BAR CHART */}
  <ResponsiveContainer width={500} height="100%">
    <BarChart
      data={data}
      layout="vertical"
      style={{ marginRight: "60px" }}
      margin={{ top: 20, right: 30, left: 50, bottom: 20 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis type="number" />
      <YAxis type="category" dataKey="name" />
      <Tooltip />
      <Bar dataKey="value">
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Bar>
    </BarChart>
  </ResponsiveContainer>
</Box>


      {/* DAILY USAGE BAR CHART -> For the users's to show their hours of daily usage for 30 days */}
    </div>
  );
}
