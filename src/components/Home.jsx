import React, { useState, useEffect } from 'react';
import { COURSES } from '../data/courses';
import { ArrowRight, Check } from 'lucide-react';

export default function Home({ onNavigate, completedLessons = {} }) {
  // Mini live typing demo
  const demoSentence = 'Keep your fingers on the home row and look ahead.';
  const [demoIndex, setDemoIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setDemoIndex(prev => {
        if (prev >= demoSentence.length) {
          return 0;
        }
        return prev + 1;
      });
    }, 140);
    return () => clearInterval(timer);
  }, [demoSentence.length]);

  // Check user best stats from localStorage
  const completedList = Object.values(completedLessons);
  const bestWpm = completedList.length > 0 ? Math.max(...completedList.map(l => l.netWpm || 0)) : 0;
  const avgAccuracy = completedList.length > 0
    ? Math.round(completedList.reduce((acc, l) => acc + (l.accuracy || 0), 0) / completedList.length)
    : 0;
  const totalCompleted = completedList.length;

  return (
    <div className="max-w-content mx-auto px-4 py-12 md:py-16">
      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-16 md:mb-24">
        <div className="lg:col-span-7">
          <p className="text-sm font-semibold text-accent uppercase tracking-wider mb-3">
            Free Touch Typing Tutor
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-ink tracking-tight leading-[1.15] mb-5">
            Learn to type faster, without looking at the keys.
          </h1>
          <p className="text-base sm:text-lg text-ink-muted mb-8 leading-relaxed max-w-xl">
            Free step-by-step lessons, a 1-minute speed test and typing games. No sign-up.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="#/lessons"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-btn bg-accent hover:bg-accent-hover text-white text-sm font-medium transition-colors shadow-subtle"
            >
              <span>Start lesson 1</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <a
              href="#/test"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-btn bg-paper-surface hover:bg-paper text-ink border border-paper-border text-sm font-medium transition-colors shadow-subtle"
            >
              <span>Take a speed test</span>
            </a>
          </div>

          {/* Honest Stats Strip (only shown if user has history) */}
          {totalCompleted > 0 && (
            <div className="mt-8 pt-6 border-t border-paper-border inline-flex items-center gap-4 text-xs text-ink-muted">
              <span>Your progress:</span>
              <span className="font-mono font-medium text-ink">{bestWpm} WPM best</span>
              <span>·</span>
              <span className="font-mono font-medium text-ink">{avgAccuracy}% accuracy</span>
              <span>·</span>
              <span>{totalCompleted} lessons completed</span>
            </div>
          )}
        </div>

        {/* Live typing demo card (desktop) */}
        <div className="lg:col-span-5 hidden lg:block">
          <div className="bg-paper-surface border border-paper-border rounded-card p-6 shadow-subtle">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-paper-border text-xs text-ink-muted">
              <span className="font-medium">Live typing demo</span>
              <span className="font-mono text-accent">Home row discipline</span>
            </div>

            <div className="font-mono text-lg text-ink min-h-[90px] leading-relaxed select-none">
              <span className="text-ink">
                {demoSentence.slice(0, demoIndex)}
              </span>
              <span className="inline-block w-2 h-5 bg-ink align-middle ml-0.5 caret-pulse" />
              <span className="text-ink-muted/50">
                {demoSentence.slice(demoIndex)}
              </span>
            </div>

            <div className="mt-4 pt-3 border-t border-paper-border flex items-center justify-between text-xs text-ink-muted">
              <span>Focus on accuracy first</span>
              <span className="font-mono">Speed follows</span>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <section className="mb-16 md:mb-24">
        <h2 className="text-xl sm:text-2xl font-semibold text-ink tracking-tight mb-8">
          How it works
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-paper-surface border border-paper-border rounded-card p-6 shadow-subtle">
            <div className="font-mono text-2xl font-semibold text-accent mb-3">01</div>
            <h3 className="text-base font-semibold text-ink mb-2">Learn the home row</h3>
            <p className="text-sm text-ink-muted leading-relaxed">
              Rest your fingers on ASDF and JKL;. Build muscle memory key by key with visual finger guides.
            </p>
          </div>

          <div className="bg-paper-surface border border-paper-border rounded-card p-6 shadow-subtle">
            <div className="font-mono text-2xl font-semibold text-accent mb-3">02</div>
            <h3 className="text-base font-semibold text-ink mb-2">Practise daily</h3>
            <p className="text-sm text-ink-muted leading-relaxed">
              Spend 10 minutes a day with short interactive drills. Strict error-blocking ensures clean technique.
            </p>
          </div>

          <div className="bg-paper-surface border border-paper-border rounded-card p-6 shadow-subtle">
            <div className="font-mono text-2xl font-semibold text-accent mb-3">03</div>
            <h3 className="text-base font-semibold text-ink mb-2">Test your speed</h3>
            <p className="text-sm text-ink-muted leading-relaxed">
              Measure your words per minute and accuracy with 1 to 5 minute benchmark tests and arcade games.
            </p>
          </div>
        </div>
      </section>

      {/* Course Overview */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-ink tracking-tight">
            Curriculum overview
          </h2>
          <a
            href="#/lessons"
            className="text-xs sm:text-sm font-medium text-accent hover:underline flex items-center gap-1"
          >
            <span>View all 30 lessons</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="bg-paper-surface border border-paper-border rounded-card divide-y divide-paper-border shadow-subtle overflow-hidden">
          {COURSES.map((course, idx) => {
            const courseCompleted = course.lessons.filter(l => completedLessons[l.id]).length;
            const isFinished = courseCompleted === course.lessons.length && course.lessons.length > 0;

            return (
              <a
                key={course.id}
                href="#/lessons"
                className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-paper transition-colors group"
              >
                <div className="flex items-start gap-4">
                  <span className="font-mono text-sm text-ink-muted w-6 pt-0.5">
                    0{idx + 1}
                  </span>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-ink group-hover:text-accent transition-colors">
                        {course.title}
                      </h3>
                      <span className="text-[11px] px-2 py-0.5 rounded bg-paper-border/60 text-ink-muted font-medium">
                        {course.badge}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
                      {course.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs self-end sm:self-center shrink-0">
                  <span className="text-ink-muted">
                    {courseCompleted > 0 ? `${courseCompleted}/${course.lessons.length} completed` : `${course.lessons.length} lessons`}
                  </span>
                  {isFinished && (
                    <span className="text-accent flex items-center gap-1 font-medium">
                      <Check className="w-3.5 h-3.5" />
                      <span>Done</span>
                    </span>
                  )}
                  <ArrowRight className="w-4 h-4 text-ink-muted group-hover:text-accent transition-colors" />
                </div>
              </a>
            );
          })}
        </div>
      </section>
    </div>
  );
}
