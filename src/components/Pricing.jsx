import React, { useState } from 'react';
import { BRAND } from '../config/brand';
import { useAuth } from '../lib/auth';
import { Card, Button, Badge } from './ui';
import { Check, Sparkles, HelpCircle, ShieldCheck, ArrowRight, X } from 'lucide-react';

export default function Pricing() {
  const { user, isProUser, subscription } = useAuth();
  const { plans, gstNote, currencySymbol, freeTrialDays } = BRAND.pricing;
  const [billingCycle, setBillingCycle] = useState('yearly'); // 'monthly' | 'yearly'

  const handleSelectPlan = (planId) => {
    window.location.href = `#/checkout?plan=${planId}`;
  };

  const faqList = [
    {
      q: 'Do I need a credit card to start the 7-day free trial?',
      a: 'No. You can start your 7-day Pro free trial immediately upon creating an account. No credit card or payment information is required.'
    },
    {
      q: 'Which payment methods do you accept?',
      a: 'We accept all major Indian payment options via Razorpay: UPI (Google Pay, PhonePe, Paytm, BHIM), debit/credit cards (Visa, Mastercard, RuPay), and Netbanking from 50+ Indian banks.'
    },
    {
      q: 'Can I cancel my monthly or yearly subscription at any time?',
      a: 'Yes. You can cancel your subscription with a single click from your Account settings. You will retain full access until the end of your current billing period without further charges.'
    },
    {
      q: 'What is the Exam Pack (3 Months)?',
      a: 'The Exam Pack is a one-time payment of ₹249 giving you 90 days of complete Pro access without recurring debits. It is ideal for students preparing for an upcoming recruitment test.'
    },
    {
      q: 'Does it work on Windows laptops and desktops?',
      a: 'Yes! Pankaj Typing runs in any modern browser on Windows, Mac, and Linux. For optimal touch-typing speed building, we recommend using a physical desktop or laptop keyboard.'
    }
  ];

  return (
    <div className="max-w-content mx-auto py-12 md:py-20 px-4">
      {/* Title & Tagline */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <Badge variant="accent" className="mb-3">Simple, Transparent Pricing</Badge>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-text tracking-tight mb-4">
          Invest in your typing speed. Pass your exam with confidence.
        </h1>
        <p className="text-sm sm:text-base text-text-muted leading-relaxed">
          Start with our generous free plan, or unlock complete government exam simulations, Hindi Inscript & Remington Gail courses, and unlimited certificates.
        </p>

        {/* 7-Day Free Trial Callout */}
        <div className="inline-flex items-center gap-2 mt-5 px-3 py-1.5 rounded-full bg-accent-soft text-accent text-xs font-semibold border border-accent/20">
          <ShieldCheck className="w-4 h-4" />
          <span>All new accounts include 7 days of free Pro access. No card required.</span>
        </div>
      </div>

      {/* Main 3 Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 items-stretch">
        {/* Plan 1: Free Starter */}
        <Card className="p-6 flex flex-col justify-between">
          <div>
            <div className="text-2xs font-semibold uppercase tracking-wider text-text-muted mb-2">
              {plans.free.name}
            </div>
            <div className="flex items-baseline gap-1 mb-2">
              <span className="font-mono text-4xl font-bold text-text">₹0</span>
              <span className="text-xs text-text-muted font-sans">/ forever</span>
            </div>
            <p className="text-xs text-text-muted leading-relaxed mb-6">
              {plans.free.description}
            </p>

            <ul className="space-y-3 text-xs text-text-muted mb-8">
              {plans.free.features.map((feat, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <Button
            variant="secondary"
            size="md"
            onClick={() => window.location.href = '#/lessons'}
            className="w-full justify-center"
          >
            <span>Start Free</span>
          </Button>
        </Card>

        {/* Plan 2: Pro Monthly */}
        <Card className="p-6 flex flex-col justify-between">
          <div>
            <div className="text-2xs font-semibold uppercase tracking-wider text-text-muted mb-2">
              {plans.monthly.name}
            </div>
            <div className="flex items-baseline gap-1 mb-2">
              <span className="font-mono text-4xl font-bold text-text">₹99</span>
              <span className="text-xs text-text-muted font-sans">/ month</span>
            </div>
            <p className="text-xs text-text-muted leading-relaxed mb-6">
              {plans.monthly.description}
            </p>

            <ul className="space-y-3 text-xs text-text-muted mb-8">
              {plans.monthly.features.slice(0, 7).map((feat, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <Button
            variant="secondary"
            size="md"
            onClick={() => handleSelectPlan('pro_monthly')}
            className="w-full justify-center"
          >
            <span>Start 7-Day Free Trial</span>
          </Button>
        </Card>

        {/* Plan 3: Pro Yearly (Highlighted - Best Value) */}
        <Card className="p-6 flex flex-col justify-between relative border-pro ring-2 ring-pro bg-surface shadow-md">
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-2xs font-bold uppercase tracking-wider bg-pro text-white shadow-subtle">
              <Sparkles className="w-3 h-3" />
              <span>{plans.yearly.badge} · {plans.yearly.discountLabel}</span>
            </span>
          </div>

          <div>
            <div className="text-2xs font-semibold uppercase tracking-wider text-pro mb-2 mt-2">
              {plans.yearly.name}
            </div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="font-mono text-4xl font-bold text-text">₹499</span>
              <span className="text-xs text-text-muted font-sans">/ year</span>
              <span className="text-xs text-text-muted line-through">₹1,188</span>
            </div>
            <div className="text-2xs text-accent font-medium mb-3">
              Only ₹41.58 / month
            </div>
            <p className="text-xs text-text-muted leading-relaxed mb-6">
              Complete exam preparation pass. Full 12-month access to all present and future drills.
            </p>

            <ul className="space-y-3 text-xs text-text mb-8">
              {plans.yearly.features.map((feat, idx) => (
                <li key={idx} className="flex items-start gap-2 font-medium">
                  <Check className="w-3.5 h-3.5 text-pro shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <Button
            variant="primary"
            size="lg"
            onClick={() => handleSelectPlan('pro_yearly')}
            className="w-full justify-center !bg-pro hover:!bg-pro-hover text-white shadow-subtle"
          >
            <span>Start 7-Day Free Trial</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </Card>
      </div>

      {/* Exam Pack Callout Box */}
      <div className="p-6 sm:p-8 rounded-card border border-border bg-surface-2 mb-16 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-2xs font-semibold uppercase tracking-wider text-text-muted mb-1">
            <Badge variant="outline">{plans.examPack.badge}</Badge>
            <span>One-Time Payment</span>
          </div>
          <h2 className="text-xl font-semibold text-text mb-1">
            {plans.examPack.name} — ₹249 for 90 Days
          </h2>
          <p className="text-xs sm:text-sm text-text-muted max-w-xl leading-relaxed">
            {plans.examPack.description} No recurring credit card mandate. Full Pro access throughout your exam revision cycle.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => handleSelectPlan('exam_pack_3m')}
          className="shrink-0"
        >
          <span>Get 3 Months Access</span>
        </Button>
      </div>

      {/* GST Note & Transparency statement */}
      <div className="text-center text-xs text-text-muted mb-16">
        <p className="mb-1">{gstNote}</p>
        <p>Instant digital activation. Receipts and tax invoices available immediately in your account.</p>
      </div>

      {/* Feature Comparison Table */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold text-text text-center tracking-tight mb-8">
          Detailed Feature Comparison
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse bg-surface border border-border rounded-card">
            <thead>
              <tr className="border-b border-border text-text-muted">
                <th className="py-3 px-4 font-semibold">Features</th>
                <th className="py-3 px-4 font-semibold text-center w-28">Free Plan</th>
                <th className="py-3 px-4 font-semibold text-center w-36 text-pro">Pro Plan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="py-3 px-4 font-medium text-text">English Touch Typing Lessons</td>
                <td className="py-3 px-4 text-center text-text-muted">First 2 Levels (12 drills)</td>
                <td className="py-3 px-4 text-center font-semibold text-pro">All 5 Levels (30+ drills)</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-text">Hindi Inscript Course</td>
                <td className="py-3 px-4 text-center text-text-muted">First 2 Levels</td>
                <td className="py-3 px-4 text-center font-semibold text-pro">All 6 Levels (Full Conjuncts)</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-text">Hindi Remington Gail Course (Krutidev)</td>
                <td className="py-3 px-4 text-center text-text-muted">First 2 Levels</td>
                <td className="py-3 px-4 text-center font-semibold text-pro">All 6 Levels (Pre-base matras)</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-text">Government Exam Simulator (SSC/High Court)</td>
                <td className="py-3 px-4 text-center text-text-muted">1 Preview Test</td>
                <td className="py-3 px-4 text-center font-semibold text-pro">Unlimited Mock Tests</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-text">Official Evaluation Scorecard</td>
                <td className="py-3 px-4 text-center text-text-muted">Basic</td>
                <td className="py-3 px-4 text-center font-semibold text-pro">Full / Half Mistake Breakdown</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-text">Timed Speed Tests</td>
                <td className="py-3 px-4 text-center text-text-muted">1-Minute (3 / day)</td>
                <td className="py-3 px-4 text-center font-semibold text-pro">1, 2, 3, 5, 10 min (Unlimited)</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-text">Verifiable Certificates (PDF & PNG)</td>
                <td className="py-3 px-4 text-center text-text-muted">Sample Preview</td>
                <td className="py-3 px-4 text-center font-semibold text-pro">Unlimited with QR code</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-text">Cross-device Cloud Sync</td>
                <td className="py-3 px-4 text-center text-text-muted"><X className="w-4 h-4 mx-auto text-text-muted/60" /></td>
                <td className="py-3 px-4 text-center font-semibold text-pro"><Check className="w-4 h-4 mx-auto text-pro" /></td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-text">Arcade Games (Speed Race & Attack)</td>
                <td className="py-3 px-4 text-center text-text-muted">1 Game</td>
                <td className="py-3 px-4 text-center font-semibold text-pro">All 3 Games</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Pricing FAQ Accordion */}
      <section className="max-w-2xl mx-auto">
        <h2 className="text-xl font-semibold text-text text-center tracking-tight mb-6">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          {faqList.map((item, idx) => (
            <Card key={idx} className="p-4">
              <h3 className="text-sm font-semibold text-text mb-1.5">{item.q}</h3>
              <p className="text-xs text-text-muted leading-relaxed">{item.a}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
