import { useCallback, useEffect, useRef, useState } from "react";
import type {
  SyllableAttemptLog,
  SyllableEvent,
  SyllableEventType,
  SyllableItem,
  SyllableSessionLog,
  SyllableSubmission,
} from "./types";
import { scoreSubmission } from "./scoring";

const STORAGE_KEY = "syllable-exercise-session";
const SEED_KEY = "syllable-exercise-seed";

function loadSeed(): number {
  try {
    const raw = localStorage.getItem(SEED_KEY);
    if (raw) {
      const n = parseInt(raw, 10);
      if (!Number.isNaN(n)) return n;
    }
  } catch {
    /* ignore */
  }
  return Math.floor(Math.random() * 0xffffffff);
}

function saveSeed(seed: number): void {
  try {
    localStorage.setItem(SEED_KEY, String(seed));
  } catch {
    /* ignore */
  }
}

function loadSession(): SyllableSessionLog | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SyllableSessionLog;
  } catch {
    return null;
  }
}

function saveSession(session: SyllableSessionLog): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {
    /* ignore */
  }
}

export function useSyllableLogger(items: SyllableItem[]) {
  const [session, setSession] = useState<SyllableSessionLog | null>(() => loadSession());
  const currentAttemptRef = useRef<SyllableAttemptLog | null>(null);
  const seedRef = useRef<number>(loadSeed());

  // Ensure we have a session (and seed) when starting - create new if none or completed
  useEffect(() => {
    const existing = loadSession();
    const completed = existing?.completedAt != null || (existing && existing.attempts.length >= items.length);
    if (!existing || completed) {
      const newSeed = Math.floor(Math.random() * 0xffffffff);
      seedRef.current = newSeed;
      saveSeed(newSeed);
      const newSession: SyllableSessionLog = {
        sessionId: `syl-${Date.now()}`,
        seed: newSeed,
        startedAt: Date.now(),
        attempts: [],
        completedAt: null,
      };
      setSession(newSession);
      saveSession(newSession);
    } else {
      seedRef.current = existing.seed;
    }
  }, [items.length]);

  const getOrCreateSession = useCallback((): SyllableSessionLog => {
    let s = session;
    if (!s || s.attempts.length >= items.length) {
      const newSeed = Math.floor(Math.random() * 0xffffffff);
      seedRef.current = newSeed;
      saveSeed(newSeed);
      s = {
        sessionId: `syl-${Date.now()}`,
        seed: newSeed,
        startedAt: Date.now(),
        attempts: [],
        completedAt: null,
      };
      setSession(s);
      saveSession(s);
    }
    return s;
  }, [session, items.length]);

  const startAttempt = useCallback(
    (item: SyllableItem) => {
      const sess = getOrCreateSession();
      const attempt: SyllableAttemptLog = {
        itemId: item.id,
        level: item.level,
        type: item.type,
        shownAt: Date.now(),
        firstActionAt: null,
        submissions: [],
        events: [],
        completedAt: null,
        wasTimeout: false,
        isCorrect: false,
        errorTags: [],
      };
      currentAttemptRef.current = attempt;
      const updated = {
        ...sess,
        attempts: [...sess.attempts, attempt],
      };
      setSession(updated);
      saveSession(updated);
    },
    [getOrCreateSession]
  );

  const logEvent = useCallback(
    (type: SyllableEventType, tileId?: string, value?: string) => {
      const attempt = currentAttemptRef.current;
      if (!attempt) return;

      const ev: SyllableEvent = {
        ts: Date.now(),
        type,
        tileId,
        value,
      };
      if (attempt.firstActionAt === null) {
        attempt.firstActionAt = ev.ts;
      }
      attempt.events.push(ev);

      const sess = session;
      if (sess) {
        const idx = sess.attempts.findIndex((a) => a.itemId === attempt.itemId && a.shownAt === attempt.shownAt);
        if (idx >= 0) {
          const updated = { ...sess, attempts: [...sess.attempts] };
          updated.attempts[idx] = { ...attempt };
          setSession(updated);
          saveSession(updated);
        }
      }
    },
    [session]
  );

  const completeAttempt = useCallback(
    (
      assembledSyllables: string[],
      item: SyllableItem,
      wasTimeout: boolean
    ): { isCorrect: boolean; errorTags: string[] } => {
      const attempt = currentAttemptRef.current;
      if (!attempt) return { isCorrect: false, errorTags: [] };

      const result = scoreSubmission(assembledSyllables, item);
      const sub: SyllableSubmission = {
        ts: Date.now(),
        assembledSyllables: [...assembledSyllables],
        assembledWord: assembledSyllables.join(""),
        isCorrect: result.isCorrect,
        errorTags: result.errorTags,
      };
      attempt.submissions.push(sub);
      attempt.completedAt = Date.now();
      attempt.wasTimeout = wasTimeout;
      attempt.isCorrect = result.isCorrect;
      attempt.errorTags = result.errorTags;

      const sess = session;
      if (sess) {
        const idx = sess.attempts.findIndex((a) => a.itemId === attempt.itemId && a.shownAt === attempt.shownAt);
        if (idx >= 0) {
          const updated = { ...sess, attempts: [...sess.attempts] };
          updated.attempts[idx] = { ...attempt };
          if (updated.attempts.length >= items.length) {
            updated.completedAt = Date.now();
          }
          setSession(updated);
          saveSession(updated);
        }
      }

      currentAttemptRef.current = null;
      return {
        isCorrect: result.isCorrect,
        errorTags: result.errorTags,
      };
    },
    [session, items.length]
  );

  const getSeed = useCallback(() => seedRef.current, []);

  const resetSession = useCallback(() => {
    const newSeed = Math.floor(Math.random() * 0xffffffff);
    seedRef.current = newSeed;
    saveSeed(newSeed);
    const newSession: SyllableSessionLog = {
      sessionId: `syl-${Date.now()}`,
      seed: newSeed,
      startedAt: Date.now(),
      attempts: [],
      completedAt: null,
    };
    setSession(newSession);
    saveSession(newSession);
    currentAttemptRef.current = null;
  }, []);

  return {
    session,
    startAttempt,
    logEvent,
    completeAttempt,
    getOrCreateSession,
    getSeed,
    resetSession,
  };
}
