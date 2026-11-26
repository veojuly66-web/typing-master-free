import React from 'react';
import { Lock, ArrowRight } from 'lucide-react';
import Button from './Button';

export default function ProLock({
  title = 'Pro plan required',
  description = 'This drill, exam simulator, or practice session requires an active Pro plan or 7-day free trial',
  children = null,
  onUnlock = null
}) {
  const handleUpgrade = () => {
    if (onUnlock) {
      onUnlock();
    } else {
      window.location.hash = '#/pricing';
    }
  };

  return (
    <div className="relative rounded-card border border-border overflow-hidden bg-surface">
      {children && (
        <div className="opacity-35 select-none pointer-events-none p-6">
          {children}
        </div>
      )}

      <div className={`p-8 text-center flex flex-col items-center justify-center ${children ? 'absolute inset-0 bg-surface/95' : ''}`}>
        <div className="w-10 h-10 rounded-btn bg-pro-soft flex items-center justify-center text-pro mb-3 border border-pro/20">
          <Lock className="w-4 h-4 text-pro" strokeWidth={1.5} />
        </div>

        <span className="text-xs font-medium text-pro mb-1">
          Pro curriculum
        </span>

        <h3 className="text-base sm:text-lg font-medium text-text tracking-tight mb-1.5">
          {title}
        </h3>

        <p className="text-xs sm:text-sm text-text-muted max-w-md mx-auto mb-5 leading-relaxed">
          {description}
        </p>

        <div className="flex items-center gap-4 flex-wrap justify-center">
          <Button
            variant="primary"
            size="md"
            onClick={handleUpgrade}
            className="!bg-pro hover:opacity-90 text-white"
          >
            <span>Start 7-day free trial</span>
            <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
          </Button>

          <a
            href="#/pricing"
            className="text-xs text-text-muted hover:text-text font-medium underline underline-offset-2 py-1"
          >
            View plans from ₹99/month
          </a>
        </div>
      </div>
    </div>
  );
}
