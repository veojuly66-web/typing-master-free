import React, { useState, useEffect } from 'react';
import { RotateCcw } from 'lucide-react';
import { COURSES } from '../data/courses';

export default function StatsDashboard({ completedLessons = {}, onSelectLesson }) {
  const [testHistory, setTestHistory] = useState([]);
  const [userName, setUserName] = useState(() => localStorage.getItem('tm_user_name') || 'Typist');
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(userName);

  useEffect(() => {
    try {
      const history = JSON.parse(localStorage.getItem('tm_test_history') || '[]');
      setTestHistory(history);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleSaveName = () => {
    const cleaned = tempName.trim() || 'Typist';
    setUserName(cleaned);
    localStorage.setItem('tm_user_name', cleaned);
    setIsEditingName(false);
  };

  const handleResetProgress = () => {
    if (window.confirm('Are you sure you want to reset all your typing progress, lesson records, and test history? This action cannot be undone.')) {
      localStorage.removeItem('tm_completed_lessons');
      localStorage.removeItem('tm_test_history');
      localStorage.removeItem('tm_bubbles_high');
      localStorage.removeItem('tm_attack_high');
      window.location.reload();
    }
  };

  // Compute metrics
  const completedCount = Object.keys(completedLessons).length;
  const totalLessons = COURSES.reduce((sum, c) => sum + c.lessons.length, 0);
  const completedArray = Object.values(completedLessons);
  const avgWpm = completedArray.length > 0
    ? Math.round(completedArray.reduce((acc, l) => acc + (l.netWpm || 0), 0) / completedArray.length)
    : 0;
  const topSpeed = completedArray.length > 0
    ? Math.max(...completedArray.map(l => l.netWpm || 0))
    : 0;
  const avgAccuracy = completedArray.length > 0
    ? Math.round(completedArray.reduce((acc, l) => acc + (l.accuracy || 0), 0) / completedArray.length)
    : 100;
  const totalPracticeTime = completedArray.reduce((acc, l) => acc + (l.timeSeconds || 0), 0);

  return (
    <div className="max-w-content mx-auto py-8 md:py-12 px-4">
      {/* Header & User name */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-paper-border">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-semibold text-ink tracking-tight">
              Progress &amp; Stats
            </h1>
            <span className="text-ink-muted text-sm">·</span>
            {isEditingName ? (
              <span className="inline-flex items-center gap-1.5">
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                  className="px-2 py-0.5 text-xs rounded-input bg-paper border border-paper-border text-ink focus:outline-none focus:border-accent"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={handleSaveName}
                  className="text-xs text-accent hover:underline font-medium"
                >
                  Save
                </button>
              </span>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setTempName(userName);
                  setIsEditingName(true);
                }}
                className="text-sm font-medium text-ink-muted hover:text-ink underline decoration-dotted"
                title="Click to rename"
              >
                {userName}
              </button>
            )}
          </div>
          <p className="text-xs sm:text-sm text-ink-muted">
            All progress is stored locally in your browser and never sent to remote servers.
          </p>
        </div>

        <button
          type="button"
          onClick={handleResetProgress}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-btn border border-paper-border text-xs text-ink-muted hover:text-type-error transition-colors self-start sm:self-center"
        >
          <RotateCcw className="w-3 h-3" strokeWidth={1.5} />
          <span>Reset progress</span>
        </button>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-paper-surface border border-paper-border rounded-card p-5 shadow-subtle">
          <div className="text-xs font-medium text-ink-muted mb-1">Lessons done</div>
          <div className="font-mono text-3xl font-semibold tabular-nums text-ink">
            {completedCount} <span className="text-xs font-sans font-normal text-ink-muted">/ {totalLessons}</span>
          </div>
          <div className="text-[11px] text-ink-muted mt-1">Interactive drills</div>
        </div>

        <div className="bg-paper-surface border border-paper-border rounded-card p-5 shadow-subtle">
          <div className="text-xs font-medium text-ink-muted mb-1">Peak net speed</div>
          <div className="font-mono text-3xl font-semibold tabular-nums text-accent">
            {topSpeed} <span className="text-xs font-sans font-normal text-ink-muted">WPM</span>
          </div>
          <div className="text-[11px] text-ink-muted mt-1">Best lesson result</div>
        </div>

        <div className="bg-paper-surface border border-paper-border rounded-card p-5 shadow-subtle">
          <div className="text-xs font-medium text-ink-muted mb-1">Avg accuracy</div>
          <div className="font-mono text-3xl font-semibold tabular-nums text-ink">
            {avgAccuracy}%
          </div>
          <div className="text-[11px] text-ink-muted mt-1">Across all sessions</div>
        </div>

        <div className="bg-paper-surface border border-paper-border rounded-card p-5 shadow-subtle">
          <div className="text-xs font-medium text-ink-muted mb-1">Practice time</div>
          <div className="font-mono text-3xl font-semibold tabular-nums text-ink">
            {Math.round(totalPracticeTime / 60)} <span className="text-xs font-sans font-normal text-ink-muted">mins</span>
          </div>
          <div className="text-[11px] text-ink-muted mt-1">Active typing time</div>
        </div>
      </div>

      {/* Speed Test History Table */}
      <div className="bg-paper-surface border border-paper-border rounded-card p-6 shadow-subtle">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-paper-border">
          <div>
            <h2 className="text-base font-semibold text-ink">Speed Test History</h2>
            <p className="text-xs text-ink-muted mt-0.5">Your most recent benchmark test results</p>
          </div>
          {testHistory.length > 0 && (
            <button
              type="button"
              onClick={() => {
                localStorage.removeItem('tm_test_history');
                setTestHistory([]);
              }}
              className="text-xs text-ink-muted hover:text-type-error transition-colors"
            >
              Clear tests
            </button>
          )}
        </div>

        {testHistory.length === 0 ? (
          <div className="text-center py-10 text-xs text-ink-muted">
            <p>No tests taken yet.</p>
            <a href="#/test" className="text-accent hover:underline font-medium mt-1 inline-block">
              Take a 1-minute speed test →
            </a>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-paper-border text-ink-muted">
                  <th className="pb-2 font-medium">Test</th>
                  <th className="pb-2 font-medium">Date</th>
                  <th className="pb-2 font-medium">Net WPM</th>
                  <th className="pb-2 font-medium">Accuracy</th>
                  <th className="pb-2 font-medium">Gross WPM</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-paper-border">
                {testHistory.slice(0, 15).map((row, idx) => (
                  <tr key={idx} className="hover:bg-paper transition-colors">
                    <td className="py-2.5 font-medium text-ink">{row.testTitle || 'Speed Test'}</td>
                    <td className="py-2.5 text-ink-muted font-mono">
                      {row.date ? new Date(row.date).toLocaleDateString() : '—'}
                    </td>
                    <td className="py-2.5 font-mono font-semibold text-accent">{row.netWpm} WPM</td>
                    <td className="py-2.5 font-mono text-ink">{row.accuracy}%</td>
                    <td className="py-2.5 font-mono text-ink-muted">{row.grossWpm} WPM</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
