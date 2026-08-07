import { Link } from "@tanstack/react-router";
import { Check, Lock } from "lucide-react";

import { challenge, useChallenge, useStats } from "@/lib/challenge-store";
import { cn } from "@/lib/utils";

export function ProgressTracker() {
  const { hydrated } = useChallenge();
  const stats = useStats();
  const currentDay = challenge.currentDay;
  const completed = new Set(stats.completedDays);

  if (!hydrated) {
    return (
      <div className="grid grid-cols-10 gap-2">
        {Array.from({ length: 60 }, (_, i) => (
          <div key={i} className="aspect-square animate-pulse rounded-lg bg-secondary" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-10 gap-2">
        {Array.from({ length: challenge.totalDays }, (_, i) => i + 1).map((day) => {
          const isCompleted = completed.has(day);
          const isCurrent = day === currentDay;
          const isLocked = day > currentDay;
          const isMissed = day < currentDay && !isCompleted;

          if (isLocked) {
            return (
              <div
                key={day}
                title={`Day ${day} · locked`}
                aria-label={`Day ${day} locked`}
                className="grid aspect-square cursor-not-allowed place-items-center rounded-lg border border-border/60 bg-secondary/40 font-mono text-[11px] text-muted-foreground/60"
              >
                <Lock className="size-3" />
              </div>
            );
          }

          return (
            <Link
              key={day}
              to="/day/$dayId"
              params={{ dayId: String(day) }}
              title={`Day ${day} · ${isCompleted ? "completed" : isCurrent ? "today" : "missed"}`}
              className={cn(
                "grid aspect-square place-items-center rounded-lg border font-mono text-[11px] transition-transform hover:scale-110",
                isCompleted && "border-primary bg-primary text-primary-foreground",
                isCurrent && !isCompleted && "border-primary bg-primary/15 text-primary animate-pulse-ring",
                isMissed && "border-destructive/40 bg-destructive/10 text-destructive",
              )}
            >
              {isCompleted ? <Check className="size-3.5" /> : day}
            </Link>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap gap-4 font-mono text-xs text-muted-foreground">
        <span className="flex items-center gap-2"><i className="size-3 rounded bg-primary" />completed</span>
        <span className="flex items-center gap-2"><i className="size-3 rounded bg-primary/25" />today</span>
        <span className="flex items-center gap-2"><i className="size-3 rounded bg-destructive/40" />missed</span>
        <span className="flex items-center gap-2"><i className="size-3 rounded bg-secondary" />locked</span>
      </div>
    </div>
  );
}