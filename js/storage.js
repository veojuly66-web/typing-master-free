/**
 * Data Storage & State Management
 * Persistent storage using localStorage for:
 * - Lessons completed and stars earned
 * - Speed test history (WPM, Accuracy, Date)
 * - Key statistics (mistake counts, total presses for heatmap)
 * - High scores for arcade games
 * - User settings (Theme, sound switch, sound type, font size)
 */

class StorageManager {
    constructor() {
        this.PREFIX = 'typing_master_free_';
    }

    getUser() {
        const raw = localStorage.getItem(this.PREFIX + 'user');
        if (raw) {
            try { return JSON.parse(raw); } catch (e) { }
        }
        return {
            name: 'Typing Champion',
            createdAt: new Date().toISOString(),
            avatar: '🏆'
        };
    }

    saveUser(userData) {
        localStorage.setItem(this.PREFIX + 'user', JSON.stringify(userData));
    }

    getSettings() {
        const raw = localStorage.getItem(this.PREFIX + 'settings');
        if (raw) {
            try { return JSON.parse(raw); } catch (e) { }
        }
        return {
            theme: 'classic', // classic | modern-dark | retro-amber | cyberpunk | emerald
            soundType: 'mechanical',
            soundVolume: 0.5,
            soundEnabled: true,
            showHands: true,
            showKeyboard: true,
            fontSize: 'normal'
        };
    }

    saveSettings(settings) {
        localStorage.setItem(this.PREFIX + 'settings', JSON.stringify(settings));
    }

    getLessonProgress() {
        const raw = localStorage.getItem(this.PREFIX + 'lessons');
        if (raw) {
            try { return JSON.parse(raw); } catch (e) { }
        }
        return {
            completedIds: ['1-1'], // first unlocked
            scores: {} // { '1-1': { wpm: 35, accuracy: 98, stars: 3, date: '...' } }
        };
    }

    saveLessonProgress(progress) {
        localStorage.setItem(this.PREFIX + 'lessons', JSON.stringify(progress));
    }

    recordLessonCompletion(lessonId, wpm, accuracy, nextLessonId) {
        const progress = this.getLessonProgress();
        let stars = 1;
        if (accuracy >= 94 && wpm >= 20) stars = 2;
        if (accuracy >= 98 && wpm >= 30) stars = 3;

        progress.scores[lessonId] = {
            wpm: Math.round(wpm),
            accuracy: Math.round(accuracy),
            stars: stars,
            date: new Date().toLocaleDateString()
        };

        if (nextLessonId && !progress.completedIds.includes(nextLessonId)) {
            progress.completedIds.push(nextLessonId);
        }

        this.saveLessonProgress(progress);
        return stars;
    }

    getTestHistory() {
        const raw = localStorage.getItem(this.PREFIX + 'test_history');
        if (raw) {
            try { return JSON.parse(raw); } catch (e) { }
        }
        return [];
    }

    addTestResult(result) {
        const history = this.getTestHistory();
        history.unshift({
            id: 'test_' + Date.now(),
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            durationSeconds: result.durationSeconds,
            wpm: Math.round(result.wpm),
            netWpm: Math.round(result.netWpm),
            accuracy: Math.round(result.accuracy),
            errors: result.errors,
            keystrokes: result.keystrokes,
            category: result.category || 'Standard'
        });
        // keep last 50 tests
        if (history.length > 50) history.pop();
        localStorage.setItem(this.PREFIX + 'test_history', JSON.stringify(history));
    }

    getKeyStats() {
        const raw = localStorage.getItem(this.PREFIX + 'key_stats');
        if (raw) {
            try { return JSON.parse(raw); } catch (e) { }
        }
        return {}; // { 'a': { total: 120, errors: 4 } }
    }

    recordKeyPress(key, isCorrect) {
        if (!key || key.length > 1) return;
        const lower = key.toLowerCase();
        const stats = this.getKeyStats();
        if (!stats[lower]) {
            stats[lower] = { total: 0, errors: 0 };
        }
        stats[lower].total++;
        if (!isCorrect) {
            stats[lower].errors++;
        }
        // Save throttled or direct
        localStorage.setItem(this.PREFIX + 'key_stats', JSON.stringify(stats));
    }

    getGameHighScore() {
        const val = localStorage.getItem(this.PREFIX + 'game_highscore');
        return val ? parseInt(val, 10) : 0;
    }

    saveGameHighScore(score) {
        const current = this.getGameHighScore();
        if (score > current) {
            localStorage.setItem(this.PREFIX + 'game_highscore', score.toString());
            return true;
        }
        return false;
    }

    exportData() {
        return JSON.stringify({
            user: this.getUser(),
            settings: this.getSettings(),
            lessons: this.getLessonProgress(),
            testHistory: this.getTestHistory(),
            keyStats: this.getKeyStats(),
            highScore: this.getGameHighScore()
        }, null, 2);
    }

    importData(jsonString) {
        try {
            const data = JSON.parse(jsonString);
            if (data.user) this.saveUser(data.user);
            if (data.settings) this.saveSettings(data.settings);
            if (data.lessons) this.saveLessonProgress(data.lessons);
            if (data.testHistory) localStorage.setItem(this.PREFIX + 'test_history', JSON.stringify(data.testHistory));
            if (data.keyStats) localStorage.setItem(this.PREFIX + 'key_stats', JSON.stringify(data.keyStats));
            if (data.highScore) localStorage.setItem(this.PREFIX + 'game_highscore', data.highScore.toString());
            return true;
        } catch (e) {
            console.error('Failed to import data', e);
            return false;
        }
    }

    resetAllData() {
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith(this.PREFIX)) {
                localStorage.removeItem(key);
            }
        });
    }
}

window.storageManager = new StorageManager();
