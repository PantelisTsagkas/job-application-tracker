"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ApplicationForm } from "@/components/applications/ApplicationForm";
import { Header } from "@/components/layout/Header";
import { toast } from "sonner";
import type { ApplicationFormValues } from "@/lib/validations";

export default function NewApplicationPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: ApplicationFormValues) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to create application");
      }

      toast.success("Application created!");
      router.push("/applications");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Something went wrong"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Header title="New Application" />
      <ApplicationForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
}
