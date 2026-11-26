import React, { useState, useEffect, useRef } from 'react';
import { EXAM_PRESETS, evaluateExamScorecard } from '../../data/exams';
import { useAuth } from '../../lib/auth';
import { Storage } from '../../lib/storage';
import { ProLock, Card, Button, Badge } from '../ui';
import { Play, RotateCcw, AlertTriangle, CheckCircle, XCircle, FileText, ChevronRight } from 'lucide-react';
import { translateInscript } from '../../data/layouts/inscript';
import { RemingtonGailBuffer } from '../../data/layouts/remington-gail';

export default function ExamSimulator() {
  const { isProUser, user } = useAuth();
  const [selectedExam, setSelectedExam] = useState(EXAM_PRESETS[0]);
  const [activeLayout, setActiveLayout] = useState(EXAM_PRESETS[0].layout);

  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(EXAM_PRESETS[0].durationSeconds);
  const [typedText, setTypedText] = useState('');
  const [scorecard, setScorecard] = useState(null);

  const timerRef = useRef(null);
  const remingtonRef = useRef(new RemingtonGailBuffer());
  const inputRef = useRef(null);

  const isHindi = selectedExam.language === 'hindi';

  const handleSelectExam = (exam) => {
    setSelectedExam(exam);
    setActiveLayout(exam.layout);
    setIsRunning(false);
    setTimeLeft(exam.durationSeconds);
    setTypedText('');
    setScorecard(null);
  };

  const handleStartExam = () => {
    setIsRunning(true);
    setTimeLeft(selectedExam.durationSeconds);
    setTypedText('');
    setScorecard(null);
    remingtonRef.current.reset();
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  // Timer countdown
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            finishExam();
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

  const finishExam = () => {
    setIsRunning(false);
    const result = evaluateExamScorecard({
      originalText: selectedExam.samplePassage,
      typedText,
      durationSeconds: selectedExam.durationSeconds - timeLeft || selectedExam.durationSeconds,
      qualifyingSpeedWpm: selectedExam.qualifyingSpeedWpm,
      maxErrorPercentage: selectedExam.maxErrorPercentage
    });
    setScorecard(result);

    // Save to local & cloud storage
    try {
      Storage.addTestResult({
        testId: selectedExam.id,
        testTitle: selectedExam.title,
        netWpm: result.netWpm,
        grossWpm: result.grossWpm,
        accuracy: Math.max(0, 100 - Math.round(result.errorPercentage)),
        duration: selectedExam.durationSeconds,
        errorsCount: result.fullMistakes + result.halfMistakes,
        date: new Date().toISOString()
      });
    } catch (e) {}
  };

  // Custom key handler for Inscript & Remington Gail
  const handleKeyDown = (e) => {
    if (!isRunning) return;

    if (!selectedExam.backspaceAllowed && e.key === 'Backspace') {
      e.preventDefault();
      return;
    }

    if (e.key === 'Backspace') {
      // Allow standard backspace in allowed mode
      return;
    }

    if (e.ctrlKey || e.metaKey || e.altKey) return;

    if (isHindi) {
      if (activeLayout === 'inscript') {
        const char = translateInscript(e);
        if (char) {
          e.preventDefault();
          setTypedText(prev => prev + char);
        }
      } else if (activeLayout === 'remington-gail') {
        const res = remingtonRef.current.processKey(e);
        if (res) {
          e.preventDefault();
          if (res.type === 'char') {
            setTypedText(prev => prev + res.value);
          }
        }
      }
    }
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeFormatted = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  return (
    <div className="max-w-content mx-auto py-8 md:py-12 px-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-text tracking-tight">
            Government Exam Simulator
          </h1>
          <p className="text-xs sm:text-sm text-text-muted mt-1 max-w-2xl">
            TCS iON and High Court pattern dual-box typing console. Full mistake and half mistake evaluation according to official recruitment standards.
          </p>
        </div>

        {/* Pro Plan Gate Check */}
        {!isProUser && (
          <div className="p-3 rounded-card bg-pro-soft/60 border border-pro/30 text-xs text-text flex items-center justify-between gap-3">
            <span className="text-pro font-medium">Exam simulator is a Pro feature (Free preview enabled).</span>
            <Button size="sm" variant="primary" onClick={() => window.location.href = '#/pricing'} className="!bg-pro text-white">
              Unlock All
            </Button>
          </div>
        )}
      </div>

      {!isRunning && !scorecard && (
        <div className="space-y-6">
          {/* Preset Selector Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {EXAM_PRESETS.map((preset) => {
              const isSelected = preset.id === selectedExam.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectExam(preset)}
                  className={`text-left p-4 rounded-card border transition-colors duration-150 ease-smooth ${
                    isSelected
                      ? 'bg-surface border-accent shadow-subtle ring-1 ring-accent'
                      : 'bg-surface border-border hover:border-text-muted/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-medium text-text-muted">
                      {preset.organizer}
                    </span>
                    <span className="text-2xs font-mono font-medium tabular-nums px-1.5 py-0.5 rounded-key bg-surface-2 text-text">
                      {Math.round(preset.durationSeconds / 60)} min
                    </span>
                  </div>

                  <h3 className="text-sm font-semibold text-text mb-1">{preset.title}</h3>
                  <p className="text-xs text-text-muted line-clamp-2 leading-relaxed mb-3">
                    {preset.description}
                  </p>

                  <div className="flex items-center justify-between text-2xs pt-2 border-t border-border">
                    <span className="text-accent font-medium tabular-nums">Req: {preset.qualifyingSpeedWpm} WPM</span>
                    <span className="text-text-muted">{preset.backspaceAllowed ? 'Backspace Allowed' : 'No Backspace'}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Exam Details & Start Card */}
          <Card className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 mb-4 border-b border-border">
              <div>
                <h2 className="text-base font-semibold text-text">{selectedExam.title}</h2>
                <p className="text-xs text-text-muted mt-0.5">{selectedExam.description}</p>
              </div>

              {isHindi && (
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-text-muted">Layout</span>
                  <select
                    value={activeLayout}
                    onChange={(e) => setActiveLayout(e.target.value)}
                    className="px-2.5 py-1 rounded-input bg-surface border border-border text-xs text-text font-medium"
                  >
                    <option value="remington-gail">Remington Gail (Krutidev)</option>
                    <option value="inscript">Inscript (Govt Standard)</option>
                  </select>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-6 text-xs text-text-muted tabular-nums">
                <div>
                  <span className="font-semibold text-text">{Math.round(selectedExam.durationSeconds / 60)} Minutes</span> Duration
                </div>
                <div>
                  <span className="font-semibold text-text">{selectedExam.qualifyingSpeedWpm} WPM</span> Min Speed
                </div>
                <div>
                  <span className="font-semibold text-text">{selectedExam.maxErrorPercentage}%</span> Max Error
                </div>
              </div>

              <Button variant="primary" size="lg" onClick={handleStartExam} className="gap-2">
                <Play className="w-4 h-4 fill-current" strokeWidth={1.5} />
                <span>Begin Examination</span>
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Active Exam Console: Two-Box Interface (TCS iON Style) */}
      {isRunning && (
        <div className="space-y-4 animate-fadeIn">
          {/* Top Timer Bar */}
          <div className="flex items-center justify-between p-3.5 rounded-card bg-surface border border-border">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-text text-sm">{selectedExam.title}</span>
              <span className="text-2xs font-mono px-2 py-0.5 rounded-key bg-surface-2 text-text-muted">
                {activeLayout}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className={`font-mono text-xl font-semibold tabular-nums px-3 py-1 rounded-btn ${
                timeLeft < 60 ? 'bg-rose-50 dark:bg-rose-950/40 text-error border border-rose-300' : 'bg-surface-2 text-text'
              }`}>
                {timeFormatted}
              </div>

              <Button size="sm" variant="outline" onClick={finishExam} className="!text-error hover:!bg-rose-50">
                Submit Test
              </Button>
            </div>
          </div>

          {/* Upper Box: Original Passage (Scrollable) */}
          <div className="p-5 rounded-card bg-surface border border-border">
            <div className="text-xs font-medium text-text-muted mb-2">
              Passage to transcribe
            </div>
            <div className={`${isHindi ? 'font-hindi text-xl leading-[2]' : 'font-mono text-base leading-relaxed'} text-text max-h-[160px] overflow-y-auto select-none p-3 bg-surface-2/60 rounded-btn border border-border/60`}>
              {selectedExam.samplePassage}
            </div>
          </div>

          {/* Lower Box: Candidate Typing Area */}
          <div className="p-5 rounded-card bg-surface border border-border">
            <div className="flex items-center justify-between text-xs font-medium text-text-muted mb-2">
              <span>Candidate transcription box</span>
              <span className="font-mono tabular-nums">Words typed: {typedText.trim().split(/\s+/).filter(Boolean).length}</span>
            </div>
            <textarea
              ref={inputRef}
              rows={6}
              value={typedText}
              onChange={(e) => {
                if (!isHindi) {
                  setTypedText(e.target.value);
                }
              }}
              onKeyDown={handleKeyDown}
              placeholder="Start typing the passage here..."
              className={`w-full p-4 rounded-input bg-bg border border-border focus:outline-none focus:border-accent ${
                isHindi ? 'font-hindi text-xl leading-[2]' : 'font-mono text-base leading-relaxed'
              } text-text resize-none`}
            />
          </div>
        </div>
      )}

      {/* Official Scorecard Result */}
      {scorecard && (
        <div className="max-w-2xl mx-auto bg-surface border border-border rounded-card p-6 sm:p-8 shadow-subtle animate-fadeIn">
          {/* Header & Qualification Status */}
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-border">
            <div>
              <span className="text-xs font-medium text-text-muted block mb-1">
                Official Examination Scorecard
              </span>
              <h2 className="text-xl font-semibold text-text">{selectedExam.title}</h2>
            </div>

            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-key text-xs font-medium ${
              scorecard.isQualified
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-300'
                : 'bg-rose-50 dark:bg-rose-950/40 text-error border border-rose-300'
            }`}>
              {scorecard.isQualified ? <CheckCircle className="w-4 h-4" strokeWidth={1.5} /> : <XCircle className="w-4 h-4" strokeWidth={1.5} />}
              <span>{scorecard.isQualified ? 'Qualified' : 'Not Qualified'}</span>
            </div>
          </div>

          {/* Main Speed Metrics */}
          <div className="grid grid-cols-2 gap-4 pb-6 mb-6 border-b border-border">
            <div>
              <div className="text-xs font-medium text-text-muted mb-1">Net Typing Speed</div>
              <div className="font-mono text-4xl sm:text-5xl font-semibold tabular-nums text-text">
                {scorecard.netWpm} <span className="text-sm font-sans font-normal text-text-muted">WPM</span>
              </div>
              <div className="text-2xs text-text-muted mt-1 tabular-nums">
                Required speed: {selectedExam.qualifyingSpeedWpm} WPM
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs font-medium text-text-muted mb-1">Error Rate</div>
              <div className={`font-mono text-4xl sm:text-5xl font-semibold tabular-nums ${scorecard.isAccuracyQualified ? 'text-accent' : 'text-error'}`}>
                {scorecard.errorPercentage}%
              </div>
              <div className="text-2xs text-text-muted mt-1 tabular-nums">
                Max allowed: {selectedExam.maxErrorPercentage}%
              </div>
            </div>
          </div>

          {/* Mistake Breakdown Grid */}
          <div className="grid grid-cols-3 gap-3 mb-6 text-xs text-text-muted text-center">
            <div className="p-3 rounded-btn bg-surface-2 border border-border">
              <div className="text-2xs mb-0.5">Total Words</div>
              <div className="font-mono text-xl font-semibold tabular-nums text-text">{scorecard.totalTypedWords}</div>
            </div>

            <div className="p-3 rounded-btn bg-surface-2 border border-border">
              <div className="text-2xs mb-0.5">Full Mistakes</div>
              <div className="font-mono text-xl font-semibold tabular-nums text-error">{scorecard.fullMistakes}</div>
              <div className="text-[10px] text-text-muted">1 word deducted each</div>
            </div>

            <div className="p-3 rounded-btn bg-surface-2 border border-border">
              <div className="text-2xs mb-0.5">Half Mistakes</div>
              <div className="font-mono text-xl font-semibold tabular-nums text-amber-600 dark:text-amber-400">{scorecard.halfMistakes}</div>
              <div className="text-[10px] text-text-muted">0.5 word deducted each</div>
            </div>
          </div>

          {/* Word by Word Comparison Preview */}
          <div className="mb-6 p-4 rounded-btn bg-surface-2 border border-border">
            <div className="text-xs font-medium text-text-muted mb-2">
              Mistake-by-mistake transcription preview
            </div>
            <div className="flex flex-wrap gap-1.5 text-xs font-mono max-h-36 overflow-y-auto">
              {scorecard.wordComparisons.map((item, idx) => (
                <span
                  key={idx}
                  className={`px-1.5 py-0.5 rounded text-2xs ${
                    item.status === 'correct'
                      ? 'bg-surface text-text border border-border'
                      : item.status === 'half_mistake'
                      ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300'
                      : 'bg-rose-100 dark:bg-rose-950/60 text-error border border-rose-300 font-semibold'
                  }`}
                  title={item.status !== 'correct' ? `Typed: "${item.typed}" (Expected: "${item.orig}")` : undefined}
                >
                  {item.typed || `[omitted: ${item.orig}]`}
                </span>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between gap-3 pt-4 border-t border-border">
            <Button variant="secondary" size="md" onClick={() => setScorecard(null)}>
              <RotateCcw className="w-4 h-4 mr-1.5" />
              <span>Retry Mock Test</span>
            </Button>

            <Button variant="primary" size="md" onClick={() => window.location.href = '#/exams'}>
              <span>All Exam Tests</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
