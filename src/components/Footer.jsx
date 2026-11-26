import React from 'react';

export default function Footer() {
  return (
    <footer className="border-t border-paper-border bg-paper-surface mt-auto">
      <div className="max-w-content mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {/* Col 1: Brand & Description */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-6 rounded-md bg-accent text-white flex items-center justify-center font-bold text-xs select-none">
                P
              </span>
              <span className="font-semibold text-ink text-base tracking-tight">
                Pankaj Typing
              </span>
            </div>
            <p className="text-xs text-ink-muted leading-relaxed max-w-sm">
              Free step-by-step touch typing lessons, speed tests, and arcade typing practice. No sign-up required.
            </p>
          </div>

          {/* Col 2: Practice links */}
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-ink mb-3">
              Practice
            </div>
            <ul className="space-y-2 text-xs text-ink-muted">
              <li>
                <a href="#/lessons" className="hover:text-ink transition-colors">
                  Touch Typing Lessons
                </a>
              </li>
              <li>
                <a href="#/test" className="hover:text-ink transition-colors">
                  1-Minute Speed Test
                </a>
              </li>
              <li>
                <a href="#/games" className="hover:text-ink transition-colors">
                  Arcade Games
                </a>
              </li>
              <li>
                <a href="#/practice" className="hover:text-ink transition-colors">
                  Custom Practice
                </a>
              </li>
              <li>
                <a href="#/progress" className="hover:text-ink transition-colors">
                  Your Progress
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: About & Legal */}
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-ink mb-3">
              Information
            </div>
            <ul className="space-y-2 text-xs text-ink-muted">
              <li>
                <a href="#/about" className="hover:text-ink transition-colors">
                  About Pankaj Typing
                </a>
              </li>
              <li>
                <a href="#/privacy" className="hover:text-ink transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#/contact" className="hover:text-ink transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-6 border-t border-paper-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-ink-muted">
          <div>
            © 2026 Pankaj Typing. Made in Himachal Pradesh, India.
          </div>
          <div>
            Progress stored locally in your browser.
          </div>
        </div>
      </div>
    </footer>
  );
}