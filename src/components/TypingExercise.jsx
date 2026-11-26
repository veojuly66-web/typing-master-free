import React, { useState, useEffect, useRef } from 'react';
import { soundManager } from '../utils/audio';
import VirtualKeyboard from './VirtualKeyboard';
import { RotateCcw, ArrowRight } from 'lucide-react';

export default function TypingExercise({
  text = '',
  title = 'Typing Exercise',
  intro = '',
  targetWpm = 30,
  targetAccuracy = 95,
  onComplete,
  onExit
}) {
  const [typed, setTyped] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [activeKey, setActiveKey] = useState(null);
  const [errorsCount, setErrorsCount] = useState(0);
  const [mistakeKeys, setMistakeKeys] = useState({});
  const [errorFlash, setErrorFlash] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(true);

  const containerRef = useRef(null);
  const textDisplayRef = useRef(null);
  const timerRef = useRef(null);

  const targetChar = typed.length < text.length ? text[typed.length] : null;

  // Auto focus and keep focus
  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  // Timer loop
  useEffect(() => {
    if (startTime && typed.length < text.length) {
      timerRef.current = setInterval(() => {
        setElapsedSeconds((Date.now() - startTime) / 1000);
      }, 250);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [startTime, typed.length, text.length]);

  // Live stats calculation
  const totalCorrect = typed.length;
  const totalAttempts = totalCorrect + errorsCount;
  const minutes = Math.max(elapsedSeconds / 60, 0.016);
  const grossWpm = Math.round((totalAttempts / 5) / minutes) || 0;
  const netWpm = Math.max(0, Math.round((totalCorrect / 5) / minutes)) || 0;
  const accuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 100;

  // Exercise completion
  useEffect(() => {
    if (typed.length >= text.length && text.length > 0) {
      soundManager.playSuccess();
      const finalStats = {
        grossWpm,
        netWpm,
        accuracy,
        timeSeconds: Math.round(elapsedSeconds),
        totalChars: text.length,
        errorsCount,
        mistakeKeys,
        passed: netWpm >= targetWpm && accuracy >= targetAccuracy
      };
      if (onComplete) {
        onComplete(finalStats);
      }
    }
  }, [typed.length, text.length]);

  // Auto-scroll the text display so caret is always visible in the 3 visible lines
  useEffect(() => {
    const caretEl = document.getElementById('exercise-caret');
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

  // Key down handler
  const handleKeyDown = (e) => {
    // Shortcuts
    if (e.key === 'Escape') {
      e.preventDefault();
      handleRestart();
      return;
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      if (onExit) onExit();
      return;
    }

    // Ignore modifier combinations
    if (e.ctrlKey || e.metaKey || e.altKey) return;

    setActiveKey(e.key);
    setTimeout(() => setActiveKey(null), 100);

    if (typed.length >= text.length) return;

    // Backspace: allow correcting back one character if needed
    if (e.key === 'Backspace') {
      e.preventDefault();
      if (typed.length > 0) {
        setTyped(prev => prev.slice(0, -1));
        soundManager.playKeypress('backspace', true);
      }
      return;
    }

    // Single printable character
    if (e.key.length === 1) {
      e.preventDefault();

      if (!startTime) {
        setStartTime(Date.now());
      }

      const expectedChar = text[typed.length];
      const isCorrect = e.key === expectedChar;

      if (isCorrect) {
        soundManager.playKeypress(e.key);
        setTyped(prev => prev + e.key);
        setErrorFlash(false);
      } else {
        // Strict Error Blocking: cursor DOES NOT advance past mistakes!
        soundManager.playError();
        setErrorFlash(true);
        setTimeout(() => setErrorFlash(false), 180);
        setErrorsCount(prev => prev + 1);
        setMistakeKeys(prev => ({
          ...prev,
          [expectedChar]: (prev[expectedChar] || 0) + 1
        }));
      }
    }
  };

  const handleRestart = () => {
    setTyped('');
    setStartTime(null);
    setElapsedSeconds(0);
    setErrorsCount(0);
    setMistakeKeys({});
    setErrorFlash(false);
    containerRef.current?.focus();
  };

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onClick={() => containerRef.current?.focus()}
      className="max-w-4xl mx-auto px-4 py-6 outline-none focus:outline-none"
    >
      {/* Exercise Header */}
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-paper-border">
        <div>
          <h1 className="text-xl font-semibold text-ink tracking-tight">{title}</h1>
          {intro && <p className="text-xs text-ink-muted mt-0.5">{intro}</p>}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRestart}
            aria-label="Restart exercise (Escape)"
            title="Restart (Esc)"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-btn border border-paper-border text-xs text-ink-muted hover:text-ink hover:bg-paper transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Restart</span>
          </button>

          <button
            type="button"
            onClick={onExit}
            aria-label="Exit to lessons list (Tab)"
            title="Exit (Tab)"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-btn border border-paper-border text-xs text-ink-muted hover:text-ink hover:bg-paper transition-colors"
          >
            <span>Exit</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Thin Stat Bar: Numbers only, no heavy boxes */}
      <div className="flex items-center justify-between text-xs text-ink-muted font-medium mb-6 pb-3 border-b border-paper-border select-none">
        <div>
          <span className="font-mono text-xl sm:text-2xl font-semibold text-ink">{netWpm}</span>
          <span className="ml-1.5 text-ink-muted">WPM</span>
        </div>

        <div>
          <span className={`font-mono text-xl sm:text-2xl font-semibold ${
            accuracy >= targetAccuracy ? 'text-accent' : 'text-ink'
          }`}>
            {accuracy}%
          </span>
          <span className="ml-1.5 text-ink-muted">Accuracy</span>
        </div>

        <div>
          <span className="font-mono text-xl sm:text-2xl font-semibold text-ink">
            {Math.round(elapsedSeconds)}s
          </span>
          <span className="ml-1.5 text-ink-muted">Time</span>
        </div>

        <div>
          <span className={`font-mono text-xl sm:text-2xl font-semibold ${
            errorsCount > 0 ? 'text-type-error' : 'text-ink'
          }`}>
            {errorsCount}
          </span>
          <span className="ml-1.5 text-ink-muted">Errors</span>
        </div>
      </div>

      {/* Big Centered Typing Display: JetBrains Mono 24-28px, 3 lines visible, auto-scroll */}
      <div className={`bg-paper-surface border rounded-card p-6 sm:p-8 shadow-subtle transition-colors ${
        errorFlash ? 'border-type-error bg-rose-50/20 dark:bg-rose-950/10' : 'border-paper-border'
      }`}>
        <div
          ref={textDisplayRef}
          className="font-mono text-xl sm:text-2xl md:text-[26px] leading-[1.7] max-h-[140px] sm:max-h-[160px] overflow-hidden select-none relative"
        >
          {/* Typed characters (Normal ink) */}
          <span className="text-ink">
            {typed}
          </span>

          {/* Smooth Blinking Caret */}
          <span
            id="exercise-caret"
            className={`inline-block w-[2.5px] h-6 sm:h-7 align-middle mx-[0.5px] caret-pulse ${
              errorFlash ? 'bg-type-error' : 'bg-type-caret'
            }`}
          />

          {/* Untyped characters (Muted ink) */}
          <span className="text-ink-muted/40">
            {text.slice(typed.length)}
          </span>
        </div>

        {/* Small hint bar under text */}
        <div className="mt-4 pt-3 border-t border-paper-border flex flex-wrap items-center justify-between gap-2 text-xs text-ink-muted">
          <span>Esc to restart · Tab to skip</span>
          <button
            type="button"
            onClick={() => setShowKeyboard(!showKeyboard)}
            className="hover:text-ink underline text-[11px]"
          >
            {showKeyboard ? 'Hide keyboard' : 'Show keyboard'}
          </button>
        </div>
      </div>

      {/* Virtual Keyboard */}
      {showKeyboard && (
        <VirtualKeyboard
          targetChar={targetChar}
          activeKey={activeKey}
        />
      )}
    </div>
  );
}
