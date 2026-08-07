import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import achievementsData from "@/data/achievements.json";
import challengeData from "@/data/challenge.json";
import studentData from "@/data/student.json";

export type DayState = {
  checklist: string[];
  github: { repo: string; commit: string; verified: boolean };
  linkedin: { url: string; verified: boolean };
  reflection: { learned: string; overcame: string; savedAt: string | null };
  completed: boolean;
  completedAt: string | null;
};

export type AppState = {
  profileId: string | null;
  selectedTrack: string | null;
  days: Record<string, DayState>;
};

const STORAGE_KEY = "sixty-day-challenge:v1";

export const emptyDay = (): DayState => ({
  checklist: [],
  github: { repo: "", commit: "", verified: false },
  linkedin: { url: "", verified: false },
  reflection: { learned: "", overcame: "", savedAt: null },
  completed: false,
  completedAt: null,
});

const initialState: AppState = { profileId: null, selectedTrack: null, days: {} };

export const challenge = challengeData;
export const student = studentData;
export const achievements = achievementsData;

export type DayContent = {
  day: number;
  title: string;
  focus: string;
  estimate: string;
  brief: string;
  checklist: { id: string; label: string }[];
  resources: { label: string; url: string }[];
};

export function getDayContent(day: number): DayContent {
  const found = challenge.days.find((d) => d.day === day);
  if (found) return found as DayContent;
  return { day, ...(challenge.defaultDay as Omit<DayContent, "day">) };
}

export function dayMomentum(state: DayState | undefined, checklistSize: number) {
  if (!state) return 0;
  let score = 0;
  if (state.github.verified) score += 40;
  if (state.linkedin.verified) score += 30;
  if (checklistSize > 0 && state.checklist.length >= checklistSize) score += 20;
  if (state.reflection.learned.trim() && state.reflection.overcame.trim()) score += 10;
  return Math.min(100, score);
}

type Ctx = {
  hydrated: boolean;
  state: AppState;
  profile: typeof studentData | null;
  startChallenge: () => void;
  selectTrack: (id: string) => void;
  getDay: (day: number) => DayState;
  updateDay: (day: number, patch: Partial<DayState>) => void;
  toggleTask: (day: number, taskId: string) => void;
  completeDay: (day: number) => void;
  reopenDay: (day: number) => void;
  resetAll: () => void;
};

const ChallengeContext = createContext<Ctx | null>(null);

export function ChallengeProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(initialState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as AppState;
        setState({ ...initialState, ...parsed, days: parsed.days ?? {} });
      }
    } catch {
      /* corrupted storage: fall back to a clean slate */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage full or unavailable */
    }
  }, [state, hydrated]);

  const getDay = useCallback(
    (day: number) => state.days[String(day)] ?? emptyDay(),
    [state.days],
  );

  const updateDay = useCallback((day: number, patch: Partial<DayState>) => {
    setState((prev) => {
      const key = String(day);
      const current = prev.days[key] ?? emptyDay();
      return { ...prev, days: { ...prev.days, [key]: { ...current, ...patch } } };
    });
  }, []);

  const toggleTask = useCallback((day: number, taskId: string) => {
    setState((prev) => {
      const key = String(day);
      const current = prev.days[key] ?? emptyDay();
      const checklist = current.checklist.includes(taskId)
        ? current.checklist.filter((t) => t !== taskId)
        : [...current.checklist, taskId];
      return { ...prev, days: { ...prev.days, [key]: { ...current, checklist } } };
    });
  }, []);

  const completeDay = useCallback((day: number) => {
    setState((prev) => {
      const key = String(day);
      const current = prev.days[key] ?? emptyDay();
      return {
        ...prev,
        profileId: prev.profileId ?? studentData.id,
        days: {
          ...prev.days,
          [key]: { ...current, completed: true, completedAt: new Date().toISOString() },
        },
      };
    });
  }, []);

  const reopenDay = useCallback((day: number) => {
    setState((prev) => {
      const key = String(day);
      const current = prev.days[key] ?? emptyDay();
      return {
        ...prev,
        days: { ...prev.days, [key]: { ...current, completed: false, completedAt: null } },
      };
    });
  }, []);

  const startChallenge = useCallback(() => {
    setState((prev) => ({ ...prev, profileId: prev.profileId ?? studentData.id }));
  }, []);

  const selectTrack = useCallback((id: string) => {
    setState((prev) => ({ ...prev, selectedTrack: prev.selectedTrack === id ? null : id }));
  }, []);

  const resetAll = useCallback(() => setState(initialState), []);

  const value = useMemo<Ctx>(
    () => ({
      hydrated,
      state,
      profile: state.profileId ? studentData : null,
      startChallenge,
      selectTrack,
      getDay,
      updateDay,
      toggleTask,
      completeDay,
      reopenDay,
      resetAll,
    }),
    [
      hydrated,
      state,
      startChallenge,
      selectTrack,
      getDay,
      updateDay,
      toggleTask,
      completeDay,
      reopenDay,
      resetAll,
    ],
  );

  return <ChallengeContext.Provider value={value}>{children}</ChallengeContext.Provider>;
}

