import React from 'react';

export default function Skeleton({ className = '', variant = 'text', width, height }) {
  const base = 'animate-pulse bg-surface-2 dark:bg-surface-2 rounded';
  const variantClass = variant === 'circle' ? 'rounded-full' : 'rounded-card';

  return (
    <div
      className={`${base} ${variantClass} ${className}`}
      style={{
        width: width || (variant === 'circle' ? height : undefined),
        height: height || (variant === 'text' ? '1rem' : undefined)
      }}
      aria-hidden="true"
    />
  );
}
