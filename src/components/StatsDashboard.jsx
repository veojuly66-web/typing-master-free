import React, { useState, useEffect } from 'react';
import { Award, Zap, Target, BookOpen, Clock, Flame, Crown, BarChart2, CheckCircle2 } from 'lucide-react';

export default function StatsDashboard({ completedLessons = {}, onSelectLesson }) {
  const [testHistory, setTestHistory] = useState([]);
  const [userName, setUserName] = useState(() => localStorage.getItem('tm_user_name') || 'Pankaj');
  const [isEditingName, setIsEditingName] = useState(false);

  useEffect(() => {
    try {
      const history = JSON.parse(localStorage.getItem('tm_test_history') || '[]');
      setTestHistory(history);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleSaveName = (name) => {
    setUserName(name);
    localStorage.setItem('tm_user_name', name);
    setIsEditingName(false);
  };

  // Compute stats
  const completedCount = Object.keys(completedLessons).length;
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
    <div className="max-w-5xl mx-auto py-8 px-4">
      {/* Premium Lifetime Banner */}
      <div className="bg-gradient-to-r from-amber-500/15 via-blue-600/15 to-purple-600/15 border border-amber-500/30 p-6 rounded-3xl mb-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-amber-500/20">
            <Crown className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider">
                Lifetime Premium Unlocked
              </span>
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> 100% Free for Everyone
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              {isEditingName ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    defaultValue={userName}
                    onBlur={(e) => handleSaveName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveName(e.target.value)}
                    className="bg-slate-800 border border-slate-700 px-3 py-1 rounded-lg text-white font-bold text-lg"
                    autoFocus
                  />
                  <button 
                    onClick={() => setIsEditingName(false)}
                    className="text-xs text-blue-400 font-medium hover:underline"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <h2 
                  onClick={() => setIsEditingName(true)}
                  className="text-2xl font-black text-white tracking-tight cursor-pointer hover:text-blue-300 transition-colors flex items-center gap-2"
                  title="Click to edit name"
                >
                  <span>{userName}</span>
                  <span className="text-xs text-slate-500 font-normal underline">edit</span>
                </h2>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Access to all 30+ interactive touch typing lessons, speed tests, official certificates, and games.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-[10px] uppercase font-bold text-slate-400">Current Level</div>
            <div className="text-xl font-bold text-amber-400">
              {completedCount >= 20 ? 'Grandmaster' : completedCount >= 10 ? 'Intermediate' : 'Beginner Typist'}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Lessons Done</span>
            <BookOpen className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-3xl font-black text-white font-mono">{completedCount} <span className="text-xs text-slate-500 font-normal">/ 30</span></div>
          <div className="text-xs text-slate-400 mt-1">Interactive drills</div>
        </div>

        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Top Velocity</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-amber-400 font-mono">{topSpeed} <span className="text-xs text-slate-500 font-normal">WPM</span></div>
          <div className="text-xs text-slate-400 mt-1">Peak net speed</div>
        </div>

        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Avg Accuracy</span>
            <Target className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-emerald-400 font-mono">{avgAccuracy}%</div>
          <div className="text-xs text-slate-400 mt-1">Across all sessions</div>
        </div>

        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Practice Time</span>
            <Clock className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-black text-purple-400 font-mono">
            {Math.round(totalPracticeTime / 60)} <span className="text-xs text-slate-500 font-normal">mins</span>
          </div>
          <div className="text-xs text-slate-400 mt-1">Total active typing</div>
        </div>
      </div>

      {/* Test History */}
      <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 shadow-xl mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-bold text-white tracking-tight">Recent Speed Test Results</h3>
          </div>
          {testHistory.length > 0 && (
            <button
              onClick={() => {
                localStorage.removeItem('tm_test_history');
                setTestHistory([]);
              }}
              className="text-xs text-slate-500 hover:text-rose-400 transition-colors"
            >
              Clear History
            </button>
          )}
        </div>

        {testHistory.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-sm">
            No speed tests recorded yet. Head over to the <strong className="text-blue-400">Speed Tests</strong> tab to take your first 1-minute or 5-minute certification exam!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="text-xs uppercase bg-slate-950/60 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Test Title</th>
                  <th className="py-3 px-4">Net WPM</th>
                  <th className="py-3 px-4">Gross WPM</th>
                  <th className="py-3 px-4">Accuracy</th>
                  <th className="py-3 px-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {testHistory.map((h, i) => (
                  <tr key={i} className="hover:bg-slate-800/40 transition-colors font-mono">
                    <td className="py-3 px-4 font-sans font-semibold text-white">{h.testTitle}</td>
                    <td className="py-3 px-4 text-blue-400 font-bold">{h.netWpm} WPM</td>
                    <td className="py-3 px-4 text-slate-400">{h.grossWpm} WPM</td>
                    <td className="py-3 px-4 text-emerald-400">{h.accuracy}%</td>
                    <td className="py-3 px-4 text-xs font-sans text-slate-500">
                      {new Date(h.date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Touch Typing Tips */}
      <div className="bg-slate-950/60 rounded-3xl border border-slate-800 p-6">
        <h4 className="text-base font-bold text-white mb-3 flex items-center gap-2">
          <Flame className="w-4 h-4 text-amber-500" />
          <span>Pankaj Typing Pro Tips for Fast Mastery</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-400 leading-relaxed">
          <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
            <strong className="text-slate-200 block mb-1">1. Never Look at the Keys</strong>
            Looking down breaks your cognitive rhythm. Trust your finger muscle memory. If you miss a letter, feel the tactile bumps on F and J to reorient.
          </div>
          <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
            <strong className="text-slate-200 block mb-1">2. Accuracy Before Speed</strong>
            Speed is a natural byproduct of accuracy. When your accuracy reaches 98%+, high speed will follow without straining your hands.
          </div>
          <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
            <strong className="text-slate-200 block mb-1">3. Daily 15-Minute Flow</strong>
            Brief daily practice builds neural pathways much faster than long weekly sessions. 15 minutes a day will turn you into an 80+ WPM touch typist!
          </div>
        </div>
      </div>
    </div>
  );
}
