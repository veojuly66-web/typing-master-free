import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { PASSAGES, getRandomPassage } from '../data/passages';
import { Storage } from '../lib/storage';
import { calculateSpeedBand } from '../lib/stats';
import { useAuth } from '../lib/auth';
import TypingEngine from './typing/TypingEngine';
import ProLock from './ui/ProLock';
import PlanBadge from './ui/PlanBadge';
import { Play, RotateCcw, Award, ArrowRight, Check, Filter, Lock, Globe, Sparkles, X } from 'lucide-react';

const CertificateModal = React.lazy(() => import('./CertificateModal'));

export default function TypingTest({ onBack, onFocusChange }) {
  const { isProUser } = useAuth();
  const [language, setLanguage] = useState('english'); // 'english' | 'inscript' | 'remington'
  const [duration, setDuration] = useState(60); // 60, 120, 180, 300, 600
  const [difficulty, setDifficulty] = useState('All'); // All, Easy, Medium, Hard
  const [passageType, setPassageType] = useState('All');

  const [currentPassage, setCurrentPassage] = useState(() => getRandomPassage({ language: 'english' }));
  const [isRunning, setIsRunning] = useState(false);
  const [finalStats, setFinalStats] = useState(null);
  const [showCertificate, setShowCertificate] = useState(false);
  const [showProLockModal, setShowProLockModal] = useState(false);
  const [proLockReason, setProLockReason] = useState('');

  // Daily test count calculation
  const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const todayTestsCount = useMemo(() => {
    try {
      const history = Storage.getTestHistory() || [];
      return history.filter(t => (t.date || '').slice(0, 10) === todayStr).length;
    } catch (e) {
      return 0;
    }
  }, [todayStr, isRunning, finalStats]);

  const durationOptions = [
    { label: '1 Min', value: 60, isPro: false },
    { label: '2 Min', value: 120, isPro: true },
    { label: '3 Min', value: 180, isPro: true },
    { label: '5 Min', value: 300, isPro: true },
    { label: '10 Min (Exam)', value: 600, isPro: true },
  ];

  const difficultyOptions = ['All', 'Easy', 'Medium', 'Hard'];

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    const passLang = newLang === 'english' ? 'english' : 'hindi';
    const next = getRandomPassage({ language: passLang, difficulty, type: passageType });
    setCurrentPassage(next);
    setIsRunning(false);
    setFinalStats(null);
  };

  const handleSelectPassage = (diff, type) => {
    const filters = {};
    filters.language = language === 'english' ? 'english' : 'hindi';
    if (diff && diff !== 'All') filters.difficulty = diff;
    if (type && type !== 'All') filters.type = type;
    const next = getRandomPassage(filters);
    setCurrentPassage(next);
    setIsRunning(false);
    setFinalStats(null);
  };

  const handleDurationClick = (opt) => {
    if (opt.isPro && !isProUser) {
      setProLockReason(`The ${opt.label} test is reserved for Pro members. Free accounts include 1-minute speed tests.`);
      setShowProLockModal(true);
      return;
    }
    setDuration(opt.value);
  };

  const handleStartTest = () => {
    if (!isProUser && todayTestsCount >= 3) {
      setProLockReason('You have completed your 3 free tests for today. Upgrade to Pro for unlimited tests, 10-minute exam simulations, and cross-device sync.');
      setShowProLockModal(true);
      return;
    }
    setIsRunning(true);
    setFinalStats(null);
  };

  const handleTestComplete = (stats) => {
    setIsRunning(false);
    const result = {
      ...stats,
      duration,
      testId: currentPassage.id,
      testTitle: `${Math.round(duration / 60)}-Minute Speed Test (${currentPassage.title})`,
      language,
      layout: language === 'inscript' ? 'inscript' : language === 'remington' ? 'remington-gail' : 'us',
      date: new Date().toISOString()
    };
    setFinalStats(result);

    // Save to storage
    try {
      Storage.addTestResult(result);
    } catch (e) {
      console.error('Failed to save test result', e);
    }
  };

  const handleRestart = () => {
    handleSelectPassage(difficulty, passageType);
  };

  const activeLayout = language === 'inscript' ? 'inscript' : language === 'remington' ? 'remington-gail' : 'us';

  return (
    <div className="max-w-content mx-auto py-8 md:py-12 px-4">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-ink tracking-tight mb-2">
              Typing Speed Test
            </h1>
            <p className="text-sm sm:text-base text-ink-muted max-w-2xl">
              Standardized benchmark tests with real-time net WPM, error penalties, and verifiable speed certification in English and Hindi.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            {!isProUser ? (
              <span className="text-xs px-2.5 py-1 rounded bg-surface-2 border border-border text-text-muted font-medium inline-flex items-center gap-1.5">
                <span>Free Plan: {Math.max(0, 3 - todayTestsCount)} of 3 tests left today</span>
              </span>
            ) : (
              <PlanBadge plan="pro" />
            )}
          </div>
        </div>
      </div>

      {!isRunning && !finalStats && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="bg-paper-surface border border-paper-border rounded-card p-6 shadow-subtle space-y-6">
            
            {/* Language Selection */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink-muted mb-2.5">
                Language &amp; Keyboard Layout
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => handleLanguageChange('english')}
                  className={`py-2.5 px-3 rounded-btn text-xs font-medium border text-left flex items-center justify-between transition-all ${
                    language === 'english'
                      ? 'bg-paper text-ink font-semibold border-accent ring-1 ring-accent'
                      : 'bg-paper-surface border-paper-border text-ink-muted hover:text-ink hover:border-ink-muted/40'
                  }`}
                >
                  <div>
                    <div className="font-semibold">English (QWERTY)</div>
                    <div className="text-[10px] text-ink-muted">Standard net WPM</div>
                  </div>
                  {language === 'english' && <Check className="w-4 h-4 text-accent" />}
                </button>

                <button
                  type="button"
                  onClick={() => handleLanguageChange('inscript')}
                  className={`py-2.5 px-3 rounded-btn text-xs font-medium border text-left flex items-center justify-between transition-all ${
                    language === 'inscript'
                      ? 'bg-paper text-ink font-semibold border-accent ring-1 ring-accent'
                      : 'bg-paper-surface border-paper-border text-ink-muted hover:text-ink hover:border-ink-muted/40'
                  }`}
                >
                  <div>
                    <div className="font-semibold">Hindi Inscript (मानक)</div>
                    <div className="text-[10px] text-ink-muted">CPCT / SSC / Secretariat</div>
                  </div>
                  {language === 'inscript' && <Check className="w-4 h-4 text-accent" />}
                </button>

                <button
                  type="button"
                  onClick={() => handleLanguageChange('remington')}
                  className={`py-2.5 px-3 rounded-btn text-xs font-medium border text-left flex items-center justify-between transition-all ${
                    language === 'remington'
                      ? 'bg-paper text-ink font-semibold border-accent ring-1 ring-accent'
                      : 'bg-paper-surface border-paper-border text-ink-muted hover:text-ink hover:border-ink-muted/40'
                  }`}
                >
                  <div>
                    <div className="font-semibold">Hindi Remington Gail</div>
                    <div className="text-[10px] text-ink-muted">High Court / Clerk Exams</div>
                  </div>
                  {language === 'remington' && <Check className="w-4 h-4 text-accent" />}
                </button>
              </div>
            </div>

            {/* Duration Selector */}
            <div className="pt-4 border-t border-paper-border">
              <div className="flex items-center justify-between mb-2.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-ink-muted">
                  Test Duration
                </label>
                {!isProUser && (
                  <span className="text-2xs text-text-muted">
                    Pro unlocks 2, 3, 5, and 10-minute durations
                  </span>
                )}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {durationOptions.map((opt) => {
                  const isSelected = duration === opt.value;
                  const isLocked = opt.isPro && !isProUser;

                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleDurationClick(opt)}
                      className={`py-2.5 px-3 rounded-btn text-xs font-medium border text-center transition-all relative ${
                        isSelected
                          ? 'bg-paper text-ink font-semibold border-accent ring-1 ring-accent'
                          : isLocked
                          ? 'bg-paper-surface/60 border-paper-border text-ink-muted/70 hover:border-pro/40'
                          : 'bg-paper-surface border-paper-border text-ink-muted hover:text-ink hover:border-ink-muted/40'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-1.5">
                        <span>{opt.label}</span>
                        {isLocked && <Lock className="w-3 h-3 text-pro" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Difficulty Selector & Passage Preview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-paper-border">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-ink-muted mb-2">
                  Difficulty Level
                </label>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {difficultyOptions.map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => {
                        setDifficulty(d);
                        handleSelectPassage(d, passageType);
                      }}
                      className={`px-3 py-1.5 rounded-btn text-xs font-medium border transition-colors ${
                        difficulty === d
                          ? 'bg-accent-soft text-accent border-accent/40 font-semibold'
                          : 'bg-paper border-paper-border text-ink-muted hover:text-ink'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Passage Preview Card */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-ink-muted mb-2">
                  Selected Text Passage
                </label>
                <div className="p-3 rounded-card bg-paper border border-paper-border text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-ink">{currentPassage.title}</span>
                    <span className="text-[10px] text-ink-muted uppercase">{currentPassage.difficulty}</span>
                  </div>
                  <p className="text-ink-muted line-clamp-2 leading-relaxed">
                    {currentPassage.text}
                  </p>
                  <button
                    type="button"
                    onClick={handleRestart}
                    className="mt-2 text-[11px] text-accent hover:underline font-medium inline-block"
                  >
                    Shuffle new passage
                  </button>
                </div>
              </div>
            </div>

            {/* Start Button */}
            <div className="pt-4 border-t border-paper-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-xs text-ink-muted">
                Typing begins automatically on your first keystroke.
              </span>
              <button
                type="button"
                onClick={handleStartTest}
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-btn bg-accent hover:bg-accent-hover text-white text-sm font-semibold transition-colors shadow-subtle"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Start {Math.round(duration / 60)}-Minute Test</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active Running Test */}
      {isRunning && (
        <div className="py-2">
          <TypingEngine
            key={`test-${currentPassage.id}-${duration}-${activeLayout}`}
            text={currentPassage.text}
            title={`${Math.round(duration / 60)}-Minute Speed Test: ${currentPassage.title}`}
            intro="Type steadily. Net speed subtracts uncorrected errors. Pace yourself for accuracy."
            targetWpm={language === 'english' ? 40 : 30}
            targetAccuracy={95}
            mode="test"
            layout={activeLayout}
            durationLimitSeconds={duration}
            onComplete={handleTestComplete}
            onExit={() => setIsRunning(false)}
            onFocusChange={onFocusChange}
          />
        </div>
      )}

      {/* Test Results Card */}
      {finalStats && (
        <div className="bg-paper-surface border border-paper-border rounded-card p-6 sm:p-8 shadow-subtle max-w-2xl mx-auto animate-fadeIn">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-paper-border">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-accent mb-1 block">
                Test Completed
              </span>
              <h2 className="text-xl sm:text-2xl font-semibold text-ink">
                {finalStats.testTitle}
              </h2>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-accent-soft text-accent border border-accent/20">
              {calculateSpeedBand(finalStats.netWpm).label}
            </span>
          </div>

          {/* Primary Net WPM & Accuracy */}
          <div className="grid grid-cols-2 gap-4 py-4 border-b border-paper-border mb-6">
            <div>
              <div className="text-xs text-ink-muted uppercase tracking-wider mb-1">
                Net Speed (Standard)
              </div>
              <div className="font-mono text-4xl sm:text-5xl font-bold text-ink">
                {finalStats.netWpm}{' '}
                <span className="text-sm font-sans font-normal text-ink-muted">WPM</span>
              </div>
              <div className="text-[11px] text-ink-muted mt-1">
                Gross: {finalStats.grossWpm} WPM {finalStats.kph ? `(${finalStats.kph} KPH)` : ''}
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs text-ink-muted uppercase tracking-wider mb-1">
                Accuracy
              </div>
              <div className={`font-mono text-4xl sm:text-5xl font-bold ${
                finalStats.accuracy >= 95 ? 'text-accent' : 'text-ink'
              }`}>
                {finalStats.accuracy}%
              </div>
              <div className="text-[11px] text-ink-muted mt-1">
                {finalStats.errorsCount} uncorrected errors
              </div>
            </div>
          </div>

          {/* Secondary Details */}
          <div className="grid grid-cols-3 gap-3 mb-6 text-xs text-ink-muted">
            <div className="p-3 rounded-card bg-paper border border-paper-border">
              <div className="text-[11px] mb-1">Duration</div>
              <div className="font-mono text-base font-semibold text-ink">
                {Math.round(finalStats.duration / 60)} min
              </div>
            </div>

            <div className="p-3 rounded-card bg-paper border border-paper-border">
              <div className="text-[11px] mb-1">Layout</div>
              <div className="font-mono text-xs font-semibold text-ink uppercase">
                {finalStats.layout || 'US'}
              </div>
            </div>

            <div className="p-3 rounded-card bg-paper border border-paper-border">
              <div className="text-[11px] mb-1">Total Typed</div>
              <div className="font-mono text-base font-semibold text-ink">
                {finalStats.totalChars || finalStats.totalCorrect || 0} chars
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-paper-border">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleRestart}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-btn border border-paper-border bg-paper hover:bg-paper-border/60 text-ink text-xs font-medium transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Take Another Test</span>
              </button>

              <a
                href="#/practice"
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-btn border border-paper-border bg-paper hover:bg-paper-border/60 text-ink text-xs font-medium transition-colors"
              >
                <span>Drill Weak Keys</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            {finalStats.accuracy >= 80 && (
              <button
                type="button"
                onClick={() => setShowCertificate(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-btn bg-accent hover:bg-accent-hover text-white text-xs font-semibold transition-colors shadow-subtle"
              >
                <Award className="w-4 h-4" />
                <span>Get Certificate</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Pro Lock Modal */}
      {showProLockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="relative max-w-md w-full bg-surface border border-border rounded-card p-6 shadow-xl">
            <button
              type="button"
              onClick={() => setShowProLockModal(false)}
              className="absolute top-4 right-4 p-1 rounded-btn hover:bg-surface-2 text-text-muted hover:text-text transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <ProLock
              title="Unlock Unlimited Tests with Pro"
              description={proLockReason || "Upgrade to Pro to unlock unlimited typing tests, all durations (1 to 10 minutes), TCS iON exam simulator, and verified certificates."}
              onUnlock={() => {
                setShowProLockModal(false);
                window.location.hash = '#/pricing';
              }}
            />
          </div>
        </div>
      )}

      {/* Certificate Modal */}
      {showCertificate && finalStats && (
        <Suspense fallback={null}>
          <CertificateModal
            stats={finalStats}
            testTitle={finalStats.testTitle}
            onClose={() => setShowCertificate(false)}
          />
        </Suspense>
      )}
    </div>
  );
}
