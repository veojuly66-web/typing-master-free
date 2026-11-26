import React from 'react';

export default function Toggle({
  checked = false,
  onChange,
  label,
  description,
  id,
  disabled = false
}) {
  const inputId = id || `toggle-${Math.random().toString(36).substring(2, 7)}`;

  return (
    <div className="flex items-start justify-between gap-4 select-none">
      {(label || description) && (
        <label htmlFor={inputId} className="cursor-pointer text-xs">
          {label && <div className="font-medium text-text">{label}</div>}
          {description && <div className="text-text-muted mt-0.5 leading-relaxed">{description}</div>}
        </label>
      )}

      <button
        type="button"
        role="switch"
        id={inputId}
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
          checked ? 'bg-accent' : 'bg-surface-2 border-border'
        } ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
      >
        <span
          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-subtle ring-0 transition duration-200 ease-in-out ${
            checked ? 'translate-x-4' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}
