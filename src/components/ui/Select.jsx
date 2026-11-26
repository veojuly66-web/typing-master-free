import React from 'react';

export default function Select({
  value,
  onChange,
  options = [], // [{ value, label }]
  label,
  id,
  className = ''
}) {
  const selectId = id || `select-${Math.random().toString(36).substring(2, 7)}`;

  return (
    <div className="text-xs">
      {label && (
        <label htmlFor={selectId} className="block font-medium text-text-muted mb-1.5">
          {label}
        </label>
      )}
      <select
        id={selectId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-3 py-1.5 rounded-btn bg-surface border border-border text-text font-medium text-xs focus:outline-none focus:border-accent ${className}`}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
