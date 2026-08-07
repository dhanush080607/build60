import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  CalendarDays,
  Flame,
  Gauge,
  Rocket,
  Target,
  Trophy,
  UserPlus,
} from "lucide-react";

import { AICoach } from "@/components/challenge/AICoach";
import { AnimatedNumber } from "@/components/challenge/AnimatedNumber";
import { BadgeGrid } from "@/components/challenge/BadgeGrid";
import { ProgressTracker } from "@/components/challenge/ProgressTracker";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  challenge,
  getDayContent,
  student,
  useChallenge,
  useStats,
} from "@/lib/challenge-store";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Student Dashboard — 60 Days of Shipping" },
      {
        name: "description",
        content:
          "Track your streak, momentum score, 60 day progress grid, achievements and today's build task.",
      },
      { property: "og:title", content: "Student Dashboard — 60 Days of Shipping" },
      { property: "og:description", content: "Your streak, momentum and daily build task in one place." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const navigate = useNavigate();
  const { hydrated, profile, state, startChallenge, resetAll } = useChallenge();
  const stats = useStats();
  const currentDay = challenge.currentDay;
  const today = getDayContent(currentDay);
  const todayState = state.days[String(currentDay)];

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-6xl space-y-4 px-5 py-16">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const streakCopy =
    stats.streakState === "new"
      ? "Your first commit starts your journey."
      : stats.streakState === "missed"
        ? "You missed a day — recovery mode. Complete today to restart your streak."
        : `${stats.streak} day streak. Keep it alive.`;

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <Link to="/" className="flex items-center gap-2 font-mono text-sm font-semibold">
            <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground">60</span>
            days_of_shipping
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={resetAll}>
              Reset progress
            </Button>
            <Link to="/day/$dayId" params={{ dayId: String(currentDay) }}>
              <Button size="sm">Day {currentDay}</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 px-5 py-10">
        {!profile ? (
          <div className="surface-panel flex flex-wrap items-center justify-between gap-4 p-6">
            <div className="flex items-center gap-3">
              <UserPlus className="size-5 text-primary" />
              <div>
                <p className="font-semibold">No profile loaded yet</p>
                <p className="text-sm text-muted-foreground">
                  Activate your student profile to unlock streaks and momentum tracking.
                </p>
              </div>
            </div>
            <Button onClick={startChallenge}>Activate profile</Button>
          </div>
        ) : (
          <div className="surface-panel flex flex-wrap items-center gap-4 p-6">
            <span className="grid size-14 place-items-center rounded-xl bg-primary text-lg font-bold text-primary-foreground">
              {student.avatarInitials}
            </span>
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-bold">{student.name}</h1>
              <p className="font-mono text-xs text-muted-foreground">
                {student.handle} · {student.year} · {student.college}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{student.goal}</p>
            </div>
            <span className="rounded-full bg-secondary px-3 py-1 font-mono text-xs">
              track: {state.selectedTrack ?? student.track}
            </span>
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-3">
          <div className="surface-panel p-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Flame className="size-4 text-primary" /> Streak
            </div>
            <p className="mt-3 font-mono text-4xl font-bold">
              <AnimatedNumber value={stats.streak} />
              <span className="ml-1 text-base text-muted-foreground">days</span>
            </p>
            <p className="mt-2 text-sm text-muted-foreground">{streakCopy}</p>
          </div>

          <div className="surface-panel p-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Gauge className="size-4 text-accent" /> Momentum score
            </div>
            <p className="mt-3 font-mono text-4xl font-bold">
              <AnimatedNumber value={stats.momentum} />
              <span className="text-base text-muted-foreground">/100</span>
            </p>
            <Progress value={stats.momentum} className="mt-3 h-2" />
            <p className="mt-2 text-xs text-muted-foreground">
              GitHub 40 · LinkedIn 30 · Checklist 20 · Reflection 10
            </p>
          </div>

          <div className="surface-panel p-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Trophy className="size-4 text-warning" /> Completion
            </div>
            <p className="mt-3 font-mono text-4xl font-bold">
              <AnimatedNumber value={stats.completionPct} suffix="%" />
            </p>
            <Progress value={stats.completionPct} className="mt-3 h-2" />
            <p className="mt-2 text-xs text-muted-foreground">
              {stats.completedCount} of {challenge.totalDays} days · {stats.unlocked.length} badges
            </p>
          </div>
        </div>

        <section className="surface-panel p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="font-mono text-xs text-primary">TODAY · DAY {currentDay}</p>
              <h2 className="mt-1 text-xl font-semibold">{today.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {today.focus} · {today.estimate}
              </p>
              <p className="mt-3 max-w-2xl text-sm text-muted-foreground">{today.brief}</p>
              {todayState?.completed && (
                <p className="mt-3 font-mono text-xs text-primary">day {currentDay} completed ✓</p>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => navigate({ to: "/day/$dayId", params: { dayId: String(currentDay) } })}>
                Start Building <ArrowRight className="size-4" />
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  navigate({
                    to: "/day/$dayId",
                    params: { dayId: String(currentDay) },
                    hash: "submission",
                  })
                }
              >
                Submit Proof
              </Button>
            </div>
          </div>
        </section>

        <section className="surface-panel p-6">
          <div className="mb-5 flex items-center gap-2">
            <CalendarDays className="size-4 text-primary" />
            <h2 className="text-lg font-semibold">60 day progress tracker</h2>
          </div>
          <ProgressTracker />
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="surface-panel p-6">
            <div className="mb-5 flex items-center gap-2">
              <Target className="size-4 text-primary" />
              <h2 className="text-lg font-semibold">Achievements</h2>
            </div>
            <BadgeGrid />
          </section>

          <section className="surface-panel p-6">
            <div className="mb-5 flex items-center gap-2">
              <Rocket className="size-4 text-accent" />
              <h2 className="text-lg font-semibold">Reflection timeline</h2>
            </div>
            <ReflectionTimeline />
          </section>
        </div>
      </main>

      <AICoach />
    </div>
  );
}

function ReflectionTimeline() {
  const { state } = useChallenge();
  const entries = Object.entries(state.days)
    .filter(([, d]) => d.reflection.learned.trim() || d.reflection.overcame.trim())
    .sort((a, b) => Number(b[0]) - Number(a[0]));

  if (entries.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No reflections yet. Write your first one on a challenge day and it will appear here.
      </p>
    );
  }

  return (
    <ol className="space-y-3">
      {entries.map(([day, d]) => (
        <li key={day} className="rounded-xl border border-border bg-secondary/30 p-4 animate-rise">
          <div className="flex items-center justify-between">
            <p className="font-mono text-xs text-primary">DAY {day}</p>
            {d.reflection.savedAt && (
              <p className="font-mono text-[11px] text-muted-foreground">
                {new Date(d.reflection.savedAt).toLocaleDateString()}
              </p>
            )}
          </div>
          {d.reflection.learned && (
            <p className="mt-2 text-sm">
              <span className="text-muted-foreground">Learned: </span>
              {d.reflection.learned}
            </p>
          )}
          {d.reflection.overcame && (
            <p className="mt-1 text-sm">
              <span className="text-muted-foreground">Overcame: </span>
              {d.reflection.overcame}
            </p>
          )}
        </li>
      ))}
    </ol>
  );
}