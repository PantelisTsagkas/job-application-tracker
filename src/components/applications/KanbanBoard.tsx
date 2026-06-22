"use client";

import { useEffect, useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { KanbanColumn } from "./KanbanColumn";
import { ApplicationCard } from "./ApplicationCard";
import { toast } from "sonner";
import { STATUS_CONFIG, type Application, type StatusKey } from "@/types";

const BOARD_STATUSES: StatusKey[] = [
  "APPLIED",
  "PHONE_SCREEN",
  "INTERVIEWING",
  "OFFER",
];
const ARCHIVED_STATUSES: StatusKey[] = ["REJECTED", "WITHDRAWN"];
const DROP_STATUSES: StatusKey[] = [...BOARD_STATUSES, ...ARCHIVED_STATUSES];

interface KanbanBoardProps {
  applications: Application[];
  onStatusChange: (id: string, newStatus: StatusKey) => void;
}

function resolveDropStatus(
  overId: string,
  items: Application[]
): StatusKey | null {
  if (DROP_STATUSES.includes(overId as StatusKey)) {
    return overId as StatusKey;
  }

  const overApp = items.find((app) => app.id === overId);
  return overApp?.status ?? null;
}

export function KanbanBoard({ applications, onStatusChange }: KanbanBoardProps) {
  const [items, setItems] = useState(applications);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [dragSnapshot, setDragSnapshot] = useState<Application[] | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  useEffect(() => {
    // Re-sync when the parent list changes (filters, deletes, etc.)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(applications);
  }, [applications]);

  const getApplicationsByStatus = (status: StatusKey) =>
    items.filter((app) => app.status === status);

  const activeApplication = activeId
    ? items.find((app) => app.id === activeId)
    : undefined;

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
    setDragSnapshot(items);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const newStatus = resolveDropStatus(over.id as string, items);
    if (!newStatus) return;

    const activeApp = items.find((app) => app.id === activeId);
    if (!activeApp || activeApp.status === newStatus) return;

    setItems((prev) =>
      prev.map((app) =>
        app.id === activeId ? { ...app, status: newStatus } : app
      )
    );
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    const draggedId = active.id as string;
    const originalApp = dragSnapshot?.find((app) => app.id === draggedId);
    const newStatus = over
      ? resolveDropStatus(over.id as string, items)
      : null;

    setActiveId(null);
    setDragSnapshot(null);

    if (!over || !originalApp || !newStatus) {
      setItems(applications);
      return;
    }

    if (originalApp.status === newStatus) {
      setItems(applications);
      return;
    }

    try {
      const res = await fetch(`/api/applications/${draggedId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status");

      toast.success(`Moved to ${STATUS_CONFIG[newStatus].label.toLowerCase()}`);
      onStatusChange(draggedId, newStatus);
    } catch {
      setItems(dragSnapshot ?? applications);
      toast.error("Failed to update status");
    }
  };

  const handleDragCancel = () => {
    const snapshot = dragSnapshot;
    setActiveId(null);
    setDragSnapshot(null);
    setItems(snapshot ?? applications);
  };

  return (
    <div className="space-y-6">
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
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

        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground">Archived</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {ARCHIVED_STATUSES.map((status) => (
              <KanbanColumn
                key={status}
                status={status}
                applications={getApplicationsByStatus(status)}
              />
            ))}
          </div>
        </div>

        <DragOverlay dropAnimation={null}>
          {activeApplication ? (
            <ApplicationCard application={activeApplication} overlay />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
