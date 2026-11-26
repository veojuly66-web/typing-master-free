export const FINGER_COLORS = {
  'left-pinky': { bg: 'bg-rose-50/70 dark:bg-rose-950/30', border: 'border-rose-200/80 dark:border-rose-900/40', text: 'text-rose-700 dark:text-rose-300', dot: 'bg-rose-400', name: 'Left pinky' },
  'left-ring': { bg: 'bg-amber-50/70 dark:bg-amber-950/30', border: 'border-amber-200/80 dark:border-amber-900/40', text: 'text-amber-700 dark:text-amber-300', dot: 'bg-amber-400', name: 'Left ring' },
  'left-middle': { bg: 'bg-emerald-50/70 dark:bg-emerald-950/30', border: 'border-emerald-200/80 dark:border-emerald-900/40', text: 'text-emerald-700 dark:text-emerald-300', dot: 'bg-emerald-400', name: 'Left middle' },
  'left-index': { bg: 'bg-blue-50/70 dark:bg-blue-950/30', border: 'border-blue-200/80 dark:border-blue-900/40', text: 'text-blue-700 dark:text-blue-300', dot: 'bg-blue-400', name: 'Left index' },
  'thumb': { bg: 'bg-stone-50/70 dark:bg-stone-900/30', border: 'border-stone-200/80 dark:border-stone-800/50', text: 'text-stone-700 dark:text-stone-300', dot: 'bg-stone-400', name: 'Thumb' },
  'right-index': { bg: 'bg-indigo-50/70 dark:bg-indigo-950/30', border: 'border-indigo-200/80 dark:border-indigo-900/40', text: 'text-indigo-700 dark:text-indigo-300', dot: 'bg-indigo-400', name: 'Right index' },
  'right-middle': { bg: 'bg-teal-50/70 dark:bg-teal-950/30', border: 'border-teal-200/80 dark:border-teal-900/40', text: 'text-teal-700 dark:text-teal-300', dot: 'bg-teal-400', name: 'Right middle' },
  'right-ring': { bg: 'bg-orange-50/70 dark:bg-orange-950/30', border: 'border-orange-200/80 dark:border-orange-900/40', text: 'text-orange-700 dark:text-orange-300', dot: 'bg-orange-400', name: 'Right ring' },
  'right-pinky': { bg: 'bg-pink-50/70 dark:bg-pink-950/30', border: 'border-pink-200/80 dark:border-pink-900/40', text: 'text-pink-700 dark:text-pink-300', dot: 'bg-pink-400', name: 'Right pinky' }
};

export const CHAR_TO_FINGER = {
  // Left Pinky
  '1': 'left-pinky', '!': 'left-pinky', '`': 'left-pinky', '~': 'left-pinky',
  'q': 'left-pinky', 'Q': 'left-pinky',
  'a': 'left-pinky', 'A': 'left-pinky',
  'z': 'left-pinky', 'Z': 'left-pinky',
  'tab': 'left-pinky',

  // Left Ring
  '2': 'left-ring', '@': 'left-ring',
  'w': 'left-ring', 'W': 'left-ring',
  's': 'left-ring', 'S': 'left-ring',
  'x': 'left-ring', 'X': 'left-ring',

  // Left Middle
  '3': 'left-middle', '#': 'left-middle',
  'e': 'left-middle', 'E': 'left-middle',
  'd': 'left-middle', 'D': 'left-middle',
  'c': 'left-middle', 'C': 'left-middle',

  // Left Index
  '4': 'left-index', '$': 'left-index',
  '5': 'left-index', '%': 'left-index',
  'r': 'left-index', 'R': 'left-index',
  't': 'left-index', 'T': 'left-index',
  'f': 'left-index', 'F': 'left-index',
  'g': 'left-index', 'G': 'left-index',
  'v': 'left-index', 'V': 'left-index',
  'b': 'left-index', 'B': 'left-index',

  // Space / Thumbs
  ' ': 'thumb',

  // Right Index
  '6': 'right-index', '^': 'right-index',
  '7': 'right-index', '&': 'right-index',
  'y': 'right-index', 'Y': 'right-index',
  'u': 'right-index', 'U': 'right-index',
  'h': 'right-index', 'H': 'right-index',
  'j': 'right-index', 'J': 'right-index',
  'n': 'right-index', 'N': 'right-index',
  'm': 'right-index', 'M': 'right-index',

  // Right Middle
  '8': 'right-middle', '*': 'right-middle',
  'i': 'right-middle', 'I': 'right-middle',
  'k': 'right-middle', 'K': 'right-middle',
  ',': 'right-middle', '<': 'right-middle',

  // Right Ring
  '9': 'right-ring', '(': 'right-ring',
  'o': 'right-ring', 'O': 'right-ring',
  'l': 'right-ring', 'L': 'right-ring',
  '.': 'right-ring', '>': 'right-ring',

  // Right Pinky
  '0': 'right-pinky', ')': 'right-pinky',
  '-': 'right-pinky', '_': 'right-pinky',
  '=': 'right-pinky', '+': 'right-pinky',
  'p': 'right-pinky', 'P': 'right-pinky',
  '[': 'right-pinky', '{': 'right-pinky',
  ']': 'right-pinky', '}': 'right-pinky',
  '\\': 'right-pinky', '|': 'right-pinky',
  ';': 'right-pinky', ':': 'right-pinky',
  '\'': 'right-pinky', '"': 'right-pinky',
  '/': 'right-pinky', '?': 'right-pinky',
  'enter': 'right-pinky',
  'backspace': 'right-pinky'
};