export function useChallenge() {
  const ctx = useContext(ChallengeContext);
  if (!ctx) throw new Error("useChallenge must be used inside ChallengeProvider");
  return ctx;
}

export type Stats = {
  completedDays: number[];
  completedCount: number;
  completionPct: number;
  streak: number;
  streakState: "new" | "active" | "missed";
  momentum: number;
  submissions: number;
  linkedinPosts: number;
  reflections: number;
  perfectDays: number;
  unlocked: string[];
  badgeProgress: { id: string; value: number; target: number; unlocked: boolean }[];
};

export function useStats(): Stats {
  const { state } = useChallenge();
  const currentDay = challenge.currentDay;

  return useMemo(() => {
    const entries = Object.entries(state.days);
    const completedDays = entries
      .filter(([, d]) => d.completed)
      .map(([k]) => Number(k))
      .sort((a, b) => a - b);

    let streak = 0;
    const completedSet = new Set(completedDays);
    const anchor = completedSet.has(currentDay) ? currentDay : currentDay - 1;
    for (let d = anchor; d >= 1; d--) {
      if (completedSet.has(d)) streak++;
      else break;
    }

    const streakState: Stats["streakState"] =
      completedDays.length === 0 ? "new" : streak === 0 ? "missed" : "active";

    const submissions = entries.filter(([, d]) => d.github.verified).length;
    const linkedinPosts = entries.filter(([, d]) => d.linkedin.verified).length;
    const reflections = entries.filter(
      ([, d]) => d.reflection.learned.trim() && d.reflection.overcame.trim(),
    ).length;
    const perfectDays = entries.filter(
      ([k, d]) => dayMomentum(d, getDayContent(Number(k)).checklist.length) === 100,
    ).length;

    const momentum = dayMomentum(
      state.days[String(currentDay)],
      getDayContent(currentDay).checklist.length,
    );

    const metrics: Record<string, number> = {
      completedDays: completedDays.length,
      submissions,
      linkedinPosts,
      reflections,
      perfectDays,
    };

    const badgeProgress = achievementsData.map((a) => {
      const value = metrics[a.metric] ?? 0;
      return { id: a.id, value: Math.min(value, a.target), target: a.target, unlocked: value >= a.target };
    });

    return {
      completedDays,
      completedCount: completedDays.length,
      completionPct: Math.round((completedDays.length / challenge.totalDays) * 100),
      streak,
      streakState,
      momentum,
      submissions,
      linkedinPosts,
      reflections,
      perfectDays,
      unlocked: badgeProgress.filter((b) => b.unlocked).map((b) => b.id),
      badgeProgress,
    };
  }, [state.days, currentDay]);
}

export function isValidUrl(value: string, mustInclude?: string) {
  try {
    const url = new URL(value.trim());
    if (!/^https?:$/.test(url.protocol)) return false;
    if (mustInclude && !url.hostname.toLowerCase().includes(mustInclude)) return false;
    return true;
  } catch {
    return false;
  }
}