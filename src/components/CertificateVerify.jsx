import React from 'react';
import { Card, Badge, Button } from './ui';
import { CheckCircle2, ShieldCheck, Award, ArrowLeft } from 'lucide-react';
import { BRAND } from '../config/brand';

export default function CertificateVerify({ certId = 'PT-DEMO123' }) {
  // In real deployment, cert is fetched by ID from Supabase public read policy
  const mockCert = {
    id: certId,
    recipientName: 'Aspirant Student',
    track: 'English (US QWERTY)',
    testTitle: '5-Minute Benchmark Speed Test',
    netWpm: 48,
    accuracy: 98,
    duration: 300,
    issuedDate: 'November 26, 2026',
    issuer: BRAND.name
  };

  return (
    <div className="max-w-content mx-auto py-12 md:py-20 px-4 text-center">
      <div className="max-w-lg mx-auto bg-surface border border-border rounded-card p-8 shadow-subtle animate-fadeIn">
        {/* Verified Badge */}
        <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-accent flex items-center justify-center mx-auto mb-4 border border-emerald-300">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <span className="text-2xs font-semibold uppercase tracking-wider text-accent bg-accent-soft px-2.5 py-0.5 rounded-full inline-block mb-2">
          Authentic Verified Certificate
        </span>

        <h1 className="text-2xl font-semibold text-text tracking-tight mb-1">
          Certificate Verified
        </h1>
        <p className="text-xs text-text-muted mb-6">
          Issued by {BRAND.name} Official Testing Server
        </p>

        {/* Certificate Details Card */}
        <div className="bg-surface-2 p-5 rounded border border-border text-left space-y-3 text-xs mb-6">
          <div className="flex justify-between border-b border-border pb-2">
            <span className="text-text-muted">Certificate ID</span>
            <span className="font-mono font-bold text-text">{mockCert.id}</span>
          </div>

          <div className="flex justify-between border-b border-border pb-2">
            <span className="text-text-muted">Recipient Name</span>
            <span className="font-semibold text-text">{mockCert.recipientName}</span>
          </div>

          <div className="flex justify-between border-b border-border pb-2">
            <span className="text-text-muted">Assessment Drill</span>
            <span className="text-text">{mockCert.testTitle}</span>
          </div>

          <div className="flex justify-between border-b border-border pb-2">
            <span className="text-text-muted">Net Typing Speed</span>
            <span className="font-mono font-bold text-accent text-sm">{mockCert.netWpm} WPM</span>
          </div>

          <div className="flex justify-between border-b border-border pb-2">
            <span className="text-text-muted">Accuracy Standard</span>
            <span className="font-mono font-bold text-text">{mockCert.accuracy}%</span>
          </div>

          <div className="flex justify-between">
            <span className="text-text-muted">Issue Date</span>
            <span className="text-text">{mockCert.issuedDate}</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3">
          <Button variant="secondary" size="md" onClick={() => window.location.href = '#/'}>
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            <span>Go to Home</span>
          </Button>

          <Button variant="primary" size="md" onClick={() => window.location.href = '#/test'}>
            <span>Take Speed Test</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
