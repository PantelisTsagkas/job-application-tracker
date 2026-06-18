import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { ApplicationsChart } from "@/components/dashboard/ApplicationsChart";
import { Header } from "@/components/layout/Header";
import { StatusBadge } from "@/components/applications/StatusBadge";
import { formatDistanceToNow, startOfWeek } from "date-fns";
import Link from "next/link";
import type { StatusKey } from "@/types";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const userId = session.user.id;

  const [total, byStatusRaw, applications] = await Promise.all([
    prisma.application.count({ where: { userId } }),
    prisma.application.groupBy({
      by: ["status"],
      where: { userId },
      _count: true,
    }),
    prisma.application.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
  ]);

  const byStatus: Record<string, number> = {
    APPLIED: 0,
    PHONE_SCREEN: 0,
    INTERVIEWING: 0,
    OFFER: 0,
    REJECTED: 0,
    WITHDRAWN: 0,
  };
  for (const item of byStatusRaw) {
    byStatus[item.status] = item._count;
  }

  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const thisWeek = applications.filter(
    (a) => new Date(a.createdAt) >= weekStart
  ).length;

  const interviewsAndOffers = (byStatus.INTERVIEWING ?? 0) + (byStatus.OFFER ?? 0);
  const responseRate = total > 0 ? Math.round((interviewsAndOffers / total) * 1000) / 10 : 0;

  const stats = { total, byStatus, thisWeek, responseRate };

  const recentApps = applications.slice(0, 5);

  return (
    <div className="space-y-8">
      <Header title="Dashboard" />
      <StatsGrid stats={stats} />

      <div className="rounded-xl border border-border p-6">
        <h2 className="mb-4 text-lg font-semibold">Applications (Last 30 days)</h2>
        <ApplicationsChart
          applications={applications.map((a) => ({
            ...a,
            status: a.status as StatusKey,
            notes: [],
          }))}
        />
      </div>

      <div className="rounded-xl border border-border p-6">
        <h2 className="mb-4 text-lg font-semibold">Recent Activity</h2>
        {recentApps.length === 0 ? (
          <p className="text-sm text-muted-foreground">No applications yet.</p>
        ) : (
          <div className="space-y-3">
            {recentApps.map((app) => (
              <Link
                key={app.id}
                href={`/applications/${app.id}`}
                className="flex items-center justify-between rounded-lg p-3 hover:bg-muted/50 transition-colors"
              >
                <div>
                  <p className="text-sm font-medium">{app.company}</p>
                  <p className="text-xs text-muted-foreground">{app.role}</p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={app.status as StatusKey} />
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(app.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
