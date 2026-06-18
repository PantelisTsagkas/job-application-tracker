"use client";

import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { StatusBadge } from "./StatusBadge";
import { Card } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import type { Application } from "@/types";

interface ApplicationCardProps {
  application: Application;
}

export function ApplicationCard({ application }: ApplicationCardProps) {
  const router = useRouter();

  return (
    <Card
      className="cursor-pointer rounded-xl border border-border p-3 transition-colors hover:border-zinc-600"
      onClick={() => router.push(`/applications/${application.id}`)}
    >
      <div className="space-y-2">
        <div>
          <p className="font-medium text-sm">{application.company}</p>
          <p className="text-xs text-muted-foreground">{application.role}</p>
        </div>
        <StatusBadge status={application.status} />
        {application.location && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            {application.location}
          </div>
        )}
        <p className="text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(application.appliedAt), {
            addSuffix: true,
          })}
        </p>
      </div>
    </Card>
  );
}
