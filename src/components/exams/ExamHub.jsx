import React from 'react';
import { EXAM_PRESETS } from '../../data/exams';
import { Card, Button, Badge } from '../ui';
import { ArrowRight, CheckCircle2, ShieldCheck, Clock, Award } from 'lucide-react';

export default function ExamHub() {
  const examGuides = [
    {
      id: 'ssc-typing-test',
      title: 'SSC CHSL & CGL Typing Test Format',
      slug: '#/exams/ssc-typing-test',
      examId: 'ssc-chsl-en',
      speed: '35 WPM English / 30 WPM Hindi',
      duration: '10 / 15 Minutes',
      description: 'Complete guide to the Staff Selection Commission skill test criteria, key depressions per hour (KDPH), and error calculation formulas.'
    },
    {
      id: 'high-court-typing-test',
      title: 'High Court Clerk & ARO Typing Test Format',
      slug: '#/exams/high-court-typing-test',
      examId: 'allahabad-hc-en',
      speed: '30 WPM English / 25 WPM Hindi',
      duration: '10 Minutes',
      description: 'Everything you need to know about High Court typing assessments (Allahabad, Patna, Rajasthan). Legal passages with strict evaluation.'
    },
    {
      id: 'cpct-typing-test',
      title: 'MP CPCT Exam Pattern & Remington Hindi',
      slug: '#/exams/cpct-typing-test',
      examId: 'cpct-mp',
      speed: '20 WPM Hindi / 30 WPM English',
      duration: '15 Minutes',
      description: 'Prepare for Madhya Pradesh Computer Proficiency Certification Test with Remington Gail layout drills and timed scorecards.'
    },
    {
      id: 'hindi-typing-test',
      title: 'Hindi Typing Test (Inscript & Remington Gail)',
      slug: '#/exams/hindi-typing-test',
      examId: 'ssc-chsl-hi',
      speed: '25 - 35 WPM',
      duration: '5 - 15 Minutes',
      description: 'Master pre-base matras (ि), half letters, reph, and conjuncts on standard Krutidev and Inscript layouts.'
    }
  ];

  return (
    <div className="max-w-content mx-auto py-10 md:py-16 px-4">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-3xl sm:text-4xl font-semibold text-text tracking-tight mb-3">
          Government Typing Exam Center
        </h1>
        <p className="text-sm sm:text-base text-text-muted max-w-2xl leading-relaxed">
          Detailed exam criteria, error evaluation formulas, and interactive mock tests for SSC, High Courts, CPCT, and state clerical recruitment tests.
        </p>
      </div>

      {/* Guide Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        {examGuides.map((guide) => (
          <Card key={guide.id} className="p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-text-muted mb-2">
                <span className="font-medium text-accent">Exam Syllabus</span>
                <span className="font-mono tabular-nums">{guide.duration}</span>
              </div>

              <h2 className="text-lg font-semibold text-text mb-2">
                {guide.title}
              </h2>

              <p className="text-xs sm:text-sm text-text-muted leading-relaxed mb-4">
                {guide.description}
              </p>

              <div className="inline-block px-2.5 py-1 rounded-key bg-surface-2 text-2xs font-medium text-text mb-6">
                Qualifying: <strong className="font-semibold text-accent">{guide.speed}</strong>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border">
              <a
                href={guide.slug}
                className="text-xs font-semibold text-accent hover:text-accent-hover inline-flex items-center gap-1"
              >
                <span>Read Exam Guide & Rules</span>
                <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
              </a>

              <a
                href="#/exams"
                className="text-xs font-medium text-text-muted hover:text-text underline"
              >
                Launch Mock
              </a>
            </div>
          </Card>
        ))}
      </div>

      {/* Real Evaluation Rules Comparison Table */}
      <section className="bg-surface border border-border rounded-card p-6 sm:p-8">
        <h2 className="text-xl font-semibold text-text tracking-tight mb-2">
          Official Error Evaluation Rules Summary
        </h2>
        <p className="text-xs sm:text-sm text-text-muted mb-6">
          How mistakes are counted in major government examinations
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-border text-text-muted">
                <th className="py-2.5 px-3 font-semibold">Exam Name</th>
                <th className="py-2.5 px-3 font-semibold">Language / Layout</th>
                <th className="py-2.5 px-3 font-semibold">Min Speed</th>
                <th className="py-2.5 px-3 font-semibold">Duration</th>
                <th className="py-2.5 px-3 font-semibold">Backspace Rule</th>
                <th className="py-2.5 px-3 font-semibold">Error Allowance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="py-3 px-3 font-semibold text-text">SSC CHSL / CGL</td>
                <td className="py-3 px-3 text-text-muted">English (QWERTY) / Hindi (Inscript or Remington)</td>
                <td className="py-3 px-3 font-mono text-accent">35 / 30 WPM</td>
                <td className="py-3 px-3 text-text-muted">10 / 15 min</td>
                <td className="py-3 px-3 text-text-muted">Allowed</td>
                <td className="py-3 px-3 text-text-muted">7% UR / 10% Reserved</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold text-text">Allahabad High Court</td>
                <td className="py-3 px-3 text-text-muted">English / Hindi (Remington Gail)</td>
                <td className="py-3 px-3 font-mono text-accent">30 / 25 WPM</td>
                <td className="py-3 px-3 text-text-muted">10 min</td>
                <td className="py-3 px-3 text-text-muted">Blocked in strict mode</td>
                <td className="py-3 px-3 text-text-muted">5% maximum</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold text-text">MP CPCT</td>
                <td className="py-3 px-3 text-text-muted">Hindi (Remington Gail) & English</td>
                <td className="py-3 px-3 font-mono text-accent">20 / 30 WPM</td>
                <td className="py-3 px-3 text-text-muted">15 min each</td>
                <td className="py-3 px-3 text-text-muted">Allowed</td>
                <td className="py-3 px-3 text-text-muted">Scaled Scorecard</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold text-text">Patna High Court</td>
                <td className="py-3 px-3 text-text-muted">English</td>
                <td className="py-3 px-3 font-mono text-accent">40 WPM</td>
                <td className="py-3 px-3 text-text-muted">10 min</td>
                <td className="py-3 px-3 text-text-muted">Allowed</td>
                <td className="py-3 px-3 text-text-muted">5% maximum</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
