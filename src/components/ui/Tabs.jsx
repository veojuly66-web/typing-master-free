import React from 'react';

export default function Tabs({
  tabs = [], // [{ id, label, icon: Icon, count }]
  activeId,
  onChange,
  className = ''
}) {
  return (
    <div
      role="tablist"
      className={`inline-flex items-center p-1 rounded-btn bg-surface-2 border border-border gap-1 select-none ${className}`}
    >
      {tabs.map((tab) => {
        const isActive = activeId === tab.id;
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            role="tab"
            type="button"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-btn text-xs font-medium transition-colors ${
              isActive
                ? 'bg-surface text-text shadow-subtle'
                : 'text-text-muted hover:text-text hover:bg-surface/50'
            }`}
          >
            {Icon && <Icon className="w-3.5 h-3.5" />}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span className="font-mono text-2xs px-1 rounded bg-border/50 text-text-muted">
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
