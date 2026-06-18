"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function Header({ title }: { title?: string }) {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const html = document.documentElement;
    if (dark) {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
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
