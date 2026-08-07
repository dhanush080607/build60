import { cn } from "@/lib/utils";

type Props = {
  streak: number;
  size?: "sm" | "lg";
  className?: string;
};

export function streakTier(streak: number) {
  if (streak <= 0) return { label: "Unlit", tone: "muted", intensity: 0 } as const;
  if (streak < 3) return { label: "Spark", tone: "warning", intensity: 1 } as const;
  if (streak < 7) return { label: "Burning", tone: "warning", intensity: 2 } as const;
  if (streak < 14) return { label: "Blazing", tone: "primary", intensity: 3 } as const;
  if (streak < 30) return { label: "Inferno", tone: "primary", intensity: 4 } as const;
  return { label: "Legendary", tone: "accent", intensity: 5 } as const;
}

export function StreakFlame({ streak, size = "lg", className }: Props) {
  const tier = streakTier(streak);
  const scale = 0.68 + tier.intensity * 0.08;
  const box = size === "lg" ? "size-20" : "size-12";

  return (
    <div className={cn("relative grid place-items-center", box, className)} aria-hidden="true">
      <span
        className="absolute inset-0 rounded-full blur-xl transition-opacity duration-500"
        style={{
          opacity: 0.14 + tier.intensity * 0.13,
          background:
            tier.intensity >= 4
              ? "var(--gradient-accent)"
              : "radial-gradient(circle, var(--color-warning), transparent 70%)",
        }}
      />
      <svg
        viewBox="0 0 32 40"
        className={cn("relative", size === "lg" ? "h-16" : "h-9", tier.intensity > 0 && "animate-flame")}
        style={{ transform: `scale(${scale})`, transformOrigin: "50% 100%" }}
      >
        <defs>
          <linearGradient id={`flame-outer-${tier.intensity}`} x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="var(--color-warning)" />
            <stop
              offset="100%"
              stopColor={tier.intensity >= 3 ? "var(--color-primary)" : "var(--color-destructive)"}
            />
          </linearGradient>
        </defs>
        <path
          d="M16 1c5 7 1 9 4 12 2-1 3-3 3-5 4 5 6 10 6 15 0 9-6 16-13 16S3 32 3 23c0-7 5-12 8-16 2 3 3 4 5 4-2-4-3-7 0-10Z"
          fill={tier.intensity === 0 ? "var(--color-muted)" : `url(#flame-outer-${tier.intensity})`}
          opacity={tier.intensity === 0 ? 0.5 : 1}
        />
        {tier.intensity > 1 && (
          <path
            d="M16 15c3 3 4 6 4 9 0 4-2 7-5 7s-5-3-5-7c0-3 2-6 6-9Z"
            fill="var(--color-background)"
            opacity={0.25 + tier.intensity * 0.1}
          />
        )}
      </svg>
      {tier.intensity >= 3 && (
        <span className="pointer-events-none absolute -top-1 left-1/2 size-1.5 -translate-x-1/2 rounded-full bg-primary animate-float" />
      )}
    </div>
  );
}