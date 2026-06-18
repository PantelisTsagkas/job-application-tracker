import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { ApplicationDetail } from "./ApplicationDetail";
import type { StatusKey } from "@/types";

export default async function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { id } = await params;

  const application = await prisma.application.findFirst({
    where: { id, userId: session.user.id },
    include: { notes: { orderBy: { createdAt: "desc" } } },
  });

  if (!application) notFound();

  return (
    <ApplicationDetail
      application={{
        ...application,
        status: application.status as StatusKey,
      }}
    />
  );
}
