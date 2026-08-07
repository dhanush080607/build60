import {
  Flame,
  GitCommitHorizontal,
  Hammer,
  Lock,
  Megaphone,
  NotebookPen,
  Rocket,
  Trophy,
} from "lucide-react";

import { Progress } from "@/components/ui/progress";
import { achievements, useStats } from "@/lib/challenge-store";
import { cn } from "@/lib/utils";

const ICONS = { GitCommitHorizontal, Flame, Hammer, Megaphone, NotebookPen, Rocket } as const;

export function BadgeGrid() {
  const stats = useStats();

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {achievements.map((badge) => {
        const p = stats.badgeProgress.find((b) => b.id === badge.id);
        const value = p?.value ?? 0;
        const unlocked = p?.unlocked ?? false;
        const Icon = ICONS[badge.icon as keyof typeof ICONS] ?? Trophy;

        return (
          <div
            key={badge.id}
            className={cn(
              "rounded-xl border p-4 transition-colors",
              unlocked ? "border-primary/60 bg-primary/10" : "border-border bg-secondary/30",
            )}
          >
            <div className="flex items-start gap-3">
              <span
                className={cn(
                  "grid size-10 shrink-0 place-items-center rounded-lg",
                  unlocked ? "bg-primary text-primary-foreground animate-pop-in" : "bg-secondary text-muted-foreground",
                )}
              >
                {unlocked ? <Icon className="size-5" /> : <Lock className="size-4" />}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">{badge.name}</p>
                <p className="text-xs text-muted-foreground">{badge.description}</p>
                {!unlocked && (
                  <div className="mt-2">
                    <Progress value={(value / badge.target) * 100} className="h-1.5" />
                    <p className="mt-1 font-mono text-[11px] text-muted-foreground">
                      {value}/{badge.target}
                    </p>
                  </div>
                )}
                {unlocked && (
                  <p className="mt-2 font-mono text-[11px] text-primary">unlocked ✓</p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}