import { describe, it, expect } from 'vitest';
import { EXAM_PRESETS, getExamById, evaluateExamScorecard } from './exams';

describe('Exams & Scoring Simulator Suite', () => {
  it('exports official target exams for SSC, High Court, and CPCT', () => {
    expect(EXAM_PRESETS.length).toBeGreaterThanOrEqual(6);
    expect(getExamById('ssc-chsl-en')).toBeDefined();
    expect(getExamById('allahabad-hc-en')).toBeDefined();
    expect(getExamById('cpct-mp')).toBeDefined();
  });

  it('evaluates SSC CHSL scoring with error percentage and cutoff', () => {
    const exam = getExamById('ssc-chsl-en');
    const originalText = 'The quick brown fox jumps over the lazy dog and runs through the forest.';
    const typedText = 'The quick brown fox jumps over the lazy dog and runs through the forest.';

    const result = evaluateExamScorecard({
      originalText,
      typedText,
      durationSeconds: 600,
      qualifyingSpeedWpm: exam.qualifyingSpeedWpm,
      maxErrorPercentage: exam.maxErrorPercentage
    });
    expect(result.errorPercentage).toBe(0);
    expect(result.fullMistakes).toBe(0);
    expect(result.halfMistakes).toBe(0);
  });

  it('correctly calculates capitalization differences vs full mistakes', () => {
    const exam = getExamById('allahabad-hc-en');
    const originalText = 'India is a sovereign democratic republic';
    const typedText = 'india is a sovereign democratic republic'; // 'india' lower case

    const result = evaluateExamScorecard({
      originalText,
      typedText,
      durationSeconds: 600,
      qualifyingSpeedWpm: exam.qualifyingSpeedWpm,
      maxErrorPercentage: exam.maxErrorPercentage
    });
    expect(result.halfMistakes).toBeGreaterThan(0);
  });
});

