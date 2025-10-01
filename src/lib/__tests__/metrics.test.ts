import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  computeAccuracy,
  computeAvgRt,
  saveSession,
  loadSession,
  clearSession,
  type Trial,
} from '../metrics';

describe('computeAccuracy', () => {
  it('returns 0 for empty array', () => {
    expect(computeAccuracy([])).toBe(0);
  });

  it('calculates accuracy correctly', () => {
    const trials: Trial[] = [
      { item: 'test1', isWord: true, answer: true, correct: true, rtMs: 500 },
      { item: 'test2', isWord: false, answer: false, correct: true, rtMs: 600 },
      { item: 'test3', isWord: true, answer: false, correct: false, rtMs: 400 },
      { item: 'test4', isWord: false, answer: true, correct: false, rtMs: 550 },
    ];
    // 2 correct out of 4 = 50%
    expect(computeAccuracy(trials)).toBe(50);
  });

  it('handles 100% accuracy', () => {
    const trials: Trial[] = [
      { item: 'test1', isWord: true, answer: true, correct: true, rtMs: 500 },
      { item: 'test2', isWord: false, answer: false, correct: true, rtMs: 600 },
    ];
    expect(computeAccuracy(trials)).toBe(100);
  });
});

describe('computeAvgRt', () => {
  it('returns 0 for empty array', () => {
    expect(computeAvgRt([])).toBe(0);
  });

  it('calculates average RT correctly', () => {
    const trials: Trial[] = [
      { item: 'test1', isWord: true, answer: true, correct: true, rtMs: 500 },
      { item: 'test2', isWord: false, answer: false, correct: true, rtMs: 600 },
      { item: 'test3', isWord: true, answer: false, correct: false, rtMs: 400 },
    ];
    // (500 + 600 + 400) / 3 = 500
    expect(computeAvgRt(trials)).toBe(500);
  });

  it('rounds to nearest integer', () => {
    const trials: Trial[] = [
      { item: 'test1', isWord: true, answer: true, correct: true, rtMs: 500 },
      { item: 'test2', isWord: false, answer: false, correct: true, rtMs: 501 },
    ];
    // (500 + 501) / 2 = 500.5, rounds to 501
    expect(computeAvgRt(trials)).toBe(501);
  });
});

describe('session storage', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it('saves and loads session correctly', () => {
    const trials: Trial[] = [
      { item: 'test1', isWord: true, answer: true, correct: true, rtMs: 500 },
    ];

    saveSession(trials);
    const loaded = loadSession();

    expect(loaded).toEqual(trials);
  });

  it('returns null when no session data exists', () => {
    expect(loadSession()).toBeNull();
  });

  it('clears session correctly', () => {
    const trials: Trial[] = [
      { item: 'test1', isWord: true, answer: true, correct: true, rtMs: 500 },
    ];

    saveSession(trials);
    clearSession();
    expect(loadSession()).toBeNull();
  });

  it('handles corrupted session data gracefully', () => {
    sessionStorage.setItem('dyslexia-screener-trials', 'invalid json{');
    expect(loadSession()).toBeNull();
  });
});
