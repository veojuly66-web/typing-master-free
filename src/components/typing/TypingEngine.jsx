import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { soundManager } from '../../utils/audio';
import { Storage } from '../../lib/storage';
import { calculateGrossWpm, calculateNetWpm, calculateAccuracy, calculateConsistency } from '../../lib/stats';
import { translateInscript } from '../../data/layouts/inscript';
import { RemingtonGailBuffer } from '../../data/layouts/remington-gail';
import VirtualKeyboard from './VirtualKeyboard';
import { RotateCcw, AlertCircle, Keyboard, Globe } from 'lucide-react';

export default function TypingEngine({
  text = '',
  title = 'Typing Exercise',
  intro = '',
  targetWpm = 30,
  targetAccuracy = 95,
  mode = 'lesson', // 'lesson' | 'test' | 'practice' | 'exam'
  examConfig = null, // for government exam simulator
  durationLimitSeconds = null, // for timed tests
  layout: initialLayout = null, // 'english' | 'inscript' | 'remington-gail'
  onComplete,
  onExit,
  onFocusChange
}) {
  const settings = Storage.getSettings();
  const activeLayout = initialLayout || settings.keyboardLayout || 'us';

  const isHindiText = useMemo(() => /[\u0900-\u097F]/.test(text), [text]);

  // Segment text into grapheme clusters for Hindi (or characters for English)
  const segments = useMemo(() => {
    if (!text) return [];
    if (isHindiText && typeof Intl !== 'undefined' && Intl.Segmenter) {
      const segmenter = new Intl.Segmenter('hi', { granularity: 'grapheme' });
      return Array.from(segmenter.segment(text)).map(s => s.segment);
    }
    return text.split('');
  }, [text, isHindiText]);

  const [typedSegments, setTypedSegments] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [activeKey, setActiveKey] = useState(null);
  const [errorsCount, setErrorsCount] = useState(0);
  const [mistakeKeys, setMistakeKeys] = useState({});
  const [errorFlash, setErrorFlash] = useState(false);
  const [capsLockOn, setCapsLockOn] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(settings.showKeyboard);
  const [wpmSamples, setWpmSamples] = useState([]);

  // Remington Gail stateful pre-base matra buffer
  const remingtonBufferRef = useRef(new RemingtonGailBuffer());

  const containerRef = useRef(null);
  const textDisplayRef = useRef(null);
  const timerRef = useRef(null);
  const lastKeyTimeRef = useRef(null);

  const currentIndex = typedSegments.length;
  const isFinished = segments.length > 0 && currentIndex >= segments.length;
  const currentTargetCluster = !isFinished ? segments[currentIndex] : null;

  // Auto focus
  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  // Timer loop
  useEffect(() => {
    if (startTime && !isPaused && !isFinished) {
      timerRef.current = setInterval(() => {
        const now = Date.now();
        const secs = (now - startTime) / 1000;
        setElapsedSeconds(secs);

        const typedChars = typedSegments.join('').length;
        const currentGross = calculateGrossWpm(typedChars, Math.max(secs / 60, 0.016));
        setWpmSamples(prev => [...prev.slice(-60), currentGross]);

        if (durationLimitSeconds && secs >= durationLimitSeconds) {
          clearInterval(timerRef.current);
          handleFinish(secs);
        }
      }, 500);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [startTime, isPaused, isFinished, typedSegments.length, durationLimitSeconds]);

  // Focus mode callback
  useEffect(() => {
    const isTyping = !!startTime && !isFinished && !isPaused;
    if (onFocusChange) {
      onFocusChange(isTyping);
    }
  }, [startTime, isFinished, isPaused, onFocusChange]);

  // Window blur pause
  useEffect(() => {
    const handleBlur = () => {
      if (startTime && !isFinished) {
        setIsPaused(true);
      }
    };
    window.addEventListener('blur', handleBlur);
    return () => window.removeEventListener('blur', handleBlur);
  }, [startTime, isFinished]);

  // Calculate live stats
  const totalTypedChars = typedSegments.join('').length;
  const totalAttempts = totalTypedChars + errorsCount;
  const minutes = Math.max(elapsedSeconds / 60, 0.016);
  const grossWpm = calculateGrossWpm(totalAttempts, minutes);
  const netWpm = calculateNetWpm(totalTypedChars, errorsCount, minutes);
  const accuracy = calculateAccuracy(totalTypedChars, totalAttempts);
  const consistency = calculateConsistency(wpmSamples);

  // Hindi exam metrics: KPH and words per minute by word count
  const kph = Math.round((totalTypedChars / minutes) * 60) || 0;
  const wordCount = typedSegments.join('').trim().split(/\s+/).filter(Boolean).length;
  const wordsPerMinCount = Math.round(wordCount / minutes) || 0;

  // Finish callback
  const handleFinish = useCallback((finalSecs = elapsedSeconds) => {
    soundManager.playSuccess();
    const finalMinutes = Math.max(finalSecs / 60, 0.016);
    const finalChars = typedSegments.join('').length;
    const finalGross = calculateGrossWpm(finalChars + errorsCount, finalMinutes);
    const finalNet = calculateNetWpm(finalChars, errorsCount, finalMinutes);
    const finalAcc = calculateAccuracy(finalChars, finalChars + errorsCount);
    const finalConsistency = calculateConsistency(wpmSamples);
    const finalKph = Math.round((finalChars / finalMinutes) * 60);
    const finalWordCount = typedSegments.join('').trim().split(/\s+/).filter(Boolean).length;
    const finalExamWpm = Math.round(finalWordCount / finalMinutes);

    const stats = {
      grossWpm: finalGross,
      netWpm: finalNet,
      accuracy: finalAcc,
      consistency: finalConsistency,
      kph: finalKph,
      examWpm: finalExamWpm,
      timeSeconds: Math.round(finalSecs),
      totalChars: text.length,
      errorsCount,
      mistakeKeys,
      wpmSamples,
      passed: finalNet >= targetWpm && finalAcc >= targetAccuracy,
      isHindi: isHindiText,
      layout: activeLayout
    };

    try {
      Storage.addPracticeSeconds(Math.round(finalSecs));
    } catch (e) {}

    if (onComplete) {
      onComplete(stats);
    }
  }, [elapsedSeconds, typedSegments, errorsCount, wpmSamples, text.length, targetWpm, targetAccuracy, mistakeKeys, isHindiText, activeLayout, onComplete]);

  // Check finish on last segment
  useEffect(() => {
    if (isFinished && segments.length > 0 && !durationLimitSeconds) {
      handleFinish(elapsedSeconds);
    }
  }, [isFinished, segments.length, durationLimitSeconds]);

  // Caret Auto-scroll
  useEffect(() => {
    const caretEl = document.getElementById('typing-engine-caret');
    if (caretEl && textDisplayRef.current) {
      const containerTop = textDisplayRef.current.offsetTop;
      const caretTop = caretEl.offsetTop;
      const scrollPos = caretTop - containerTop - 40;
      textDisplayRef.current.scrollTop = scrollPos > 0 ? scrollPos : 0;
    }
  }, [typedSegments.length]);

  // Key Down Handler
  const handleKeyDown = (e) => {
    if (e.getModifierState) {
      setCapsLockOn(e.getModifierState('CapsLock'));
    }

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

    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (isFinished) return;

    if (isPaused) {
      setIsPaused(false);
      return;
    }

    if (!startTime) {
      setStartTime(Date.now());
      lastKeyTimeRef.current = Date.now();
    }

    const expectedCluster = segments[currentIndex];
    const now = Date.now();
    const latency = lastKeyTimeRef.current ? Math.min(now - lastKeyTimeRef.current, 2000) : 200;
    lastKeyTimeRef.current = now;

    // Determine the character typed based on layout mapping
    let typedChar = null;
    let isPendingState = false;

    if (activeLayout === 'inscript') {
      typedChar = translateInscript(e);
    } else if (activeLayout === 'remington-gail') {
      const res = remingtonBufferRef.current.processKey(e);
      if (res) {
        if (res.type === 'pending_matra') {
          isPendingState = true;
          soundManager.playKeypress('f');
          return;
        } else if (res.type === 'char') {
          typedChar = res.value;
        }
      }
    } else {
      // Standard English QWERTY
      if (e.key.length === 1) {
        typedChar = e.key;
      }
    }

    setActiveKey(e.key);
    setTimeout(() => setActiveKey(null), 100);

    // Backspace Handling
    if (e.key === 'Backspace') {
      e.preventDefault();
      const allowBackspace = settings.errorMode !== 'no_backspace' && mode !== 'exam';
      if (allowBackspace && typedSegments.length > 0) {
        setTypedSegments(prev => prev.slice(0, -1));
        soundManager.playKeypress('backspace', true);
      }
      return;
    }

    if (!typedChar) return;
    e.preventDefault();

    // Check correctness:
    // Compare typedChar with expectedCluster
    const isCorrect = typedChar === expectedCluster;

    if (isCorrect) {
      soundManager.playKeypress(typedChar);
      setTypedSegments(prev => [...prev, typedChar]);
      setErrorFlash(false);
      try {
        Storage.recordKeystroke(expectedCluster, true, latency);
      } catch (err) {}
    } else {
      soundManager.playError();
      setErrorFlash(true);
      setTimeout(() => setErrorFlash(false), 160);
      setErrorsCount(prev => prev + 1);

      setMistakeKeys(prev => ({
        ...prev,
        [expectedCluster]: (prev[expectedCluster] || 0) + 1
      }));

      try {
        Storage.recordKeystroke(expectedCluster, false, latency);
      } catch (err) {}

      // In 'allow' or 'exam' mode, cursor advances with error:
      if (settings.errorMode === 'allow' || mode === 'exam') {
        setTypedSegments(prev => [...prev, typedChar]);
      }
    }
  };

  const handleRestart = () => {
    setTypedSegments([]);
    setStartTime(null);
    setElapsedSeconds(0);
    setErrorsCount(0);
    setMistakeKeys({});
    setErrorFlash(false);
    setIsPaused(false);
    setWpmSamples([]);
    remingtonBufferRef.current.reset();
    containerRef.current?.focus();
  };

  const typedText = typedSegments.join('');
  const untypedSegments = segments.slice(currentIndex);

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onClick={() => containerRef.current?.focus()}
      className="max-w-4xl mx-auto px-4 py-4 outline-none focus:outline-none"
    >
      {/* Exercise Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-xl font-semibold text-text tracking-tight">{title}</h1>
            {isHindiText && (
              <span className="text-2xs font-semibold px-2 py-0.5 rounded bg-accent-soft text-accent border border-accent/20">
                {activeLayout === 'inscript' ? 'Inscript' : 'Remington Gail'}
              </span>
            )}
          </div>
          {intro && <p className="text-xs text-text-muted mt-0.5">{intro}</p>}
        </div>

        <div className="flex items-center gap-2">
          {capsLockOn && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-key bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 text-2xs font-medium border border-amber-300 dark:border-amber-800">
              <AlertCircle className="w-3 h-3" strokeWidth={1.5} />
              <span>Caps Lock on</span>
            </span>
          )}

          <button
            type="button"
            onClick={handleRestart}
            aria-label="Restart exercise"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-btn border border-border bg-surface hover:bg-surface-2 text-xs text-text font-medium transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-text-muted" strokeWidth={1.5} />
            <span className="hidden sm:inline">Restart (Esc)</span>
          </button>
        </div>
      </div>

      {/* Live Stat Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-medium pb-3 mb-4 border-b border-border text-text-muted select-none">
        <div>
          <span className="font-mono text-xl sm:text-2xl font-semibold text-text tabular-nums">{netWpm}</span>
          <span className="ml-1 text-text-muted">Net WPM</span>
        </div>

        <div>
          <span className={`font-mono text-xl sm:text-2xl font-semibold tabular-nums ${accuracy >= targetAccuracy ? 'text-accent' : 'text-text'}`}>
            {accuracy}%
          </span>
          <span className="ml-1 text-text-muted">Accuracy</span>
        </div>

        {isHindiText ? (
          <div>
            <span className="font-mono text-xl sm:text-2xl font-semibold text-text tabular-nums">{kph}</span>
            <span className="ml-1 text-text-muted">KPH</span>
          </div>
        ) : (
          <div>
            <span className="font-mono text-xl sm:text-2xl font-semibold text-text tabular-nums">{grossWpm}</span>
            <span className="ml-1 text-text-muted">Gross WPM</span>
          </div>
        )}

        <div>
          <span className="font-mono text-xl sm:text-2xl font-semibold text-text tabular-nums">
            {durationLimitSeconds ? `${Math.max(0, Math.round(durationLimitSeconds - elapsedSeconds))}s` : `${Math.round(elapsedSeconds)}s`}
          </span>
          <span className="ml-1 text-text-muted">{durationLimitSeconds ? 'Remaining' : 'Time'}</span>
        </div>

        <div>
          <span className={`font-mono text-xl sm:text-2xl font-semibold tabular-nums ${errorsCount > 0 ? 'text-error' : 'text-text'}`}>
            {errorsCount}
          </span>
          <span className="ml-1 text-text-muted">Errors</span>
        </div>
      </div>

      {/* Display Box */}
      <div className={`bg-surface border rounded-card p-6 sm:p-8 shadow-subtle transition-colors relative ${
        errorFlash ? 'border-error bg-rose-50/20 dark:bg-rose-950/10' : 'border-border'
      }`}>
        {isPaused && (
          <div className="absolute inset-0 bg-surface/95 z-20 flex flex-col items-center justify-center rounded-card">
            <span className="text-sm font-semibold text-text mb-1">Typing Paused</span>
            <span className="text-xs text-text-muted">Click or press any key to resume</span>
          </div>
        )}

        <div
          ref={textDisplayRef}
          className={`${isHindiText ? 'font-hindi text-2xl sm:text-3xl leading-[2]' : 'font-mono text-xl sm:text-2xl leading-[1.8]'} max-h-[170px] sm:max-h-[190px] overflow-hidden select-none relative`}
        >
          {/* Typed text */}
          <span className="text-text">
            {typedText}
          </span>

          {/* Caret */}
          <span
            id="typing-engine-caret"
            className={`inline-block w-[2.5px] ${isHindiText ? 'h-7 sm:h-8' : 'h-6 sm:h-7'} align-middle mx-[0.5px] caret-pulse ${
              errorFlash ? 'bg-error' : 'bg-text'
            }`}
          />

          {/* Untyped remaining text */}
          <span className="text-text-muted/40">
            {untypedSegments.join('')}
          </span>
        </div>

        {/* Footer info bar */}
        <div className="mt-4 pt-3 border-t border-border flex flex-wrap items-center justify-between gap-2 text-2xs text-text-muted">
          <div className="flex items-center gap-2">
            <span>Esc: restart · Tab: exit</span>
            {isHindiText && activeLayout === 'remington-gail' && (
              <span className="text-accent font-medium">Tip: Type 'f' before letter for 'ि' matra (e.g. f + k = कि)</span>
            )}
          </div>

          <button
            type="button"
            onClick={() => setShowKeyboard(!showKeyboard)}
            className="hover:text-text underline"
          >
            {showKeyboard ? 'Hide keyboard' : 'Show keyboard'}
          </button>
        </div>
      </div>

      {/* Virtual Keyboard */}
      {showKeyboard && (
        <VirtualKeyboard
          targetChar={currentTargetCluster}
          activeKey={activeKey}
          layout={activeLayout}
        />
      )}
    </div>
  );
}
