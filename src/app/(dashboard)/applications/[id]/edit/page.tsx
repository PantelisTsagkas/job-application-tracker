"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ApplicationForm } from "@/components/applications/ApplicationForm";
import { Header } from "@/components/layout/Header";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import type { ApplicationFormValues } from "@/lib/validations";
import type { Application } from "@/types";

export default function EditApplicationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [application, setApplication] = useState<Application | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [id, setId] = useState<string>("");

  useEffect(() => {
    params.then((p) => {
      setId(p.id);
      fetch(`/api/applications/${p.id}`)
        .then((res) => {
          if (!res.ok) throw new Error("Not found");
          return res.json();
        })
        .then(setApplication)
        .catch(() => {
          toast.error("Application not found");
          router.push("/applications");
        });
    });
  }, [params, router]);

  const handleSubmit = async (data: ApplicationFormValues) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to update application");
      }

      toast.success("Application updated!");
      router.push(`/applications/${id}`);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Something went wrong"
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!application) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-[400px] w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Header title={`Edit — ${application.company}`} />
      <ApplicationForm
        application={application}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}
