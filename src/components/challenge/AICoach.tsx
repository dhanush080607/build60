import { Bot, Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Msg = { id: string; role: "coach" | "user"; text: string };

const SAMPLE_REPLIES = [
  "Your streak is strong. Complete today's commit to stay ahead.",
  "Your next goal should be deploying your project.",
  "Break Day 12 into three 40-minute blocks: model, build, ship.",
  "Your LinkedIn proof is what compounds. Post the lesson, not the code.",
  "Momentum beats motivation — a 20 minute commit still keeps the streak alive.",
];

let seq = 0;
const nextId = () => `m${++seq}`;

export function AICoach() {
  const [open, setOpen] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([
    { id: "m0", role: "coach", text: "Hey! I'm Nova, your AI coding coach. Ask me anything about today's build." },
  ]);
  const replyIndex = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, thinking, open]);

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setMessages((m) => [...m, { id: nextId(), role: "user", text: trimmed }]);
    setInput("");
    setThinking(true);
    window.setTimeout(() => {
      const reply =
        SAMPLE_REPLIES[replyIndex.current % SAMPLE_REPLIES.length] ?? SAMPLE_REPLIES[0]!;
      replyIndex.current += 1;
      setMessages((m) => [...m, { id: nextId(), role: "coach", text: reply }]);
      setThinking(false);
    }, 750);
  };

  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-5 z-50 flex h-[26rem] w-[min(22rem,calc(100vw-2.5rem))] flex-col surface-panel animate-pop-in overflow-hidden">
          <div className="flex items-center gap-3 border-b border-border px-4 py-3">
            <div className="grid size-9 place-items-center rounded-full bg-primary/15 text-primary">
              <Bot className="size-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">Nova · AI Coding Coach</p>
              <p className="text-xs text-muted-foreground">Always on, always shipping</p>
            </div>
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
                    ? "ml-auto bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground",
                )}
              >
                {m.text}
              </div>
            ))}
            {thinking && (
              <div className="w-fit rounded-xl bg-secondary px-3 py-2 text-sm text-muted-foreground">
                Nova is thinking…
              </div>
            )}
          </div>

          <div className="border-t border-border p-3">
            <div className="mb-2 flex flex-wrap gap-2">
              {["How's my streak?", "What's next?"].map((q) => (
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
        className="fixed bottom-5 right-5 z-50 grid size-14 place-items-center rounded-full bg-primary text-primary-foreground transition-transform hover:scale-105 animate-pulse-ring"
      >
        {open ? <X className="size-6" /> : <Bot className="size-6" />}
      </button>
    </>
  );
}