// Tiny typed wrapper around sessionStorage.
// Every exercise persists its result as JSON under a fixed key; this collapses
// the repeated getItem → JSON.parse → try/catch → setItem boilerplate into one
// place. State is intentionally session-scoped (cleared when the tab closes).

export interface SessionStore<T> {
  save(value: T): void;
  load(): T | null;
  clear(): void;
}

export function createSessionStore<T>(key: string): SessionStore<T> {
  return {
    save(value) {
      sessionStorage.setItem(key, JSON.stringify(value));
    },
    load() {
      const raw = sessionStorage.getItem(key);
      if (!raw) return null;
      try {
        return JSON.parse(raw) as T;
      } catch {
        return null;
      }
    },
    clear() {
      sessionStorage.removeItem(key);
    },
  };
}
