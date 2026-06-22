"use client";

import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, MapPin } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Application } from "@/types";

interface ApplicationCardProps {
  application: Application;
  draggable?: boolean;
  overlay?: boolean;
}

export function ApplicationCard({
  application,
  draggable = false,
  overlay = false,
}: ApplicationCardProps) {
  const router = useRouter();
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: application.id,
      disabled: !draggable,
    });

  const style =
    draggable && transform
      ? { transform: CSS.Translate.toString(transform) }
      : undefined;

  const card = (
    <Card
      size="sm"
      className={cn(
        "rounded-xl border border-border p-3 transition-colors",
        overlay
          ? "cursor-grabbing shadow-lg ring-2 ring-primary/20"
          : "cursor-pointer hover:border-muted-foreground/40",
        draggable && !overlay && "touch-none",
        isDragging && !overlay && "opacity-40"
      )}
      onClick={
        overlay || isDragging
          ? undefined
          : () => router.push(`/applications/${application.id}`)
      }
    >
      <div className="flex gap-2">
        {draggable && !overlay && (
          <button
            type="button"
            className="mt-0.5 shrink-0 cursor-grab touch-none rounded p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground active:cursor-grabbing"
            aria-label={`Drag ${application.company} card`}
            onClick={(e) => e.stopPropagation()}
            {...listeners}
            {...attributes}
          >
            <GripVertical className="h-4 w-4" />
          </button>
        )}
        <div className="min-w-0 flex-1 space-y-2">
          <div>
            <p className="text-sm font-medium">{application.company}</p>
            <p className="text-xs text-muted-foreground">{application.role}</p>
          </div>
          <StatusBadge status={application.status} />
          {application.location && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3 shrink-0" />
              <span className="truncate">{application.location}</span>
            </div>
          )}
          <p className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(application.appliedAt), {
              addSuffix: true,
            })}
          </p>
        </div>
      </div>
    </Card>
  );

  if (!draggable || overlay) {
    return card;
  }

  return (
    <div ref={setNodeRef} style={style} className="relative z-0">
      {card}
    </div>
  );
}
