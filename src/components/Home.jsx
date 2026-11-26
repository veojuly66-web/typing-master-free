import React, { useState, useEffect } from 'react';
import { COURSES } from '../data/courses';
import { BRAND } from '../config/brand';
import { Button } from './ui';
import { ArrowRight, Play, ShieldCheck, Layers, Users, Terminal, ChevronDown } from 'lucide-react';

const FAQ_ITEMS = [
  {
    q: 'Is Pankaj Typing free to use?',
    a: 'Yes. The Free starter plan requires no login or credit card and includes the first 2 levels of English and Hindi courses, 3 daily 1-minute speed tests, and Word Bubbles.'
  },
  {
    q: 'Do I need to install Krutidev or Inscript fonts for Hindi?',
    a: 'No font or external IME installation is needed. Typing runs directly in the browser and converts standard QWERTY keystrokes into Unicode Devanagari for both Inscript and Remington Gail, including pre-base matras (ि) and conjuncts.'
  },
  {
    q: 'Which government exams are supported?',
    a: 'Exam presets are configured to match SSC CHSL, SSC CGL, Allahabad High Court, Patna High Court, Rajasthan High Court, MP CPCT, and UPSSSC Junior Assistant patterns.'
  },
  {
    q: 'How does the exam simulator score mistakes?',
    a: 'Full mistakes (omitted or substituted words) and half mistakes (spacing, capitalization, punctuation) are evaluated separately to compute Net WPM and Error Percentage against board cutoffs.'
  },
  {
    q: 'What does the Pro plan include?',
    a: 'Pro unlocks all 5 English levels, all 6 Hindi Inscript levels, all 6 Hindi Remington Gail levels, unlimited exam mock tests, 1 to 10-minute speed tests, weak-key drills, arcade games, and verifiable certificates.'
  }
];

const DEMO_SNIPPETS = [
  {
    id: 'en',
    label: 'English',
    layoutName: 'US QWERTY',
    text: 'Keep your fingers resting lightly on the home row keys.',
    keys: ['A', 'S', 'D', 'F', 'J', 'K', 'L', ';'],
    stats: '52 WPM · 98% accuracy'
  },
  {
    id: 'hi',
    label: 'हिंदी रेमिंगटन',
    layoutName: 'Remington Gail',
    text: 'अभ्यास से ही टाइपिंग में गति और शुद्धता आती है।',
    keys: ['र', 'ा', 'स', 'य', 'क', 'ि', 'त', 'न'],
    stats: '36 WPM · Unicode output'
  }
];

