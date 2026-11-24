import React, { useState, useEffect, useRef, useCallback } from 'react';
import { soundManager } from '../utils/audio';
import VirtualKeyboard from './VirtualKeyboard';
import { RotateCcw, Volume2, VolumeX, Flag, CheckCircle2, AlertCircle, Zap, Clock, Target } from 'lucide-react';

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
  const [isSoundOn, setIsSoundOn] = useState(soundManager.enabled);
  const [errorsCount, setErrorsCount] = useState(0);
  const [mistakeKeys, setMistakeKeys] = useState({});
  const [isFocused, setIsFocused] = useState(true);
  const [errorFlash, setErrorFlash] = useState(false);

  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const timerRef = useRef(null);

  const targetChar = typed.length < text.length ? text[typed.length] : null;

  // Sound toggle
  const toggleSound = () => {
    soundManager.enabled = !soundManager.enabled;
    soundManager.saveSettings();
    setIsSoundOn(soundManager.enabled);
  };

  // Focus input automatically
  useEffect(() => {
    inputRef.current?.focus();
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

  // Compute live statistics (Strict Touch Typing Mode: cursor only advances on correct key)
  const totalCorrect = typed.length;
  const totalAttempts = totalCorrect + errorsCount;
  const minutes = Math.max(elapsedSeconds / 60, 0.016); // at least 1 second
  
  const grossWpm = Math.round((totalAttempts / 5) / minutes) || 0;
  const netWpm = Math.max(0, Math.round((totalCorrect / 5) / minutes)) || 0;
  const accuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 100;
  const progressPercent = Math.min(100, Math.round((totalCorrect / text.length) * 100));

  // Handle completion
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

  // Handle key typing
  const handleKeyDown = (e) => {
    // Ignore meta keys
    if (e.ctrlKey || e.metaKey || e.altKey) return;

    if (e.key === 'Escape') {
      handleRestart();
      return;
    }

    // Physical key animation
    setActiveKey(e.key);
    setTimeout(() => setActiveKey(null), 120);

    if (typed.length >= text.length) return;

    // Handle Backspace
    if (e.key === 'Backspace') {
      e.preventDefault();
      if (typed.length > 0) {
        setTyped(prev => prev.slice(0, -1));
        soundManager.playKeypress('backspace', true);
      }
      return;
    }

    // Only accept single printable characters
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
        soundManager.playError();
        setErrorFlash(true);
        setTimeout(() => setErrorFlash(false), 220);
        setErrorsCount(prev => prev + 1);
        setMistakeKeys(prev => ({
          ...prev,
          [expectedChar]: (prev[expectedChar] || 0) + 1
        }));
        // Galat key press karne par aage nahi badhega! Cursor yahi rahega jab tak sahi key press na ho.
      }
    }
  };

  const handleRestart = () => {
    setTyped('');
    setStartTime(null);
    setElapsedSeconds(0);
    setErrorsCount(0);
    setMistakeKeys({});
    inputRef.current?.focus();
  };

  return (
    <div 
      className="flex flex-col w-full max-w-5xl mx-auto py-4 px-2 select-none"
      onClick={() => inputRef.current?.focus()}
    >
      {/* Hidden input to capture keystrokes on mobile/desktop without losing focus */}
      <input
        ref={inputRef}
        type="text"
        className="opacity-0 absolute -z-10 pointer-events-none"
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        autoFocus
      />

      {/* Top Exercise Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4 bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-slate-800 shadow-lg">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/20 text-blue-400 border border-blue-500/30">
              Interactive Lesson
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Strict Mode: Blocks on Error
            </span>
            <span className="text-xs text-slate-400">Target: {targetWpm} WPM • {targetAccuracy}% Acc</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">{title}</h2>
          {intro && <p className="text-xs text-slate-400 mt-0.5 max-w-2xl">{intro}</p>}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleSound}
            title={isSoundOn ? "Mute typing audio" : "Enable typing audio"}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
          >
            {isSoundOn ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          <button
            onClick={handleRestart}
            title="Restart exercise (Esc)"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restart</span>
          </button>

          {onExit && (
            <button
              onClick={onExit}
              className="px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-slate-700 hover:border-rose-800/50 text-xs font-medium transition-colors"
            >
              Exit
            </button>
          )}
        </div>
      </div>

      {/* Real-time Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        {/* WPM */}
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-3.5 flex items-center gap-3 shadow-md">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Net Speed</div>
            <div className="text-2xl font-black text-white font-mono leading-none mt-1">
              {netWpm} <span className="text-xs font-normal text-slate-400">WPM</span>
            </div>
          </div>
        </div>

        {/* Accuracy */}
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-3.5 flex items-center gap-3 shadow-md">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Accuracy</div>
            <div className={`text-2xl font-black font-mono leading-none mt-1 ${
              accuracy >= targetAccuracy ? 'text-emerald-400' : 'text-amber-400'
            }`}>
              {accuracy}<span className="text-xs font-normal text-slate-400">%</span>
            </div>
          </div>
        </div>

        {/* Errors */}
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-3.5 flex items-center gap-3 shadow-md">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center border border-rose-500/20">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Mistakes</div>
            <div className="text-2xl font-black text-rose-400 font-mono leading-none mt-1">
              {errorsCount}
            </div>
          </div>
        </div>

        {/* Time */}
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-3.5 flex items-center gap-3 shadow-md">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Time</div>
            <div className="text-2xl font-black text-white font-mono leading-none mt-1">
              {Math.floor(elapsedSeconds)}<span className="text-xs font-normal text-slate-400">s</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-800 rounded-full h-2 mb-4 overflow-hidden border border-slate-700/50">
        <div 
          className="bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400 h-full transition-all duration-150 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Focus Indicator Reminder */}
      {!isFocused && (
        <div className="mb-3 py-2 px-4 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs flex items-center justify-center gap-2 cursor-pointer animate-pulse"
             onClick={() => inputRef.current?.focus()}>
          <span>Click anywhere to re-focus typing!</span>
        </div>
      )}

      {/* Main Text Display Box */}
      <div 
        ref={containerRef}
        className="relative bg-slate-950/80 rounded-2xl border-2 border-slate-800 hover:border-slate-700/80 p-6 md:p-8 font-mono text-xl md:text-2xl leading-relaxed tracking-wider shadow-2xl min-h-[160px] flex items-center transition-colors cursor-text"
        onClick={() => inputRef.current?.focus()}
      >
        <div className="flex flex-wrap items-center">
          {text.split('').map((char, index) => {
            const isTyped = index < typed.length;
            const isCurrent = index === typed.length;
            const isCorrect = isTyped && typed[index] === char;
            const isIncorrect = isTyped && typed[index] !== char;

            let charClass = 'text-slate-500'; // Upcoming character

            if (isCurrent) {
              if (errorFlash) {
                charClass = 'bg-rose-600 text-white font-bold rounded px-1 animate-bounce ring-4 ring-rose-500 shadow-lg shadow-rose-500/50 scale-125';
              } else {
                charClass = 'bg-blue-600 text-white font-bold rounded px-0.5 animate-pulse ring-2 ring-blue-400 shadow-md';
              }
            } else if (isCorrect) {
              charClass = 'text-emerald-400 font-medium';
            } else if (isIncorrect) {
              charClass = 'text-rose-500 bg-rose-500/20 underline decoration-rose-500 decoration-2 font-bold';
            }

            return (
              <span
                key={index}
                className={`transition-colors duration-75 relative inline-block ${charClass}`}
              >
                {char === ' ' ? (
                  isCurrent ? '␣' : '\u00A0'
                ) : (
                  char
                )}
              </span>
            );
          })}
        </div>
      </div>

      {/* Virtual On-Screen Keyboard */}
      <VirtualKeyboard
        targetChar={targetChar}
        activeKey={activeKey}
        showHands={true}
      />
    </div>
  );
}
