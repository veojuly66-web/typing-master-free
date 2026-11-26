import React from 'react';
import { Sparkles, ShieldCheck } from 'lucide-react';

export default function PlanBadge({ plan = 'free', trialDaysLeft = null, className = '' }) {
  if (plan === 'pro') {
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-2xs font-semibold bg-pro-soft text-pro border border-pro/30 uppercase tracking-wider ${className}`}>
        <Sparkles className="w-3 h-3 text-pro" />
        <span>PRO</span>
      </span>
    );
  }

  if (plan === 'trial') {
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-2xs font-semibold bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-800 uppercase tracking-wider ${className}`}>
        <ShieldCheck className="w-3 h-3" />
        <span>Trial ({trialDaysLeft ?? 7}d)</span>
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-2xs font-medium bg-surface-2 text-text-muted border border-border uppercase tracking-wider ${className}`}>
      Free
    </span>
  );
}
