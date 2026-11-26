import React from 'react';
import { Lock, Sparkles, ArrowRight } from 'lucide-react';
import Button from './Button';

export default function ProLock({
  title = 'Pro Plan Feature',
  description = 'This lesson, exam simulation, or practice drill requires an active Pro subscription or 7-day free trial.',
  children = null,
  onUnlock = null
}) {
  const handleUpgrade = () => {
    if (onUnlock) {
      onUnlock();
    } else {
      window.location.href = '#/pricing';
    }
  };

  return (
    <div className="relative rounded-card border border-border overflow-hidden bg-surface">
      {/* Blurred preview backdrop if children provided */}
      {children && (
        <div className="filter blur-[5px] opacity-40 select-none pointer-events-none p-6">
          {children}
        </div>
      )}

      {/* Lock Card Overlay */}
      <div className={`p-8 text-center flex flex-col items-center justify-center ${children ? 'absolute inset-0 bg-surface/85 backdrop-blur-[2px]' : ''}`}>
        <div className="w-12 h-12 rounded-full bg-pro-soft flex items-center justify-center text-pro mb-3 border border-pro/20 shadow-subtle">
          <Lock className="w-5 h-5 text-pro" />
        </div>

        <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-2xs font-semibold uppercase tracking-wider bg-pro-soft text-pro mb-2">
          <Sparkles className="w-3 h-3 text-pro" />
          <span>Pro Feature</span>
        </div>

        <h3 className="text-base sm:text-lg font-semibold text-text tracking-tight mb-1">
          {title}
        </h3>

        <p className="text-xs sm:text-sm text-text-muted max-w-md mx-auto mb-5 leading-relaxed">
          {description}
        </p>

        <div className="flex items-center gap-3 flex-wrap justify-center">
          <Button
            variant="primary"
            size="md"
            onClick={handleUpgrade}
            className="!bg-pro hover:!bg-pro-hover text-white font-medium"
          >
            <span>Start 7-Day Free Trial</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>

          <a
            href="#/pricing"
            className="text-xs text-text-muted hover:text-text font-medium underline underline-offset-2 py-1"
          >
            View all plans (from ₹99/mo)
          </a>
        </div>
      </div>
    </div>
  );
}
