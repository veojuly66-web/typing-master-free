/**
 * Standard typing tutor statistics engine
 * Gross WPM = (typed characters / 5) / minutes
 * Net WPM = Gross WPM - (uncorrected errors / minutes)
 * Accuracy = correct keystrokes / total keystrokes * 100
 */

export function calculateGrossWpm(typedChars, minutes) {
  if (!minutes || minutes <= 0) return 0;
  return Math.round((typedChars / 5) / minutes);
}

export function calculateNetWpm(typedChars, uncorrectedErrors = 0, minutes) {
  if (!minutes || minutes <= 0) return 0;
  const gross = (typedChars / 5) / minutes;
  const errorPenalty = uncorrectedErrors / minutes;
  return Math.max(0, Math.round(gross - errorPenalty));
}

export function calculateAccuracy(correctKeystrokes, totalKeystrokes) {
  if (!totalKeystrokes || totalKeystrokes <= 0) return 100;
  return Math.max(0, Math.min(100, Math.round((correctKeystrokes / totalKeystrokes) * 100)));
}

/**
 * Consistency calculation:
 * Measures coefficient of variation (standard deviation / mean) across WPM samples taken every second or word.
 * Returns a percentage 0 - 100% (100% = perfectly steady metronomic cadence).
 */
export function calculateConsistency(wpmSamples = []) {
  if (!wpmSamples || wpmSamples.length < 2) return 100;

  const validSamples = wpmSamples.filter(s => typeof s === 'number' && s > 0);
  if (validSamples.length < 2) return 100;

  const mean = validSamples.reduce((a, b) => a + b, 0) / validSamples.length;
  if (mean === 0) return 100;

  const variance = validSamples.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / validSamples.length;
  const standardDeviation = Math.sqrt(variance);

  const cv = standardDeviation / mean;
  const consistency = Math.max(0, Math.min(100, Math.round((1 - cv) * 100)));
  return consistency;
}

/**
 * Weak Key Ranking
 * Orders keys by highest error rate, weighted by number of attempts
 */
export function rankWeakKeys(keyStats = {}, limit = 5) {
  const entries = Object.entries(keyStats).map(([key, data]) => {
    const hits = data.hits || 0;
    const errors = data.errors || 0;
    const errorRate = hits > 0 ? (errors / hits) : 0;
    const avgLatency = hits > 0 ? (data.totalLatencyMs / hits) : 0;
    return {
      key,
      hits,
      errors,
      errorRate,
      avgLatency: Math.round(avgLatency),
      score: errorRate * 100 + (avgLatency > 400 ? 20 : 0)
    };
  });

  return entries
    .filter(e => e.hits >= 2 && (e.errors > 0 || e.avgLatency > 350))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

/**
 * Standard typing velocity bands
 */
export function getSpeedBand(wpm) {
  if (wpm < 25) return { band: 'Beginner', label: 'Beginner', description: 'Developing finger positions and muscle memory.' };
  if (wpm < 40) return { band: 'Average', label: 'Average', description: 'Standard everyday typing speed.' };
  if (wpm < 60) return { band: 'Good', label: 'Good', description: 'Fluid touch typing with minimal hesitation.' };
  if (wpm < 80) return { band: 'Fast', label: 'Fast', description: 'High-velocity touch typing.' };
  return { band: 'Professional', label: 'Professional', description: 'Top-tier typing mastery.' };
}

export const calculateSpeedBand = getSpeedBand;

export function formatDuration(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}
