// Storage engine for Pankaj Typing with versioned schema pt_v2 and migration
const SCHEMA_VERSION = 'pt_v2';

const DEFAULT_SETTINGS = {
  theme: 'system', // 'light' | 'dark' | 'system'
  fontSize: 26,
  caretStyle: 'line', // 'line' | 'block' | 'underline'
  errorMode: 'stop', // 'stop' (Stop on error) | 'allow' (Allow errors + backspace) | 'exam' (No backspace)
  keyboardLayout: 'us', // 'us' | 'uk'
  showKeyboard: true,
  showFingerColors: true,
  showLiveStats: true,
  soundEnabled: true,
  soundPack: 'piano', // 'piano' | 'mechanical' | 'typewriter' | 'soft'
  soundVolume: 0.45,
  focusMode: true,
  dailyGoalMinutes: 10,
};

function safeGet(key, fallback) {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    return JSON.parse(item);
  } catch (e) {
    console.warn(`Storage safeGet failed for ${key}:`, e);
    return fallback;
  }
}

function safeSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`Storage safeSet failed for ${key}:`, e);
  }
}

// Automatic migration from v1 (tm_completed_lessons, tm_test_history, etc.)
function migrateIfNeeded() {
  try {
    const isMigrated = localStorage.getItem(`${SCHEMA_VERSION}_migrated`);
    if (isMigrated) return;

    // 1. Migrate lessons
    const oldLessons = safeGet('tm_completed_lessons', {});
    const newLessons = safeGet(`${SCHEMA_VERSION}_lessons`, {});
    for (const [id, stats] of Object.entries(oldLessons)) {
      if (!newLessons[id]) {
        newLessons[id] = {
          netWpm: stats.netWpm || 0,
          grossWpm: stats.grossWpm || stats.netWpm || 0,
          accuracy: stats.accuracy || 100,
          passed: stats.passed ?? true,
          stars: stats.stars || (stats.accuracy >= 97 ? 3 : 2),
          timeSeconds: stats.timeSeconds || 60,
          completedAt: stats.completedAt || new Date().toISOString()
        };
      }
    }
    safeSet(`${SCHEMA_VERSION}_lessons`, newLessons);

    // 2. Migrate test history
    const oldHistory = safeGet('tm_test_history', []);
    const newHistory = safeGet(`${SCHEMA_VERSION}_test_history`, []);
    const combinedHistory = [...newHistory, ...oldHistory].slice(0, 500);
    safeSet(`${SCHEMA_VERSION}_test_history`, combinedHistory);

    // 3. Migrate user name
    const oldName = localStorage.getItem('tm_user_name');
    if (oldName && !localStorage.getItem(`${SCHEMA_VERSION}_user_name`)) {
      localStorage.setItem(`${SCHEMA_VERSION}_user_name`, oldName);
    }

    localStorage.setItem(`${SCHEMA_VERSION}_migrated`, 'true');
  } catch (e) {
    console.error('Migration failed:', e);
  }
}

// Run migration on module load
migrateIfNeeded();

