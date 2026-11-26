import React, { useState, useEffect } from 'react';
import { COURSES } from '../data/courses';
import { BRAND } from '../config/brand';
import { Storage } from '../lib/storage';
import { useAuth } from '../lib/auth';
import { Card, Button, Badge } from './ui';
import { ArrowRight, Check, Play, ShieldCheck, Award, Zap, Brain, Target, Users, BookOpen, Layers } from 'lucide-react';

const FAQ_ITEMS = [
  {
    q: 'Is Pankaj Typing free to use?',
    a: 'Yes. Our Free Starter plan requires no login or credit card. It includes the first 2 levels of English courses, first 2 levels of Hindi courses, daily 1-minute speed tests, and basic progress tracking.'
  },
  {
    q: 'How does Hindi typing work? Do I need to install Krutidev or Inscript fonts?',
    a: 'No font or IME installation is required. Our engine runs directly in your browser and automatically maps standard English QWERTY keyboard presses to Unicode Hindi characters for both Inscript and Remington Gail layouts. It even handles pre-base matras (ि) and complex conjuncts.'
  },
  {
    q: 'Which government exams are supported?',
    a: 'We have dedicated mock test simulators configured according to the official criteria of SSC CHSL, SSC CGL, High Courts (Allahabad, Patna, Rajasthan), MP CPCT, and State Clerk / DEO exams.'
  },
  {
    q: 'What is the evaluation formula for government typing tests?',
    a: 'Our exam simulator replicates official evaluation rules: full mistakes (missing or substituted words) and half mistakes (spacing, punctuation, capitalization) are scored separately, calculating your official Net WPM and Error Percentage.'
  },
  {
    q: 'What is included in the Pro plan?',
    a: 'Pro unlocks all 5 English course levels, all 6 Hindi Inscript levels, all 6 Hindi Remington Gail levels, unlimited exam mock tests, 1 to 10-minute speed tests, weak-key adaptive drills, arcade games, and verifiable certificates.'
  }
];

