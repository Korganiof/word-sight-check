import { createSessionStore } from "./sessionStore";

export interface Trial {
  item: string;
  isWord: boolean; // ground truth
  answer: boolean | null;
  correct: boolean;
  rtMs: number;
  timedOut?: boolean;
}

export function computeAccuracy(trials: Trial[]): number {
  if (trials.length === 0) return 0;
  const correct = trials.filter(t => t.correct).length;
  return Math.round((correct / trials.length) * 100);
}

export function computeAvgRt(trials: Trial[]): number {
  if (trials.length === 0) return 0;
  const sum = trials.reduce((acc, t) => acc + t.rtMs, 0);
  return Math.round(sum / trials.length);
}

const sessionStore = createSessionStore<Trial[]>('dyslexia-screener-trials');

export const saveSession = (trials: Trial[]): void => sessionStore.save(trials);
export const loadSession = (): Trial[] | null => sessionStore.load();
export const clearSession = (): void => sessionStore.clear();
