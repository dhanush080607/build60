import {
  ArrowLeft,
  ArrowRight,
  Binary,
  Brain,
  CheckCircle2,
  Layers,
  Rocket,
  Smartphone,
  Sparkle,
  Target,
} from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { challenge, student, useChallenge } from "@/lib/challenge-store";
import { cn } from "@/lib/utils";

const ICONS = { Layers, Brain, Binary, Smartphone } as const;

const GOAL_PRESETS = [
  "Ship 60 public builds and land a summer internship",
  "Become interview-ready with 60 days of DSA proof",
  "Launch my first AI product before campus placements",
];

export function Onboarding() {
  const { hydrated, state, completeOnboarding } = useChallenge();
  const [step, setStep] = useState(0);
  const [track, setTrack] = useState<string | null>(null);
  const [goal, setGoal] = useState("");
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (!hydrated || state.onboarded) return;
    const t = window.setTimeout(() => setStep(1), 1900);
    return () => window.clearTimeout(t);
  }, [hydrated, state.onboarded]);

  useEffect(() => {
    if (step !== 3) return;
    setGenerating(true);
    const t = window.setTimeout(() => setGenerating(false), 1800);
    return () => window.clearTimeout(t);
  }, [step]);

  if (!hydrated || state.onboarded) return null;

  const finish = () => completeOnboarding(track ?? student.track, goal);

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-background">
      <div className="grid-backdrop pointer-events-none absolute inset-0 opacity-60 animate-grid-drift" />
      <div className="relative mx-auto flex min-h-full w-full max-w-2xl flex-col justify-center px-5 py-10">
        {step > 0 && (
          <div className="mb-6 flex items-center gap-2">
            {[1, 2, 3].map((s) => (
              <span
                key={s}
                className={cn(
                  "h-1 flex-1 rounded-full transition-colors duration-500",
                  step >= s ? "bg-primary" : "bg-secondary",
                )}
              />
            ))}
          </div>
        )}

        {step === 0 && (
          <div className="text-center animate-blur-in">
            <div className="mx-auto grid size-20 place-items-center rounded-3xl bg-primary/15 text-primary animate-float">
              <Sparkle className="size-9" />
            </div>
            <h1 className="mt-8 text-4xl font-bold sm:text-5xl">
              Welcome to <span className="shimmer-text">ABTalks</span>
            </h1>
            <p className="mx-auto mt-4 max-w-md text-muted-foreground">
              Sixty days. One build a day. Public proof every time.
            </p>
            <div className="mx-auto mt-8 h-1 w-40 overflow-hidden rounded-full bg-secondary">
              <span className="block h-full w-1/3 rounded-full bg-primary animate-float" />
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="animate-blur-in">
            <p className="font-mono text-xs text-primary">STEP 1 / 3</p>
            <h2 className="mt-2 text-3xl font-bold">Choose your coding track</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              This shapes your daily briefs. You can switch later.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {challenge.tracks.map((t) => {
                const Icon = ICONS[t.icon as keyof typeof ICONS] ?? Target;
                const selected = track === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setTrack(t.id)}
                    aria-pressed={selected}
                    className={cn(
                      "surface-panel p-4 text-left card-hover",
                      selected && "border-primary",
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="grid size-9 place-items-center rounded-lg bg-primary/15 text-primary">
                        <Icon className="size-4" />
                      </span>
                      {selected && <CheckCircle2 className="size-5 text-primary animate-pop-in" />}
                    </div>
                    <p className="mt-3 font-semibold">{t.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{t.tagline}</p>
                  </button>
                );
              })}
            </div>
            <div className="mt-7 flex justify-end">
              <Button disabled={!track} onClick={() => setStep(2)}>
                Continue <ArrowRight className="size-4" />
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-blur-in">
            <p className="font-mono text-xs text-primary">STEP 2 / 3</p>
            <h2 className="mt-2 text-3xl font-bold">Set your 60-day goal</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              One sentence you'll read every morning.
            </p>
            <Input
              className="mt-6 h-12"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="e.g. Ship 60 public builds and land an internship"
              aria-label="Your 60 day goal"
            />
            <div className="mt-3 flex flex-wrap gap-2">
              {GOAL_PRESETS.map((g) => (
                <button
                  key={g}
                  onClick={() => setGoal(g)}
                  className="rounded-full border border-border px-3 py-1 text-left text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  {g}
                </button>
              ))}
            </div>
            <div className="mt-7 flex flex-wrap justify-between gap-3">
              <Button variant="ghost" onClick={() => setStep(1)}>
                <ArrowLeft className="size-4" /> Back
              </Button>
              <Button disabled={!goal.trim()} onClick={() => setStep(3)}>
                Generate my journey <ArrowRight className="size-4" />
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-blur-in text-center">
            <p className="font-mono text-xs text-primary">STEP 3 / 3</p>
            <div className="mx-auto mt-6 grid size-20 place-items-center rounded-3xl bg-primary/15 text-primary animate-float">
              <Rocket className="size-9" />
            </div>
            <h2 className="mt-6 text-3xl font-bold">
              {generating ? "Generating your journey…" : "Your journey is ready"}
            </h2>
            <ul className="mx-auto mt-6 max-w-sm space-y-2 text-left">
              {[
                `${challenge.totalDays} daily briefs on the ${
                  challenge.tracks.find((t) => t.id === track)?.name ?? "Full-Stack"
                } track`,
                "Momentum scoring + streak flame",
                "Achievement badges and global ranking",
              ].map((line, i) => (
                <li
                  key={line}
                  className="flex items-center gap-3 rounded-xl border border-border bg-secondary/30 px-4 py-3 text-sm animate-rise"
                  style={{ animationDelay: `${i * 220}ms` }}
                >
                  <CheckCircle2 className="size-4 shrink-0 text-primary" /> {line}
                </li>
              ))}
            </ul>
            <p className="mt-5 font-mono text-xs text-muted-foreground">goal: {goal}</p>
            <Button size="lg" className="mt-7 w-full sm:w-auto" disabled={generating} onClick={finish}>
              {generating ? "Building…" : "Enter ABTalks"} <ArrowRight className="size-4" />
            </Button>
          </div>
        )}

        {step > 0 && step < 3 && (
          <button
            onClick={finish}
            className="mx-auto mt-8 font-mono text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            skip onboarding
          </button>
        )}
      </div>
    </div>
  );
}