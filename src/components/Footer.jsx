import React from 'react';

export default function Footer({ onFocusChange }) {
  return (
    <footer className="border-t border-paper-border bg-paper-surface mt-auto transition-opacity duration-200">
      <div className="max-w-content mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Col 1: Brand & Description */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-md bg-accent text-white flex items-center justify-center font-bold text-sm select-none">
                P
              </span>
              <span className="font-semibold text-ink text-base tracking-tight">
                Pankaj Typing
              </span>
            </div>
            <p className="text-xs text-ink-muted leading-relaxed max-w-xs">
              A calm, focused touch typing tutor. Master the keyboard with progressive drills, 40+ speed tests, and real-time accuracy analytics. Free forever, no registration needed.
            </p>
            <div className="text-[11px] text-ink-muted">
              Built for students, professionals, and keyboard enthusiasts.
            </div>
          </div>

          {/* Col 2: Learn */}
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-ink mb-3.5">
              Learn & Practice
            </div>
            <ul className="space-y-2.5 text-xs text-ink-muted">
              <li>
                <a href="#/lessons" className="hover:text-ink transition-colors">
                  Touch Typing Lessons
                </a>
              </li>
              <li>
                <a href="#/placement" className="hover:text-ink transition-colors">
                  1-Minute Placement Diagnostic
                </a>
              </li>
              <li>
                <a href="#/practice" className="hover:text-ink transition-colors">
                  Adaptive Weak-Key Practice
                </a>
              </li>
              <li>
                <a href="#/practice" className="hover:text-ink transition-colors">
                  Custom Text & Code Drills
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Tools & Games */}
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-ink mb-3.5">
              Tools & Games
            </div>
            <ul className="space-y-2.5 text-xs text-ink-muted">
              <li>
                <a href="#/test" className="hover:text-ink transition-colors">
                  Timed Typing Speed Tests
                </a>
              </li>
              <li>
                <a href="#/games" className="hover:text-ink transition-colors">
                  Arcade Typing Games
                </a>
              </li>
              <li>
                <a href="#/progress" className="hover:text-ink transition-colors">
                  Keyboard Heatmap & Stats
                </a>
              </li>
              <li>
                <a href="#/certificate" className="hover:text-ink transition-colors">
                  Certificate of Typing Speed
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: About & Legal */}
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-ink mb-3.5">
              Information
            </div>
            <ul className="space-y-2.5 text-xs text-ink-muted">
              <li>
                <a href="#/about" className="hover:text-ink transition-colors">
                  About Pankaj Typing
                </a>
              </li>
              <li>
                <a href="#/settings" className="hover:text-ink transition-colors">
                  Settings & Preferences
                </a>
              </li>
              <li>
                <a href="#/privacy" className="hover:text-ink transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#/terms" className="hover:text-ink transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#/contact" className="hover:text-ink transition-colors">
                  Contact Support
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-paper-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-ink-muted">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span>© 2026 Pankaj Typing.</span>
            <span>·</span>
            <span>Made in Himachal Pradesh, India.</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>100% client-side</span>
            <span>·</span>
            <span>Works offline</span>
            <span>·</span>
            <span>No data collection</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
