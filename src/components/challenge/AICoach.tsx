import { MessageSquareCode, Send, Sparkle, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { StreakFlame } from "@/components/challenge/StreakFlame";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { challenge, student, useChallenge, useStats } from "@/lib/challenge-store";
import { cn } from "@/lib/utils";

type Msg = { id: string; role: "coach" | "user"; text: string };

let seq = 0;
const nextId = () => `m${++seq}`;

export function AICoach() {
  const [open, setOpen] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [input, setInput] = useState("");
  const stats = useStats();
  const { state } = useChallenge();
  const [messages, setMessages] = useState<Msg[]>([
    {
      id: "m0",
      role: "coach",
      text: `Hey ${student.name.split(" ")[0]} — I'm Nova, your AI coding mentor. I track your streak, your momentum and your proof. Ask me anything about today's build.`,
    },
  ]);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, thinking, open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const coachReply = (question: string) => {
    const q = question.toLowerCase();
    const day = challenge.currentDay;
    const todayState = state.days[String(day)];

    if (q.includes("streak") || q.includes("flame")) {
      if (stats.streak === 0) {
        return "Your flame is unlit right now — that's fine, day one is always the hardest. Complete today's checklist and one commit, and the streak restarts tonight.";
      }
      return `${stats.streak} day streak — your flame is ${
        stats.streak >= 14 ? "an inferno 🔥" : stats.streak >= 7 ? "blazing" : "catching"
      }. Statistically, learners who pass day 7 finish the 60. Protect the chain today.`;
    }

    if (q.includes("next") || q.includes("what should") || q.includes("stuck")) {
      if (!todayState?.github.verified) {
        return `Next step: get Day ${day}'s GitHub proof in. Even a small scoped commit is worth 40 momentum points and unblocks everything else.`;
      }
      if (!todayState?.linkedin.verified) {
        return "Commit's in — now write the LinkedIn post. Lead with the problem you hit, not the framework. That's +30 momentum and the part that compounds publicly.";
      }
      if (!todayState?.reflection.learned) {
        return "Both proofs are verified. Close the loop with your reflection: what you learned, what you overcame. Ten points, two minutes, huge recall benefit.";
      }
      return `Day ${day} is fully proven. Take a walk, then pre-read tomorrow's brief so you start warm.`;
    }

    if (q.includes("badge") || q.includes("achievement") || q.includes("rank")) {
      const next = stats.badgeProgress.find((b) => !b.unlocked);
      return next
        ? `You've unlocked ${stats.unlocked.length} badge${stats.unlocked.length === 1 ? "" : "s"}. Closest one is ${next.value}/${next.target} — genuinely within reach this week. Your global rank climbs with every completed day.`
        : "Every badge unlocked. That puts you in rare company — time to mentor someone behind you.";
    }

    if (q.includes("momentum") || q.includes("score")) {
      return `Today's momentum is ${stats.momentum}/100. The split is GitHub 40, LinkedIn 30, checklist 20, reflection 10 — so the fastest jump is always the piece you've skipped.`;
    }

    if (q.includes("tired") || q.includes("give up") || q.includes("motivat") || q.includes("hard")) {
      return `You've completed ${stats.completedCount} days that most people only talk about. Motivation is unreliable; a 20 minute commit isn't. Shrink today's scope, ship it, keep the flame.`;
    }

    if (q.includes("celebrat") || q.includes("done") || q.includes("finished")) {
      return `That's a win — log it. ${stats.completedCount} days shipped, ${stats.submissions} commits proven, ${stats.linkedinPosts} public posts. This is a portfolio building itself.`;
    }

    return `On Day ${day} — "${challenge.days[0]?.title ?? "today's build"}" — I'd split it into three 40-minute blocks: model the data, build the surface, ship the proof. Tell me which block feels hardest and I'll break it down further.`;
  };
  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setMessages((m) => [...m, { id: nextId(), role: "user", text: trimmed }]);
    setInput("");
    setThinking(true);
    window.setTimeout(() => {
      setMessages((m) => [...m, { id: nextId(), role: "coach", text: coachReply(trimmed) }]);
      setThinking(false);
      inputRef.current?.focus();
    }, 800);
  };

  return (
    <>
      {open && (
        <div className="fixed bottom-20 right-3 z-50 flex h-[min(30rem,calc(100dvh-7rem))] w-[min(23rem,calc(100vw-1.5rem))] flex-col surface-panel animate-pop-in overflow-hidden sm:bottom-24 sm:right-5">
          <div className="flex items-center gap-3 border-b border-border bg-secondary/40 px-4 py-3">
            <div className="relative grid size-9 shrink-0 place-items-center rounded-full bg-primary/15 text-primary">
              <Sparkle className="size-4" />
              <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-card bg-success" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">Nova · AI Coding Mentor</p>
              <p className="truncate text-xs text-muted-foreground">
                online · {stats.streak}d streak · {stats.momentum}/100 momentum
              </p>
            </div>
            <StreakFlame streak={stats.streak} size="sm" className="hidden shrink-0 sm:grid" />
            <Button variant="ghost" size="icon" aria-label="Close coach" onClick={() => setOpen(false)}>
              <X className="size-4" />
            </Button>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((m) => (
              <div
                key={m.id}
                className={cn(
                  "max-w-[85%] rounded-xl px-3 py-2 text-sm leading-relaxed animate-rise",
                  m.role === "user"
                    ? "ml-auto rounded-br-sm bg-primary text-primary-foreground"
                    : "rounded-bl-sm bg-secondary text-secondary-foreground",
                )}
              >
                {m.text}
              </div>
            ))}
            {thinking && (
              <div className="flex w-fit items-center gap-1.5 rounded-xl rounded-bl-sm bg-secondary px-3 py-2.5">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="size-1.5 rounded-full bg-muted-foreground animate-float"
                    style={{ animationDelay: `${i * 140}ms`, animationDuration: "1s" }}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-border p-3">
            <div className="mb-2 flex flex-wrap gap-2">
              {["How's my streak?", "What's next?", "Momentum?", "Badges"].map((q) => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  {q}
                </button>
              ))}
            </div>
            <form
              className="flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
            >
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask your coach…"
                aria-label="Message the AI coach"
              />
              <Button type="submit" size="icon" aria-label="Send message" disabled={!input.trim()}>
                <Send className="size-4" />
              </Button>
            </form>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close AI coach" : "Open AI coach"}
        className="fixed bottom-4 right-4 z-50 grid size-13 place-items-center rounded-full bg-primary text-primary-foreground transition-transform hover:scale-105 active:scale-95 animate-pulse-ring sm:bottom-5 sm:right-5 sm:size-14"
      >
        {open ? <X className="size-6" /> : <MessageSquareCode className="size-6" />}
      </button>
    </>
  );
}