import React from 'react';
import Button from './Button';

export default function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  icon: Icon
}) {
  return (
    <div className="text-center py-12 px-4 select-none">
      {Icon && (
        <div className="w-10 h-10 mx-auto mb-3 rounded-btn bg-surface-2 border border-border text-text-muted flex items-center justify-center">
          <Icon className="w-5 h-5" />
        </div>
      )}
      <h3 className="text-sm font-semibold text-text mb-1">{title}</h3>
      {description && (
        <p className="text-xs text-text-muted max-w-sm mx-auto mb-4 leading-relaxed">
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <Button size="sm" variant="secondary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
