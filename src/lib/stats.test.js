import { describe, it, expect } from 'vitest';
import {
  calculateGrossWpm,
  calculateNetWpm,
  calculateAccuracy,
  calculateConsistency,
  rankWeakKeys,
  getSpeedBand,
  formatDuration
} from './stats';

describe('Typing Stats Engine', () => {
  it('calculates gross WPM correctly (5 chars = 1 word)', () => {
    // 250 characters typed in 1 minute = 50 WPM
    expect(calculateGrossWpm(250, 1)).toBe(50);
    // 125 characters typed in 30 seconds (0.5 min) = 50 WPM
    expect(calculateGrossWpm(125, 0.5)).toBe(50);
    expect(calculateGrossWpm(0, 1)).toBe(0);
    expect(calculateGrossWpm(100, 0)).toBe(0);
  });

  it('calculates net WPM with error penalty', () => {
    // 250 chars typed in 1 min with 2 uncorrected errors: gross 50 - 2 = 48 net
    expect(calculateNetWpm(250, 2, 1)).toBe(48);
    // Huge error count shouldn't return negative
    expect(calculateNetWpm(50, 20, 1)).toBe(0);
  });

  it('calculates accuracy accurately', () => {
    expect(calculateAccuracy(100, 100)).toBe(100);
    expect(calculateAccuracy(95, 100)).toBe(95);
    expect(calculateAccuracy(0, 0)).toBe(100);
    expect(calculateAccuracy(48, 50)).toBe(96);
  });

  it('calculates consistency percentage', () => {
    // Perfectly uniform speed = 100% consistency
    expect(calculateConsistency([50, 50, 50, 50])).toBe(100);
    // Varied speeds return reasonable consistency
    const result = calculateConsistency([45, 52, 48, 50, 46]);
    expect(result).toBeGreaterThan(80);
    expect(result).toBeLessThanOrEqual(100);
  });

  it('ranks weak keys by error rate and latency', () => {
    const sampleStats = {
      'a': { hits: 20, errors: 0, totalLatencyMs: 3000 },
      'p': { hits: 10, errors: 4, totalLatencyMs: 4000 }, // 40% error rate
      'q': { hits: 10, errors: 2, totalLatencyMs: 5000 }, // 20% error rate
    };

    const ranked = rankWeakKeys(sampleStats);
    expect(ranked.length).toBeGreaterThan(0);
    expect(ranked[0].key).toBe('p');
  });

  it('determines correct speed band', () => {
    expect(getSpeedBand(20).band).toBe('Beginner');
    expect(getSpeedBand(35).band).toBe('Average');
    expect(getSpeedBand(55).band).toBe('Good');
    expect(getSpeedBand(75).band).toBe('Fast');
    expect(getSpeedBand(95).band).toBe('Professional');
  });

  it('formats duration nicely MM:SS', () => {
    expect(formatDuration(60)).toBe('1:00');
    expect(formatDuration(75)).toBe('1:15');
    expect(formatDuration(5)).toBe('0:05');
  });
});
