import React, { useState, useEffect } from 'react';
import { Storage } from '../lib/storage';
import { rankWeakKeys } from '../lib/stats';
import { Card, Button, Badge, StatNumber, Modal } from './ui';
import { KEYBOARD_ROWS } from '../utils/fingerMap';
import { Download, Upload, RotateCcw, Award, CheckCircle, Flame, Target, Trophy, Clock } from 'lucide-react';

const ACHIEVEMENTS_LIST = [
  { id: 'first_drill', title: 'First Keystroke', desc: 'Complete your first interactive typing drill', icon: '🎯' },
  { id: 'home_row_hero', title: 'Home Row Master', desc: 'Complete all drills in Level 1', icon: '⌨️' },
  { id: 'speed_40', title: '40 WPM Milestone', desc: 'Reach 40 Net WPM on any lesson or test', icon: '⚡' },
  { id: 'speed_60', title: '60 WPM Velocity', desc: 'Surpass 60 Net WPM with high accuracy', icon: '🚀' },
  { id: 'speed_80', title: '80 WPM Professional', desc: 'Join the top tier of touch typists at 80+ WPM', icon: '🏆' },
  { id: 'pure_precision', title: '100% Pure Accuracy', desc: 'Complete a full lesson with zero mistakes', icon: '💎' },
  { id: 'practice_30m', title: '30 Minutes Practiced', desc: 'Accumulate 30 total minutes of active typing', icon: '⏱️' },
  { id: 'practice_1h', title: '1 Hour Dedicated', desc: 'Log 60 minutes of focused keyboard training', icon: '⏳' },
  { id: 'streak_3d', title: '3-Day Cadence', desc: 'Practice typing for 3 consecutive days', icon: '🔥' },
  { id: 'streak_7d', title: '7-Day Discipline', desc: 'Maintain an unbroken 7-day practice streak', icon: '🌟' },
  { id: 'speed_racer', title: 'Race Champion', desc: 'Win first place in the Speed Race game', icon: '🏎️' },
  { id: 'certified', title: 'Certified Typist', desc: 'Complete a 5-minute timed certification exam', icon: '📜' }
];

