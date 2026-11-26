import React, { useState, useEffect } from 'react';

// Lightweight notification toast
let toastFn = null;

export function showToast(message, type = 'info', duration = 3000) {
  if (toastFn) {
    toastFn({ message, type, duration });
  }
}

export function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    toastFn = ({ message, type, duration }) => {
      const id = Date.now();
      setToasts(prev => [...prev, { id, message, type }]);
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, duration);
    };

    return () => {
      toastFn = null;
    };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-xs pointer-events-none"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto px-3.5 py-2 rounded-btn text-xs font-medium shadow-modal border animate-fadeIn transition-all ${
            t.type === 'error'
              ? 'bg-rose-50 dark:bg-rose-950 text-error border-rose-200 dark:border-rose-900'
              : t.type === 'accent'
              ? 'bg-accent text-white border-accent'
              : 'bg-surface text-text border-border'
          }`}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}
