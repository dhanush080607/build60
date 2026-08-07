import { useMemo } from "react";

const COLORS = ["var(--primary)", "var(--accent)", "var(--warning)", "var(--success)"];

export function Confetti({ show }: { show: boolean }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: 60 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.6,
        duration: 2.2 + Math.random() * 1.4,
        color: COLORS[i % COLORS.length],
        size: 6 + Math.random() * 8,
      })),
    [],
  );

  if (!show) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] overflow-hidden" aria-hidden>
      {pieces.map((p) => (
        <span
          key={p.id}
          className="absolute top-0 rounded-[2px]"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size * 1.6,
            backgroundColor: p.color,
            animation: `confetti-fall ${p.duration}s linear ${p.delay}s forwards`,
          }}
        />
      ))}
    </div>
  );
}