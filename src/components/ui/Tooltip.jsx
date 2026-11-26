import React, { useState } from 'react';

export default function Tooltip({
  content,
  children,
  position = 'top' // 'top' | 'bottom'
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {children}
      {visible && content && (
        <div
          role="tooltip"
          className={`absolute z-50 px-2 py-1 text-2xs font-medium text-white bg-text rounded-btn whitespace-nowrap shadow-subtle pointer-events-none transition-opacity ${
            position === 'bottom'
              ? 'top-full mt-1.5 left-1/2 -translate-x-1/2'
              : 'bottom-full mb-1.5 left-1/2 -translate-x-1/2'
          }`}
        >
          {content}
        </div>
      )}
    </div>
  );
}
