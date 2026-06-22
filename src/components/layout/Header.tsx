"use client";

import { Menu, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/layout/sidebar-context";

const THEME_KEY = "theme";

export function Header({ title }: { title?: string }) {
  const sidebar = useSidebar();
  const [dark, setDark] = useState(true);

  useEffect(() => {
    // Reading localStorage on mount (not in the initializer) so the first
    // client render matches the server-rendered markup and avoids a
    // hydration mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDark((localStorage.getItem(THEME_KEY) ?? "dark") === "dark");
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    if (dark) {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
    localStorage.setItem(THEME_KEY, dark ? "dark" : "light");
  }, [dark]);

  return (
    <header className="flex items-center justify-between gap-3 pb-6">
      <div className="flex min-w-0 items-center gap-3">
        {sidebar && (
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 shrink-0 md:hidden"
            onClick={() => sidebar.setMobileOpen(true)}
            aria-label="Open navigation menu"
          >
            <Menu className="h-4 w-4" />
          </Button>
        )}
        {title && (
          <h1 className="truncate text-xl font-semibold tracking-tight">
            {title}
          </h1>
        )}
      </div>
      <div className="shrink-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setDark(!dark)}
          className="h-9 w-9"
        >
          {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
      </div>
    </header>
  );
}
