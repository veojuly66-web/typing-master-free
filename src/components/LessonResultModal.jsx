import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, CheckCircle, RotateCcw, ArrowRight, Award, AlertTriangle, Zap, Target } from 'lucide-react';

export default function LessonResultModal({
  stats,
  lessonTitle,
  onNext,
  onRetry,
  onCourseList,
  hasNextLesson = true
}) {
  const { netWpm, grossWpm, accuracy, timeSeconds, errorsCount, mistakeKeys = {}, passed } = stats;

  useEffect(() => {
    if (passed) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [passed]);

  // Extract top problem keys
  const problemKeyEntries = Object.entries(mistakeKeys).sort((a, b) => b[1] - a[1]).slice(0, 5);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Top Glow Accent */}
        <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${
          passed ? 'from-emerald-400 via-teal-500 to-blue-500' : 'from-amber-400 to-rose-500'
        }`} />

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-3 shadow-lg ring-4 ring-slate-800">
            {passed ? (
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40">
                <Trophy className="w-8 h-8 animate-bounce-short" />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/40">
                <AlertTriangle className="w-8 h-8" />
              </div>
            )}
          </div>

          <h3 className="text-2xl font-black text-white tracking-tight">
            {passed ? 'Lesson Completed!' : 'Keep Practicing!'}
          </h3>
          <p className="text-sm text-slate-400 mt-1">
            {passed 
              ? 'Great rhythm! Your muscle memory is getting sharper.' 
              : 'Speed will come naturally with practice. Focus on accuracy first.'}
          </p>
          <div className="text-xs text-slate-500 mt-0.5 font-medium">{lessonTitle}</div>
        </div>

        {/* Big Metrics Grid */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {/* Net Speed */}
          <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 text-center">
            <div className="flex items-center justify-center gap-1 text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Zap className="w-3.5 h-3.5 text-blue-400" />
              <span>Net Speed</span>
            </div>
            <div className="text-3xl font-black text-blue-400 font-mono">
              {netWpm}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">WPM</div>
          </div>

          {/* Accuracy */}
          <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 text-center">
            <div className="flex items-center justify-center gap-1 text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Target className="w-3.5 h-3.5 text-emerald-400" />
              <span>Accuracy</span>
            </div>
            <div className={`text-3xl font-black font-mono ${
              accuracy >= 95 ? 'text-emerald-400' : 'text-amber-400'
            }`}>
              {accuracy}%
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">{errorsCount} errors</div>
          </div>

          {/* Time */}
          <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 text-center">
            <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
              Time
            </div>
            <div className="text-3xl font-black text-purple-400 font-mono">
              {timeSeconds}s
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Gross {grossWpm} WPM</div>
          </div>
        </div>

        {/* Problem Keys Analysis */}
        {problemKeyEntries.length > 0 && (
          <div className="mb-6 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20">
            <div className="text-xs font-bold text-rose-300 mb-2 flex items-center gap-1.5">
              <span>Difficult Keys in this Lesson:</span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {problemKeyEntries.map(([key, count]) => (
                <span
                  key={key}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 border border-rose-500/40 text-rose-300 font-mono text-xs font-bold flex items-center gap-1.5"
                >
                  <span className="text-white">{key === ' ' ? 'Space' : key}</span>
                  <span className="text-[10px] text-rose-400/80">({count}x missed)</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Buttons Action Group */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={onRetry}
            className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-sm font-semibold transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Try Again</span>
          </button>

          {hasNextLesson && onNext && (
            <button
              onClick={onNext}
              className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/25 text-sm font-bold transition-all"
            >
              <span>Next Lesson</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={onCourseList}
            className="w-full sm:w-auto px-4 py-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700/60 text-sm font-medium transition-colors"
          >
            Course Menu
          </button>
        </div>
      </div>
    </div>
  );
}
