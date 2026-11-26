import React from 'react';
import { Card, Button, Badge } from '../ui';
import { Play, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';

const EXAM_DETAILS = {
  'ssc-typing-test': {
    title: 'SSC CHSL & CGL Typing Skill Test Guide',
    organizer: 'Staff Selection Commission (SSC)',
    speedEnglish: '35 WPM (10,500 KDPH)',
    speedHindi: '30 WPM (9,000 KDPH)',
    duration: '10 minutes for CHSL; 15 minutes for CGL',
    backspace: 'Allowed during examination duration',
    evaluation: 'Full mistakes (omission, substitution of word) deduct 1 full word. Half mistakes (spelling, capitalization, punctuation) deduct 0.5 words.',
    maxError: '7% for Unreserved (General) category; 10% for Reserved categories (OBC, SC, ST, EWS).',
    preparationTips: [
      'Focus on error-free rhythm during the first 2 minutes. Accuracy determines your net speed.',
      'Practice on desktop mechanical keyboards similar to TCS iON test centers.',
      'Use proper finger placement on the home row so you never look down at the keyboard.',
      'Do not rush punctuation and numbers; mistyping them results in penalty deductions.'
    ]
  },
  'high-court-typing-test': {
    title: 'High Court RO / ARO / Clerk Typing Test Guide',
    organizer: 'High Court of Judicature (Allahabad, Patna, Rajasthan)',
    speedEnglish: '30 to 40 WPM (depending on state)',
    speedHindi: '25 to 30 WPM (Remington Gail / Krutidev layout)',
    duration: '10 minutes',
    backspace: 'Restricted / strictly blocked in various High Court test interfaces',
    evaluation: 'Strict accuracy thresholds. More than 5% errors lead to immediate disqualification regardless of speed.',
    maxError: '5% maximum permissible error limit.',
    preparationTips: [
      'Practice in "No Backspace" mode to eliminate the subconscious habit of pressing Backspace.',
      'Master legal terminology: jurisdiction, affidavit, petitioner, appellant, statutory.',
      'For Hindi candidates, practice pre-base matra (ि) combinations diligently.'
    ]
  },
  'cpct-typing-test': {
    title: 'Madhya Pradesh CPCT Exam Pattern & Guide',
    organizer: 'MPSEDC, Bhopal, Madhya Pradesh',
    speedEnglish: '30 WPM (for 50% qualifying score)',
    speedHindi: '20 WPM on Remington Gail (Krutidev font keyboard layout)',
    duration: '15 minutes per typing test section',
    backspace: 'Allowed within current word',
    evaluation: 'Net WPM is computed on the total valid passage transcript. Scaled percentile scorecard is awarded.',
    maxError: '10% max error allowance.',
    preparationTips: [
      'Hindi typing in CPCT uses the Remington Gail keyboard layout.',
      'A score of 20 WPM in Hindi qualifies you for government clerical jobs in Madhya Pradesh.',
      'Take 15-minute simulated mock tests to build sustained muscular stamina.'
    ]
  },
  'hindi-typing-test': {
    title: 'Complete Hindi Typing Test Guide (Inscript & Remington Gail)',
    organizer: 'All Central & State Recruitment Boards',
    speedEnglish: 'N/A',
    speedHindi: '25 to 35 WPM depending on service rules',
    duration: '10 minutes',
    backspace: 'Configurable per exam',
    evaluation: 'Accuracy evaluated by words per minute (word count) or 5-keystroke standard.',
    maxError: '5% to 7%',
    preparationTips: [
      'Decide early between Inscript (Govt of India standard) and Remington Gail (Krutidev layout).',
      'Learn the pre-base rule in Remington: type "f" first for chhoti-ee matra (ि).',
      'Practice typing complex conjuncts (क्ष, त्र, ज्ञ, श्र, द्ध, द्व) daily.'
    ]
  }
};

export default function ExamDetailPage({ slug = 'ssc-typing-test' }) {
  const detail = EXAM_DETAILS[slug] || EXAM_DETAILS['ssc-typing-test'];

  return (
    <div className="max-w-content mx-auto py-10 md:py-16 px-4">
      {/* Breadcrumb / Back button */}
      <a
        href="#/exams"
        className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text font-medium mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.5} />
        <span>Back to All Exams</span>
      </a>

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-text tracking-tight mb-2">
          {detail.title}
        </h1>
        <p className="text-xs sm:text-sm text-text-muted">
          Conducted by <span className="text-text font-medium">{detail.organizer}</span>
        </p>
      </div>

      {/* Grid of Key Exam Parameters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10 text-xs">
        <Card className="p-4">
          <span className="text-xs font-medium text-text-muted block mb-1">Qualifying Speed</span>
          <span className="font-semibold text-sm tabular-nums text-text">{detail.speedEnglish}</span>
        </Card>

        <Card className="p-4">
          <span className="text-xs font-medium text-text-muted block mb-1">Hindi Speed (if opted)</span>
          <span className="font-semibold text-sm tabular-nums text-accent">{detail.speedHindi}</span>
        </Card>

        <Card className="p-4">
          <span className="text-xs font-medium text-text-muted block mb-1">Duration</span>
          <span className="font-semibold text-sm tabular-nums text-text">{detail.duration}</span>
        </Card>

        <Card className="p-4">
          <span className="text-xs font-medium text-text-muted block mb-1">Max Allowed Errors</span>
          <span className="font-semibold text-sm tabular-nums text-error">{detail.maxError}</span>
        </Card>
      </div>

      {/* Evaluation Rules Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6">
            <h2 className="text-base font-semibold text-text mb-3">
              Official Evaluation & Mistake Calculation
            </h2>
            <p className="text-xs sm:text-sm text-text-muted leading-relaxed mb-4">
              {detail.evaluation}
            </p>
            <div className="p-3 bg-surface-2 rounded border border-border text-xs text-text-muted">
              <strong>Backspace Rule:</strong> {detail.backspace}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-base font-semibold text-text mb-3">
              Expert Preparation Tips for this Exam
            </h2>
            <ul className="space-y-2.5 text-xs sm:text-sm text-text-muted">
              {detail.preparationTips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* Right CTA Box */}
        <div className="lg:col-span-5">
          <Card className="p-6 bg-surface border-accent/30">
            <h3 className="text-base font-semibold text-text mb-2">
              Ready to test your speed?
            </h3>
            <p className="text-xs text-text-muted leading-relaxed mb-6">
              Launch our exam simulator configured specifically for this test. Dual-box console with automatic mistake scoring.
            </p>

            <Button
              variant="primary"
              size="lg"
              onClick={() => window.location.href = '#/exams'}
              className="w-full justify-center gap-2 mb-3"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Take Free Mock Test</span>
            </Button>

            <a
              href="#/pricing"
              className="block text-center text-xs text-text-muted hover:text-text font-medium underline"
            >
              Unlock All Government Exam Passages with Pro
            </a>
          </Card>
        </div>
      </div>
    </div>
  );
}
