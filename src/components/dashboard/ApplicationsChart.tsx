"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { format, subDays, startOfDay } from "date-fns";
import type { Application } from "@/types";

interface ApplicationsChartProps {
  applications: Application[];
}

export function ApplicationsChart({ applications }: ApplicationsChartProps) {
  const today = startOfDay(new Date());
  const days = Array.from({ length: 30 }, (_, i) => {
    const date = subDays(today, 29 - i);
    return {
      date: format(date, "MMM d"),
      timestamp: date.getTime(),
      count: 0,
    };
  });

  for (const app of applications) {
    const appDate = startOfDay(new Date(app.createdAt)).getTime();
    const day = days.find((d) => d.timestamp === appDate);
    if (day) day.count++;
  }

  return (
    <div className="h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={days}>
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1a1a1a",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "8px",
              fontSize: "12px",
            }}
          />
          <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
