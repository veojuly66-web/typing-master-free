import React, { useState } from 'react';
import { KEYBOARD_ROWS, CHAR_TO_FINGER, FINGER_COLORS, getFingerInfo } from '../utils/fingerMap';
import { Hand, Eye, EyeOff, Sparkles } from 'lucide-react';

export default function VirtualKeyboard({ targetChar, activeKey, showHands = true }) {
  const [showColorCoded, setShowColorCoded] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);

  const fingerInfo = getFingerInfo(targetChar);

  // Normalize target key for matching keycap
  const getNormalizedTarget = (char) => {
    if (!char) return '';
    if (char === ' ') return 'Space';
    return char;
  };

  const normTarget = getNormalizedTarget(targetChar);

  // Check if a specific keycap is the target
  const isKeyTarget = (rowKey) => {
    if (!targetChar) return false;
    if (rowKey.key === 'Space' && targetChar === ' ') return true;
    if (rowKey.key.toLowerCase() === targetChar.toLowerCase()) return true;
    if (rowKey.shiftKey === targetChar) return true;
    return false;
  };

  // Check if this key is currently physically pressed down
  const isKeyPressed = (rowKey) => {
    if (!activeKey) return false;
    if (rowKey.key === 'Space' && activeKey === ' ') return true;
    if (rowKey.key.toLowerCase() === activeKey.toLowerCase()) return true;
    if (rowKey.shiftKey === activeKey) return true;
    return false;
  };

  // Determine if Shift key should glow
  const isShiftTarget = (rowKeyId) => {
    if (!fingerInfo?.needsShift) return false;
    // Opposite shift
    if (fingerInfo.fingerKey.startsWith('left') && rowKeyId === 'shift-right') return true;
    if (fingerInfo.fingerKey.startsWith('right') && rowKeyId === 'shift-left') return true;
    return false;
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-6 bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-800 p-4 shadow-2xl transition-all">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800/80 mb-3 text-sm">
        {/* Current Key Instruction */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Target Key:</span>
            <span className="inline-flex items-center justify-center min-w-[32px] h-8 px-2.5 rounded-lg bg-blue-600/30 text-blue-300 font-mono text-base font-bold border border-blue-500/50 shadow-inner">
              {targetChar === ' ' ? '␣ Space' : targetChar || '—'}
            </span>
          </div>

          {fingerInfo && (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/90 border border-slate-700/80 text-xs">
              <span className={`w-2.5 h-2.5 rounded-full ${fingerInfo.badge} animate-pulse`} />
              <span className="text-slate-300 font-medium">
                Use: <strong className={fingerInfo.text}>{fingerInfo.name}</strong>
              </span>
              {fingerInfo.needsShift && (
                <span className="ml-1 text-amber-300 font-semibold bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30 text-[11px]">
                  + {fingerInfo.shiftHand}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => setShowColorCoded(!showColorCoded)}
            className={`px-2.5 py-1 rounded-lg border transition-colors flex items-center gap-1.5 ${
              showColorCoded 
                ? 'bg-blue-600/20 text-blue-400 border-blue-500/30' 
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Finger Colors</span>
          </button>

          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors flex items-center gap-1"
          >
            {isMinimized ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>{isMinimized ? 'Show' : 'Minimize'}</span>
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Keyboard Layout */}
          <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 select-none overflow-x-auto">
            {KEYBOARD_ROWS.map((row, rIdx) => (
              <div key={rIdx} className="flex justify-center gap-1.5 min-w-[700px]">
                {row.map((k, kIdx) => {
                  const target = isKeyTarget(k);
                  const pressed = isKeyPressed(k);
                  const shiftActive = isShiftTarget(k.id);
                  const fingerStyle = showColorCoded && FINGER_COLORS[k.finger];

                  // Base Keycap Styling
                  let keyBg = 'bg-slate-800/90 text-slate-200 border-slate-700/80 shadow-sm';
                  let keyGlow = '';

                  if (target || shiftActive) {
                    keyBg = 'bg-blue-600 text-white border-blue-300 shadow-lg shadow-blue-500/40 translate-y-[-2px] ring-2 ring-blue-400/80';
                    keyGlow = 'animate-pulse';
                  } else if (pressed) {
                    keyBg = 'bg-emerald-600 text-white border-emerald-400 translate-y-[2px] shadow-none';
                  } else if (showColorCoded && fingerStyle) {
                    keyBg = `${fingerStyle.bg} ${fingerStyle.text} ${fingerStyle.border} hover:bg-slate-700/60`;
                  }

                  return (
                    <div
                      key={kIdx}
                      className={`relative flex flex-col items-center justify-center font-mono font-medium rounded-lg border transition-all duration-75 select-none ${
                        k.width || 'w-11'
                      } h-11 text-xs md:text-sm ${keyBg} ${keyGlow} ${
                        k.isSpecial ? 'text-[11px] font-sans font-semibold tracking-tight text-slate-400' : ''
                      }`}
                    >
                      {/* Secondary / Shift key legend */}
                      {k.shiftKey && (
                        <span className={`text-[10px] leading-none mb-0.5 opacity-70 ${target && k.shiftKey === targetChar ? 'font-bold text-amber-300 scale-125' : ''}`}>
                          {k.shiftKey}
                        </span>
                      )}
                      
                      {/* Primary key legend */}
                      <span className={`leading-none uppercase ${target && k.key.toLowerCase() === targetChar?.toLowerCase() ? 'font-black scale-110 text-white' : ''}`}>
                        {k.key}
                      </span>

                      {/* Home Row Tactile Bumps on F and J */}
                      {k.hasBump && (
                        <div className="absolute bottom-1.5 w-3 h-0.5 rounded-full bg-slate-300/80" />
                      )}

                      {/* Home Row indicator dot */}
                      {k.isHome && !k.hasBump && (
                        <div className="absolute bottom-1 w-1 h-1 rounded-full bg-slate-400/40" />
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Hands Guide Visualization */}
          {showHands && (
            <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Hand className="w-4 h-4 text-blue-400" />
                <span className="font-semibold text-slate-300">Hand Guide:</span>
                <span>Rest your 8 fingers on the Home Row (ASDF JKL;) & thumbs on Spacebar.</span>
              </div>

              {/* Color legend pills */}
              {showColorCoded && (
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> Pinky
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Ring
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Middle
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Index
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-500/20 text-slate-300 border border-slate-500/30 text-[10px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400" /> Thumb
                  </span>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