export default function Home({ completedLessons = {} }) {
  const [currentSnippetIdx, setCurrentSnippetIdx] = useState(0);
  const [demoCharIndex, setDemoCharIndex] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);

  const activeSnippet = DEMO_SNIPPETS[currentSnippetIdx];

  useEffect(() => {
    let switchTimer = null;
    const timer = setInterval(() => {
      setDemoCharIndex((prev) => {
        if (prev >= activeSnippet.text.length) {
          if (!switchTimer) {
            switchTimer = setTimeout(() => {
              setCurrentSnippetIdx((s) => (s + 1) % DEMO_SNIPPETS.length);
              setDemoCharIndex(0);
            }, 900);
          }
          return prev;
        }
        return prev + 1;
      });
    }, 115);

    return () => {
      clearInterval(timer);
      if (switchTimer) clearTimeout(switchTimer);
    };
  }, [activeSnippet.text.length, currentSnippetIdx]);

  const allLessons = COURSES.flatMap((c) => c.lessons);
  const nextUnfinishedLesson = allLessons.find((l) => !completedLessons[l.id]) || allLessons[0];
  const completedList = Object.values(completedLessons);
  const isReturningUser = completedList.length > 0;

  const activeKeyHighlightIdx = demoCharIndex % activeSnippet.keys.length;

  return (
    <div className="max-w-content mx-auto px-4 sm:px-6 py-12 md:py-16">
      {/* Hero Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center mb-20 md:mb-24">
        <div className="lg:col-span-7">
          <p className="text-xs font-medium text-accent mb-3">
            English QWERTY · Hindi Inscript · Remington Gail
          </p>

          <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-medium text-text tracking-[-0.025em] leading-[1.12] mb-4">
            Typing practice that gets you exam-ready, in English and Hindi
          </h1>

          <p className="text-base sm:text-lg text-text-muted mb-8 leading-relaxed max-w-xl">
            Step-by-step touch-typing drills and TCS iON pattern government exam mock tests for SSC, High Court, and CPCT aspirants.
          </p>

          {isReturningUser ? (
            <div className="p-5 max-w-lg mb-6 rounded-card border border-border bg-surface shadow-subtle">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-border text-xs">
                <span className="font-medium text-accent">Continue practice</span>
                <span className="font-mono tabular-nums text-text-muted">
                  {completedList.length} / {allLessons.length} drills completed
                </span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-sm font-medium text-text">{nextUnfinishedLesson.title}</h2>
                  <p className="text-xs text-text-muted tabular-nums mt-0.5">
                    Target {nextUnfinishedLesson.targetWpm} WPM · {nextUnfinishedLesson.targetAccuracy}% accuracy
                  </p>
                </div>

                <Button
                  size="md"
                  variant="primary"
                  onClick={() => { window.location.hash = `#/lessons/${nextUnfinishedLesson.id}`; }}
                >
                  <Play className="w-3.5 h-3.5" strokeWidth={1.5} />
                  <span>Resume</span>
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="primary"
                size="lg"
                onClick={() => { window.location.hash = '#/lessons'; }}
              >
                <span>Start practicing free</span>
                <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
              </Button>

              <Button
                variant="secondary"
                size="lg"
                onClick={() => { window.location.hash = '#/test'; }}
              >
                <span>Take a speed test</span>
              </Button>
            </div>
          )}

          <p className="mt-5 text-xs text-text-muted">
            No card required to start · Runs offline in your browser · 7-day Pro trial on signup
          </p>
        </div>

        {/* Hero Visual Moment: Interactive Bilingual Typing Console & Keycap Row */}
        <div className="lg:col-span-5">
          <div className="rounded-card bg-surface border border-border p-5 sm:p-6 shadow-subtle">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-border text-xs">
              <div className="inline-flex items-center gap-1 bg-surface-2 p-1 rounded-btn border border-border">
                {DEMO_SNIPPETS.map((snip, idx) => (
                  <button
                    key={snip.id}
                    type="button"
                    onClick={() => {
                      setCurrentSnippetIdx(idx);
                      setDemoCharIndex(0);
                    }}
                    className={`px-2.5 py-1 rounded-[5px] text-xs font-medium transition-colors ${
                      currentSnippetIdx === idx
                        ? 'bg-surface text-text shadow-subtle'
                        : 'text-text-muted hover:text-text'
                    }`}
                  >
                    {snip.label}
                  </button>
                ))}
              </div>
              <span className="font-mono text-xs tabular-nums text-accent">{activeSnippet.stats}</span>
            </div>

            <div
              className={`${
                activeSnippet.id === 'hi'
                  ? 'font-hindi text-xl leading-[2]'
                  : 'font-mono text-base leading-relaxed'
              } min-h-[96px] select-none text-text mb-4`}
            >
              <span>{activeSnippet.text.slice(0, demoCharIndex)}</span>
              <span className="inline-block w-0.5 h-5 bg-accent align-middle mx-0.5 caret-pulse" />
              <span className="text-text-muted/45">{activeSnippet.text.slice(demoCharIndex)}</span>
            </div>

            {/* Tactile Keycap Signature Strip */}
            <div className="pt-3 border-t border-border">
              <div className="flex items-center justify-between gap-1.5 mb-2.5">
                {activeSnippet.keys.map((k, kIdx) => {
                  const isActive = demoCharIndex > 0 && demoCharIndex < activeSnippet.text.length && activeKeyHighlightIdx === kIdx;
                  return (
                    <span
                      key={k + kIdx}
                      className={`keycap h-8 flex-1 text-xs ${
                        isActive
                          ? '!bg-accent !text-white !border-accent-hover'
                          : 'text-text-muted'
                      }`}
                    >
                      {k}
                    </span>
                  );
                })}
              </div>
              <div className="flex items-center justify-between text-xs text-text-muted">
                <span>Layout: {activeSnippet.layoutName}</span>
                <span className="font-mono tabular-nums">No font install needed</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 1: Who Uses Pankaj Typing (Editorial 2x2 Ledger instead of 4 identical icon-box cards) */}
      <section className="mb-20 md:mb-24">
        <div className="max-w-xl mb-8">
          <h2 className="text-2xl sm:text-3xl font-medium text-text tracking-tight mb-2">
            Built for exam aspirants and everyday typists
          </h2>
          <p className="text-sm text-text-muted">
            Structured practice from home-row basics to high-speed Hindi court dictation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 border border-border rounded-card bg-surface divide-y md:divide-y-0 overflow-hidden shadow-subtle">
          <div className="p-6 md:border-b md:border-r border-border">
            <div className="flex items-center gap-2 text-text mb-2">
              <ShieldCheck className="w-4 h-4 text-text-muted" strokeWidth={1.5} />
              <h3 className="text-sm font-medium text-text">Government exam aspirants</h3>
            </div>
            <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
              SSC CHSL, High Court, and CPCT candidates practicing under real time limits, disabled-backspace toggles, and mistake rules.
            </p>
          </div>

          <div className="p-6 md:border-b border-border">
            <div className="flex items-center gap-2 text-text mb-2">
              <Layers className="w-4 h-4 text-text-muted" strokeWidth={1.5} />
              <h3 className="text-sm font-medium text-text">Hindi typists</h3>
            </div>
            <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
              Learners mastering BIS Inscript and Remington Gail directly in the browser without installing legacy Krutidev fonts.
            </p>
          </div>

          <div className="p-6 md:border-r border-border">
            <div className="flex items-center gap-2 text-text mb-2">
              <Users className="w-4 h-4 text-text-muted" strokeWidth={1.5} />
              <h3 className="text-sm font-medium text-text">Students and job seekers</h3>
            </div>
            <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
              Beginners building touch-typing accuracy across letters, numbers, and punctuation for clerical and data-entry roles.
            </p>
          </div>

          <div className="p-6">
            <div className="flex items-center gap-2 text-text mb-2">
              <Terminal className="w-4 h-4 text-text-muted" strokeWidth={1.5} />
              <h3 className="text-sm font-medium text-text">Office and legal professionals</h3>
            </div>
            <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
              Stenographers, clerks, and writers raising steady speed from 30 WPM to 60+ WPM with targeted weak-key drills.
            </p>
          </div>
        </div>
      </section>

      {/* Section 2: How It Works (Clean Hairline Columns) */}
      <section className="mb-20 md:mb-24">
        <h2 className="text-2xl sm:text-3xl font-medium text-text tracking-tight mb-8">
          How practice progresses
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="border-t-2 border-accent pt-4">
            <div className="font-mono tabular-nums text-xs text-accent mb-2">01</div>
            <h3 className="text-base font-medium text-text mb-1.5">Pick your keyboard track</h3>
            <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
              Switch anytime between English QWERTY, Hindi Inscript (government standard), and Hindi Remington Gail.
            </p>
          </div>

          <div className="border-t border-border pt-4">
            <div className="font-mono tabular-nums text-xs text-text-muted mb-2">02</div>
            <h3 className="text-base font-medium text-text mb-1.5">Build accuracy first</h3>
            <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
              Follow the finger guide on progressive home-row to conjunct drills for ten minutes a day.
            </p>
          </div>

          <div className="border-t border-border pt-4">
            <div className="font-mono tabular-nums text-xs text-text-muted mb-2">03</div>
            <h3 className="text-base font-medium text-text mb-1.5">Test under exam rules</h3>
            <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
              Run 10 to 15-minute mock papers with full and half mistake scoring and exportable speed certificates.
            </p>
          </div>
        </div>
      </section>

      {/* Section 3: Product Deep-Dives */}
      <section className="space-y-16 mb-20 md:mb-24">
        {/* Feature 1: Hindi Inscript & Remington Gail */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6">
            <p className="text-xs font-medium text-accent mb-2">Devanagari typing engine</p>
            <h3 className="text-2xl sm:text-3xl font-medium text-text tracking-tight mb-3">
              Native Inscript and Remington Gail in pure Unicode
            </h3>
            <p className="text-sm text-text-muted leading-relaxed mb-4">
              Online forms often break Krutidev typing rules. Our engine converts standard QWERTY presses directly into valid Unicode Devanagari, handling pre-base chhoti-ee matras, half letters, reph (र्), and conjuncts cleanly.
            </p>
            <a href="#/lessons" className="inline-flex items-center gap-1.5 text-xs font-medium text-accent hover:underline">
              <span>Explore Hindi courses</span>
              <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
            </a>
          </div>

          <div className="lg:col-span-6">
            <div className="p-5 sm:p-6 rounded-card bg-surface border border-border shadow-subtle">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-text-muted pb-3 border-b border-border mb-4">
                <span>Remington Gail · Pre-base matra</span>
                <div className="inline-flex items-center gap-1.5 font-mono text-text">
                  <kbd className="keycap px-2 py-0.5 text-xs">f</kbd>
                  <span className="text-text-muted">+</span>
                  <kbd className="keycap px-2 py-0.5 text-xs">k</kbd>
                  <span className="text-text-muted">→</span>
                  <span className="font-hindi text-sm font-medium text-accent">कि</span>
                </div>
              </div>
              <div className="font-hindi text-xl text-text leading-[2] p-4 bg-surface-2 rounded-btn border border-border">
                निरंतर अभ्यास और शुद्धता से ही परीक्षा में उच्च गति प्राप्त होती है।
              </div>
            </div>
          </div>
        </div>

        {/* Feature 2: Government Exam Simulator */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 order-2 lg:order-1">
            <div className="p-5 sm:p-6 rounded-card bg-surface border border-border shadow-subtle space-y-4">
              <div className="flex justify-between items-center text-xs pb-3 border-b border-border">
                <span className="font-medium text-text">SSC CHSL Skill Test Scorecard</span>
                <span className="px-2 py-0.5 rounded-key text-xs font-medium text-accent bg-accent-soft border border-accent/20">
                  Qualified
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3 text-left text-xs">
                <div className="p-3 bg-surface-2 rounded-btn border border-border">
                  <span className="text-xs text-text-muted block mb-1">Net speed</span>
                  <span className="font-mono text-lg font-medium tabular-nums text-text">38.4 WPM</span>
                </div>
                <div className="p-3 bg-surface-2 rounded-btn border border-border">
                  <span className="text-xs text-text-muted block mb-1">Mistakes</span>
                  <span className="font-mono text-lg font-medium tabular-nums text-error">2 full</span>
                </div>
                <div className="p-3 bg-surface-2 rounded-btn border border-border">
                  <span className="text-xs text-text-muted block mb-1">Error rate</span>
                  <span className="font-mono text-lg font-medium tabular-nums text-accent">3.2%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 order-1 lg:order-2">
            <p className="text-xs font-medium text-accent mb-2">Exam console</p>
            <h3 className="text-2xl sm:text-3xl font-medium text-text tracking-tight mb-3">
              Dual-box TCS iON pattern simulator
            </h3>
            <p className="text-sm text-text-muted leading-relaxed mb-4">
              Practice in the same layout used at testing centers: reference passage on top, typing pane below, live timer countdown, no spell-check, and post-test breakdown of full vs. half mistakes.
            </p>
            <a href="#/exams" className="text-xs font-medium text-accent hover:underline inline-flex items-center gap-1.5">
              <span>Try exam simulator</span>
              <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
            </a>
          </div>
        </div>
      </section>

      {/* Section 4: Target Exams List */}
      <section className="mb-20 md:mb-24 p-6 sm:p-8 rounded-card bg-surface border border-border shadow-subtle">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 pb-4 border-b border-border">
          <div>
            <h2 className="text-xl sm:text-2xl font-medium text-text tracking-tight">
              Supported recruitment typing exams
            </h2>
            <p className="text-xs sm:text-sm text-text-muted mt-1">
              Pre-configured speeds, durations, and error rules matched to board notifications
            </p>
          </div>
          <a href="#/exams" className="text-xs font-medium text-accent hover:underline shrink-0">
            Open exam center →
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          {BRAND.exams.map((ex) => (
            <div key={ex.id} className="p-3.5 rounded-btn bg-surface-2 border border-border flex flex-col justify-between gap-1.5">
              <div>
                <span className="font-medium text-text block">{ex.name}</span>
                <span className="text-xs text-text-muted block mt-0.5">{ex.languages.join(' · ')}</span>
              </div>
              <span className="text-xs font-mono tabular-nums text-accent">Minimum {ex.minSpeed} WPM</span>
            </div>
          ))}
        </div>
      </section>

      {/* Section 5: Pricing Preview */}
      <section className="mb-20 md:mb-24">
        <div className="max-w-xl mb-8">
          <h2 className="text-2xl sm:text-3xl font-medium text-text tracking-tight mb-2">
            Simple, honest plans
          </h2>
          <p className="text-sm text-text-muted">
            Begin on the free starter plan or upgrade for full Hindi, exam simulation, and certificates.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="p-6 rounded-card bg-surface border border-border shadow-subtle flex flex-col justify-between">
            <div>
              <div className="text-xs font-medium text-text-muted mb-1">Free starter</div>
              <div className="font-mono tabular-nums text-3xl font-medium text-text mb-2">₹0</div>
              <p className="text-xs text-text-muted mb-5 leading-relaxed">
                First 2 levels of English and Hindi lessons, daily 1-minute speed tests, and Word Bubbles.
              </p>
            </div>
            <Button variant="outline" size="md" onClick={() => { window.location.hash = '#/lessons'; }} className="w-full justify-center">
              Start free
            </Button>
          </div>

          <div className="p-6 rounded-card bg-surface border border-pro ring-1 ring-pro shadow-subtle flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-medium text-pro">Pro yearly</span>
                <span className="text-xs font-medium px-2 py-0.5 rounded-key bg-pro-soft text-pro">Save 58%</span>
              </div>
              <div className="font-mono tabular-nums text-3xl font-medium text-text mb-2">
                ₹499 <span className="text-xs font-sans text-text-muted font-normal">/ year</span>
              </div>
              <p className="text-xs text-text-muted mb-5 leading-relaxed">
                All 17 courses across English and Hindi, unlimited exam simulators, analytics, and QR certificates.
              </p>
            </div>
            <Button
              variant="primary"
              size="md"
              onClick={() => { window.location.hash = '#/pricing'; }}
              className="w-full justify-center !bg-pro hover:opacity-90 text-white"
            >
              View plans
            </Button>
          </div>

          <div className="p-6 rounded-card bg-surface border border-border shadow-subtle flex flex-col justify-between">
            <div>
              <div className="text-xs font-medium text-text-muted mb-1">Exam pack</div>
              <div className="font-mono tabular-nums text-3xl font-medium text-text mb-2">
                ₹249 <span className="text-xs font-sans text-text-muted font-normal">/ 90 days</span>
              </div>
              <p className="text-xs text-text-muted mb-5 leading-relaxed">
                One-time payment for three months of complete Pro access with no recurring auto-debit.
              </p>
            </div>
            <Button variant="secondary" size="md" onClick={() => { window.location.hash = '#/pricing'; }} className="w-full justify-center">
              Explore exam pack
            </Button>
          </div>
        </div>
      </section>

      {/* Hidden Testimonials Section (Placeholder for User to populate later) */}
      <div id="testimonials-placeholder" className="hidden" aria-hidden="true" />

      {/* Section 6: FAQ (Hairline Disclosure List) */}
      <section className="max-w-3xl mb-20">
        <h2 className="text-2xl font-medium text-text tracking-tight mb-6">
          Frequently asked questions
        </h2>

        <div className="border-t border-border divide-y divide-border">
          {FAQ_ITEMS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className="py-4">
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between gap-4 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm font-medium text-text">{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-text-muted shrink-0 transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`}
                    strokeWidth={1.5}
                  />
                </button>
                {isOpen && (
                  <p className="text-xs sm:text-sm text-text-muted leading-relaxed mt-2 pr-6">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Final Call to Action */}
      <div className="p-8 sm:p-10 rounded-card bg-surface border border-border text-center shadow-subtle">
        <h2 className="text-2xl sm:text-3xl font-medium text-text tracking-tight mb-2">
          Start building consistent typing speed today
        </h2>
        <p className="text-sm text-text-muted max-w-lg mx-auto mb-6 leading-relaxed">
          Open the home-row lessons or jump straight into an exam mock console right in your browser.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button
            variant="primary"
            size="lg"
            onClick={() => { window.location.hash = '#/lessons'; }}
          >
            <span>Start practicing free</span>
            <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
          </Button>

          <Button
            variant="secondary"
            size="lg"
            onClick={() => { window.location.hash = '#/exams'; }}
          >
            <span>Open exam simulator</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
