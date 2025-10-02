export interface Trial {
  item: string;
  isWord: boolean; // ground truth
  answer: boolean | null;
  correct: boolean;
  rtMs: number;
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

export function saveSession(trials: Trial[]): void {
  sessionStorage.setItem('dyslexia-screener-trials', JSON.stringify(trials));
}

export function loadSession(): Trial[] | null {
  const data = sessionStorage.getItem('dyslexia-screener-trials');
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}

export function clearSession(): void {
  sessionStorage.removeItem('dyslexia-screener-trials');
}
