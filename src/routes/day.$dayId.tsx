import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Github,
  Linkedin,
  Lock,
  NotebookPen,
  PartyPopper,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { AICoach } from "@/components/challenge/AICoach";
import { AnimatedNumber } from "@/components/challenge/AnimatedNumber";
import { Confetti } from "@/components/challenge/Confetti";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  challenge,
  dayMomentum,
  getDayContent,
  isValidUrl,
  useChallenge,
} from "@/lib/challenge-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/day/$dayId")({
  head: () => ({
    meta: [
      { title: "Challenge Day — 60 Days of Shipping" },
      {
        name: "description",
        content:
          "Work through the daily checklist, submit GitHub and LinkedIn proof, write your reflection and complete the day.",
      },
      { property: "og:title", content: "Challenge Day — 60 Days of Shipping" },
      { property: "og:description", content: "Checklist, proof submissions and reflection for today's build." },
    ],
  }),
  component: DayPage,
});

function DayPage() {
  const { dayId } = useParams({ from: "/day/$dayId" });
  const navigate = useNavigate();
  const day = Number(dayId);
  const { hydrated, getDay, updateDay, toggleTask, completeDay, reopenDay } = useChallenge();
  const [celebrate, setCelebrate] = useState(false);

  const content = getDayContent(day);
  const dayState = getDay(day);

  const [repo, setRepo] = useState("");
  const [commit, setCommit] = useState("");
  const [postUrl, setPostUrl] = useState("");
  const [learned, setLearned] = useState("");
  const [overcame, setOvercame] = useState("");
  const [ghErrors, setGhErrors] = useState<{ repo?: string; commit?: string }>({});
  const [liError, setLiError] = useState<string | null>(null);
  const [reflectionError, setReflectionError] = useState<string | null>(null);

  useEffect(() => {
    if (!hydrated) return;
    const d = getDay(day);
    setRepo(d.github.repo);
    setCommit(d.github.commit);
    setPostUrl(d.linkedin.url);
    setLearned(d.reflection.learned);
    setOvercame(d.reflection.overcame);
    setGhErrors({});
    setLiError(null);
    setReflectionError(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [day, hydrated]);

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash === "#submission") {
      document.getElementById("submission")?.scrollIntoView({ behavior: "smooth" });
    }
  }, [hydrated]);

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-4xl space-y-4 px-5 py-16">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-56 w-full" />
      </div>
    );
  }

  if (!Number.isInteger(day) || day < 1 || day > challenge.totalDays) {
    return (
      <div className="mx-auto max-w-md px-5 py-24 text-center">
        <h1 className="text-2xl font-bold">Day not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Days run from 1 to {challenge.totalDays}.
        </p>
        <Link to="/dashboard" className="mt-6 inline-block">
          <Button>Back to dashboard</Button>
        </Link>
      </div>
    );
  }

  if (day > challenge.currentDay) {
    return (
      <div className="mx-auto max-w-md px-5 py-24 text-center">
        <Lock className="mx-auto size-8 text-muted-foreground" />
        <h1 className="mt-4 text-2xl font-bold">Day {day} is locked</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Unlocks after you reach it. You're on day {challenge.currentDay}.
        </p>
        <Link to="/dashboard" className="mt-6 inline-block">
          <Button>Back to dashboard</Button>
        </Link>
      </div>
    );
  }

  const checklistDone = dayState.checklist.length >= content.checklist.length;
  const checklistPct = Math.round((dayState.checklist.length / content.checklist.length) * 100);
  const reflectionDone = Boolean(dayState.reflection.learned.trim() && dayState.reflection.overcame.trim());
  const momentum = dayMomentum(dayState, content.checklist.length);
  const canComplete =
    checklistDone && dayState.github.verified && dayState.linkedin.verified && reflectionDone;

  const submitGithub = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { repo?: string; commit?: string } = {};
    if (!repo.trim()) errors.repo = "Repository URL is required.";
    else if (!isValidUrl(repo, "github.com")) errors.repo = "Enter a valid GitHub repository URL.";
    if (!commit.trim()) errors.commit = "Commit URL is required.";
    else if (!isValidUrl(commit, "github.com")) errors.commit = "Enter a valid GitHub commit URL.";
    setGhErrors(errors);
    if (Object.keys(errors).length > 0) {
      updateDay(day, { github: { repo, commit, verified: false } });
      return;
    }
    updateDay(day, { github: { repo: repo.trim(), commit: commit.trim(), verified: true } });
    toast.success("GitHub proof verified ✓");
  };

  const submitLinkedin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postUrl.trim()) {
      setLiError("LinkedIn post URL is required.");
      updateDay(day, { linkedin: { url: postUrl, verified: false } });
      return;
    }
    if (!isValidUrl(postUrl, "linkedin.com")) {
      setLiError("Enter a valid LinkedIn post URL.");
      updateDay(day, { linkedin: { url: postUrl, verified: false } });
      return;
    }
    setLiError(null);
    updateDay(day, { linkedin: { url: postUrl.trim(), verified: true } });
    toast.success("LinkedIn proof verified ✓");
  };

  const saveReflection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!learned.trim() || !overcame.trim()) {
      setReflectionError("Answer both questions to complete your reflection.");
      return;
    }
    setReflectionError(null);
    updateDay(day, {
      reflection: {
        learned: learned.trim(),
        overcame: overcame.trim(),
        savedAt: new Date().toISOString(),
      },
    });
    toast.success("Reflection saved");
  };

  const finishDay = () => {
    if (!canComplete) return;
    completeDay(day);
    setCelebrate(true);
    toast.success(`Day ${day} completed! Streak updated.`);
    window.setTimeout(() => setCelebrate(false), 3500);
  };

  return (
    <div className="min-h-screen">
      <Confetti show={celebrate} />

      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-5 py-4">
          <Link to="/dashboard" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-4" /> Dashboard
          </Link>
          <span className="font-mono text-xs text-muted-foreground">
            day {day} / {challenge.totalDays}
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-4xl space-y-6 px-5 py-10">
        <section className="surface-panel p-6">
          <p className="font-mono text-xs text-primary">DAY {day} · {content.focus}</p>
          <h1 className="mt-2 text-3xl font-bold">{content.title}</h1>
          <p className="mt-3 text-muted-foreground">{content.brief}</p>
          <div className="mt-5 flex flex-wrap items-center gap-4">
            <span className="rounded-full bg-secondary px-3 py-1 font-mono text-xs">{content.estimate}</span>
            <span className="font-mono text-sm">
              momentum <AnimatedNumber value={momentum} className="font-bold text-primary" />/100
            </span>
            {dayState.completed && (
              <span className="flex items-center gap-1 font-mono text-xs text-primary">
                <CheckCircle2 className="size-4" /> completed
              </span>
            )}
          </div>
          <Progress value={momentum} className="mt-4 h-2" />
          {content.resources.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {content.resources.map((r) => (
                <a
                  key={r.url}
                  href={r.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  <BookOpen className="size-3" /> {r.label}
                </a>
              ))}
            </div>
          )}
        </section>

        <section className="surface-panel p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Task checklist</h2>
            <span className="font-mono text-xs text-muted-foreground">
              {dayState.checklist.length}/{content.checklist.length} · {checklistPct}%
            </span>
          </div>
          <Progress value={checklistPct} className="mt-3 h-2" />
          <ul className="mt-4 space-y-2">
            {content.checklist.map((task) => {
              const checked = dayState.checklist.includes(task.id);
              return (
                <li
                  key={task.id}
                  className={cn(
                    "flex items-center gap-3 rounded-xl border px-4 py-3 transition-all",
                    checked ? "border-primary/60 bg-primary/10" : "border-border bg-secondary/25",
                  )}
                >
                  <Checkbox
                    id={`${day}-${task.id}`}
                    checked={checked}
                    onCheckedChange={() => toggleTask(day, task.id)}
                  />
                  <Label
                    htmlFor={`${day}-${task.id}`}
                    className={cn(
                      "cursor-pointer text-sm font-normal",
                      checked && "text-muted-foreground line-through",
                    )}
                  >
                    {task.label}
                  </Label>
                  {checked && <CheckCircle2 className="ml-auto size-4 text-primary animate-pop-in" />}
                </li>
              );
            })}
          </ul>
        </section>

        <section id="submission" className="grid gap-6 scroll-mt-20 md:grid-cols-2">
          <form onSubmit={submitGithub} className="surface-panel space-y-4 p-6" noValidate>
            <div className="flex items-center gap-2">
              <Github className="size-4" />
              <h2 className="text-lg font-semibold">GitHub submission</h2>
            </div>
            <div className="space-y-2">
              <Label htmlFor="repo">Repository URL</Label>
              <Input
                id="repo"
                value={repo}
                onChange={(e) => setRepo(e.target.value)}
                placeholder="https://github.com/you/project"
                aria-invalid={Boolean(ghErrors.repo)}
              />
              {ghErrors.repo && <p className="text-xs text-destructive">{ghErrors.repo}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="commit">Commit URL</Label>
              <Input
                id="commit"
                value={commit}
                onChange={(e) => setCommit(e.target.value)}
                placeholder="https://github.com/you/project/commit/abc123"
                aria-invalid={Boolean(ghErrors.commit)}
              />
              {ghErrors.commit && <p className="text-xs text-destructive">{ghErrors.commit}</p>}
            </div>
            <Button type="submit" className="w-full">
              Verify GitHub proof
            </Button>
            {dayState.github.verified && (
              <p className="font-mono text-xs text-primary animate-pop-in">GitHub proof verified ✓ (+40)</p>
            )}
          </form>

          <form onSubmit={submitLinkedin} className="surface-panel space-y-4 p-6" noValidate>
            <div className="flex items-center gap-2">
              <Linkedin className="size-4" />
              <h2 className="text-lg font-semibold">LinkedIn submission</h2>
            </div>
            <div className="space-y-2">
              <Label htmlFor="post">LinkedIn post URL</Label>
              <Input
                id="post"
                value={postUrl}
                onChange={(e) => setPostUrl(e.target.value)}
                placeholder="https://www.linkedin.com/posts/you_day12-activity"
                aria-invalid={Boolean(liError)}
              />
              {liError && <p className="text-xs text-destructive">{liError}</p>}
            </div>
            <Button type="submit" className="w-full">
              Verify LinkedIn proof
            </Button>
            {dayState.linkedin.verified && (
              <p className="font-mono text-xs text-primary animate-pop-in">LinkedIn proof verified ✓ (+30)</p>
            )}
          </form>
        </section>

        <form onSubmit={saveReflection} className="surface-panel space-y-4 p-6" noValidate>
          <div className="flex items-center gap-2">
            <NotebookPen className="size-4" />
            <h2 className="text-lg font-semibold">Reflection journal</h2>
          </div>
          <div className="space-y-2">
            <Label htmlFor="learned">What did you learn today?</Label>
            <Textarea id="learned" value={learned} onChange={(e) => setLearned(e.target.value)} rows={3} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="overcame">What challenge did you overcome?</Label>
            <Textarea id="overcame" value={overcame} onChange={(e) => setOvercame(e.target.value)} rows={3} />
          </div>
          {reflectionError && <p className="text-xs text-destructive">{reflectionError}</p>}
          <div className="flex items-center gap-3">
            <Button type="submit" variant="secondary">
              Save reflection
            </Button>
            {reflectionDone && <span className="font-mono text-xs text-primary">reflection saved ✓ (+10)</span>}
          </div>
        </form>

        <section className="surface-panel p-6">
          <h2 className="text-lg font-semibold">Complete Day {day}</h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {[
              { label: "Checklist completed", done: checklistDone },
              { label: "GitHub proof added", done: dayState.github.verified },
              { label: "LinkedIn proof added", done: dayState.linkedin.verified },
              { label: "Reflection completed", done: reflectionDone },
            ].map((req) => (
              <li
                key={req.label}
                className={cn(
                  "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm",
                  req.done ? "border-primary/50 text-primary" : "border-border text-muted-foreground",
                )}
              >
                <CheckCircle2 className={cn("size-4", !req.done && "opacity-30")} /> {req.label}
              </li>
            ))}
          </ul>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            {dayState.completed ? (
              <>
                <span className="flex items-center gap-2 font-mono text-sm text-primary">
                  <PartyPopper className="size-4" /> Day {day} complete
                </span>
                <Button variant="outline" onClick={() => reopenDay(day)}>
                  Reopen day
                </Button>
              </>
            ) : (
              <Button size="lg" disabled={!canComplete} onClick={finishDay}>
                Complete Day {day}
              </Button>
            )}
            <Button variant="ghost" onClick={() => navigate({ to: "/dashboard" })}>
              Back to dashboard
            </Button>
          </div>
          {!canComplete && !dayState.completed && (
            <p className="mt-3 text-xs text-muted-foreground">
              Finish every requirement above to unlock day completion.
            </p>
          )}
        </section>
      </main>

      <AICoach />
    </div>
  );
}