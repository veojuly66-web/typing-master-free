import React from 'react';
import { Card } from './ui';

export default function Terms() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-semibold text-text tracking-tight mb-3">
          Terms of Service
        </h1>
        <p className="text-sm text-text-muted">
          Last updated: November 2026
        </p>
      </div>

      <Card className="p-6 sm:p-8 space-y-6 text-sm text-text leading-relaxed">
        <section>
          <h2 className="text-base font-semibold text-text mb-2">1. Free Usage</h2>
          <p className="text-text-muted">
            Pankaj Typing is provided 100% free of charge for personal, educational, and commercial learning purposes. No payment, registration, or subscription is required to access any feature.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-text mb-2">2. Local Browser Storage</h2>
          <p className="text-text-muted">
            All curriculum progress, test scores, custom exercises, and user preferences are stored strictly on your local device via browser storage. You retain complete control over your data and may clear or export it at any time.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-text mb-2">3. Disclaimers</h2>
          <p className="text-text-muted">
            The software and certificates of completion are provided "as is", without warranty of any kind. Speed metrics and accuracy percentages are calculated for educational benchmarks and self-improvement purposes.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-text mb-2">4. Questions</h2>
          <p className="text-text-muted">
            For any inquiries regarding these terms, please contact us at <a href="mailto:contact@example.com" className="text-accent hover:underline">contact@example.com</a>.
          </p>
        </section>
      </Card>
    </div>
  );
}