export default function ProgressDashboard({ onSelectLesson }) {
  const [history, setHistory] = useState([]);
  const [lessons, setLessons] = useState({});
  const [keyStats, setKeyStats] = useState({});
  const [dailyPractice, setDailyPractice] = useState({});
  const [achievements, setAchievements] = useState([]);
  const [userName, setUserName] = useState('Typist');
  const [heatmapMode, setHeatmapMode] = useState('error'); // 'error' | 'speed'
  const [showResetModal, setShowResetModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importJson, setImportJson] = useState('');

  useEffect(() => {
    setHistory(Storage.getTestHistory());
    setLessons(Storage.getLessons());
    setKeyStats(Storage.getKeyStats());
    setDailyPractice(Storage.getDailyPractice());
    setAchievements(Storage.getAchievements());
    setUserName(Storage.getUserName());
  }, []);

  // Compute metrics
  const completedList = Object.values(lessons);
  const completedCount = completedList.length;
  const avgWpm = completedList.length > 0
    ? Math.round(completedList.reduce((acc, l) => acc + (l.netWpm || 0), 0) / completedList.length)
    : 0;
  const topSpeed = completedList.length > 0
    ? Math.max(...completedList.map(l => l.netWpm || 0))
    : 0;
  const avgAccuracy = completedList.length > 0
    ? Math.round(completedList.reduce((acc, l) => acc + (l.accuracy || 0), 0) / completedList.length)
    : 100;
  const totalMinutes = Math.round(Object.values(dailyPractice).reduce((a, b) => a + b, 0));

  // Today's practice vs Daily Goal
  const todayStr = new Date().toISOString().split('T')[0];
  const todayMins = Math.round((dailyPractice[todayStr] || 0) * 10) / 10;
  const settings = Storage.getSettings();
  const goalMins = settings.dailyGoalMinutes || 10;
  const goalPct = Math.min(100, Math.round((todayMins / goalMins) * 100));

  // Weak keys
  const weakKeys = rankWeakKeys(keyStats, 6);

  // Keyboard heatmap styling
  const getKeyHeatmapColor = (char) => {
    if (!char) return '';
    const stats = keyStats[char.toLowerCase()];
    if (!stats || stats.hits < 2) return 'bg-surface border-border text-text';

    if (heatmapMode === 'error') {
      const errorRate = stats.errors / stats.hits;
      if (errorRate > 0.25) return 'bg-rose-200 dark:bg-rose-950/70 border-rose-400 text-rose-900 dark:text-rose-200 font-bold';
      if (errorRate > 0.12) return 'bg-amber-100 dark:bg-amber-950/60 border-amber-300 text-amber-900 dark:text-amber-200';
      if (errorRate > 0.05) return 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 text-text';
      return 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 text-emerald-800 dark:text-emerald-200';
    } else {
      // Speed / latency
      const avgMs = stats.totalLatencyMs / stats.hits;
      if (avgMs > 450) return 'bg-rose-200 dark:bg-rose-950/70 border-rose-400 text-rose-900 dark:text-rose-200';
      if (avgMs > 320) return 'bg-amber-100 dark:bg-amber-950/60 border-amber-300 text-amber-900 dark:text-amber-200';
      return 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 text-emerald-800 dark:text-emerald-200';
    }
  };

  // Export Data
  const handleExport = () => {
    const dataStr = Storage.exportData();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `pankaj-typing-progress-${todayStr}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportSubmit = () => {
    if (Storage.importData(importJson)) {
      setShowImportModal(false);
      window.location.reload();
    } else {
      alert('Invalid progress JSON data.');
    }
  };

  const handleResetConfirm = () => {
    Storage.resetAll();
    setShowResetModal(false);
    window.location.reload();
  };

  return (
    <div className="max-w-content mx-auto py-8 md:py-12 px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-border">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-semibold text-text tracking-tight">
              Progress &amp; Analytics
            </h1>
            <Badge variant="default">{userName}</Badge>
          </div>
          <p className="text-xs sm:text-sm text-text-muted">
            Track velocity trends, keystroke precision, and daily training streaks. Stored locally in your browser.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button size="sm" variant="outline" onClick={handleExport}>
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </Button>

          <Button size="sm" variant="outline" onClick={() => setShowImportModal(true)}>
            <Upload className="w-3.5 h-3.5" />
            <span>Import</span>
          </Button>

          <Button size="sm" variant="ghost" onClick={() => setShowResetModal(true)}>
            <RotateCcw className="w-3.5 h-3.5 text-error" />
            <span className="text-error">Reset</span>
          </Button>
        </div>
      </div>

      {/* Summary Stat Grid with Daily Goal Ring */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <Card className="p-5 flex flex-col justify-between">
          <StatNumber value={topSpeed} label="Peak Speed" unit="WPM" accent />
          <div className="text-2xs text-text-muted mt-2">Best recorded run</div>
        </Card>

        <Card className="p-5 flex flex-col justify-between">
          <StatNumber value={avgWpm} label="Average Speed" unit="WPM" />
          <div className="text-2xs text-text-muted mt-2">Across all drills</div>
        </Card>

        <Card className="p-5 flex flex-col justify-between">
          <StatNumber value={`${avgAccuracy}%`} label="Average Accuracy" />
          <div className="text-2xs text-text-muted mt-2">Touch typing target: 95%+</div>
        </Card>

        <Card className="p-5 flex flex-col justify-between">
          <StatNumber value={`${completedCount}/30`} label="Lessons Done" />
          <div className="text-2xs text-text-muted mt-2">Curriculum progress</div>
        </Card>

        {/* Daily Goal Ring */}
        <Card className="p-5 flex flex-col justify-between col-span-2 md:col-span-1">
          <div className="text-2xs font-semibold uppercase tracking-wider text-text-muted mb-1">
            Today's Goal
          </div>
          <div className="flex items-center gap-3">
            {/* SVG Ring */}
            <div className="relative w-11 h-11 shrink-0 flex items-center justify-center">
              <svg className="w-11 h-11 -rotate-90">
                <circle cx="22" cy="22" r="18" className="stroke-surface-2 fill-none" strokeWidth="3" />
                <circle
                  cx="22"
                  cy="22"
                  r="18"
                  className="stroke-accent fill-none transition-all duration-300"
                  strokeWidth="3"
                  strokeDasharray="113"
                  strokeDashoffset={113 - (113 * goalPct) / 100}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute text-2xs font-mono font-bold text-text">{goalPct}%</span>
            </div>
            <div>
              <div className="font-mono text-sm font-semibold text-text">{todayMins}m / {goalMins}m</div>
              <div className="text-2xs text-text-muted">Active practice</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Keyboard Heatmap Section */}
      <Card className="p-6 sm:p-8 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-4 border-b border-border">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-base font-semibold text-text">Keyboard Performance Heatmap</h2>
              <Badge variant="accent">{heatmapMode === 'error' ? 'Error Rate' : 'Key Latency'}</Badge>
            </div>
            <p className="text-xs text-text-muted">
              Identifies which finger positions incur hesitation or frequent errors.
            </p>
          </div>

          <div className="inline-flex rounded-btn bg-surface-2 p-1 border border-border text-xs">
            <button
              type="button"
              onClick={() => setHeatmapMode('error')}
              className={`px-3 py-1 rounded-btn font-medium transition-colors ${
                heatmapMode === 'error' ? 'bg-surface text-text shadow-subtle' : 'text-text-muted hover:text-text'
              }`}
            >
              Error Rate
            </button>
            <button
              type="button"
              onClick={() => setHeatmapMode('speed')}
              className={`px-3 py-1 rounded-btn font-medium transition-colors ${
                heatmapMode === 'speed' ? 'bg-surface text-text shadow-subtle' : 'text-text-muted hover:text-text'
              }`}
            >
              Key Speed
            </button>
          </div>
        </div>

        {/* Heatmap Legend */}
        <div className="flex items-center gap-4 text-2xs text-text-muted mb-4 justify-end">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-emerald-100 dark:bg-emerald-950 border border-emerald-300" />
            <span>Optimal</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-amber-100 dark:bg-amber-950 border border-amber-300" />
            <span>Moderate</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-rose-200 dark:bg-rose-950 border border-rose-400" />
            <span>Needs Practice</span>
          </span>
        </div>

        {/* Keyboard View */}
        <div className="flex flex-col gap-1.5 p-2 rounded-btn bg-bg border border-border overflow-x-auto select-none">
          {KEYBOARD_ROWS.map((row, rIdx) => (
            <div key={rIdx} className="flex justify-center gap-1 min-w-[620px]">
              {row.map((k, kIdx) => {
                const colorClass = getKeyHeatmapColor(k.key);
                return (
                  <div
                    key={kIdx}
                    className={`relative flex flex-col items-center justify-center font-mono rounded-btn border text-xs h-10 select-none ${
                      k.width || 'w-10'
                    } ${colorClass} ${k.isSpecial ? 'font-sans text-2xs text-text-muted' : 'font-medium'}`}
                  >
                    <span className="uppercase">{k.key}</span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </Card>

      {/* Weak Keys Table & Recent Tests */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
        {/* Weak Keys Table */}
        <Card className="lg:col-span-5 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-border">
              <h3 className="text-sm font-semibold text-text">Weak Key Focus</h3>
              <span className="text-2xs text-text-muted font-mono">{weakKeys.length} identified</span>
            </div>

            {weakKeys.length === 0 ? (
              <div className="text-center py-8 text-xs text-text-muted">
                No weak keys logged yet. Practice a few drills to calibrate.
              </div>
            ) : (
              <div className="divide-y divide-border">
                {weakKeys.map((item) => (
                  <div key={item.key} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-btn bg-surface-2 border border-border font-mono font-bold text-sm text-text flex items-center justify-center uppercase">
                        {item.key}
                      </span>
                      <div>
                        <div className="font-medium text-text">{item.errors} misses</div>
                        <div className="text-2xs text-text-muted">{item.avgLatency}ms avg response</div>
                      </div>
                    </div>
                    <Badge variant={item.errorRate > 0.2 ? 'error' : 'warning'}>
                      {Math.round(item.errorRate * 100)}% err
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-border mt-4">
            <Button
              size="sm"
              variant="primary"
              className="w-full"
              onClick={() => { window.location.hash = '#/practice'; }}
            >
              <span>Practice weak keys in studio</span>
            </Button>
          </div>
        </Card>

        {/* Recent Tests Table */}
        <Card className="lg:col-span-7 p-6">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-border">
            <h3 className="text-sm font-semibold text-text">Recent Speed Tests</h3>
            <span className="text-2xs text-text-muted font-mono">{history.length} total</span>
          </div>

          {history.length === 0 ? (
            <div className="text-center py-10 text-xs text-text-muted">
              No speed tests taken yet. Take a benchmark test to measure WPM.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border text-text-muted text-2xs">
                    <th className="pb-2 font-medium">Test</th>
                    <th className="pb-2 font-medium">Date</th>
                    <th className="pb-2 font-medium">Net WPM</th>
                    <th className="pb-2 font-medium">Accuracy</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {history.slice(0, 7).map((row, idx) => (
                    <tr key={idx} className="hover:bg-surface-2 transition-colors">
                      <td className="py-2.5 font-medium text-text">{row.testTitle || 'Speed Test'}</td>
                      <td className="py-2.5 text-text-muted font-mono text-2xs">
                        {row.date ? new Date(row.date).toLocaleDateString() : '—'}
                      </td>
                      <td className="py-2.5 font-mono font-semibold text-accent">{row.netWpm} WPM</td>
                      <td className="py-2.5 font-mono text-text">{row.accuracy}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

      {/* Achievements Section */}
      <Card className="p-6 sm:p-8">
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-border">
          <div>
            <h2 className="text-base font-semibold text-text">Achievements</h2>
            <p className="text-xs text-text-muted mt-0.5">Milestones unlocked along your touch-typing journey</p>
          </div>
          <span className="text-xs font-mono text-text-muted">
            {achievements.length} / {ACHIEVEMENTS_LIST.length} unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ACHIEVEMENTS_LIST.map((ach) => {
            const isUnlocked = achievements.includes(ach.id) || (ach.id === 'first_drill' && completedCount > 0);

            return (
              <div
                key={ach.id}
                className={`p-4 rounded-card border transition-all ${
                  isUnlocked
                    ? 'bg-surface border-accent/40 shadow-subtle'
                    : 'bg-surface-2 border-border opacity-50'
                }`}
              >
                <div className="text-2xl mb-2">{ach.icon}</div>
                <div className="text-xs font-semibold text-text mb-0.5">{ach.title}</div>
                <div className="text-2xs text-text-muted leading-relaxed">{ach.desc}</div>
                {isUnlocked && (
                  <div className="mt-3 text-2xs text-accent font-medium flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    <span>Unlocked</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Reset Confirmation Modal */}
      <Modal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        title="Reset All Progress?"
      >
        <p className="text-xs text-text-muted leading-relaxed mb-6">
          This will permanently delete all completed lessons, speed test history, personal bests, and custom settings stored on this device. This action cannot be reversed.
        </p>
        <div className="flex items-center justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowResetModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" size="sm" onClick={handleResetConfirm}>
            Yes, reset all progress
          </Button>
        </div>
      </Modal>

      {/* Import Modal */}
      <Modal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        title="Import Progress JSON"
      >
        <p className="text-xs text-text-muted mb-3">
          Paste previously exported Pankaj Typing JSON data below:
        </p>
        <textarea
          rows={6}
          value={importJson}
          onChange={(e) => setImportJson(e.target.value)}
          placeholder="Paste JSON here..."
          className="w-full p-3 rounded-btn bg-bg border border-border text-xs font-mono mb-4 focus:outline-none focus:border-accent"
        />
        <div className="flex items-center justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowImportModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleImportSubmit}>
            Import Data
          </Button>
        </div>
      </Modal>
    </div>
  );
}
