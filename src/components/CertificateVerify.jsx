import React, { useEffect, useState } from 'react';
import { Button } from './ui';
import { CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import { BRAND } from '../config/brand';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export default function CertificateVerify({ certId = 'PT-DEMO123' }) {
  const [cert, setCert] = useState(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let active = true;

    if (!isSupabaseConfigured || certId === 'PT-DEMO123') {
      setCert({
        id: certId || 'PT-DEMO123',
        recipientName: 'Aspirant Student (Demo)',
        track: 'English (US QWERTY)',
        testTitle: '5-Minute Benchmark Speed Test',
        netWpm: 48,
        accuracy: 98,
        duration: 300,
        issuedDate: 'November 26, 2026',
        issuer: BRAND.name
      });
      setLoading(false);
      return;
    }

    supabase
      .rpc('verify_certificate', { cert_id: certId })
      .then(({ data, error }) => {
        if (!active) return;
        const row = Array.isArray(data) ? data[0] : data;
        if (error || !row) {
          setNotFound(true);
        } else {
          setCert({
            id: row.id,
            recipientName: row.recipient_name,
            track: row.track,
            testTitle: row.test_title,
            netWpm: row.net_wpm,
            accuracy: row.accuracy,
            duration: row.duration,
            issuedDate: row.issued_date,
            issuer: BRAND.name
          });
        }
        setLoading(false);
      });

    return () => { active = false; };
  }, [certId]);

  if (loading) {
    return (
      <div className="max-w-content mx-auto py-20 px-4 text-center">
        <div className="inline-block w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-xs text-text-muted">Verifying certificate {certId}...</p>
      </div>
    );
  }

  if (notFound || !cert) {
    return (
      <div className="max-w-content mx-auto py-16 px-4 text-center">
        <div className="max-w-md mx-auto bg-surface border border-border rounded-card p-8 shadow-subtle">
          <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-950/40 text-error flex items-center justify-center mx-auto mb-3">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-semibold text-text mb-2">Certificate Not Found</h1>
          <p className="text-xs text-text-muted mb-6">
            No certificate record was found matching ID <span className="font-mono font-semibold text-text">{certId}</span>.
          </p>
          <Button variant="secondary" size="md" onClick={() => { window.location.hash = '#/'; }}>
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            <span>Go to Home</span>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-content mx-auto py-12 md:py-20 px-4 text-center">
      <div className="max-w-lg mx-auto bg-surface border border-border rounded-card p-8 shadow-subtle animate-fadeIn">
        {/* Verified Badge */}
        <div className="w-14 h-14 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-accent flex items-center justify-center mx-auto mb-4 border border-emerald-300">
          <CheckCircle2 className="w-7 h-7" strokeWidth={1.5} />
        </div>

        <span className="text-xs font-medium text-accent bg-accent-soft px-2.5 py-0.5 rounded-key inline-block mb-2">
          Authentic Verified Certificate
        </span>

        <h1 className="text-2xl font-semibold text-text tracking-tight mb-1">
          Certificate Verified
        </h1>
        <p className="text-xs text-text-muted mb-6">
          Issued by {BRAND.name} Official Testing Server
        </p>

        {/* Certificate Details Card */}
        <div className="bg-surface-2 p-5 rounded-card border border-border text-left space-y-3 text-xs mb-6">
          <div className="flex justify-between border-b border-border pb-2">
            <span className="text-text-muted">Certificate ID</span>
            <span className="font-mono font-semibold tabular-nums text-text">{cert.id}</span>
          </div>

          <div className="flex justify-between border-b border-border pb-2">
            <span className="text-text-muted">Recipient Name</span>
            <span className="font-semibold text-text">{cert.recipientName}</span>
          </div>

          <div className="flex justify-between border-b border-border pb-2">
            <span className="text-text-muted">Assessment Drill</span>
            <span className="text-text">{cert.testTitle}</span>
          </div>

          <div className="flex justify-between border-b border-border pb-2">
            <span className="text-text-muted">Net Typing Speed</span>
            <span className="font-mono font-semibold tabular-nums text-accent text-sm">{cert.netWpm} WPM</span>
          </div>

          <div className="flex justify-between border-b border-border pb-2">
            <span className="text-text-muted">Accuracy Standard</span>
            <span className="font-mono font-semibold tabular-nums text-text">{cert.accuracy}%</span>
          </div>

          <div className="flex justify-between">
            <span className="text-text-muted">Issue Date</span>
            <span className="text-text">{cert.issuedDate}</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3">
          <Button variant="secondary" size="md" onClick={() => { window.location.hash = '#/'; }}>
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            <span>Go to Home</span>
          </Button>

          <Button variant="primary" size="md" onClick={() => { window.location.hash = '#/test'; }}>
            <span>Take Speed Test</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
