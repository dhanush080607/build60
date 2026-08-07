import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  Binary,
  Brain,
  CheckCircle2,
  Flame,
  Layers,
  Smartphone,
  Target,
  Trophy,
} from "lucide-react";
import { useRef } from "react";
import { toast } from "sonner";

import { AICoach } from "@/components/challenge/AICoach";
import { Onboarding } from "@/components/challenge/Onboarding";
import { StreakFlame } from "@/components/challenge/StreakFlame";
import { Button } from "@/components/ui/button";
import { challenge, useChallenge, useStats } from "@/lib/challenge-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ABTalks — 60 Day Student Coding Challenge" },
      {
        name: "description",
        content:
          "ABTalks is a 60 day student build challenge: daily tasks, GitHub and LinkedIn proof, streak flame, momentum score and achievements.",
      },
      { property: "og:title", content: "ABTalks — 60 Day Student Coding Challenge" },
      {
        property: "og:description",
        content: "Daily builds, public proof, real momentum. Start your 60 day streak today.",
      },
    ],
  }),
  component: Landing,
});

const ICONS = { Layers, Brain, Binary, Smartphone } as const;

function Landing() {
  const navigate = useNavigate();
  const tracksRef = useRef<HTMLElement>(null);
  const { state, selectTrack, startChallenge, hydrated } = useChallenge();
  const stats = useStats();

  const start = () => {
    startChallenge();
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="min-h-screen">
      <Onboarding />
      <header className="sticky top-0 z-40 border-b border-border bg-background/70 backdrop-blur-xl">
        <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 sm:px-5 sm:py-4">
          <Link to="/" className="flex min-w-0 items-center gap-2 font-mono text-sm font-semibold">
            <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground">
              AB
            </span>
            <span className="truncate">abtalks</span>
          </Link>
          <nav className="flex shrink-0 items-center gap-1 sm:gap-2">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm">
                Dashboard
              </Button>
            </Link>
            <Button size="sm" onClick={start}>
              <span className="hidden sm:inline">Start My Challenge</span>
              <span className="sm:hidden">Start</span>
            </Button>
          </nav>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
          <div className="grid-backdrop pointer-events-none absolute inset-0 opacity-70" />
          <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-5 sm:py-24">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 font-mono text-[11px] text-muted-foreground sm:text-xs animate-blur-in">
              <Flame className="size-3.5 text-primary" />
              Cohort 04 · {challenge.totalDays} days · 4 tracks
            </p>
            <h1
              className="max-w-3xl text-[2.6rem] font-bold leading-[1.05] sm:text-6xl lg:text-7xl animate-blur-in"
              style={{ animationDelay: "80ms" }}
            >
              Ship something real, <span className="text-gradient">every single day</span>.
            </h1>
            <p
              className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg animate-blur-in"
              style={{ animationDelay: "160ms" }}
            >
              ABTalks is a 60 day build challenge for students. Daily tasks, public GitHub and
              LinkedIn proof, momentum scoring and badges that actually mean something.
            </p>
            <div
              className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap animate-blur-in"
              style={{ animationDelay: "240ms" }}
            >
              <Button size="lg" className="w-full sm:w-auto" onClick={start}>
                Start My Challenge <ArrowRight className="size-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto"
                onClick={() => tracksRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
              >
                Explore Tracks
              </Button>
            </div>

            <div className="mt-12 flex items-center gap-4 rounded-2xl border border-border bg-card/60 p-4 sm:max-w-md">
              <StreakFlame streak={hydrated ? stats.streak : 0} />
              <div className="min-w-0">
                <p className="font-mono text-xs text-muted-foreground">your streak flame</p>
                <p className="text-xl font-bold">
                  {hydrated ? stats.streak : 0} day{stats.streak === 1 ? "" : "s"}
                </p>
                <p className="text-xs text-muted-foreground">
                  Intensity grows with every day you ship.
                </p>
              </div>
            </div>

            <dl className="mt-8 grid max-w-2xl grid-cols-3 gap-3 sm:gap-4">
              {[
                { label: "Days completed", value: hydrated ? stats.completedCount : 0, icon: CheckCircle2 },
                { label: "Current streak", value: hydrated ? stats.streak : 0, icon: Flame },
                { label: "Badges unlocked", value: hydrated ? stats.unlocked.length : 0, icon: Trophy },
              ].map((s) => (
                <div key={s.label} className="surface-panel p-3 sm:p-4 card-hover">
                  <s.icon className="mb-2 size-4 text-primary" />
                  <dd className="font-mono text-xl font-semibold sm:text-2xl">{s.value}</dd>
                  <dt className="text-[11px] leading-tight text-muted-foreground sm:text-xs">{s.label}</dt>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section ref={tracksRef} id="tracks" className="scroll-mt-20 border-t border-border">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-5 sm:py-20">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold sm:text-3xl">Challenge tracks</h2>
                <p className="mt-2 text-muted-foreground">
                  Pick the lane you want to be known for. You can switch later.
                </p>
              </div>
              {state.selectedTrack && (
                <span className="rounded-full bg-primary/15 px-3 py-1 font-mono text-xs text-primary">
                  selected: {state.selectedTrack}
                </span>
              )}
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
              {challenge.tracks.map((track) => {
                const Icon = ICONS[track.icon as keyof typeof ICONS] ?? Target;
                const selected = state.selectedTrack === track.id;
                return (
                  <button
                    key={track.id}
                    onClick={() => {
                      selectTrack(track.id);
                      toast.success(
                        selected ? `${track.name} deselected` : `${track.name} track selected`,
                      );
                    }}
                    aria-pressed={selected}
                    className={cn(
                      "group surface-panel p-5 text-left card-hover",
                      selected && "border-primary",
                    )}
                    style={selected ? { boxShadow: "var(--shadow-glow)" } : undefined}
                  >
                    <div className="flex items-start justify-between">
                      <span className="grid size-10 place-items-center rounded-lg bg-primary/15 text-primary">
                        <Icon className="size-5" />
                      </span>
                      {selected && <CheckCircle2 className="size-5 text-primary animate-pop-in" />}
                    </div>
                    <h3 className="mt-4 font-semibold">{track.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{track.tagline}</p>
                    <p className="mt-4 font-mono text-xs text-muted-foreground">
                      {track.projects} projects · {track.difficulty}
                    </p>
                    <span className="mt-3 inline-block text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                      {selected ? "Selected track" : "Click to select"}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-8 sm:mt-10">
              <Button variant="secondary" className="w-full sm:w-auto" onClick={start}>
                Continue to dashboard <ArrowRight className="size-4" />
              </Button>
            </div>
          </div>
        </section>

        <section className="border-t border-border bg-card/40">
          <div className="mx-auto grid max-w-6xl gap-4 px-4 py-14 sm:gap-6 sm:px-5 sm:py-20 md:grid-cols-3">
            {[
              {
                title: "Proof, not promises",
                body: "Every day needs a GitHub commit and a public LinkedIn post. Verified before the day closes.",
              },
              {
                title: "Momentum scoring",
                body: "Checklist, commits, posts and reflections combine into a live 100 point momentum score.",
              },
              {
                title: "Badges that compound",
                body: "First Commit, 7 Day Warrior, Project Builder and more — each with visible progress.",
              },
            ].map((f) => (
              <div key={f.title} className="surface-panel p-5 sm:p-6 card-hover">
                <h3 className="font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-border px-4 py-8 text-center font-mono text-xs text-muted-foreground">
        built for students who ship · ABTalks · {challenge.name}
      </footer>

      <AICoach />
    </div>
  );
}
