import React from 'react';
import { BRAND } from '../config/brand';

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface mt-auto">
      <div className="max-w-content mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10 text-xs">
          {/* Col 1: Brand & Contact */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="keycap w-7 h-7 text-accent font-medium text-sm select-none">
                P
              </span>
              <span className="font-medium text-text text-base tracking-tight">
                {BRAND.name}
              </span>
            </div>
            <p className="text-text-muted leading-relaxed max-w-xs">
              {BRAND.description}
            </p>
            <div className="text-xs text-text-muted pt-1 space-y-1">
              <div>Support: {BRAND.contact.email}</div>
              <div>Helpline: {BRAND.contact.phone}</div>
            </div>
          </div>

          {/* Col 2: Practice & Courses */}
          <div>
            <div className="text-xs font-medium text-text mb-3">
              Practice &amp; courses
            </div>
            <ul className="space-y-2 text-text-muted">
              <li>
                <a href="#/lessons" className="hover:text-text transition-colors">
                  English touch typing (5 levels)
                </a>
              </li>
              <li>
                <a href="#/lessons" className="hover:text-text transition-colors">
                  Hindi Inscript keyboard course
                </a>
              </li>
              <li>
                <a href="#/lessons" className="hover:text-text transition-colors">
                  Hindi Remington Gail (Krutidev)
                </a>
              </li>
              <li>
                <a href="#/placement" className="hover:text-text transition-colors">
                  1-minute placement check
                </a>
              </li>
              <li>
                <a href="#/practice" className="hover:text-text transition-colors">
                  Adaptive weak-key practice
                </a>
              </li>
              <li>
                <a href="#/games" className="hover:text-text transition-colors">
                  Typing games
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Exam Simulators */}
          <div>
            <div className="text-xs font-medium text-text mb-3">
              Exam simulators
            </div>
            <ul className="space-y-2 text-text-muted">
              <li>
                <a href="#/exams/ssc-typing-test" className="hover:text-text transition-colors">
                  SSC CHSL &amp; CGL typing test
                </a>
              </li>
              <li>
                <a href="#/exams/high-court-typing-test" className="hover:text-text transition-colors">
                  High Court ARO / Clerk exam
                </a>
              </li>
              <li>
                <a href="#/exams/cpct-typing-test" className="hover:text-text transition-colors">
                  MP CPCT Hindi &amp; English test
                </a>
              </li>
              <li>
                <a href="#/exams/hindi-typing-test" className="hover:text-text transition-colors">
                  Hindi Remington exam console
                </a>
              </li>
              <li>
                <a href="#/test" className="hover:text-text transition-colors">
                  1 to 10-minute speed tests
                </a>
              </li>
              <li>
                <a href="#/pricing" className="hover:text-text transition-colors">
                  Plans &amp; exam pack (₹249)
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Company & Legal */}
          <div>
            <div className="text-xs font-medium text-text mb-3">
              Company &amp; legal
            </div>
            <ul className="space-y-2 text-text-muted">
              <li>
                <a href="#/about" className="hover:text-text transition-colors">
                  About Pankaj Typing
                </a>
              </li>
              <li>
                <a href="#/contact" className="hover:text-text transition-colors">
                  Contact support
                </a>
              </li>
              <li>
                <a href="#/privacy" className="hover:text-text transition-colors">
                  Privacy policy
                </a>
              </li>
              <li>
                <a href="#/terms" className="hover:text-text transition-colors">
                  Terms &amp; conditions
                </a>
              </li>
              <li>
                <a href="#/refund-policy" className="hover:text-text transition-colors">
                  Refund &amp; cancellation policy
                </a>
              </li>
              <li>
                <a href="#/shipping-policy" className="hover:text-text transition-colors">
                  Digital delivery policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-text-muted">
          <div>
            © 2026 {BRAND.legalEntity}. Himachal Pradesh, India.
          </div>
          <div className="flex items-center gap-3">
            <span>Razorpay payments</span>
            <span>·</span>
            <span>Supabase cloud sync</span>
            <span>·</span>
            <span>Offline capable</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
