import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { startOfWeek } from "date-fns";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  const total = await prisma.application.count({ where: { userId } });

  const byStatusRaw = await prisma.application.groupBy({
    by: ["status"],
    where: { userId },
    _count: true,
  });

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
  const thisWeek = await prisma.application.count({
    where: {
      userId,
      createdAt: { gte: weekStart },
    },
  });

  const interviewsAndOffers =
    (byStatus.INTERVIEWING || 0) + (byStatus.OFFER || 0);
  const responseRate = total > 0 ? (interviewsAndOffers / total) * 100 : 0;

  return NextResponse.json({
    total,
    byStatus,
    thisWeek,
    responseRate: Math.round(responseRate * 10) / 10,
  });
}
