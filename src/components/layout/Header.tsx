"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const THEME_KEY = "theme";

export function Header({ title }: { title?: string }) {
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
    <header className="flex items-center justify-between pb-6">
      {title && (
        <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
      )}
      <div className="ml-auto">
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
