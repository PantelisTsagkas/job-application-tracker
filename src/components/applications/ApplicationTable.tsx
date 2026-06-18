"use client";

import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { StatusBadge } from "./StatusBadge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { toast } from "sonner";
import type { Application } from "@/types";

interface ApplicationTableProps {
  applications: Application[];
  isLoading?: boolean;
  onDelete: (id: string) => void;
}

export function ApplicationTable({
  applications,
  isLoading,
  onDelete,
}: ApplicationTableProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/applications/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("Application deleted");
      onDelete(id);
    } catch {
      toast.error("Failed to delete application");
    }
    setDeletingId(null);
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-lg font-medium text-muted-foreground">
          No applications yet
        </p>
        <p className="text-sm text-muted-foreground">
          Add your first one to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Company</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Applied</TableHead>
            <TableHead>Follow-up</TableHead>
            <TableHead className="w-[60px]" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.map((app) => (
            <TableRow
              key={app.id}
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => router.push(`/applications/${app.id}`)}
            >
              <TableCell className="font-medium">{app.company}</TableCell>
              <TableCell>{app.role}</TableCell>
              <TableCell>
                <StatusBadge status={app.status} />
              </TableCell>
              <TableCell className="text-muted-foreground">
                {app.location ?? "—"}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatDistanceToNow(new Date(app.appliedAt), {
                  addSuffix: true,
                })}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {app.followUpAt
                  ? formatDistanceToNow(new Date(app.followUpAt), {
                      addSuffix: true,
                    })
                  : "—"}
              </TableCell>
              <TableCell>
                <Dialog
                  open={deletingId === app.id}
                  onOpenChange={(open) => !open && setDeletingId(null)}
                >
                  <DialogTrigger
                    render={
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      />
                    }
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeletingId(app.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </DialogTrigger>
                  <DialogContent onClick={(e) => e.stopPropagation()}>
                    <DialogHeader>
                      <DialogTitle>Delete application</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to delete the application for{" "}
                        <strong>{app.role}</strong> at{" "}
                        <strong>{app.company}</strong>? This action cannot be
                        undone.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setDeletingId(null)}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleDelete(app.id)}
                      >
                        Delete
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
