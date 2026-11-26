import React, { useState } from 'react';
import { Mail, MessageSquare } from 'lucide-react';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-semibold text-ink tracking-tight mb-3">
          Contact Us
        </h1>
        <p className="text-base text-ink-muted leading-relaxed">
          Have feedback, suggestions, or spotted a bug? We would love to hear from you.
        </p>
      </div>

      <div className="bg-paper-surface border border-paper-border rounded-card p-6 sm:p-8 shadow-subtle">
        <div className="flex items-center gap-3 pb-6 mb-6 border-b border-paper-border">
          <div className="w-10 h-10 rounded-btn bg-accent-soft text-accent flex items-center justify-center">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-ink">Direct Email</h2>
            <a
              href="mailto:contact@example.com"
              className="text-sm font-mono text-accent hover:underline"
            >
              contact@example.com
            </a>
          </div>
        </div>

        {submitted ? (
          <div className="p-4 rounded-btn bg-accent-soft text-accent text-sm font-medium">
            Thank you! For urgent queries, please email us directly at contact@example.com.
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
            className="space-y-4"
          >
            <div>
              <label htmlFor="contact-email" className="block text-xs font-medium text-ink-muted mb-1.5">
                Your email
              </label>
              <input
                id="contact-email"
                type="email"
                required
                placeholder="name@example.com"
                className="w-full px-3 py-2 rounded-btn bg-paper border border-paper-border text-ink text-sm focus:outline-none focus:border-accent"
              />
            </div>

            <div>
              <label htmlFor="contact-message" className="block text-xs font-medium text-ink-muted mb-1.5">
                Message or feedback
              </label>
              <textarea
                id="contact-message"
                rows={4}
                required
                placeholder="Tell us what you think or report an issue..."
                className="w-full px-3 py-2 rounded-btn bg-paper border border-paper-border text-ink text-sm focus:outline-none focus:border-accent resize-none"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-btn bg-accent hover:bg-accent-hover text-white text-xs font-medium transition-colors"
            >
              Send message
            </button>
          </form>
        )}
      </div>
    </div>
  );
}