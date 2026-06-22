"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

interface AnimatedNumberProps {
  value: number;
  decimals?: number;
  suffix?: string;
  duration?: number;
  className?: string;
}

export function AnimatedNumber({
  value,
  decimals = 0,
  suffix = "",
  duration = 900,
  className,
}: AnimatedNumberProps) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const start = performance.now();
    let frame = 0;

    const animate = (now: number) => {
      const progress = easeOutCubic(Math.min((now - start) / duration, 1));
      setDisplay(value * progress);
      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      }
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [value, duration]);

  const formatted =
    decimals > 0 ? display.toFixed(decimals) : String(Math.round(display));

  return (
    <span className={cn("tabular-nums", className)}>
      {formatted}
      {suffix}
    </span>
  );
}