export const Storage = {
  // Settings
  getSettings() {
    return { ...DEFAULT_SETTINGS, ...safeGet(`${SCHEMA_VERSION}_settings`, {}) };
  },

  updateSettings(partial) {
    const current = this.getSettings();
    const updated = { ...current, ...partial };
    safeSet(`${SCHEMA_VERSION}_settings`, updated);
    return updated;
  },

  // Lessons
  getLessons() {
    return safeGet(`${SCHEMA_VERSION}_lessons`, {});
  },

  saveLessonResult(lessonId, stats) {
    const lessons = this.getLessons();
    const existing = lessons[lessonId];

    // Compute 1-3 stars
    // ★ pass, ★★ pass + ≥97% accuracy, ★★★ pass + ≥97% + ≥ target+5 WPM
    let stars = 1;
    if (stats.passed) {
      if (stats.accuracy >= 97 && stats.netWpm >= (stats.targetWpm || 0) + 5) {
        stars = 3;
      } else if (stats.accuracy >= 97) {
        stars = 2;
      }
    }

    const best = existing ? {
      netWpm: Math.max(existing.netWpm || 0, stats.netWpm),
      grossWpm: Math.max(existing.grossWpm || 0, stats.grossWpm),
      accuracy: Math.max(existing.accuracy || 0, stats.accuracy),
      stars: Math.max(existing.stars || 1, stars),
      passed: stats.passed || existing.passed,
      timeSeconds: stats.timeSeconds,
      completedAt: new Date().toISOString()
    } : {
      ...stats,
      stars,
      completedAt: new Date().toISOString()
    };

    lessons[lessonId] = best;
    safeSet(`${SCHEMA_VERSION}_lessons`, lessons);
    // Backward compatibility mirror
    safeSet('tm_completed_lessons', lessons);
    return best;
  },

  // Tests
  getTestHistory() {
    return safeGet(`${SCHEMA_VERSION}_test_history`, []);
  },

  addTestResult(result) {
    const history = this.getTestHistory();
    const entry = {
      ...result,
      id: 'test-' + Date.now(),
      date: new Date().toISOString()
    };
    const updated = [entry, ...history].slice(0, 500);
    safeSet(`${SCHEMA_VERSION}_test_history`, updated);
    // Backward compatibility mirror
    safeSet('tm_test_history', updated);
    return entry;
  },

  // Certificates
  getCertificates() {
    return safeGet(`${SCHEMA_VERSION}_certificates`, []);
  },

  saveCertificate(cert) {
    const list = this.getCertificates();
    const updated = [cert, ...list.filter(c => c.id !== cert.id)];
    safeSet(`${SCHEMA_VERSION}_certificates`, updated);
    return updated;
  },

  // Per-Key Statistics (for weak-key adaptive practice and keyboard heatmaps)
  getKeyStats() {
    return safeGet(`${SCHEMA_VERSION}_key_stats`, {});
  },

  recordKeystroke(expectedKey, typedKey, latencyMs) {
    if (!expectedKey) return;
    const char = expectedKey.toLowerCase();
    const stats = this.getKeyStats();
    const curr = stats[char] || { hits: 0, errors: 0, totalLatencyMs: 0 };

    curr.hits += 1;
    if (expectedKey !== typedKey) {
      curr.errors += 1;
    }
    if (latencyMs && latencyMs > 0 && latencyMs < 3000) {
      curr.totalLatencyMs += latencyMs;
    }

    stats[char] = curr;
    safeSet(`${SCHEMA_VERSION}_key_stats`, stats);
  },

  // Daily Practice Tracking (minutes per day for GitHub-style calendar heatmap)
  getDailyPractice() {
    return safeGet(`${SCHEMA_VERSION}_daily_practice`, {});
  },

  addPracticeSeconds(seconds) {
    const today = new Date().toISOString().split('T')[0];
    const daily = this.getDailyPractice();
    const currentMins = daily[today] || 0;
    daily[today] = Math.round((currentMins + seconds / 60) * 10) / 10;
    safeSet(`${SCHEMA_VERSION}_daily_practice`, daily);
  },

  // User Name
  getUserName() {
    try {
      return localStorage.getItem(`${SCHEMA_VERSION}_user_name`) || localStorage.getItem('tm_user_name') || 'Typist';
    } catch (e) {
      return 'Typist';
    }
  },

  setUserName(name) {
    const cleaned = (name || 'Typist').trim();
    try {
      localStorage.setItem(`${SCHEMA_VERSION}_user_name`, cleaned);
      localStorage.setItem('tm_user_name', cleaned);
    } catch (e) {
      console.warn(e);
    }
  },

  // Achievements
  getAchievements() {
    return safeGet(`${SCHEMA_VERSION}_achievements`, []);
  },

  unlockAchievement(id) {
    const current = this.getAchievements();
    if (!current.includes(id)) {
      const updated = [...current, id];
      safeSet(`${SCHEMA_VERSION}_achievements`, updated);
      return true;
    }
    return false;
  },

  // Export / Import / Reset
  exportData() {
    return JSON.stringify({
      version: SCHEMA_VERSION,
      exportedAt: new Date().toISOString(),
      settings: this.getSettings(),
      lessons: this.getLessons(),
      testHistory: this.getTestHistory(),
      certificates: this.getCertificates(),
      keyStats: this.getKeyStats(),
      dailyPractice: this.getDailyPractice(),
      achievements: this.getAchievements(),
      userName: this.getUserName()
    }, null, 2);
  },

  importData(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      if (data.settings) safeSet(`${SCHEMA_VERSION}_settings`, data.settings);
      if (data.lessons) {
        safeSet(`${SCHEMA_VERSION}_lessons`, data.lessons);
        safeSet('tm_completed_lessons', data.lessons);
      }
      if (data.testHistory) {
        safeSet(`${SCHEMA_VERSION}_test_history`, data.testHistory);
        safeSet('tm_test_history', data.testHistory);
      }
      if (data.certificates) safeSet(`${SCHEMA_VERSION}_certificates`, data.certificates);
      if (data.keyStats) safeSet(`${SCHEMA_VERSION}_key_stats`, data.keyStats);
      if (data.dailyPractice) safeSet(`${SCHEMA_VERSION}_daily_practice`, data.dailyPractice);
      if (data.achievements) safeSet(`${SCHEMA_VERSION}_achievements`, data.achievements);
      if (data.userName) this.setUserName(data.userName);
      return true;
    } catch (e) {
      console.error('Import error:', e);
      return false;
    }
  },

  resetAll() {
    try {
      const keys = Object.keys(localStorage);
      for (const k of keys) {
        if (k.startsWith('pt_') || k.startsWith('tm_') || k === 'typing_master_sound') {
          localStorage.removeItem(k);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }
};
