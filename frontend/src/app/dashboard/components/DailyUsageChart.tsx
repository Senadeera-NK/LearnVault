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
import {fetchUserUsage} from "../../../../api/api"

interface DailyUsageChartProps {
  userId: string;
  onStats?:(stats:{totalDays:number})=>void;
}

interface DailyUsageData {
  day: string;
  hours: number;
}

export default function DailyUsageChart({ userId, onStats }: DailyUsageChartProps) {
  const [data, setData] = useState<DailyUsageData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try{
        const response = await fetchUserUsage(parseInt(userId));
        const usage = response.usage;

        // create a map of date => total hours
        const usageMap:Record<string,number> = {};
        usage.forEach((u:any)=>{
          if(!usageMap[u.date]) usageMap[u.date]=0;
          usageMap[u.date] += u.hours;
        });

        // last 30 days
        const today = new Date();
        const last30days: DailyUsageData[] = Array.from({length:30},(_,i)=>{
          const d = new Date();
          d.setDate(today.getDate()-(29-i));
          const dayStr = `${d.getDate()} ${d.toLocaleString('default', {month: 'short'})}`;
          const isoDate = d.toISOString().split('T')[0];
          return{
            day:dayStr,
            hours:(usageMap[isoDate]||0) *60,
          };
        });
        setData(last30days);

        //calculating total active days
        const totalDays = last30days.filter(d=>d.hours>0).length;
        if(onStats) onStats({totalDays});
      }
      catch(err){
        console.error(err);
      }finally{
        setLoading(false);
      }
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
          <YAxis
          label={{
            value:"Mins used",
            angle:-90,
            position:"insideLeft",
            style:{textAnchor:"middle", fill:"#888"}
          }}
           />
<Tooltip formatter={(value: any) => `${Number(value || 0).toFixed(1)} min`} />
          <Area
            type="linear"          // straight lines instead of monotone curve
            dataKey="hours"
            stroke="#38A169"
            fill="url(#gradientHours)"
            strokeWidth={2}
            dot={false} // pointy dots
          />
        </AreaChart>
      </ResponsiveContainer>
    </Box>
  );
}