export const KEYBOARD_ROWS = [
  [
    { key: '`', shiftKey: '~', finger: 'left-pinky' },
    { key: '1', shiftKey: '!', finger: 'left-pinky' },
    { key: '2', shiftKey: '@', finger: 'left-ring' },
    { key: '3', shiftKey: '#', finger: 'left-middle' },
    { key: '4', shiftKey: '$', finger: 'left-index' },
    { key: '5', shiftKey: '%', finger: 'left-index' },
    { key: '6', shiftKey: '^', finger: 'right-index' },
    { key: '7', shiftKey: '&', finger: 'right-index' },
    { key: '8', shiftKey: '*', finger: 'right-middle' },
    { key: '9', shiftKey: '(', finger: 'right-ring' },
    { key: '0', shiftKey: ')', finger: 'right-pinky' },
    { key: '-', shiftKey: '_', finger: 'right-pinky' },
    { key: '=', shiftKey: '+', finger: 'right-pinky' },
    { key: 'Backspace', width: 'w-20', finger: 'right-pinky', isSpecial: true }
  ],
  [
    { key: 'Tab', width: 'w-14', finger: 'left-pinky', isSpecial: true },
    { key: 'q', shiftKey: 'Q', finger: 'left-pinky' },
    { key: 'w', shiftKey: 'W', finger: 'left-ring' },
    { key: 'e', shiftKey: 'E', finger: 'left-middle' },
    { key: 'r', shiftKey: 'R', finger: 'left-index' },
    { key: 't', shiftKey: 'T', finger: 'left-index' },
    { key: 'y', shiftKey: 'Y', finger: 'right-index' },
    { key: 'u', shiftKey: 'U', finger: 'right-index' },
    { key: 'i', shiftKey: 'I', finger: 'right-middle' },
    { key: 'o', shiftKey: 'O', finger: 'right-ring' },
    { key: 'p', shiftKey: 'P', finger: 'right-pinky' },
    { key: '[', shiftKey: '{', finger: 'right-pinky' },
    { key: ']', shiftKey: '}', finger: 'right-pinky' },
    { key: '\\', shiftKey: '|', width: 'w-14', finger: 'right-pinky' }
  ],
  [
    { key: 'Caps', width: 'w-16', finger: 'left-pinky', isSpecial: true },
    { key: 'a', shiftKey: 'A', finger: 'left-pinky', isHome: true },
    { key: 's', shiftKey: 'S', finger: 'left-ring', isHome: true },
    { key: 'd', shiftKey: 'D', finger: 'left-middle', isHome: true },
    { key: 'f', shiftKey: 'F', finger: 'left-index', isHome: true, hasBump: true },
    { key: 'g', shiftKey: 'G', finger: 'left-index' },
    { key: 'h', shiftKey: 'H', finger: 'right-index' },
    { key: 'j', shiftKey: 'J', finger: 'right-index', isHome: true, hasBump: true },
    { key: 'k', shiftKey: 'K', finger: 'right-middle', isHome: true },
    { key: 'l', shiftKey: 'L', finger: 'right-ring', isHome: true },
    { key: ';', shiftKey: ':', finger: 'right-pinky', isHome: true },
    { key: '\'', shiftKey: '"', finger: 'right-pinky' },
    { key: 'Enter', width: 'w-20', finger: 'right-pinky', isSpecial: true }
  ],
  [
    { key: 'Shift', width: 'w-20', finger: 'left-pinky', isSpecial: true, id: 'shift-left' },
    { key: 'z', shiftKey: 'Z', finger: 'left-pinky' },
    { key: 'x', shiftKey: 'X', finger: 'left-ring' },
    { key: 'c', shiftKey: 'C', finger: 'left-middle' },
    { key: 'v', shiftKey: 'V', finger: 'left-index' },
    { key: 'b', shiftKey: 'B', finger: 'left-index' },
    { key: 'n', shiftKey: 'N', finger: 'right-index' },
    { key: 'm', shiftKey: 'M', finger: 'right-index' },
    { key: ',', shiftKey: '<', finger: 'right-middle' },
    { key: '.', shiftKey: '>', finger: 'right-ring' },
    { key: '/', shiftKey: '?', finger: 'right-pinky' },
    { key: 'Shift', width: 'w-20', finger: 'right-pinky', isSpecial: true, id: 'shift-right' }
  ],
  [
    { key: 'Ctrl', width: 'w-14', finger: 'left-pinky', isSpecial: true },
    { key: 'Alt', width: 'w-14', finger: 'thumb', isSpecial: true },
    { key: 'Space', width: 'w-72 flex-1', finger: 'thumb', isSpecial: true },
    { key: 'Alt', width: 'w-14', finger: 'thumb', isSpecial: true },
    { key: 'Ctrl', width: 'w-14', finger: 'right-pinky', isSpecial: true }
  ]
];

export function getFingerInfo(char) {
  if (!char) return null;
  const fingerKey = CHAR_TO_FINGER[char] || CHAR_TO_FINGER[char.toLowerCase()] || 'thumb';
  const color = FINGER_COLORS[fingerKey] || FINGER_COLORS['thumb'];
  const needsShift = char !== ' ' && char !== char.toLowerCase() && /[A-Z!@#$%^&*()_+{}|:"<>?~]/.test(char);
  
  let shiftHand = null;
  if (needsShift) {
    shiftHand = fingerKey.startsWith('left') ? 'Right Shift' : 'Left Shift';
  }

  return {
    fingerKey,
    ...color,
    needsShift,
    shiftHand
  };
}