export default function Home({ onNavigate, completedLessons = {} }) {
  const { user, isProUser } = useAuth();

  // Dual Language Auto-typing Demo
  const demoSnippets = [
    { text: 'Keep your fingers resting on the home row keys.', lang: 'English' },
    { text: 'अभ्यास से ही टाइपिंग में गति और शुद्धता आती है।', lang: 'हिंदी रेमिंगटन गेल' }
  ];

  const [currentSnippetIdx, setCurrentSnippetIdx] = useState(0);
  const [demoCharIndex, setDemoCharIndex] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);

  const activeSnippet = demoSnippets[currentSnippetIdx];

  useEffect(() => {
    const timer = setInterval(() => {
      setDemoCharIndex(prev => {
        if (prev >= activeSnippet.text.length) {
          // Switch snippet after a pause
          setTimeout(() => {
            setCurrentSnippetIdx(s => (s + 1) % demoSnippets.length);
            setDemoCharIndex(0);
          }, 800);
          return prev;
        }
        return prev + 1;
      });
    }, 120);

    return () => clearInterval(timer);
  }, [activeSnippet.text.length]);

  // Returning user status
  const allLessons = COURSES.flatMap(c => c.lessons);
  const nextUnfinishedLesson = allLessons.find(l => !completedLessons[l.id]) || allLessons[0];
  const completedList = Object.values(completedLessons);
  const isReturningUser = completedList.length > 0;

  return (
    <div className="max-w-content mx-auto px-4 py-10 md:py-16">
      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-16 md:mb-24">
        <div className="lg:col-span-7">
          <div className="inline-flex items-center gap-1.5 mb-3">
            <Badge variant="accent">English & Hindi Typing Platform</Badge>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-text tracking-tight leading-[1.18] mb-5">
            Typing practice that gets you exam-ready — in English and Hindi.
          </h1>

          <p className="text-base sm:text-lg text-text-muted mb-8 leading-relaxed max-w-xl">
            Step-by-step touch-typing courses, realistic government exam simulators (SSC, High Court, CPCT), and detailed error feedback. Start free.
          </p>

          {/* Returning User Continue Card OR Dual CTAs */}
          {isReturningUser ? (
            <Card className="p-5 max-w-lg mb-6 border-accent/30 bg-surface">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xs font-semibold uppercase tracking-wider text-accent">
                  Welcome back · Continue Learning
                </span>
                <span className="text-xs font-mono text-text-muted">
                  {completedList.length} of {allLessons.length} drills done
                </span>
              </div>

              <div className="flex items-center justify-between gap-4">
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
            </Card>
          ) : (
            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="primary"
                size="lg"
                onClick={() => { window.location.hash = '#/lessons'; }}
              >
                <span>Start Free</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>

              <Button
                variant="secondary"
                size="lg"
                onClick={() => { window.location.hash = '#/test'; }}
              >
                <span>Take a Free Speed Test</span>
              </Button>
            </div>
          )}

          <div className="flex items-center gap-5 mt-6 text-2xs text-text-muted">
            <span className="flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-accent" />
              <span>No credit card required</span>
            </span>
            <span className="flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-accent" />
              <span>Inscript & Remington Gail</span>
            </span>
            <span className="flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-accent" />
              <span>7-Day Pro Trial</span>
            </span>
          </div>
        </div>

        {/* Hero Right: Bilingual Auto-typing Demo */}
        <div className="lg:col-span-5">
          <Card className="p-6 bg-surface shadow-subtle border-border">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-border text-xs text-text-muted">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent" />
                <span className="font-medium text-text">{activeSnippet.lang} Live Demo</span>
              </div>
              <span className="font-mono text-accent">52 WPM · 98% Acc</span>
            </div>

            <div className={`${activeSnippet.lang.includes('हिंदी') ? 'font-hindi text-xl leading-[2]' : 'font-mono text-base leading-relaxed'} min-h-[90px] select-none text-text`}>
              <span>{activeSnippet.text.slice(0, demoCharIndex)}</span>
              <span className="inline-block w-2 h-5 bg-text align-middle ml-0.5 caret-pulse" />
              <span className="text-text-muted/40">{activeSnippet.text.slice(demoCharIndex)}</span>
            </div>

            <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-2xs text-text-muted">
              <span>Home row finger guidance active</span>
              <span className="text-accent font-medium">Automatic layout mapping</span>
            </div>
          </Card>
        </div>
      </div>

      {/* Section 1: Who It's For */}
      <section className="mb-16 md:mb-24">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-semibold text-text tracking-tight mb-2">
            Built for serious aspirants and professionals
          </h2>
          <p className="text-xs sm:text-sm text-text-muted">
            Whether you are preparing for a government clerical exam or building daily typing speed.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5">
            <div className="w-10 h-10 rounded bg-accent-soft text-accent flex items-center justify-center mb-3">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-text mb-1">Government Aspirants</h3>
            <p className="text-xs text-text-muted leading-relaxed">
              SSC CHSL, High Court, and CPCT candidates practicing under strict exam conditions and mistake thresholds.
            </p>
          </Card>

          <Card className="p-5">
            <div className="w-10 h-10 rounded bg-accent-soft text-accent flex items-center justify-center mb-3">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-text mb-1">Hindi Typists</h3>
            <p className="text-xs text-text-muted leading-relaxed">
              Learners mastering Inscript and Remington Gail without installing third-party font packs or complex software.
            </p>
          </Card>

          <Card className="p-5">
            <div className="w-10 h-10 rounded bg-accent-soft text-accent flex items-center justify-center mb-3">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-text mb-1">Students & Job Seekers</h3>
            <p className="text-xs text-text-muted leading-relaxed">
              High school and college students acquiring touch-typing skills to qualify for clerical and data entry positions.
            </p>
          </Card>

          <Card className="p-5">
            <div className="w-10 h-10 rounded bg-accent-soft text-accent flex items-center justify-center mb-3">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-text mb-1">Office Professionals</h3>
            <p className="text-xs text-text-muted leading-relaxed">
              Court stenographers, legal assistants, and clerks boosting speed from 30 WPM to 60+ WPM effortlessly.
            </p>
          </Card>
        </div>
      </section>

      {/* Section 2: How It Works */}
      <section className="mb-16 md:mb-24">
        <h2 className="text-2xl sm:text-3xl font-semibold text-text tracking-tight mb-8 text-center">
          How Pankaj Typing works
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="font-mono text-2xl font-bold text-accent mb-2">01</div>
            <h3 className="text-base font-semibold text-text mb-2">Choose your track & layout</h3>
            <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
              Practice in English (QWERTY), Hindi Inscript (Govt standard), or Hindi Remington Gail (Krutidev exam layout).
            </p>
          </Card>

          <Card className="p-6">
            <div className="font-mono text-2xl font-bold text-accent mb-2">02</div>
            <h3 className="text-base font-semibold text-text mb-2">Build muscle memory daily</h3>
            <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
              Ten minutes a day with stop-on-error discipline cements correct finger positions and eliminates glancing down.
            </p>
          </Card>

          <Card className="p-6">
            <div className="font-mono text-2xl font-bold text-accent mb-2">03</div>
            <h3 className="text-base font-semibold text-text mb-2">Simulate official exams</h3>
            <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
              Take full 10 to 15-minute mock tests with real full/half mistake deductions and verifiable speed certificates.
            </p>
          </Card>
        </div>
      </section>

      {/* Section 3: Feature Blocks with Real UI Previews */}
      <section className="space-y-12 mb-16 md:mb-24">
        {/* Feature 1: Hindi Inscript & Remington Gail */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6">
            <Badge variant="accent" className="mb-2">Hindi Specialization</Badge>
            <h3 className="text-2xl sm:text-3xl font-semibold text-text tracking-tight mb-3">
              True Inscript & Remington Gail Typing — In Pure Unicode
            </h3>
            <p className="text-xs sm:text-sm text-text-muted leading-relaxed mb-4">
              Most online tutors fail at Hindi because they require legacy Krutidev fonts or broken character sequences. Pankaj Typing handles the pre-base rule (typing 'f' before the letter for chhoti-ee matra), half-letters, reph (र्), and complex conjuncts natively.
            </p>
            <div className="flex items-center gap-3 text-xs font-semibold text-accent">
              <a href="#/lessons" className="inline-flex items-center gap-1 hover:underline">
                <span>Explore Hindi Courses</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="p-5 rounded-card bg-surface-2 border border-border">
              <div className="flex justify-between text-2xs text-text-muted pb-2 border-b border-border mb-3 font-mono">
                <span>REMIN_GAIL_KEYMAP</span>
                <span className="text-accent">f + k = कि</span>
              </div>
              <div className="font-hindi text-xl text-text leading-[2] p-3 bg-surface rounded border border-border">
                प्रधानमंत्री ने राष्ट्र के नाम संदेश में आत्मनिर्भर भारत के संकल्प को दोहराया।
              </div>
            </div>
          </div>
        </div>

        {/* Feature 2: Government Exam Simulator */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 order-2 lg:order-1">
            <div className="p-5 rounded-card bg-surface border border-border shadow-subtle space-y-3">
              <div className="flex justify-between items-center text-xs pb-2 border-b border-border">
                <span className="font-semibold text-text">SSC CHSL Mock Test</span>
                <span className="text-2xs font-bold text-accent bg-accent-soft px-2 py-0.5 rounded">QUALIFIED</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 bg-surface-2 rounded">
                  <span className="text-2xs text-text-muted block">Net WPM</span>
                  <span className="font-mono text-lg font-bold text-text">38.4</span>
                </div>
                <div className="p-2 bg-surface-2 rounded">
                  <span className="text-2xs text-text-muted block">Full Mistakes</span>
                  <span className="font-mono text-lg font-bold text-error">2</span>
                </div>
                <div className="p-2 bg-surface-2 rounded">
                  <span className="text-2xs text-text-muted block">Error %</span>
                  <span className="font-mono text-lg font-bold text-accent">3.2%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 order-1 lg:order-2">
            <Badge variant="accent" className="mb-2">Exam Simulator</Badge>
            <h3 className="text-2xl sm:text-3xl font-semibold text-text tracking-tight mb-3">
              Official-Pattern TCS iON Dual-Box Simulator
            </h3>
            <p className="text-xs sm:text-sm text-text-muted leading-relaxed mb-4">
              Practice in the exact interface used by exam centers: passage box on top, typing box below, timer countdown, and no live spell check. Get detailed evaluation with full and half mistake calculations.
            </p>
            <a href="#/exams" className="text-xs font-semibold text-accent hover:underline inline-flex items-center gap-1">
              <span>Try Exam Simulator</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </section>

      {/* Section 4: Target Exams List */}
      <section className="mb-16 md:mb-24 p-8 rounded-card bg-surface border border-border">
        <div className="text-center max-w-xl mx-auto mb-8">
          <Badge variant="accent" className="mb-2">Recruitment Coverage</Badge>
          <h2 className="text-2xl font-semibold text-text tracking-tight">
            Government Exams We Support
          </h2>
          <p className="text-xs text-text-muted mt-1">
            Presets configured according to standard recruitment criteria:
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-xs">
          {BRAND.exams.map((ex) => (
            <div key={ex.id} className="p-3 rounded bg-surface-2 border border-border">
              <span className="font-semibold text-text block mb-0.5">{ex.name}</span>
              <span className="text-2xs text-text-muted block">{ex.languages.join(' · ')}</span>
              <span className="text-2xs font-mono text-accent mt-1 block">Min: {ex.minSpeed} WPM</span>
            </div>
          ))}
        </div>
      </section>

      {/* Section 5: Pricing Preview */}
      <section className="mb-16 md:mb-24 text-center">
        <div className="max-w-xl mx-auto mb-8">
          <Badge variant="accent" className="mb-2">Affordable Plans</Badge>
          <h2 className="text-2xl sm:text-3xl font-semibold text-text tracking-tight mb-2">
            Simple, honest pricing for students
          </h2>
          <p className="text-xs sm:text-sm text-text-muted">
            Start completely free, or unlock the full Pro curriculum starting at just ₹99/month.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto text-left">
          <Card className="p-6 flex flex-col justify-between">
            <div>
              <div className="text-2xs font-semibold uppercase tracking-wider text-text-muted mb-1">Free Plan</div>
              <div className="font-mono text-3xl font-bold text-text mb-2">₹0</div>
              <p className="text-xs text-text-muted mb-4">First 2 levels of English & Hindi lessons, daily speed tests.</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => window.location.href = '#/lessons'} className="w-full justify-center">
              Start Free
            </Button>
          </Card>

          <Card className="p-6 flex flex-col justify-between border-pro ring-1 ring-pro bg-surface">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-2xs font-bold uppercase tracking-wider text-pro">Pro Yearly</span>
                <span className="text-2xs font-bold px-2 py-0.5 rounded bg-pro-soft text-pro">Save 58%</span>
              </div>
              <div className="font-mono text-3xl font-bold text-text mb-2">₹499 <span className="text-xs font-sans text-text-muted">/ yr</span></div>
              <p className="text-xs text-text-muted mb-4">Everything unlocked for 12 months. All exam simulators & certificates.</p>
            </div>
            <Button variant="primary" size="sm" onClick={() => window.location.href = '#/pricing'} className="w-full justify-center !bg-pro text-white">
              View All Plans
            </Button>
          </Card>

          <Card className="p-6 flex flex-col justify-between">
            <div>
              <div className="text-2xs font-semibold uppercase tracking-wider text-text-muted mb-1">Exam Pack</div>
              <div className="font-mono text-3xl font-bold text-text mb-2">₹249 <span className="text-xs font-sans text-text-muted">/ 90 days</span></div>
              <p className="text-xs text-text-muted mb-4">One-time payment for 3 months. No recurring debit mandate.</p>
            </div>
            <Button variant="secondary" size="sm" onClick={() => window.location.href = '#/pricing'} className="w-full justify-center">
              Explore Exam Pack
            </Button>
          </Card>
        </div>
      </section>

      {/* Hidden Testimonials Section (Placeholder for User to populate later) */}
      <div id="testimonials-placeholder" className="hidden" aria-hidden="true">
        {/* Fill with real verified student reviews once published */}
      </div>

      {/* Section 6: FAQ */}
      <section className="max-w-2xl mx-auto mb-16">
        <h2 className="text-2xl font-semibold text-text tracking-tight mb-6 text-center">
          Frequently Asked Questions
        </h2>

        <div className="space-y-3">
          {FAQ_ITEMS.map((faq, idx) => (
            <Card key={idx} className="p-4">
              <h3 className="text-sm font-semibold text-text mb-1">{faq.q}</h3>
              <p className="text-xs text-text-muted leading-relaxed">{faq.a}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Final Call to Action */}
      <div className="p-8 sm:p-12 rounded-card bg-surface border border-accent/30 text-center max-w-3xl mx-auto shadow-subtle">
        <h2 className="text-2xl sm:text-3xl font-semibold text-text tracking-tight mb-2">
          Ready to build your typing velocity?
        </h2>
        <p className="text-xs sm:text-sm text-text-muted max-w-lg mx-auto mb-6 leading-relaxed">
          Start practicing in your browser right now. No account required to begin.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button
            variant="primary"
            size="lg"
            onClick={() => window.location.href = '#/lessons'}
          >
            <span>Start Learning for Free</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>

          <Button
            variant="secondary"
            size="lg"
            onClick={() => window.location.href = '#/exams'}
          >
            <span>Simulate Exam Test</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
