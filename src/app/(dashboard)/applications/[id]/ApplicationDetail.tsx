"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { StatusBadge } from "@/components/applications/StatusBadge";
import { Header } from "@/components/layout/Header";
import {
  Pencil,
  Trash2,
  MapPin,
  Link as LinkIcon,
  DollarSign,
  Calendar,
  X,
} from "lucide-react";
import type { Application, Note } from "@/types";

interface ApplicationDetailProps {
  application: Application;
}

export function ApplicationDetail({ application }: ApplicationDetailProps) {
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>(application.notes);
  const [newNote, setNewNote] = useState("");
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/applications/${application.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("Application deleted");
      router.push("/applications");
    } catch {
      toast.error("Failed to delete application");
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    setIsAddingNote(true);
    try {
      const res = await fetch(`/api/applications/${application.id}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newNote }),
      });
      if (!res.ok) throw new Error("Failed to add note");
      const note = await res.json();
      setNotes([note, ...notes]);
      setNewNote("");
      toast.success("Note added");
    } catch {
      toast.error("Failed to add note");
    } finally {
      setIsAddingNote(false);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      const res = await fetch(`/api/applications/${application.id}/notes`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ noteId }),
      });
      if (!res.ok) throw new Error("Failed to delete note");
      setNotes(notes.filter((n) => n.id !== noteId));
      toast.success("Note deleted");
    } catch {
      toast.error("Failed to delete note");
    }
  };

  return (
    <div className="space-y-6">
      <Header title={application.company} />

      <div className="flex items-center gap-3">
        <StatusBadge status={application.status} />
        <span className="text-muted-foreground">{application.role}</span>
        <div className="ml-auto flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              router.push(`/applications/${application.id}/edit`)
            }
          >
            <Pencil className="mr-1.5 h-3.5 w-3.5" />
            Edit
          </Button>
          <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <DialogTrigger
              render={<Button variant="destructive" size="sm" />}
            >
              <Trash2 className="mr-1.5 h-3.5 w-3.5" />
              Delete
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete application</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete the application for{" "}
                  <strong>{application.role}</strong> at{" "}
                  <strong>{application.company}</strong>? This action cannot be
                  undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteDialog(false)}
                >
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDelete}>
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <Card className="rounded-xl border border-border p-6 space-y-4">
            <h3 className="font-semibold">Details</h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {application.location && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  {application.location}
                </div>
              )}
              {application.url && (
                <div className="flex items-center gap-2 text-sm">
                  <LinkIcon className="h-4 w-4 text-muted-foreground" />
                  <a
                    href={application.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-400 hover:underline truncate"
                  >
                    Job posting
                  </a>
                </div>
              )}
              {(application.salaryMin || application.salaryMax) && (
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  {application.salaryMin && application.salaryMax
                    ? `$${application.salaryMin.toLocaleString()} - $${application.salaryMax.toLocaleString()}`
                    : application.salaryMin
                    ? `From $${application.salaryMin.toLocaleString()}`
                    : `Up to $${application.salaryMax?.toLocaleString()}`}
                </div>
              )}
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                Applied {format(new Date(application.appliedAt), "PPP")}
              </div>
              {application.followUpAt && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  Follow-up {format(new Date(application.followUpAt), "PPP")}
                </div>
              )}
            </div>
            {application.description && (
              <div className="pt-3 border-t border-border">
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {application.description}
                </p>
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="rounded-xl border border-border p-6 space-y-4">
            <h3 className="font-semibold">Notes</h3>
            <div className="space-y-2">
              <Textarea
                placeholder="Add a note..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="min-h-[80px]"
              />
              <Button
                size="sm"
                onClick={handleAddNote}
                disabled={!newNote.trim() || isAddingNote}
              >
                Add note
              </Button>
            </div>
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {notes.length === 0 ? (
                <p className="text-xs text-muted-foreground">No notes yet.</p>
              ) : (
                notes.map((note) => (
                  <div
                    key={note.id}
                    className="group relative rounded-lg border border-border p-3"
                  >
                    <p className="text-sm whitespace-pre-wrap pr-6">
                      {note.content}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {format(new Date(note.createdAt), "MMM d, yyyy")}
                    </p>
                    <button
                      onClick={() => handleDeleteNote(note.id)}
                      className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity rounded p-1 hover:bg-muted"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
