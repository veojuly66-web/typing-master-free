import React, { useState, useEffect, useRef, Suspense } from 'react';
import { TYPING_TESTS } from '../data/courses';
import { soundManager } from '../utils/audio';
import { Play, RotateCcw, Award } from 'lucide-react';

const CertificateModal = React.lazy(() => import('./CertificateModal'));

export default function TypingTest({ onBack }) {
  const [selectedTest, setSelectedTest] = useState(TYPING_TESTS[0]);
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TYPING_TESTS[0].duration);
  const [typed, setTyped] = useState('');
  const [errorsCount, setErrorsCount] = useState(0);
  const [showCertificate, setShowCertificate] = useState(false);
  const [finalStats, setFinalStats] = useState(null);
  const [errorFlash, setErrorFlash] = useState(false);

  const containerRef = useRef(null);
  const textDisplayRef = useRef(null);
  const timerRef = useRef(null);

  const testText = selectedTest.text;

  const handleSelectTest = (test) => {
    setSelectedTest(test);
    setIsRunning(false);
    setTimeLeft(test.duration);
    setTyped('');
    setErrorsCount(0);
    setShowCertificate(false);
    setFinalStats(null);
  };

  // Timer countdown
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            finishTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning, timeLeft]);

  // Compute live statistics
  const timeElapsed = selectedTest.duration - timeLeft;
  const minutes = Math.max(timeElapsed / 60, 0.016);
  const totalCorrect = typed.length;
  const totalAttempts = totalCorrect + errorsCount;

  const grossWpm = Math.round((totalAttempts / 5) / minutes) || 0;
  const netWpm = Math.max(0, Math.round((totalCorrect / 5) / minutes)) || 0;
  const accuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 100;

  const startTest = () => {
    setIsRunning(true);
    setTimeLeft(selectedTest.duration);
    setTyped('');
    setErrorsCount(0);
    setShowCertificate(false);
    setFinalStats(null);
    setTimeout(() => {
      containerRef.current?.focus();
    }, 50);
  };

  const finishTest = () => {
    setIsRunning(false);
    soundManager.playSuccess();
    const stats = {
      netWpm,
      grossWpm,
      accuracy,
      duration: selectedTest.duration,
      errorsCount,
      totalChars: testText.length
    };
    setFinalStats(stats);

    // Save to test history in localStorage
    try {
      const history = JSON.parse(localStorage.getItem('tm_test_history') || '[]');
      history.unshift({
        ...stats,
        testId: selectedTest.id,
        testTitle: selectedTest.title,
        date: new Date().toISOString()
      });
      localStorage.setItem('tm_test_history', JSON.stringify(history.slice(0, 30)));
    } catch (e) {
      console.error(e);
    }
  };

  const handleKeyDown = (e) => {
    if (!isRunning) return;

    if (e.key === 'Escape') {
      e.preventDefault();
      startTest();
      return;
    }

    if (e.ctrlKey || e.metaKey || e.altKey) return;

    if (e.key === 'Backspace') {
      e.preventDefault();
      if (typed.length > 0) {
        setTyped(prev => prev.slice(0, -1));
        soundManager.playKeypress('backspace', true);
      }
      return;
    }

    if (e.key.length === 1) {
      e.preventDefault();
      const expectedChar = testText[typed.length];
      const isCorrect = e.key === expectedChar;

      if (isCorrect) {
        soundManager.playKeypress(e.key);
        setErrorFlash(false);
        const nextTyped = typed + e.key;
        setTyped(nextTyped);

        if (nextTyped.length >= testText.length) {
          finishTest();
        }
      } else {
        soundManager.playError();
        setErrorFlash(true);
        setTimeout(() => setErrorFlash(false), 180);
        setErrorsCount(prev => prev + 1);
      }
    }
  };

  // Auto-scroll caret
  useEffect(() => {
    const caretEl = document.getElementById('test-caret');
    if (caretEl && textDisplayRef.current) {
      const containerTop = textDisplayRef.current.offsetTop;
      const caretTop = caretEl.offsetTop;
      const scrollPos = caretTop - containerTop - 40;
      if (scrollPos > 0) {
        textDisplayRef.current.scrollTop = scrollPos;
      } else {
        textDisplayRef.current.scrollTop = 0;
      }
    }
  }, [typed]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onClick={() => containerRef.current?.focus()}
      className="max-w-content mx-auto py-8 md:py-12 px-4 outline-none focus:outline-none"
    >
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-semibold text-ink tracking-tight mb-2">
          Typing Speed Test
        </h1>
        <p className="text-sm sm:text-base text-ink-muted max-w-2xl">
          Check your typing speed and accuracy under timed benchmark conditions. Complete any test to receive a Certificate of Completion.
        </p>
      </div>

      {/* Test Selection Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {TYPING_TESTS.map((test) => {
          const isSelected = selectedTest.id === test.id;
          return (
            <button
              key={test.id}
              type="button"
              onClick={() => handleSelectTest(test)}
              className={`p-4 rounded-card border text-left transition-all ${
                isSelected
                  ? 'bg-paper-surface border-accent shadow-subtle ring-1 ring-accent'
                  : 'bg-paper-surface border-paper-border hover:border-ink-muted/40'
              }`}
            >
              <div className="flex items-center justify-between mb-1 text-xs">
                <span className="font-mono text-ink-muted">{Math.round(test.duration / 60)} min</span>
                <span className="text-[11px] px-1.5 py-0.5 rounded bg-paper border border-paper-border text-ink-muted">
                  {test.difficulty}
                </span>
              </div>
              <h2 className="text-sm font-semibold text-ink mb-1">{test.title}</h2>
              <p className="text-xs text-ink-muted line-clamp-2 leading-relaxed">{test.description}</p>
            </button>
          );
        })}
      </div>

      {/* Test Active Screen / Ready Card */}
      <div className="bg-paper-surface border border-paper-border rounded-card p-6 sm:p-8 shadow-subtle">
        {/* Thin Stat Bar */}
        <div className="flex items-center justify-between text-xs text-ink-muted font-medium mb-6 pb-3 border-b border-paper-border select-none">
          <div>
            <span className="font-mono text-xl sm:text-2xl font-semibold text-ink">{netWpm}</span>
            <span className="ml-1.5 text-ink-muted">WPM</span>
          </div>

          <div>
            <span className="font-mono text-xl sm:text-2xl font-semibold text-ink">{accuracy}%</span>
            <span className="ml-1.5 text-ink-muted">Accuracy</span>
          </div>

          <div>
            <span className={`font-mono text-xl sm:text-2xl font-semibold ${timeLeft <= 10 && isRunning ? 'text-type-error' : 'text-accent'}`}>
              {formatTime(timeLeft)}
            </span>
            <span className="ml-1.5 text-ink-muted">Remaining</span>
          </div>

          <div>
            <span className={`font-mono text-xl sm:text-2xl font-semibold ${errorsCount > 0 ? 'text-type-error' : 'text-ink'}`}>
              {errorsCount}
            </span>
            <span className="ml-1.5 text-ink-muted">Errors</span>
          </div>
        </div>

        {/* Text Area */}
        <div className={`p-6 rounded-card bg-paper border transition-colors mb-6 ${
          errorFlash ? 'border-type-error' : 'border-paper-border'
        }`}>
          <div
            ref={textDisplayRef}
            className="font-mono text-xl sm:text-2xl leading-[1.7] max-h-[140px] sm:max-h-[160px] overflow-hidden select-none relative"
          >
            <span className="text-ink">{typed}</span>
            {isRunning && (
              <span
                id="test-caret"
                className={`inline-block w-[2.5px] h-6 sm:h-7 align-middle mx-[0.5px] caret-pulse ${
                  errorFlash ? 'bg-type-error' : 'bg-type-caret'
                }`}
              />
            )}
            <span className="text-ink-muted/40">{testText.slice(typed.length)}</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          {!isRunning && !finalStats ? (
            <button
              type="button"
              onClick={startTest}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-btn bg-accent hover:bg-accent-hover text-white text-xs font-medium transition-colors shadow-subtle"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Start {Math.round(selectedTest.duration / 60)}-minute test</span>
            </button>
          ) : isRunning ? (
            <div className="flex items-center gap-3">
              <span className="text-xs text-ink-muted">Type the text above. Mistakes must be corrected to advance.</span>
              <button
                type="button"
                onClick={startTest}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-btn border border-paper-border text-xs text-ink-muted hover:text-ink hover:bg-paper transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Restart</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={startTest}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-btn bg-accent hover:bg-accent-hover text-white text-xs font-medium transition-colors shadow-subtle"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retake test</span>
              </button>

              <button
                type="button"
                onClick={() => setShowCertificate(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-btn border border-paper-border text-ink hover:bg-paper text-xs font-medium transition-colors"
              >
                <Award className="w-3.5 h-3.5 text-accent" />
                <span>View Certificate of Completion</span>
              </button>
            </div>
          )}

          <div className="text-xs text-ink-muted">
            Strict mode active
          </div>
        </div>
      </div>

      {/* Certificate Modal */}
      {showCertificate && finalStats && (
        <Suspense fallback={<div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 text-paper text-sm">Loading certificate...</div>}>
          <CertificateModal
            stats={finalStats}
            testTitle={selectedTest.title}
            onClose={() => setShowCertificate(false)}
          />
        </Suspense>
      )}
    </div>
  );
}
