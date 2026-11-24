import React, { useState, useEffect, useRef } from 'react';
import { TYPING_TESTS } from '../data/courses';
import { soundManager } from '../utils/audio';
import CertificateModal from './CertificateModal';
import { Clock, Play, RotateCcw, Award, CheckCircle2, AlertCircle, Zap, Target } from 'lucide-react';

export default function TypingTest({ onBack }) {
  const [selectedTest, setSelectedTest] = useState(TYPING_TESTS[0]);
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TYPING_TESTS[0].duration);
  const [typed, setTyped] = useState('');
  const [errorsCount, setErrorsCount] = useState(0);
  const [showCertificate, setShowCertificate] = useState(false);
  const [finalStats, setFinalStats] = useState(null);
  const [errorFlash, setErrorFlash] = useState(false);

  const inputRef = useRef(null);
  const timerRef = useRef(null);

  const testText = selectedTest.text;

  // Handle test selection
  const handleSelectTest = (test) => {
    setSelectedTest(test);
    setIsRunning(false);
    setTimeLeft(test.duration);
    setTyped('');
    setErrorsCount(0);
    setShowCertificate(false);
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

  // Compute live statistics (Strict Touch Typing Mode: cursor only advances on correct key)
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
    setTimeout(() => {
      inputRef.current?.focus();
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
      totalChars
    };
    setFinalStats(stats);
    setShowCertificate(true);

    // Save to test history
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

        // If user finished all text early
        if (nextTyped.length >= testText.length) {
          finishTest();
        }
      } else {
        soundManager.playError();
        setErrorFlash(true);
        setTimeout(() => setErrorFlash(false), 220);
        setErrorsCount(prev => prev + 1);
        // Strict Mode: galat key press karne par aage nahi badhega!
      }
    }
  };

  // Format MM:SS
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="max-w-5xl mx-auto py-6 px-4">
      {/* Top Test Banner */}
      <div className="bg-gradient-to-r from-blue-900/40 via-indigo-900/40 to-slate-900 p-6 rounded-3xl border border-blue-500/20 shadow-2xl mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-wider mb-2 border border-blue-500/30">
            <Award className="w-3.5 h-3.5 text-blue-400" />
            <span>Speed Assessment & Certification</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Official Typing Speed Test
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-xl">
            Test your real-world typing velocity and accuracy. Earn your verified touch typing certificate!
          </p>
        </div>

        {/* Certificate shortcut if already completed */}
        {finalStats && (
          <button
            onClick={() => setShowCertificate(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition-all shadow-lg"
          >
            <Award className="w-4 h-4 text-amber-400" />
            <span>View Last Certificate</span>
          </button>
        )}
      </div>

      {/* Test Selector Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {TYPING_TESTS.map((test) => {
          const isSelected = selectedTest.id === test.id;
          return (
            <button
              key={test.id}
              onClick={() => handleSelectTest(test)}
              disabled={isRunning}
              className={`p-4 rounded-2xl border text-left transition-all ${
                isSelected
                  ? 'bg-blue-600/20 border-blue-500 shadow-lg shadow-blue-500/10 ring-2 ring-blue-500/50'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200'
              } ${isRunning ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                  test.difficulty === 'Easy' ? 'bg-emerald-500/20 text-emerald-300' :
                  test.difficulty === 'Medium' ? 'bg-blue-500/20 text-blue-300' :
                  test.difficulty === 'Hard' ? 'bg-amber-500/20 text-amber-300' :
                  'bg-rose-500/20 text-rose-300'
                }`}>
                  {test.difficulty}
                </span>
                <div className="flex items-center gap-1 text-xs text-slate-400 font-mono">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{Math.round(test.duration / 60)}m</span>
                </div>
              </div>
              <h3 className="font-bold text-white text-sm tracking-tight">{test.title}</h3>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{test.description}</p>
            </button>
          );
        })}
      </div>

      {/* Test Area */}
      <div 
        className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 md:p-8 shadow-2xl relative"
        onClick={() => isRunning && inputRef.current?.focus()}
      >
        <input
          ref={inputRef}
          type="text"
          className="opacity-0 absolute -z-10 pointer-events-none"
          onKeyDown={handleKeyDown}
          autoFocus={isRunning}
        />

        {/* Status Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-6 border-b border-slate-800">
          <div className="flex items-center gap-6">
            {/* Timer */}
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Time Left</div>
                <div className="text-xl font-black font-mono text-purple-400">{formatTime(timeLeft)}</div>
              </div>
            </div>

            {/* Live Net WPM */}
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Live Net WPM</div>
                <div className="text-xl font-black font-mono text-blue-400">{netWpm}</div>
              </div>
            </div>

            {/* Live Accuracy */}
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                <Target className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Accuracy</div>
                <div className="text-xl font-black font-mono text-emerald-400">{accuracy}%</div>
              </div>
            </div>
          </div>

          {/* Start / Restart Button */}
          {!isRunning ? (
            <button
              onClick={startTest}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-blue-500/20 transition-all transform hover:scale-105"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Start {Math.round(selectedTest.duration / 60)}-Minute Test</span>
            </button>
          ) : (
            <button
              onClick={startTest}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restart Test</span>
            </button>
          )}
        </div>

        {/* Text Container */}
        <div className={`p-6 rounded-2xl bg-slate-950/70 border border-slate-800 font-mono text-lg md:text-xl leading-relaxed tracking-wide min-h-[200px] select-none transition-all ${
          !isRunning ? 'opacity-70 blur-[1px]' : ''
        }`}>
          {testText.split('').map((char, index) => {
            const isTyped = index < typed.length;
            const isCurrent = index === typed.length && isRunning;
            const isCorrect = isTyped && typed[index] === char;
            const isIncorrect = isTyped && typed[index] !== char;

            let charClass = 'text-slate-500';

            if (isCurrent) {
              if (errorFlash) {
                charClass = 'bg-rose-600 text-white font-bold rounded px-1 animate-bounce ring-4 ring-rose-500 shadow-lg shadow-rose-500/50 scale-125';
              } else {
                charClass = 'bg-blue-600 text-white font-bold rounded px-0.5 animate-pulse ring-2 ring-blue-400';
              }
            } else if (isCorrect) {
              charClass = 'text-emerald-400';
            } else if (isIncorrect) {
              charClass = 'text-rose-500 bg-rose-500/20 underline decoration-rose-500';
            }

            return (
              <span key={index} className={charClass}>
                {char}
              </span>
            );
          })}
        </div>

        {!isRunning && typed.length === 0 && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-950/60 backdrop-blur-[2px] rounded-3xl p-6 text-center">
            <h4 className="text-xl font-bold text-white mb-2">Ready to test your speed?</h4>
            <p className="text-xs text-slate-400 max-w-sm mb-4">
              Click Start to begin. The timer will start counting down immediately as you type.
            </p>
            <button
              onClick={startTest}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-xl shadow-blue-500/30 transition-all"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Start Test Now</span>
            </button>
          </div>
        )}
      </div>

      {/* Certificate Modal */}
      {showCertificate && finalStats && (
        <CertificateModal
          stats={finalStats}
          onClose={() => setShowCertificate(false)}
          testTitle={selectedTest.title}
        />
      )}
    </div>
  );
}
