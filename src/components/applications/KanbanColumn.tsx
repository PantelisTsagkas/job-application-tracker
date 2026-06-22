"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { ApplicationCard } from "./ApplicationCard";
import { STATUS_CONFIG, StatusKey } from "@/types";
import type { Application } from "@/types";

interface KanbanColumnProps {
  status: StatusKey;
  applications: Application[];
}

export function KanbanColumn({ status, applications }: KanbanColumnProps) {
  const config = STATUS_CONFIG[status];
  const { setNodeRef } = useDroppable({ id: status });

  return (
    <div className="flex min-w-0 flex-col rounded-xl border border-border bg-card">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <div
          className={`h-2.5 w-2.5 rounded-full`}
          style={{
            backgroundColor:
              config.color === "blue"
                ? "#3b82f6"
                : config.color === "yellow"
                ? "#eab308"
                : config.color === "orange"
                ? "#f97316"
                : config.color === "green"
                ? "#22c55e"
                : config.color === "red"
                ? "#ef4444"
                : "#6b7280",
          }}
        />
        <span className="text-sm font-medium">{config.label}</span>
        <span className="ml-auto rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
          {applications.length}
        </span>
      </div>
      <div
        ref={setNodeRef}
        className="flex flex-1 flex-col gap-2 overflow-y-auto p-3 min-h-[200px]"
      >
        <SortableContext
          items={applications.map((a) => a.id)}
          strategy={verticalListSortingStrategy}
        >
          {applications.map((app) => (
            <ApplicationCard key={app.id} application={app} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}
