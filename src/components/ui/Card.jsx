import React from 'react';

export default function Card({
  children,
  className = '',
  hover = false,
  as: Component = 'div',
  ...props
}) {
  return (
    <Component
      className={`bg-surface border border-border rounded-card p-5 sm:p-6 shadow-subtle ${
        hover ? 'hover:border-text-muted/40 transition-colors' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}
