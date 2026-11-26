import React from 'react';

export default function StatNumber({
  value,
  label,
  unit,
  size = 'md', // 'sm' | 'md' | 'lg'
  accent = false,
  className = ''
}) {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl sm:text-5xl'
  };

  return (
    <div className={`select-none ${className}`}>
      {label && (
        <div className="text-xs font-medium text-text-muted mb-1">
          {label}
        </div>
      )}
      <div className="flex items-baseline gap-1">
        <span
          className={`font-mono font-medium tabular-nums tracking-tight ${
            accent ? 'text-accent' : 'text-text'
          } ${sizeClasses[size] || sizeClasses.md}`}
        >
          {value}
        </span>
        {unit && <span className="text-xs font-sans text-text-muted">{unit}</span>}
      </div>
    </div>
  );
}
