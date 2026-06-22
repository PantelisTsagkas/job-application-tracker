"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { SidebarProvider } from "@/components/layout/sidebar-context";

interface DashboardShellProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  children: React.ReactNode;
}

export function DashboardShell({ user, children }: DashboardShellProps) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar user={user} />
        <main className="min-w-0 flex-1 overflow-y-auto p-4 md:ml-[240px] md:p-6">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
