import {
  Briefcase,
  LayoutGrid,
  FileText,
  BarChart3,
  CheckCircle2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const features = [
  {
    icon: LayoutGrid,
    title: "Kanban pipeline",
    description: "Drag applications through every stage of your search.",
  },
  {
    icon: FileText,
    title: "Notes & details",
    description: "Keep interview prep and contacts in one place.",
  },
  {
    icon: BarChart3,
    title: "Dashboard insights",
    description: "See activity trends and recent updates at a glance.",
  },
];

export function LoginHero() {
  return (
    <div className="relative flex flex-col justify-between overflow-hidden border-b border-border bg-gradient-to-br from-indigo-500/10 via-background to-background px-6 py-10 sm:px-10 lg:border-b-0 lg:border-r lg:px-12 lg:py-16 dark:from-indigo-500/20">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl dark:bg-indigo-500/20"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-indigo-500/5 blur-3xl"
      />

      <div className="relative space-y-8">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10 ring-1 ring-indigo-500/20">
            <Briefcase className="h-6 w-6 text-indigo-500" />
          </div>
          <div>
            <p className="text-lg font-semibold tracking-tight">JobTracker</p>
            <p className="text-sm text-muted-foreground">
              Your personal job search HQ
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <Badge variant="secondary" className="rounded-full px-3 py-1">
            Free & private
          </Badge>
          <h1 className="max-w-md text-3xl font-semibold tracking-tight sm:text-4xl">
            Stay organized from apply to offer
          </h1>
          <p className="max-w-md text-base text-muted-foreground">
            Track companies, roles, and interview stages without spreadsheets
            or sticky notes.
          </p>
        </div>
      </div>

      <ul className="relative mt-10 space-y-4 lg:mt-0">
        {features.map((feature) => (
          <li key={feature.title} className="flex gap-3">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
              <feature.icon className="h-4 w-4 text-indigo-500" />
            </div>
            <div>
              <p className="flex items-center gap-2 text-sm font-medium">
                {feature.title}
                <CheckCircle2 className="h-3.5 w-3.5 text-indigo-500/80" />
              </p>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
