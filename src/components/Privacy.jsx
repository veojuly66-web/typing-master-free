import React from 'react';

export default function Privacy() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-semibold text-ink tracking-tight mb-3">
          Privacy Policy
        </h1>
        <p className="text-sm text-ink-muted">
          Last updated: November 2026
        </p>
      </div>

      <div className="bg-paper-surface border border-paper-border rounded-card p-6 sm:p-8 shadow-subtle space-y-6 text-sm text-ink leading-relaxed">
        <section>
          <h2 className="text-base font-semibold text-ink mb-2">No accounts, no tracking</h2>
          <p className="text-ink-muted">
            Pankaj Typing does not require an account or registration. We do not collect your name, email address, IP address, or any personally identifiable information.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-ink mb-2">Local browser storage</h2>
          <p className="text-ink-muted mb-2">
            All your exercise results, lesson completion records, speed test scores, audio settings, and theme choices are stored locally on your device via standard browser <code className="font-mono bg-paper px-1.5 py-0.5 rounded text-xs border border-paper-border">localStorage</code>.
          </p>
          <p className="text-ink-muted">
            This data never leaves your computer and is never transmitted to any external server. You can delete all saved progress at any time by clicking "Reset progress" on the Progress dashboard or clearing your browser cookies and site data.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-ink mb-2">Third-party services</h2>
          <p className="text-ink-muted">
            This website is hosted via GitHub Pages. Web fonts are loaded from Google Fonts (Inter, JetBrains Mono, Source Serif 4). These services may process technical request headers required to serve static assets.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-ink mb-2">Contact</h2>
          <p className="text-ink-muted">
            If you have questions about this policy, please reach out to us at <a href="mailto:contact@example.com" className="text-accent hover:underline">contact@example.com</a>.
          </p>
        </section>
      </div>
    </div>
  );
}