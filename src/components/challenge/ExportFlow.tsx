import { ArrowDown, Copy, Github, Globe, Rocket } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

export const SUBMISSION = {
  repo: "github.com/yourname/abtalks-challenge",
  live: "abtalks-challenge.vercel.app",
};

const STEPS = [
  {
    icon: Github,
    title: "GitHub Repository",
    body: "Push your challenge code with clean, conventional commits.",
    value: SUBMISSION.repo,
  },
  {
    icon: Rocket,
    title: "Vercel Deployment",
    body: "Import the repo into Vercel — build runs on every push.",
    value: "vercel.com/new · framework auto-detected",
  },
  {
    icon: Globe,
    title: "Live URL",
    body: "Share the deployed link as your submission proof.",
    value: SUBMISSION.live,
  },
];

export function ExportFlow() {
  const copy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Copy failed — select the text manually");
    }
  };

  return (
    <div className="space-y-2">
      {STEPS.map((step, i) => (
        <div key={step.title}>
          <div className="group flex items-start gap-3 rounded-xl border border-border bg-secondary/25 p-4 card-hover">
            <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary/15 text-primary">
              <step.icon className="size-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">{step.title}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{step.body}</p>
              <p className="mt-2 truncate font-mono text-[11px] text-primary">{step.value}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0"
              aria-label={`Copy ${step.title}`}
              onClick={() => copy(step.value)}
            >
              <Copy className="size-4" />
            </Button>
          </div>
          {i < STEPS.length - 1 && (
            <div className="flex justify-center py-1 text-muted-foreground">
              <ArrowDown className="size-4 animate-float" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}