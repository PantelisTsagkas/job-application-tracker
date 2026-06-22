import { Card } from "@/components/ui/card";
import { Briefcase, PhoneCall, Trophy, TrendingUp } from "lucide-react";
import { AnimatedNumber } from "@/components/dashboard/AnimatedNumber";

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
      iconClass: "text-blue-600 dark:text-blue-400",
      iconBgClass: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      label: "Active Interviews",
      value: stats.byStatus.INTERVIEWING ?? 0,
      icon: PhoneCall,
      iconClass: "text-orange-600 dark:text-orange-400",
      iconBgClass: "bg-orange-100 dark:bg-orange-900/30",
    },
    {
      label: "Offers Received",
      value: stats.byStatus.OFFER ?? 0,
      icon: Trophy,
      iconClass: "text-green-600 dark:text-green-400",
      iconBgClass: "bg-green-100 dark:bg-green-900/30",
    },
    {
      label: "Response Rate",
      value: stats.responseRate,
      icon: TrendingUp,
      iconClass: "text-indigo-600 dark:text-indigo-400",
      iconBgClass: "bg-indigo-100 dark:bg-indigo-900/30",
      animated: true,
    },
  ] as const;

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {metrics.map((metric) => (
        <Card
          key={metric.label}
          className="rounded-xl border border-border p-4"
        >
          <div className="flex items-center justify-between">
            <p className="text-[13px] text-muted-foreground">{metric.label}</p>
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-lg ${metric.iconBgClass}`}
            >
              <metric.icon className={`h-4 w-4 ${metric.iconClass}`} />
            </div>
          </div>
          <p className="mt-2 text-3xl font-bold tabular-nums">
            {"animated" in metric && metric.animated ? (
              <AnimatedNumber
                value={metric.value}
                decimals={1}
                suffix="%"
              />
            ) : (
              metric.value
            )}
          </p>
        </Card>
      ))}
    </div>
  );
}
