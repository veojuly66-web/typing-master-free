import React, { useState, useEffect } from 'react';
import { COURSES } from '../data/courses';
import { Storage } from '../lib/storage';
import { Card, Button, Badge, ProgressBar } from './ui';
import { ArrowRight, Check, ChevronDown, ChevronUp, Play } from 'lucide-react';

const FAQ_ITEMS = [
  {
    q: 'Is Pankaj Typing completely free?',
    a: 'Yes, 100% free forever. All 30 step-by-step lessons across 5 curriculum levels, timed benchmark speed tests, adaptive practice studio, and arcade typing games are accessible without any paywalls or hidden upgrades.'
  },
  {
    q: 'Do I need to create an account or sign up?',
    a: 'No registration or account is required. You can start practicing immediately upon loading the site. Your progress, custom preferences, and achievements are saved directly to your browser.'
  },
  {
    q: 'Where is my typing progress saved?',
    a: 'All data is stored locally in your browser using standard HTML5 localStorage. No personal information or keystroke records are sent to remote servers. You can export your data to a JSON backup at any time from the Progress page.'
  },
  {
    q: 'What is considered a good typing speed?',
    a: 'The average adult typing speed is approximately 35 to 40 Words Per Minute (WPM). Speeds between 45 and 60 WPM are considered proficient, and anything above 70 WPM is considered high professional velocity. Touch typing technique allows sustained speeds of 60 to 90+ WPM without visual strain.'
  },
  {
    q: 'What is the difference between gross and net WPM?',
    a: 'Gross WPM is your raw typing speed calculated as (all typed characters / 5) / minutes. Net WPM subtracts an error penalty for uncorrected mistakes: Gross WPM - (uncorrected errors / minutes). Net WPM is the true industry benchmark for touch typing accuracy.'
  }
];

