import React, { useState } from 'react';
import { KEYBOARD_ROWS, FINGER_COLORS, getFingerInfo } from '../utils/fingerMap';
import { Eye, EyeOff } from 'lucide-react';

export default function VirtualKeyboard({ targetChar, activeKey }) {
  const [showColorCoded, setShowColorCoded] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);

  const fingerInfo = getFingerInfo(targetChar);

  // Check if a specific keycap is the target
  const isKeyTarget = (rowKey) => {
    if (!targetChar) return false;
    if (rowKey.key === 'Space' && targetChar === ' ') return true;
    if (rowKey.key.toLowerCase() === targetChar.toLowerCase()) return true;
    if (rowKey.shiftKey === targetChar) return true;
    return false;
  };

  const isKeyPressed = (rowKey) => {
    if (!activeKey) return false;
    if (rowKey.key === 'Space' && activeKey === ' ') return true;
    if (rowKey.key.toLowerCase() === activeKey.toLowerCase()) return true;
    if (rowKey.shiftKey === activeKey) return true;
    return false;
  };

  const isShiftTarget = (rowKeyId) => {
    if (!fingerInfo?.needsShift) return false;
    if (fingerInfo.fingerKey.startsWith('left') && rowKeyId === 'shift-right') return true;
    if (fingerInfo.fingerKey.startsWith('right') && rowKeyId === 'shift-left') return true;
    return false;
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-6 bg-paper-surface border border-paper-border rounded-card p-4 shadow-subtle select-none">
      {/* Keyboard Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-paper-border text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-ink-muted">Next key</span>
            <span className="keycap inline-flex items-center justify-center min-w-[28px] h-7 px-2 font-mono font-medium text-sm text-accent">
              {targetChar === ' ' ? 'Space' : targetChar || '—'}
            </span>
          </div>

          {fingerInfo && (
            <div className="flex items-center gap-1.5 text-ink-muted">
              <span className={`w-2 h-2 rounded-full ${fingerInfo.dot}`} />
              <span>Use <strong className="text-ink font-medium">{fingerInfo.name}</strong></span>
              {fingerInfo.needsShift && (
                <span className="keycap text-[11px] px-1.5 py-0.5 text-ink font-medium">
                  + {fingerInfo.shiftHand}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowColorCoded(!showColorCoded)}
            className={`px-2 py-1 rounded-btn text-xs font-medium transition-colors ${
              showColorCoded
                ? 'bg-paper text-ink border border-paper-border'
                : 'text-ink-muted hover:text-ink'
            }`}
          >
            Pastel guides
          </button>

          <button
            type="button"
            onClick={() => setIsMinimized(!isMinimized)}
            aria-label={isMinimized ? 'Show keyboard' : 'Hide keyboard'}
            className="p-1 rounded-btn text-ink-muted hover:text-ink transition-colors"
          >
            {isMinimized ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {!isMinimized && (
        <div className="flex flex-col gap-1.5 p-2 rounded-card bg-paper border border-paper-border overflow-x-auto">
          {KEYBOARD_ROWS.map((row, rIdx) => (
            <div key={rIdx} className="flex justify-center gap-1 min-w-[620px]">
              {row.map((k, kIdx) => {
                const target = isKeyTarget(k);
                const pressed = isKeyPressed(k);
                const shiftActive = isShiftTarget(k.id);
                const fingerStyle = showColorCoded && FINGER_COLORS[k.finger];

                // Keycap Styling
                let keyBg = 'bg-paper-surface text-ink border-paper-border';

                if (target || shiftActive) {
                  keyBg = 'bg-accent text-white border-accent shadow-subtle';
                } else if (pressed) {
                  keyBg = 'bg-ink text-paper border-ink';
                } else if (showColorCoded && fingerStyle) {
                  keyBg = `${fingerStyle.bg} ${fingerStyle.text} ${fingerStyle.border}`;
                }

                return (
                  <div
                    key={kIdx}
                    className={`relative flex flex-col items-center justify-center font-mono keycap transition-colors duration-75 select-none ${
                      k.width || 'w-10'
                    } h-10 text-xs ${keyBg} ${
                      k.isSpecial ? 'font-sans text-[11px] font-medium text-ink-muted' : 'font-medium'
                    }`}
                  >
                    {k.shiftKey && (
                      <span className={`text-[9px] leading-none mb-0.5 opacity-60 ${target && k.shiftKey === targetChar ? 'font-semibold' : ''}`}>
                        {k.shiftKey}
                      </span>
                    )}

                    <span className={`leading-none uppercase ${target && k.key.toLowerCase() === targetChar?.toLowerCase() ? 'font-semibold text-white' : ''}`}>
                      {k.key}
                    </span>

                    {/* F and J tactile bumps */}
                    {k.hasBump && (
                      <div className="absolute bottom-1 w-2.5 h-0.5 rounded-full bg-ink/40" />
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
