import { Crown, Medal, TrendingUp, Users } from "lucide-react";

import { Progress } from "@/components/ui/progress";
import { student, useStats } from "@/lib/challenge-store";

const TOTAL_LEARNERS = 50000;
const BASE_RANK = 247;

const LEADERBOARD = [
  { name: "Ishita Rao", college: "BITS Pilani", days: 58, rank: 1 },
  { name: "Daniel Osei", college: "NIT Trichy", days: 55, rank: 2 },
  { name: "Mei Tanaka", college: "IIT Bombay", days: 54, rank: 3 },
];

export function RankCard() {
  const stats = useStats();
  const rank = Math.max(1, BASE_RANK - stats.completedCount * 7 - stats.streak * 3);
  const percentile = ((1 - rank / TOTAL_LEARNERS) * 100).toFixed(1);

  return (
    <div className="space-y-5">
      <div className="relative overflow-hidden rounded-xl border border-primary/40 bg-primary/10 p-5">
        <span className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 skew-x-12 bg-primary/10 blur-2xl" />
        <div className="relative flex items-start gap-4">
          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
            <Crown className="size-5" />
          </span>
          <div className="min-w-0">
            <p className="text-lg font-bold leading-snug">
              You are ranked{" "}
              <span className="font-mono text-primary">#{rank.toLocaleString()}</span> among{" "}
              {TOTAL_LEARNERS.toLocaleString()} learners
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Top {percentile}% globally · {student.college} cohort
            </p>
          </div>
        </div>
        <Progress value={Number(percentile)} className="relative mt-4 h-1.5" />
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Global rank", value: `#${rank.toLocaleString()}`, icon: Medal },
          { label: "Weekly climb", value: `+${12 + stats.completedCount}`, icon: TrendingUp },
          { label: "Cohort size", value: "50k", icon: Users },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-secondary/30 p-3">
            <s.icon className="mb-2 size-4 text-accent" />
            <p className="font-mono text-base font-semibold">{s.value}</p>
            <p className="text-[11px] leading-tight text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <ol className="space-y-2">
        {LEADERBOARD.map((l) => (
          <li
            key={l.rank}
            className="flex items-center gap-3 rounded-xl border border-border bg-secondary/25 px-3 py-2"
          >
            <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-secondary font-mono text-xs">
              {l.rank}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{l.name}</p>
              <p className="truncate text-[11px] text-muted-foreground">{l.college}</p>
            </div>
            <span className="shrink-0 font-mono text-xs text-primary">{l.days}d</span>
          </li>
        ))}
        <li className="flex items-center gap-3 rounded-xl border border-primary/50 bg-primary/10 px-3 py-2">
          <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-primary font-mono text-[10px] text-primary-foreground">
            {rank}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{student.name} (you)</p>
            <p className="truncate text-[11px] text-muted-foreground">{student.college}</p>
          </div>
          <span className="shrink-0 font-mono text-xs text-primary">{stats.completedCount}d</span>
        </li>
      </ol>
    </div>
  );
}