export default function Home({ onNavigate, completedLessons = {} }) {
  // Live auto-typing demo character by character with live WPM calculation
  const demoText = 'Keep your fingers resting on the home row keys.';
  const [demoIndex, setDemoIndex] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setDemoIndex(prev => (prev >= demoText.length ? 0 : prev + 1));
    }, 130);
    return () => clearInterval(timer);
  }, [demoText.length]);

  // Returning user check
  const allLessons = COURSES.flatMap(c => c.lessons);
  const nextUnfinishedLesson = allLessons.find(l => !completedLessons[l.id]) || allLessons[0];
  const completedList = Object.values(completedLessons);
  const isReturningUser = completedList.length > 0;

  const todayStr = new Date().toISOString().split('T')[0];
  const dailyPractice = Storage.getDailyPractice();
  const todayMins = Math.round((dailyPractice[todayStr] || 0) * 10) / 10;
  const settings = Storage.getSettings();
  const goalMins = settings.dailyGoalMinutes || 10;

  return (
    <div className="max-w-content mx-auto px-4 py-10 md:py-16">
      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-16 md:mb-24">
        <div className="lg:col-span-7">
          <div className="inline-flex items-center gap-1.5 mb-3">
            <Badge variant="accent">Free Touch Typing Tutor</Badge>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-text tracking-tight leading-[1.15] mb-5">
            Learn to touch type. Free, step by step.
          </h1>

          <p className="text-base sm:text-lg text-text-muted mb-8 leading-relaxed max-w-xl">
            Structured lessons, a real speed test and typing games — right in your browser. No sign-up.
          </p>

          {/* Returning User Continue Card OR New User Dual CTAs */}
          {isReturningUser ? (
            <Card className="p-5 max-w-lg mb-6 border-accent/30 bg-surface">
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xs font-semibold uppercase tracking-wider text-accent">
                  Welcome back · Continue Learning
                </span>
                <span className="text-xs font-mono text-text-muted">
                  {completedList.length} of {allLessons.length} drills done
                </span>
              </div>

              <div className="flex items-center justify-between gap-4 mb-3">
                <div>
                  <h3 className="text-sm font-semibold text-text">{nextUnfinishedLesson.title}</h3>
                  <p className="text-xs text-text-muted">Target: {nextUnfinishedLesson.targetWpm} WPM · 95% accuracy</p>
                </div>

                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => { window.location.hash = `#/lessons/${nextUnfinishedLesson.id}`; }}
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Resume</span>
                </Button>
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-between text-2xs text-text-muted">
                <span>Today: {todayMins}m / {goalMins}m goal</span>
                <span className="font-mono text-text">Keep your streak going!</span>
              </div>
            </Card>
          ) : (
            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="primary"
                size="lg"
                onClick={() => { window.location.hash = '#/lessons/c1-l1'; }}
              >
                <span>Start learning</span>
                <ArrowRight className="w-4 h-4" />
              </Button>

              <Button
                variant="secondary"
                size="lg"
                onClick={() => { window.location.hash = '#/placement'; }}
              >
                <span>Find my level</span>
              </Button>
            </div>
          )}
        </div>

        {/* Hero Right: Live Auto-typing Demo */}
        <div className="lg:col-span-5 hidden lg:block">
          <Card className="p-6">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-border text-xs text-text-muted">
              <span className="font-medium text-text">Real-time typing preview</span>
              <span className="font-mono text-accent">52 WPM · 98%</span>
            </div>

            <div className="font-mono text-lg text-text min-h-[90px] leading-relaxed select-none">
              <span className="text-text">
                {demoText.slice(0, demoIndex)}
              </span>
              <span className="inline-block w-2 h-5 bg-text align-middle ml-0.5 caret-pulse" />
              <span className="text-text-muted/40">
                {demoText.slice(demoIndex)}
              </span>
            </div>

            <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-2xs text-text-muted">
              <span>Home row finger guidance active</span>
              <span className="font-mono text-accent">Zero looking down</span>
            </div>
          </Card>
        </div>
      </div>

      {/* How It Works: 3 Steps */}
      <section className="mb-16 md:mb-24">
        <h2 className="text-xl sm:text-2xl font-semibold text-text tracking-tight mb-8">
          How it works
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="font-mono text-2xl font-semibold text-accent mb-3">01</div>
            <h3 className="text-base font-semibold text-text mb-2">Find your level</h3>
            <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
              Take a 1-minute diagnostic placement test, or start straight from the home row basics.
            </p>
          </Card>

          <Card className="p-6">
            <div className="font-mono text-2xl font-semibold text-accent mb-3">02</div>
            <h3 className="text-base font-semibold text-text mb-2">Practise a few minutes daily</h3>
            <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
              Ten minutes a day builds lasting motor memory. Stop-on-error mode guarantees clean technique.
            </p>
          </Card>

          <Card className="p-6">
            <div className="font-mono text-2xl font-semibold text-accent mb-3">03</div>
            <h3 className="text-base font-semibold text-text mb-2">Track your speed</h3>
            <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
              Benchmark your WPM with timed speed tests, earn certificates of completion, and race in arcade games.
            </p>
          </Card>
        </div>
      </section>

      {/* 5 Course Levels Overview */}
      <section className="mb-16 md:mb-24">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-text tracking-tight">
              Curriculum overview
            </h2>
            <p className="text-xs text-text-muted mt-0.5">5 progressive levels · 30 interactive lessons</p>
          </div>
          <Button size="sm" variant="outline" onClick={() => { window.location.hash = '#/lessons'; }}>
            <span>View curriculum</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>

        <div className="bg-surface border border-border rounded-card divide-y divide-border shadow-subtle overflow-hidden">
          {COURSES.map((course) => {
            const courseCompleted = course.lessons.filter(l => completedLessons[l.id]).length;
            const isFinished = courseCompleted === course.lessons.length && course.lessons.length > 0;

            return (
              <a
                key={course.id}
                href={`#/lessons`}
                className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-surface-2 transition-colors group"
              >
                <div className="flex items-start gap-4">
                  <span className="font-mono text-sm text-text-muted w-6 pt-0.5">
                    0{course.level}
                  </span>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-text group-hover:text-accent transition-colors">
                        {course.title}
                      </h3>
                      <Badge variant={isFinished ? 'accent' : 'default'}>{course.badge}</Badge>
                    </div>
                    <p className="text-xs text-text-muted leading-relaxed">
                      {course.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs self-end sm:self-center shrink-0">
                  <span className="text-text-muted font-mono text-2xs">
                    {courseCompleted > 0 ? `${courseCompleted}/${course.lessons.length} done` : `${course.lessons.length} drills`}
                  </span>
                  {isFinished && (
                    <span className="text-accent flex items-center gap-1 font-medium text-2xs">
                      <Check className="w-3.5 h-3.5" />
                      <span>Complete</span>
                    </span>
                  )}
                  <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-accent transition-colors" />
                </div>
              </a>
            );
          })}
        </div>
      </section>

      {/* Feature Section: 4 Short Blocks with Real UI Mocks */}
      <section className="mb-16 md:mb-24">
        <h2 className="text-xl sm:text-2xl font-semibold text-text tracking-tight mb-8">
          Built for deliberate practice
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Feature 1: Adaptive Practice */}
          <Card className="p-6 flex flex-col justify-between">
            <div>
              <div className="h-28 rounded-btn bg-surface-2 border border-border p-3 mb-4 flex flex-col justify-center">
                <div className="text-2xs font-semibold text-text-muted mb-1 uppercase">Weak Key Detection</div>
                <div className="flex gap-2">
                  <span className="px-2.5 py-1 rounded bg-surface border border-error text-error font-mono text-xs font-bold">R (28% err)</span>
                  <span className="px-2.5 py-1 rounded bg-surface border border-warning text-warning font-mono text-xs font-bold">U (18% err)</span>
                </div>
              </div>
              <h3 className="text-base font-semibold text-text mb-1">Smart Adaptive Practice</h3>
              <p className="text-xs text-text-muted leading-relaxed">
                The tutor analyzes per-key error rates and latency to generate personalized drills weighted heavily toward your most hesitant fingers.
              </p>
            </div>
            <a href="#/practice" className="mt-4 text-xs text-accent hover:underline font-medium inline-block">
              Open practice studio →
            </a>
          </Card>

          {/* Feature 2: Weak-key Analysis & Heatmap */}
          <Card className="p-6 flex flex-col justify-between">
            <div>
              <div className="h-28 rounded-btn bg-surface-2 border border-border p-3 mb-4 flex flex-col justify-center">
                <div className="text-2xs font-semibold text-text-muted mb-1 uppercase">Keyboard Heatmap</div>
                <div className="flex gap-1.5 overflow-hidden">
                  <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 font-mono text-2xs text-emerald-800">A</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 font-mono text-2xs text-emerald-800">S</span>
                  <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 font-mono text-2xs text-amber-800">D</span>
                  <span className="px-2 py-0.5 rounded bg-rose-200 dark:bg-rose-950 font-mono text-2xs text-rose-800 font-bold">F</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 font-mono text-2xs text-emerald-800">J</span>
                </div>
              </div>
              <h3 className="text-base font-semibold text-text mb-1">Comprehensive Keystroke Analytics</h3>
              <p className="text-xs text-text-muted leading-relaxed">
                Review interactive heatmaps of your keyboard showing where mistakes happen and how your reaction speed evolves over time.
              </p>
            </div>
            <a href="#/progress" className="mt-4 text-xs text-accent hover:underline font-medium inline-block">
              View progress analytics →
            </a>
          </Card>

          {/* Feature 3: Speed Test & Certificate */}
          <Card className="p-6 flex flex-col justify-between">
            <div>
              <div className="h-28 rounded-btn bg-surface-2 border border-border p-3 mb-4 flex flex-col justify-center">
                <div className="text-2xs font-semibold text-text-muted mb-1 uppercase">Certificate of Typing Speed</div>
                <div className="font-serif text-sm font-semibold text-text">Pankaj Typing Verified Benchmark</div>
                <div className="font-mono text-2xs text-accent mt-0.5">5-Minute Exam · 64 WPM · 98% Accuracy</div>
              </div>
              <h3 className="text-base font-semibold text-text mb-1">Timed Benchmarks &amp; Certificates</h3>
              <p className="text-xs text-text-muted leading-relaxed">
                Test yourself under 1, 2, 3, 5, or 10-minute conditions with 40+ original passages. Download verified A4 certificates as PNG or PDF.
              </p>
            </div>
            <a href="#/test" className="mt-4 text-xs text-accent hover:underline font-medium inline-block">
              Take a speed test →
            </a>
          </Card>

          {/* Feature 4: Arcade Typing Games */}
          <Card className="p-6 flex flex-col justify-between">
            <div>
              <div className="h-28 rounded-btn bg-surface-2 border border-border p-3 mb-4 flex flex-col justify-center">
                <div className="text-2xs font-semibold text-text-muted mb-1 uppercase">Speed Race · Multi-lane</div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-accent">🏎 You (54 WPM)</span>
                  <span className="text-2xs text-text-muted">vs 3 Computer Cars</span>
                </div>
              </div>
              <h3 className="text-base font-semibold text-text mb-1">Three Interactive Arcade Games</h3>
              <p className="text-xs text-text-muted leading-relaxed">
                Break the monotony with Word Bubbles, Word Attack: Defender, and Speed Race against opponents calibrated to your cadence.
              </p>
            </div>
            <a href="#/games" className="mt-4 text-xs text-accent hover:underline font-medium inline-block">
              Explore games hub →
            </a>
          </Card>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="mb-16">
        <h2 className="text-xl sm:text-2xl font-semibold text-text tracking-tight mb-8">
          Frequently asked questions
        </h2>

        <div className="bg-surface border border-border rounded-card divide-y divide-border shadow-subtle overflow-hidden">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className="p-5 sm:p-6">
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between text-left text-sm font-semibold text-text hover:text-accent transition-colors gap-4"
                >
                  <span>{item.q}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 shrink-0 text-text-muted" /> : <ChevronDown className="w-4 h-4 shrink-0 text-text-muted" />}
                </button>
                {isOpen && (
                  <p className="text-xs sm:text-sm text-text-muted leading-relaxed mt-3 pt-3 border-t border-border animate-fadeIn">
                    {item.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
