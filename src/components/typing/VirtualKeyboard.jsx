import React, { useState } from 'react';
import { getFingerInfo, getKeyboardRows } from '../../utils/fingerMap';
import { Eye, EyeOff, Sparkles, Hand } from 'lucide-react';

export default function VirtualKeyboard({
  targetChar,
  activeKey,
  layout = 'us', // 'us' | 'uk'
  showKeyboard = true,
  onToggleKeyboard,
  showFingerColors = true,
  onToggleFingerColors,
  showHands = true,
  onToggleHands
}) {
  const [internalShowColors, setInternalShowColors] = useState(showFingerColors);
  const [internalShowHands, setInternalShowHands] = useState(showHands);

  const fingerInfo = getFingerInfo(targetChar);
  const rows = getKeyboardRows(layout);

  const isKeyTarget = (k) => {
    if (!targetChar) return false;
    if (k.key === 'Space' && targetChar === ' ') return true;
    if (k.key.toLowerCase() === targetChar.toLowerCase()) return true;
    if (k.shiftKey === targetChar) return true;
    return false;
  };

  const isKeyPressed = (k) => {
    if (!activeKey) return false;
    if (k.key === 'Space' && activeKey === ' ') return true;
    if (k.key.toLowerCase() === activeKey.toLowerCase()) return true;
    if (k.shiftKey === activeKey) return true;
    return false;
  };

  const isShiftTarget = (rowKeyId) => {
    if (!fingerInfo?.needsShift) return false;
    if (fingerInfo.fingerKey.startsWith('left') && rowKeyId === 'shift-right') return true;
    if (fingerInfo.fingerKey.startsWith('right') && rowKeyId === 'shift-left') return true;
    return false;
  };

  // Pastel styling map
  const fingerBgClasses = {
    'left-pinky': 'bg-[#FCE7E4] dark:bg-[#382221] text-[#9A3428] dark:text-[#F3B2AC] border-[#F4CCC6] dark:border-[#4E2B29]',
    'left-ring': 'bg-[#FDEFD9] dark:bg-[#3A2E1D] text-[#8C5E18] dark:text-[#F4D19B] border-[#F6DCB6] dark:border-[#523F23]',
    'left-middle': 'bg-[#E6F4EA] dark:bg-[#1B3124] text-[#1E7038] dark:text-[#A8E2B9] border-[#C8E7D1] dark:border-[#274B34]',
    'left-index': 'bg-[#E3EEFB] dark:bg-[#1C293B] text-[#1C5CA8] dark:text-[#ABC9F5] border-[#C2DBF7] dark:border-[#273F5E]',
    'thumb': 'bg-[#EEEDEA] dark:bg-[#282725] text-[#55534E] dark:text-[#C7C5BF] border-[#DDDCD6] dark:border-[#383733]',
    'right-index': 'bg-[#E3EEFB] dark:bg-[#1C293B] text-[#1C5CA8] dark:text-[#ABC9F5] border-[#C2DBF7] dark:border-[#273F5E]',
    'right-middle': 'bg-[#E6F4EA] dark:bg-[#1B3124] text-[#1E7038] dark:text-[#A8E2B9] border-[#C8E7D1] dark:border-[#274B34]',
    'right-ring': 'bg-[#FDEFD9] dark:bg-[#3A2E1D] text-[#8C5E18] dark:text-[#F4D19B] border-[#F6DCB6] dark:border-[#523F23]',
    'right-pinky': 'bg-[#EEE8FB] dark:bg-[#2A213B] text-[#5B3CA8] dark:text-[#CBBBF5] border-[#D8CEF7] dark:border-[#40305C]'
  };

  if (!showKeyboard) {
    return (
      <div className="w-full max-w-typing mx-auto mt-4 text-center">
        <button
          type="button"
          onClick={onToggleKeyboard}
          className="text-xs text-text-muted hover:text-text underline"
        >
          Show virtual keyboard
        </button>
      </div>
    );
  }

  const activeFingerKey = fingerInfo?.fingerKey;

  return (
    <div className="w-full max-w-typing mx-auto mt-6 bg-surface border border-border rounded-card p-4 sm:p-5 shadow-subtle select-none">
      {/* Keyboard Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-3 border-b border-border text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-text-muted">Target key:</span>
            <span className="inline-flex items-center justify-center min-w-[28px] h-7 px-2 rounded-btn bg-accent-soft text-accent font-mono font-semibold text-sm">
              {targetChar === ' ' ? 'Space' : targetChar || '—'}
            </span>
          </div>

          {fingerInfo && (
            <div className="flex items-center gap-1.5 text-text-muted">
              <span className={`w-2 h-2 rounded-full ${fingerInfo.dot || 'bg-accent'}`} />
              <span>Use: <strong className="text-text font-medium">{fingerInfo.name}</strong></span>
              {fingerInfo.needsShift && (
                <span className="text-2xs px-1.5 py-0.5 rounded bg-surface-2 border border-border text-text font-medium">
                  + {fingerInfo.shiftHand}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              const next = !internalShowColors;
              setInternalShowColors(next);
              if (onToggleFingerColors) onToggleFingerColors(next);
            }}
            className={`px-2 py-1 rounded-btn text-xs font-medium transition-colors ${
              internalShowColors ? 'bg-surface-2 text-text border border-border' : 'text-text-muted hover:text-text'
            }`}
          >
            Pastel guides
          </button>

          <button
            type="button"
            onClick={() => {
              const next = !internalShowHands;
              setInternalShowHands(next);
              if (onToggleHands) onToggleHands(next);
            }}
            className={`px-2 py-1 rounded-btn text-xs font-medium transition-colors ${
              internalShowHands ? 'bg-surface-2 text-text border border-border' : 'text-text-muted hover:text-text'
            }`}
          >
            Hands
          </button>

          <button
            type="button"
            onClick={onToggleKeyboard}
            aria-label="Hide keyboard"
            className="p-1 rounded-btn text-text-muted hover:text-text transition-colors"
          >
            <EyeOff className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Keyboard Grid */}
      <div className="flex flex-col gap-1.5 p-2 rounded-btn bg-bg border border-border overflow-x-auto">
        {rows.map((row, rIdx) => (
          <div key={rIdx} className="flex justify-center gap-1 min-w-[620px]">
            {row.map((k, kIdx) => {
              const target = isKeyTarget(k);
              const pressed = isKeyPressed(k);
              const shiftActive = isShiftTarget(k.id);
              const fingerColorClass = internalShowColors ? fingerBgClasses[k.finger] : null;

              let keyStyle = 'bg-surface text-text border-border';

              if (target || shiftActive) {
                keyStyle = 'bg-accent text-white border-accent shadow-subtle';
              } else if (pressed) {
                keyStyle = 'bg-text text-bg border-text';
              } else if (fingerColorClass) {
                keyStyle = fingerColorClass;
              }

              return (
                <div
                  key={kIdx}
                  className={`relative flex flex-col items-center justify-center font-mono rounded-btn border transition-all duration-75 select-none ${
                    k.width || 'w-10'
                  } h-10 text-xs ${keyStyle} ${
                    k.isSpecial ? 'font-sans text-2xs font-medium text-text-muted' : 'font-medium'
                  }`}
                >
                  {k.shiftKey && (
                    <span className={`text-[9px] leading-none mb-0.5 opacity-60 ${target && k.shiftKey === targetChar ? 'font-bold text-white' : ''}`}>
                      {k.shiftKey}
                    </span>
                  )}
                  <span className={`leading-none uppercase ${target && k.key.toLowerCase() === targetChar?.toLowerCase() ? 'font-bold text-white' : ''}`}>
                    {k.key}
                  </span>

                  {k.hasBump && (
                    <div className="absolute bottom-1 w-2.5 h-0.5 rounded-full bg-text/40" />
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Minimal Hand SVG Visual Guide */}
      {internalShowHands && (
        <div className="mt-4 pt-3 border-t border-border flex items-center justify-center gap-12 text-2xs text-text-muted">
          {/* Left Hand */}
          <div className="flex flex-col items-center gap-1">
            <span className="font-medium">Left Hand</span>
            <div className="flex items-end gap-1 h-8">
              <span title="Pinky" className={`w-2 rounded-t transition-all ${activeFingerKey === 'left-pinky' ? 'h-6 bg-accent' : 'h-5 bg-border'}`} />
              <span title="Ring" className={`w-2 rounded-t transition-all ${activeFingerKey === 'left-ring' ? 'h-7 bg-accent' : 'h-6 bg-border'}`} />
              <span title="Middle" className={`w-2 rounded-t transition-all ${activeFingerKey === 'left-middle' ? 'h-8 bg-accent' : 'h-7 bg-border'}`} />
              <span title="Index" className={`w-2 rounded-t transition-all ${activeFingerKey === 'left-index' ? 'h-7 bg-accent' : 'h-6 bg-border'}`} />
              <span title="Thumb" className={`w-2.5 rounded-t transition-all ${activeFingerKey === 'thumb' ? 'h-4 bg-accent' : 'h-4 bg-border'}`} />
            </div>
          </div>

          {/* Right Hand */}
          <div className="flex flex-col items-center gap-1">
            <span className="font-medium">Right Hand</span>
            <div className="flex items-end gap-1 h-8">
              <span title="Thumb" className={`w-2.5 rounded-t transition-all ${activeFingerKey === 'thumb' ? 'h-4 bg-accent' : 'h-4 bg-border'}`} />
              <span title="Index" className={`w-2 rounded-t transition-all ${activeFingerKey === 'right-index' ? 'h-7 bg-accent' : 'h-6 bg-border'}`} />
              <span title="Middle" className={`w-2 rounded-t transition-all ${activeFingerKey === 'right-middle' ? 'h-8 bg-accent' : 'h-7 bg-border'}`} />
              <span title="Ring" className={`w-2 rounded-t transition-all ${activeFingerKey === 'right-ring' ? 'h-7 bg-accent' : 'h-6 bg-border'}`} />
              <span title="Pinky" className={`w-2 rounded-t transition-all ${activeFingerKey === 'right-pinky' ? 'h-6 bg-accent' : 'h-5 bg-border'}`} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
