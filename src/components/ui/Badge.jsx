import React from 'react';

export default function Badge({
  children,
  variant = 'default', // 'default' | 'accent' | 'warning' | 'error'
  className = ''
}) {
  const variantStyles = {
    default: 'bg-surface-2 text-text-muted border-border',
    accent: 'bg-accent-soft text-accent border-accent/20',
    warning: 'bg-amber-50 dark:bg-amber-950/30 text-warning border-amber-200 dark:border-amber-900/40',
    error: 'bg-rose-50 dark:bg-rose-950/30 text-error border-rose-200 dark:border-rose-900/40',
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-btn text-2xs font-medium border select-none ${
        variantStyles[variant] || variantStyles.default
      } ${className}`}
    >
      {children}
    </span>
  );
}
