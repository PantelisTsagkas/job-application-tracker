"use client";

import { useDroppable } from "@dnd-kit/core";
import { ApplicationCard } from "./ApplicationCard";
import { STATUS_CONFIG, StatusKey } from "@/types";
import type { Application } from "@/types";
import { cn } from "@/lib/utils";

const STATUS_DOT_COLORS: Record<string, string> = {
  blue: "#3b82f6",
  yellow: "#eab308",
  orange: "#f97316",
  green: "#22c55e",
  red: "#ef4444",
  gray: "#6b7280",
};

interface KanbanColumnProps {
  status: StatusKey;
  applications: Application[];
}

export function KanbanColumn({ status, applications }: KanbanColumnProps) {
  const config = STATUS_CONFIG[status];
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div className="flex min-w-0 flex-col rounded-xl border border-border bg-card">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <div
          className="h-2.5 w-2.5 rounded-full"
          style={{
            backgroundColor:
              STATUS_DOT_COLORS[config.color] ?? STATUS_DOT_COLORS.gray,
          }}
        />
        <span className="text-sm font-medium">{config.label}</span>
        <span className="ml-auto rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
          {applications.length}
        </span>
      </div>
      <div
        ref={setNodeRef}
        className={cn(
          "flex min-h-[200px] flex-1 flex-col gap-2 overflow-y-auto p-3 transition-colors",
          isOver && "bg-primary/5 ring-2 ring-inset ring-primary/20"
        )}
      >
        {applications.length === 0 ? (
          <p
            className={cn(
              "flex flex-1 items-center justify-center rounded-lg border border-dashed border-border px-3 py-8 text-center text-xs text-muted-foreground",
              isOver && "border-primary/40 text-primary/80"
            )}
          >
            Drop here
          </p>
        ) : (
          applications.map((app) => (
            <ApplicationCard key={app.id} application={app} draggable />
          ))
        )}
      </div>
    </div>
  );
}
