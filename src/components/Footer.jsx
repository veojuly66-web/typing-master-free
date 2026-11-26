import React from 'react';
import { BRAND } from '../config/brand';

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface mt-auto transition-opacity duration-200">
      <div className="max-w-content mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10 text-xs">
          {/* Col 1: Brand & Contact */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-md bg-accent text-white flex items-center justify-center font-bold text-sm select-none">
                P
              </span>
              <span className="font-semibold text-text text-base tracking-tight">
                {BRAND.name}
              </span>
            </div>
            <p className="text-text-muted leading-relaxed max-w-xs">
              {BRAND.description}
            </p>
            <div className="text-2xs text-text-muted pt-1">
              <strong>Support:</strong> {BRAND.contact.email}<br />
              <strong>Helpline:</strong> {BRAND.contact.phone}
            </div>
          </div>

          {/* Col 2: Product & Learn */}
          <div>
            <div className="text-2xs font-semibold uppercase tracking-wider text-text mb-3.5">
              Practice & Courses
            </div>
            <ul className="space-y-2 text-text-muted">
              <li>
                <a href="#/lessons" className="hover:text-text transition-colors">
                  English Touch Typing (5 Levels)
                </a>
              </li>
              <li>
                <a href="#/lessons" className="hover:text-text transition-colors">
                  Hindi Inscript Keyboard Course
                </a>
              </li>
              <li>
                <a href="#/lessons" className="hover:text-text transition-colors">
                  Hindi Remington Gail (Krutidev)
                </a>
              </li>
              <li>
                <a href="#/placement" className="hover:text-text transition-colors">
                  1-Minute Diagnostic Placement
                </a>
              </li>
              <li>
                <a href="#/practice" className="hover:text-text transition-colors">
                  Keybr-style Weak-Key Practice
                </a>
              </li>
              <li>
                <a href="#/games" className="hover:text-text transition-colors">
                  Arcade Games (Speed Race & Bubbles)
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Exams & Tools */}
          <div>
            <div className="text-2xs font-semibold uppercase tracking-wider text-text mb-3.5">
              Exam Simulators
            </div>
            <ul className="space-y-2 text-text-muted">
              <li>
                <a href="#/exams/ssc-typing-test" className="hover:text-text transition-colors">
                  SSC CHSL & CGL Typing Test
                </a>
              </li>
              <li>
                <a href="#/exams/high-court-typing-test" className="hover:text-text transition-colors">
                  High Court ARO / Clerk Exam
                </a>
              </li>
              <li>
                <a href="#/exams/cpct-typing-test" className="hover:text-text transition-colors">
                  MP CPCT Hindi & English Test
                </a>
              </li>
              <li>
                <a href="#/exams/hindi-typing-test" className="hover:text-text transition-colors">
                  Hindi Remington Exam Console
                </a>
              </li>
              <li>
                <a href="#/test" className="hover:text-text transition-colors">
                  1 to 10-Minute Speed Tests
                </a>
              </li>
              <li>
                <a href="#/pricing" className="hover:text-text transition-colors">
                  Plans & Exam Pack (₹249)
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Legal & Razorpay Compliance */}
          <div>
            <div className="text-2xs font-semibold uppercase tracking-wider text-text mb-3.5">
              Company & Legal
            </div>
            <ul className="space-y-2 text-text-muted">
              <li>
                <a href="#/about" className="hover:text-text transition-colors">
                  About Pankaj Typing
                </a>
              </li>
              <li>
                <a href="#/contact" className="hover:text-text transition-colors">
                  Contact Support
                </a>
              </li>
              <li>
                <a href="#/privacy" className="hover:text-text transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#/terms" className="hover:text-text transition-colors">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="#/refund-policy" className="hover:text-text transition-colors font-medium text-accent">
                  Refund & Cancellation Policy
                </a>
              </li>
              <li>
                <a href="#/shipping-policy" className="hover:text-text transition-colors">
                  Shipping & Delivery (Digital)
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-2xs text-text-muted">
          <div>
            © 2026 {BRAND.legalEntity}. Made in Himachal Pradesh, India.
          </div>
          <div className="flex items-center gap-4">
            <span>Razorpay Secured</span>
            <span>·</span>
            <span>Supabase Cloud Sync</span>
            <span>·</span>
            <span>Offline First PWA</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
