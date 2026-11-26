import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Check, RotateCcw, ArrowRight, X } from 'lucide-react';

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
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
    }
  }, [passed]);

  const problemKeys = Object.entries(mistakeKeys)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm animate-fadeIn">
      <div className="bg-paper-surface border border-paper-border rounded-card max-w-lg w-full p-6 sm:p-8 shadow-xl relative">
        {/* Close Button */}
        <button
          type="button"
          onClick={onCourseList}
          aria-label="Close result modal"
          className="absolute top-4 right-4 text-ink-muted hover:text-ink transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Status Heading */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            {passed ? (
              <span className="w-5 h-5 rounded-full bg-accent-soft text-accent flex items-center justify-center">
                <Check className="w-3.5 h-3.5" />
              </span>
            ) : null}
            <h3 className="text-xl font-semibold text-ink tracking-tight">
              {passed ? 'Lesson complete' : 'Keep practicing'}
            </h3>
          </div>
          <p className="text-xs text-ink-muted">
            {lessonTitle} · {passed ? 'Target reached with good form.' : 'Repeat this drill to build steady rhythm.'}
          </p>
        </div>

        {/* Main Metric: Big Net WPM */}
        <div className="py-4 border-y border-paper-border mb-6 flex items-baseline justify-between">
          <div>
            <div className="text-xs text-ink-muted uppercase tracking-wider mb-1">Net typing speed</div>
            <div className="font-mono text-4xl sm:text-5xl font-semibold text-ink">
              {netWpm} <span className="text-sm font-sans font-normal text-ink-muted">WPM</span>
            </div>
          </div>

          <div className="text-right">
            <div className="text-xs text-ink-muted uppercase tracking-wider mb-1">Accuracy</div>
            <div className={`font-mono text-3xl font-semibold ${accuracy >= 95 ? 'text-accent' : 'text-ink'}`}>
              {accuracy}%
            </div>
          </div>
        </div>

        {/* Secondary Metrics Grid */}
        <div className="grid grid-cols-3 gap-3 mb-6 text-xs text-ink-muted">
          <div className="p-3 rounded-card bg-paper border border-paper-border">
            <div className="text-[11px] mb-1">Gross speed</div>
            <div className="font-mono text-base font-semibold text-ink">{grossWpm} WPM</div>
          </div>

          <div className="p-3 rounded-card bg-paper border border-paper-border">
            <div className="text-[11px] mb-1">Time elapsed</div>
            <div className="font-mono text-base font-semibold text-ink">{timeSeconds}s</div>
          </div>

          <div className="p-3 rounded-card bg-paper border border-paper-border">
            <div className="text-[11px] mb-1">Errors</div>
            <div className={`font-mono text-base font-semibold ${errorsCount > 0 ? 'text-type-error' : 'text-ink'}`}>
              {errorsCount}
            </div>
          </div>
        </div>

        {/* Problem Keys (if any) */}
        {problemKeys.length > 0 && (
          <div className="mb-6 p-3 rounded-card bg-paper border border-paper-border">
            <div className="text-[11px] text-ink-muted mb-2">Most missed keys:</div>
            <div className="flex items-center gap-2 flex-wrap">
              {problemKeys.map(([k, count]) => (
                <span
                  key={k}
                  className="px-2 py-0.5 rounded-btn bg-paper-surface border border-paper-border font-mono text-xs text-ink inline-flex items-center gap-1.5"
                >
                  <span>{k === ' ' ? 'Space' : k}</span>
                  <span className="text-[10px] text-ink-muted">({count}×)</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
          <button
            type="button"
            onClick={onRetry}
            className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-btn border border-paper-border text-ink hover:bg-paper text-xs font-medium transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Try again</span>
          </button>

          {hasNextLesson && onNext && (
            <button
              type="button"
              onClick={onNext}
              className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-btn bg-accent hover:bg-accent-hover text-white text-xs font-medium transition-colors shadow-subtle"
            >
              <span>Next lesson</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            onClick={onCourseList}
            className="w-full sm:w-auto px-4 py-2.5 rounded-btn text-ink-muted hover:text-ink text-xs transition-colors"
          >
            Course list
          </button>
        </div>
      </div>
    </div>
  );
}
