"use client";

import { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { KanbanColumn } from "./KanbanColumn";
import { ApplicationCard } from "./ApplicationCard";
import { toast } from "sonner";
import type { Application, StatusKey } from "@/types";

const BOARD_STATUSES: StatusKey[] = [
  "APPLIED",
  "PHONE_SCREEN",
  "INTERVIEWING",
  "OFFER",
];
const ARCHIVED_STATUSES: StatusKey[] = ["REJECTED", "WITHDRAWN"];

interface KanbanBoardProps {
  applications: Application[];
  onStatusChange: (id: string, newStatus: StatusKey) => void;
}

export function KanbanBoard({ applications, onStatusChange }: KanbanBoardProps) {
  const [items, setItems] = useState(applications);
  const [showArchived, setShowArchived] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  // Keep items in sync with props
  if (applications !== items && applications.length !== items.length) {
    setItems(applications);
  }

  const getApplicationsByStatus = (status: StatusKey) =>
    items.filter((app) => app.status === status);

  const archivedApps = items.filter((app) =>
    ARCHIVED_STATUSES.includes(app.status)
  );

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Check if we're over a column (status)
    const isOverColumn = BOARD_STATUSES.includes(overId as StatusKey);
    if (!isOverColumn) return;

    const activeApp = items.find((app) => app.id === activeId);
    if (!activeApp || activeApp.status === overId) return;

    setItems((prev) =>
      prev.map((app) =>
        app.id === activeId ? { ...app, status: overId as StatusKey } : app
      )
    );
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const isOverColumn = BOARD_STATUSES.includes(overId as StatusKey);
    const activeApp = items.find((app) => app.id === activeId);

    if (!activeApp) return;

    let newStatus: StatusKey | null = null;

    if (isOverColumn && activeApp.status !== overId) {
      newStatus = overId as StatusKey;
    }

    if (newStatus) {
      try {
        const res = await fetch(`/api/applications/${activeId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        });
        if (!res.ok) throw new Error("Failed to update status");
        toast.success(`Moved to ${newStatus.replace("_", " ").toLowerCase()}`);
        onStatusChange(activeId, newStatus);
      } catch {
        // Revert on failure
        setItems(applications);
        toast.error("Failed to update status");
      }
    }
  };

  return (
    <div className="space-y-6">
      <DndContext
        sensors={sensors}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {BOARD_STATUSES.map((status) => (
            <KanbanColumn
              key={status}
              status={status}
              applications={getApplicationsByStatus(status)}
            />
          ))}
        </div>
      </DndContext>

      {archivedApps.length > 0 && (
        <div>
          <button
            onClick={() => setShowArchived(!showArchived)}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {showArchived ? "Hide" : "Show"} archived ({archivedApps.length})
          </button>
          {showArchived && (
            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {archivedApps.map((app) => (
                <ApplicationCard key={app.id} application={app} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
