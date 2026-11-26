import React from 'react';

export default function Button({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger'
  size = 'md', // 'sm' | 'md' | 'lg'
  className = '',
  disabled = false,
  type = 'button',
  onClick,
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors select-none focus:outline-none disabled:opacity-40 disabled:pointer-events-none rounded-btn';

  const variantStyles = {
    primary: 'bg-accent hover:bg-accent-hover text-white shadow-subtle',
    secondary: 'bg-surface hover:bg-surface-2 text-text border border-border shadow-subtle',
    outline: 'bg-transparent hover:bg-surface-2 text-text border border-border',
    ghost: 'bg-transparent hover:bg-surface-2 text-text-muted hover:text-text',
    danger: 'bg-error hover:opacity-90 text-white shadow-subtle'
  };

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-5 py-2.5 gap-2.5'
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant] || variantStyles.primary} ${sizeStyles[size] || sizeStyles.md} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
