import React from 'react';
import { BRAND } from '../config/brand';
import { Card } from './ui';

export default function RefundPolicy() {
  return (
    <div className="max-w-content mx-auto py-10 md:py-16 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-semibold text-text tracking-tight mb-2">
          Refund & Cancellation Policy
        </h1>
        <p className="text-xs text-text-muted mb-8">
          Last updated: November 26, 2026 · {BRAND.legalEntity}
        </p>

        <div className="prose prose-sm dark:prose-invert space-y-6 text-xs sm:text-sm text-text-muted leading-relaxed">
          <Card className="p-6 space-y-4">
            <h2 className="text-base font-semibold text-text">1. 7-Day Free Trial</h2>
            <p>
              We provide an unconditional 7-day free trial on all newly registered accounts. During this trial period, users can thoroughly test all Pro features, Hindi layouts, and exam simulators with zero financial commitment and without entering credit card information.
            </p>
          </Card>

          <Card className="p-6 space-y-4">
            <h2 className="text-base font-semibold text-text">2. Subscription Cancellation</h2>
            <p>
              You may cancel your monthly or yearly recurring subscription at any time directly through your <strong>Account Settings</strong> or by emailing us at <a href={`mailto:${BRAND.contact.email}`} className="text-accent underline">{BRAND.contact.email}</a>.
            </p>
            <p>
              Upon cancellation, your subscription will remain active until the end of your paid billing cycle. No further automatic renewals will occur.
            </p>
          </Card>

          <Card className="p-6 space-y-4">
            <h2 className="text-base font-semibold text-text">3. Refund Eligibility</h2>
            <p>
              Because {BRAND.name} is a digital service offering immediate access to proprietary curriculum and software tools, payments are generally non-refundable once activated. However, we consider refund requests on a case-by-case basis under the following circumstances:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Duplicate billing:</strong> In the event of an accidental duplicate transaction caused by payment gateway timeouts.</li>
              <li><strong>Unintended renewal:</strong> If you intended to cancel before renewal and contact our support team within 48 hours of the renewal transaction without substantial platform usage during that period.</li>
              <li><strong>Technical non-delivery:</strong> If persistent server-side technical failures prevented access to Pro features for more than 72 consecutive hours and our team was unable to resolve the issue.</li>
            </ul>
          </Card>

          <Card className="p-6 space-y-4">
            <h2 className="text-base font-semibold text-text">4. Refund Processing Time</h2>
            <p>
              Approved refunds are credited back to the original payment source (UPI ID, bank account, or debit/credit card) via Razorpay within <strong>5 to 7 business days</strong> as per banking network standards.
            </p>
          </Card>

          <Card className="p-6 space-y-4">
            <h2 className="text-base font-semibold text-text">5. Contact Support</h2>
            <p>
              For any billing questions, cancellation assistance, or refund claims, please reach out to:
            </p>
            <p className="font-mono text-text">
              Email: {BRAND.contact.email}<br />
              Phone: {BRAND.contact.phone}<br />
              Address: {BRAND.contact.address}
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
