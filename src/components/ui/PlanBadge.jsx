import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function PlanBadge({ plan = 'free', trialDaysLeft = null, className = '' }) {
  if (plan === 'pro') {
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-key text-xs font-medium bg-pro-soft text-pro border border-pro/25 tabular-nums ${className}`}>
        Pro
      </span>
    );
  }

  if (plan === 'trial') {
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-key text-xs font-medium bg-pro-soft/70 text-pro border border-pro/20 tabular-nums ${className}`}>
        <ShieldCheck className="w-3.5 h-3.5" strokeWidth={1.5} />
        <span>Trial · {trialDaysLeft ?? 7}d</span>
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-key text-xs font-medium bg-surface-2 text-text-muted border border-border ${className}`}>
      Free
    </span>
  );
}
