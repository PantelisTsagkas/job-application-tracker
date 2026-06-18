import { Card } from "@/components/ui/card";
import { Briefcase, PhoneCall, Trophy, TrendingUp } from "lucide-react";

interface StatsGridProps {
  stats: {
    total: number;
    byStatus: Record<string, number>;
    thisWeek: number;
    responseRate: number;
  };
}

export function StatsGrid({ stats }: StatsGridProps) {
  const metrics = [
    {
      label: "Total Applications",
      value: stats.total,
      icon: Briefcase,
    },
    {
      label: "Active Interviews",
      value: stats.byStatus.INTERVIEWING ?? 0,
      icon: PhoneCall,
    },
    {
      label: "Offers Received",
      value: stats.byStatus.OFFER ?? 0,
      icon: Trophy,
    },
    {
      label: "Response Rate",
      value: `${stats.responseRate}%`,
      icon: TrendingUp,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {metrics.map((metric) => (
        <Card
          key={metric.label}
          className="rounded-xl border border-border p-4"
        >
          <div className="flex items-center justify-between">
            <p className="text-[13px] text-muted-foreground">{metric.label}</p>
            <metric.icon className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="mt-2 text-3xl font-bold tabular-nums">
            {metric.value}
          </p>
        </Card>
      ))}
    </div>
  );
}
