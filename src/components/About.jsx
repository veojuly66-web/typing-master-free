import React from 'react';
import { ArrowRight, Check } from 'lucide-react';

export default function About() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-semibold text-ink tracking-tight mb-3">
          About Pankaj Typing
        </h1>
        <p className="text-base text-ink-muted leading-relaxed">
          A calm, focused touch-typing tutor built to help people type faster and with greater comfort.
        </p>
      </div>

      <div className="space-y-6 text-sm text-ink leading-relaxed">
        <div className="bg-paper-surface border border-paper-border rounded-card p-6 shadow-subtle">
          <h2 className="text-base font-semibold text-ink mb-2">Why we built this</h2>
          <p className="text-ink-muted leading-relaxed mb-3">
            Many online typing tools are filled with noisy popups, intrusive ads, confusing paywalls, and fake badges. Typing is a foundational skill for programmers, writers, students, and professionals — learning it should be straightforward, quiet, and reliable.
          </p>
          <p className="text-ink-muted leading-relaxed">
            Pankaj Typing gives you a distraction-free environment inspired by calm paper and ink: real tactile feedback, strict error discipline, and clear step-by-step progress without requiring any account.
          </p>
        </div>

        <div className="bg-paper-surface border border-paper-border rounded-card p-6 shadow-subtle">
          <h2 className="text-base font-semibold text-ink mb-3">Core principles</h2>
          <ul className="space-y-2 text-ink-muted">
            <li className="flex items-start gap-2">
              <span className="text-accent mt-0.5"><Check className="w-4 h-4" /></span>
              <span><strong>100% free and open:</strong> All lessons, speed tests, and games are immediately accessible to everyone.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-0.5"><Check className="w-4 h-4" /></span>
              <span><strong>Private by default:</strong> Your typing stats, test history, and preferences live solely in your browser's local storage.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-0.5"><Check className="w-4 h-4" /></span>
              <span><strong>Proper finger placement:</strong> The virtual keyboard and finger guides reinforce correct physical muscle memory.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-0.5"><Check className="w-4 h-4" /></span>
              <span><strong>Strict error discipline:</strong> The cursor does not advance past mistakes, stopping bad typing habits before they start.</span>
            </li>
          </ul>
        </div>

        <div className="bg-paper-surface border border-paper-border rounded-card p-6 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-ink mb-1">Ready to practice?</h3>
            <p className="text-xs text-ink-muted">Start with Lesson 1 on the home row.</p>
          </div>
          <a
            href="#/lessons"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-btn bg-accent hover:bg-accent-hover text-white text-xs font-medium transition-colors shrink-0"
          >
            <span>Start lessons</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}