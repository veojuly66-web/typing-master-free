import React, { useState, useEffect, useRef, useCallback } from 'react';
import { soundManager } from '../../utils/audio';
import { Storage } from '../../lib/storage';
import { calculateGrossWpm, calculateNetWpm, calculateAccuracy, calculateConsistency } from '../../lib/stats';
import VirtualKeyboard from './VirtualKeyboard';
import { RotateCcw, AlertCircle } from 'lucide-react';

export default function TypingEngine({
  text = '',
  title = 'Typing Exercise',
  intro = '',
  targetWpm = 30,
  targetAccuracy = 95,
  mode = 'lesson', // 'lesson' | 'test' | 'practice'
  durationLimitSeconds = null, // for timed tests
  onComplete,
  onExit,
  onFocusChange
}) {
  const settings = Storage.getSettings();

  const [typed, setTyped] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [activeKey, setActiveKey] = useState(null);
  const [errorsCount, setErrorsCount] = useState(0);
  const [mistakeKeys, setMistakeKeys] = useState({});
  const [errorFlash, setErrorFlash] = useState(false);
  const [capsLockOn, setCapsLockOn] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(settings.showKeyboard);
  const [showFingerColors, setShowFingerColors] = useState(settings.showFingerColors);

  // WPM samples over time for chart and consistency
  const [wpmSamples, setWpmSamples] = useState([]);
  const [perWordData, setPerWordData] = useState([]);

  const containerRef = useRef(null);
  const textDisplayRef = useRef(null);
  const timerRef = useRef(null);
  const lastKeyTimeRef = useRef(null);

  const targetChar = typed.length < text.length ? text[typed.length] : null;

  // Auto focus
  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  // Timer loop
  useEffect(() => {
    if (startTime && !isPaused && typed.length < text.length) {
      timerRef.current = setInterval(() => {
        const now = Date.now();
        const secs = (now - startTime) / 1000;
        setElapsedSeconds(secs);

        // Record WPM sample every 2 seconds
        const currentGross = calculateGrossWpm(typed.length, Math.max(secs / 60, 0.016));
        setWpmSamples(prev => [...prev.slice(-60), currentGross]);

        // Check duration limit for timed tests
        if (durationLimitSeconds && secs >= durationLimitSeconds) {
          clearInterval(timerRef.current);
          handleFinish(secs);
        }
      }, 500);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [startTime, isPaused, typed.length, text.length, durationLimitSeconds]);

  // Handle focus mode: inform parent when typing is active
  useEffect(() => {
    const isTyping = !!startTime && typed.length < text.length && !isPaused;
    if (onFocusChange) {
      onFocusChange(isTyping);
    }
  }, [startTime, typed.length, isPaused, text.length, onFocusChange]);

  // Window blur / pause
  useEffect(() => {
    const handleBlur = () => {
      if (startTime && typed.length < text.length) {
        setIsPaused(true);
      }
    };
    window.addEventListener('blur', handleBlur);
    return () => window.removeEventListener('blur', handleBlur);
  }, [startTime, typed.length, text.length]);

  // Calculate live stats
  const totalCorrect = typed.length;
  const totalAttempts = totalCorrect + errorsCount;
  const minutes = Math.max(elapsedSeconds / 60, 0.016);
  const grossWpm = calculateGrossWpm(totalAttempts, minutes);
  const netWpm = calculateNetWpm(totalCorrect, errorsCount, minutes);
  const accuracy = calculateAccuracy(totalCorrect, totalAttempts);
  const consistency = calculateConsistency(wpmSamples);

  // Complete exercise
  const handleFinish = useCallback((finalSecs = elapsedSeconds) => {
    soundManager.playSuccess();
    const finalMinutes = Math.max(finalSecs / 60, 0.016);
    const finalGross = calculateGrossWpm(totalCorrect + errorsCount, finalMinutes);
    const finalNet = calculateNetWpm(totalCorrect, errorsCount, finalMinutes);
    const finalAcc = calculateAccuracy(totalCorrect, totalCorrect + errorsCount);
    const finalConsistency = calculateConsistency(wpmSamples);

    const stats = {
      grossWpm: finalGross,
      netWpm: finalNet,
      accuracy: finalAcc,
      consistency: finalConsistency,
      timeSeconds: Math.round(finalSecs),
      totalChars: text.length,
      errorsCount,
      mistakeKeys,
      wpmSamples,
      passed: finalNet >= targetWpm && finalAcc >= targetAccuracy
    };

    // Record practice seconds
    Storage.addPracticeSeconds(finalSecs);

    if (onComplete) {
      onComplete(stats);
    }
  }, [elapsedSeconds, totalCorrect, errorsCount, mistakeKeys, wpmSamples, targetWpm, targetAccuracy, text.length, onComplete]);

  // Watch for completion of whole text
  useEffect(() => {
    if (typed.length >= text.length && text.length > 0) {
      handleFinish(elapsedSeconds);
    }
  }, [typed.length, text.length]);

  // Auto-scroll caret
  useEffect(() => {
    const caretEl = document.getElementById('engine-caret');
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

  // Key Down Handler
  const handleKeyDown = (e) => {
    // Check Caps Lock
    setCapsLockOn(e.getModifierState && e.getModifierState('CapsLock'));

    // Resume if paused
    if (isPaused) {
      setIsPaused(false);
      return;
    }

    // Keyboard Shortcuts
    if (e.key === 'Escape') {
      e.preventDefault();
      handleRestart();
      return;
    }

    if (e.key === 'Tab' && e.shiftKey) {
      e.preventDefault();
      if (onExit) onExit();
      return;
    }

    // Toggle keyboard: Ctrl+Shift+K
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      setShowKeyboard(prev => !prev);
      return;
    }

    // Ignore composition / IME and modifier keys
    if (e.isComposing || e.ctrlKey || e.metaKey || e.altKey) return;

    setActiveKey(e.key);
    setTimeout(() => setActiveKey(null), 100);

    if (typed.length >= text.length) return;

    const now = Date.now();
    const latency = lastKeyTimeRef.current ? now - lastKeyTimeRef.current : 0;
    lastKeyTimeRef.current = now;

    // Error mode logic: 'stop' | 'allow' | 'exam'
    const errorMode = settings.errorMode;

    if (e.key === 'Backspace') {
      if (errorMode === 'exam') {
        // No backspace in exam mode
        e.preventDefault();
        return;
      }
      e.preventDefault();
      if (typed.length > 0) {
        setTyped(prev => prev.slice(0, -1));
        soundManager.playKeypress('backspace', true);
      }
      return;
    }

    if (e.key.length === 1) {
      e.preventDefault();

      if (!startTime) {
        setStartTime(Date.now());
      }

      const expectedChar = text[typed.length];
      const isCorrect = e.key === expectedChar;

      // Record keystroke analytics for weak key detection
      Storage.recordKeystroke(expectedChar, e.key, latency);

      if (isCorrect) {
        soundManager.playKeypress(e.key);
        setTyped(prev => prev + e.key);
        setErrorFlash(false);
      } else {
        soundManager.playError();
        setErrorFlash(true);
        setTimeout(() => setErrorFlash(false), 160);
        setErrorsCount(prev => prev + 1);
        setMistakeKeys(prev => ({
          ...prev,
          [expectedChar]: (prev[expectedChar] || 0) + 1
        }));

        if (errorMode === 'allow' || errorMode === 'exam') {
          // In allow/exam mode, advance with error
          setTyped(prev => prev + e.key);
        }
        // In 'stop' mode: cursor does NOT advance until correct key is pressed!
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
    setIsPaused(false);
    setWpmSamples([]);
    containerRef.current?.focus();
  };

  // Caret style classes
  const caretStyles = {
    line: 'w-[2.5px] h-6 sm:h-7 bg-text',
    block: 'w-[10px] h-6 sm:h-7 bg-text/40',
    underline: 'w-3 h-[3px] self-end bg-accent'
  };

  const activeCaretStyle = caretStyles[settings.caretStyle] || caretStyles.line;

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onClick={() => {
        if (isPaused) setIsPaused(false);
        containerRef.current?.focus();
      }}
      className="w-full max-w-typing mx-auto px-4 py-4 outline-none focus:outline-none select-none relative"
    >
      {/* Exercise Header */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-border">
        <div>
          <h1 className="text-lg font-semibold text-text tracking-tight">{title}</h1>
          {intro && <p className="text-xs text-text-muted mt-0.5">{intro}</p>}
        </div>

        <div className="flex items-center gap-2">
          {capsLockOn && (
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-btn bg-amber-50 dark:bg-amber-950 text-warning border border-amber-200 dark:border-amber-900 text-2xs font-medium">
              <AlertCircle className="w-3 h-3" />
              <span>Caps Lock ON</span>
            </div>
          )}

          <button
            type="button"
            onClick={handleRestart}
            aria-label="Restart exercise (Esc)"
            title="Restart (Esc)"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-btn border border-border text-xs text-text-muted hover:text-text hover:bg-surface-2 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Restart</span>
          </button>
        </div>
      </div>

      {/* Live Stat Bar (numbers only, tabular nums) */}
      {settings.showLiveStats && (
        <div className="flex items-center justify-between text-xs text-text-muted font-medium mb-5 pb-3 border-b border-border select-none tabular-nums">
          <div>
            <span className="font-mono text-xl sm:text-2xl font-semibold text-text">{netWpm}</span>
            <span className="ml-1.5 text-text-muted font-sans">WPM</span>
          </div>

          <div>
            <span className={`font-mono text-xl sm:text-2xl font-semibold ${
              accuracy >= targetAccuracy ? 'text-accent' : 'text-text'
            }`}>
              {accuracy}%
            </span>
            <span className="ml-1.5 text-text-muted font-sans">Accuracy</span>
          </div>

          <div>
            <span className="font-mono text-xl sm:text-2xl font-semibold text-text">
              {Math.round(elapsedSeconds)}s
            </span>
            <span className="ml-1.5 text-text-muted font-sans">Time</span>
          </div>

          <div>
            <span className={`font-mono text-xl sm:text-2xl font-semibold ${
              errorsCount > 0 ? 'text-error' : 'text-text'
            }`}>
              {errorsCount}
            </span>
            <span className="ml-1.5 text-text-muted font-sans">Errors</span>
          </div>
        </div>
      )}

      {/* Typing Surface */}
      <div className={`bg-surface border rounded-card p-6 sm:p-8 shadow-subtle transition-colors relative ${
        errorFlash ? 'border-error bg-rose-50/20 dark:bg-rose-950/10' : 'border-border'
      }`}>
        {isPaused && (
          <div className="absolute inset-0 bg-surface/90 backdrop-blur-xs rounded-card flex items-center justify-center z-20 cursor-pointer">
            <span className="text-xs font-medium text-text px-4 py-2 rounded-btn bg-surface-2 border border-border shadow-subtle">
              Paused. Click here or press any key to resume.
            </span>
          </div>
        )}

        <div
          ref={textDisplayRef}
          style={{ fontSize: `${settings.fontSize}px` }}
          className="font-mono leading-[1.7] max-h-[140px] sm:max-h-[160px] overflow-hidden select-none relative"
        >
          {/* Typed characters */}
          <span className="text-text">
            {typed}
          </span>

          {/* Smooth Blinking Caret */}
          <span
            id="engine-caret"
            className={`inline-block align-middle mx-[0.5px] caret-pulse ${activeCaretStyle} ${
              errorFlash ? '!bg-error' : ''
            }`}
          />

          {/* Untyped text */}
          <span className="text-text-muted/40">
            {text.slice(typed.length)}
          </span>
        </div>

        {/* Small hint footer */}
        <div className="mt-4 pt-3 border-t border-border flex flex-wrap items-center justify-between gap-2 text-2xs text-text-muted">
          <span>Esc to restart · Shift+Tab to exit · Mode: {settings.errorMode === 'stop' ? 'Stop on error' : settings.errorMode === 'allow' ? 'Allow backspace' : 'Exam mode'}</span>
          <span>Ctrl+Shift+K to toggle keyboard</span>
        </div>
      </div>

      {/* Virtual Keyboard */}
      <VirtualKeyboard
        targetChar={targetChar}
        activeKey={activeKey}
        layout={settings.keyboardLayout}
        showKeyboard={showKeyboard}
        onToggleKeyboard={() => setShowKeyboard(prev => !prev)}
        showFingerColors={showFingerColors}
        onToggleFingerColors={setShowFingerColors}
      />
    </div>
  );
}
