import React from 'react';

export default function ProgressBar({
  value = 0,
  max = 100,
  className = '',
  barClassName = 'bg-accent'
}) {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100))) || 0;

  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      className={`w-full bg-surface-2 border border-border rounded-full h-1.5 overflow-hidden select-none ${className}`}
    >
      <div
        className={`${barClassName} h-full transition-[width] duration-300 ease-smooth`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
