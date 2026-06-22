"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { format, subDays, startOfDay } from "date-fns";
import type { Application } from "@/types";

interface ApplicationsChartProps {
  applications: Application[];
}

type ChartSize = { width: number; height: number };

export function ApplicationsChart({ applications }: ApplicationsChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<ChartSize | null>(null);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const updateSize = (width: number, height: number) => {
      if (width > 0 && height > 0) {
        setSize({ width: Math.floor(width), height: Math.floor(height) });
      }
    };

    updateSize(element.clientWidth, element.clientHeight);

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      updateSize(width, height);
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const days = useMemo(() => {
    const today = startOfDay(new Date());
    const chartDays = Array.from({ length: 30 }, (_, i) => {
      const date = subDays(today, 29 - i);
      return {
        date: format(date, "MMM d"),
        timestamp: date.getTime(),
        count: 0,
      };
    });

    for (const app of applications) {
      const appDate = startOfDay(new Date(app.createdAt)).getTime();
      const day = chartDays.find((d) => d.timestamp === appDate);
      if (day) day.count++;
    }

    return chartDays;
  }, [applications]);

  return (
    <div ref={containerRef} className="h-[250px] w-full min-w-0">
      {size ? (
        <BarChart width={size.width} height={size.height} data={days}>
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
              backgroundColor: "var(--popover)",
              color: "var(--popover-foreground)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              fontSize: "12px",
            }}
            labelStyle={{ color: "var(--muted-foreground)" }}
            itemStyle={{ color: "var(--popover-foreground)" }}
            cursor={{ fill: "var(--muted)", opacity: 0.4 }}
          />
          <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
        </BarChart>
      ) : null}
    </div>
  );
}
