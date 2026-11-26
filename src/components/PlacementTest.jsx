import React, { useState } from 'react';
import TypingEngine from './typing/TypingEngine';
import { Card, Button, StatNumber, Badge } from './ui';
import { Compass, CheckCircle2, ArrowRight, RotateCcw } from 'lucide-react';

const PLACEMENT_TEXT = 'Typing speed and accuracy are developed through consistent muscle memory. Keep your fingers resting lightly on the home row and maintain a calm rhythm without glancing at the keys. Precision in everyday practice naturally leads to effortless speed.';

export default function PlacementTest({ onSelectLesson }) {
  const [testResult, setTestResult] = useState(null);

  const handleComplete = (stats) => {
    // Recommend level based on WPM & Accuracy
    let recommendedLevel = 1;
    let levelName = 'Level 1: Beginner';
    let targetLessonId = 'c1-l1';
    let reasoning = 'Mastering the home row and top row fingers will establish solid touch-typing fundamentals.';

    if (stats.netWpm >= 65 && stats.accuracy >= 94) {
      recommendedLevel = 5;
      levelName = 'Level 5: Expert';
      targetLessonId = 'c4-l1';
      reasoning = 'Your touch typing speed is already strong. Real literature paragraphs will hone your cadence and peak velocity.';
    } else if (stats.netWpm >= 50 && stats.accuracy >= 92) {
      recommendedLevel = 4;
      levelName = 'Level 4: Advanced';
      targetLessonId = 'c3-l1';
      reasoning = 'You have good typing flow. Mastering top number rows and programming brackets will unlock complete keyboard mastery.';
    } else if (stats.netWpm >= 35 && stats.accuracy >= 90) {
      recommendedLevel = 3;
      levelName = 'Level 3: Intermediate';
      targetLessonId = 'c2-l1';
      reasoning = 'You know the alphabet positions well. High-frequency bigrams and common prefix drills will accelerate your words per minute.';
    } else if (stats.netWpm >= 20 && stats.accuracy >= 85) {
      recommendedLevel = 2;
      levelName = 'Level 2: Elementary';
      targetLessonId = 'c1-l9';
      reasoning = 'Focusing on downward reaches (bottom row) and opposite-hand Shift key discipline will give you balanced accuracy.';
    }

    setTestResult({
      ...stats,
      recommendedLevel,
      levelName,
      targetLessonId,
      reasoning
    });
  };

  return (
    <div className="max-w-content mx-auto py-8 md:py-12 px-4">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 mb-2">
          <Badge variant="accent">Diagnostic Assessment</Badge>
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-text tracking-tight mb-2">
          1-Minute Placement Test
        </h1>
        <p className="text-sm text-text-muted max-w-2xl">
          Not sure where to start? Take this quick 60-second diagnostic test. We will analyze your typing velocity and accuracy, then recommend the exact course level that fits your skill.
        </p>
      </div>

      {!testResult ? (
        <TypingEngine
          text={PLACEMENT_TEXT}
          title="Diagnostic Benchmark"
          intro="Type comfortably at your normal natural pace. The test runs for 60 seconds."
          durationLimitSeconds={60}
          targetWpm={25}
          targetAccuracy={90}
          mode="test"
          onComplete={handleComplete}
          onExit={() => { window.location.hash = '#/lessons'; }}
        />
      ) : (
        <Card className="max-w-xl mx-auto p-6 sm:p-8 animate-fadeIn">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className="w-5 h-5 text-accent" />
            <h2 className="text-xl font-semibold text-text tracking-tight">Placement Complete</h2>
          </div>

          {/* Result Stats Strip */}
          <div className="grid grid-cols-3 gap-3 py-4 border-y border-border mb-6">
            <StatNumber value={testResult.netWpm} label="Net speed" unit="WPM" accent />
            <StatNumber value={`${testResult.accuracy}%`} label="Accuracy" />
            <StatNumber value={`${testResult.timeSeconds}s`} label="Duration" />
          </div>

          {/* Recommendation Box */}
          <div className="p-4 rounded-card bg-surface-2 border border-border mb-6">
            <div className="text-2xs font-semibold uppercase tracking-wider text-accent mb-1">
              Recommended Starting Point
            </div>
            <div className="text-base font-semibold text-text mb-1">
              {testResult.levelName}
            </div>
            <p className="text-xs text-text-muted leading-relaxed">
              {testResult.reasoning}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <Button
              variant="primary"
              className="w-full sm:w-auto flex-1"
              onClick={() => {
                window.location.hash = `#/lessons/${testResult.targetLessonId}`;
              }}
            >
              <span>Start {testResult.levelName}</span>
              <ArrowRight className="w-4 h-4" />
            </Button>

            <Button
              variant="secondary"
              className="w-full sm:w-auto"
              onClick={() => setTestResult(null)}
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake test</span>
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
