import { describe, it, expect } from 'vitest';
import { PASSAGES, getRandomPassage } from './passages';

describe('Passages & Randomizer Suite', () => {
  it('contains English and Hindi passages', () => {
    const englishPassages = PASSAGES.filter(p => !p.language || p.language === 'english');
    const hindiPassages = PASSAGES.filter(p => p.language === 'hindi');
    
    expect(englishPassages.length).toBeGreaterThan(30);
    expect(hindiPassages.length).toBeGreaterThan(10);
  });

  it('getRandomPassage respects language filter', () => {
    for (let i = 0; i < 10; i++) {
      const eng = getRandomPassage({ language: 'english' });
      expect(eng.language || 'english').toBe('english');

      const hi = getRandomPassage({ language: 'hindi' });
      expect(hi.language).toBe('hindi');
      expect(/[\u0900-\u097F]/.test(hi.text)).toBe(true);
    }
  });

  it('getRandomPassage respects difficulty filter', () => {
    const easy = getRandomPassage({ difficulty: 'Easy' });
    expect(easy.difficulty).toBe('Easy');

    const hard = getRandomPassage({ difficulty: 'Hard' });
    expect(hard.difficulty).toBe('Hard');
  });
});
