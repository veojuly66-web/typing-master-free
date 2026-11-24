export const FINGER_COLORS = {
  'left-pinky': { bg: 'bg-rose-500/20', border: 'border-rose-500', text: 'text-rose-400', badge: 'bg-rose-500', name: 'Left Pinky' },
  'left-ring': { bg: 'bg-amber-500/20', border: 'border-amber-500', text: 'text-amber-400', badge: 'bg-amber-500', name: 'Left Ring' },
  'left-middle': { bg: 'bg-emerald-500/20', border: 'border-emerald-500', text: 'text-emerald-400', badge: 'bg-emerald-500', name: 'Left Middle' },
  'left-index': { bg: 'bg-blue-500/20', border: 'border-blue-500', text: 'text-blue-400', badge: 'bg-blue-500', name: 'Left Index' },
  'thumb': { bg: 'bg-slate-500/20', border: 'border-slate-400', text: 'text-slate-300', badge: 'bg-slate-500', name: 'Thumb' },
  'right-index': { bg: 'bg-purple-500/20', border: 'border-purple-500', text: 'text-purple-400', badge: 'bg-purple-500', name: 'Right Index' },
  'right-middle': { bg: 'bg-teal-500/20', border: 'border-teal-500', text: 'text-teal-400', badge: 'bg-teal-500', name: 'Right Middle' },
  'right-ring': { bg: 'bg-orange-500/20', border: 'border-orange-500', text: 'text-orange-400', badge: 'bg-orange-500', name: 'Right Ring' },
  'right-pinky': { bg: 'bg-pink-500/20', border: 'border-pink-500', text: 'text-pink-400', badge: 'bg-pink-500', name: 'Right Pinky' }
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
    { key: 'Tab', width: 'w-16', finger: 'left-pinky', isSpecial: true },
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
    { key: 'Caps', width: 'w-20', finger: 'left-pinky', isSpecial: true },
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
    { key: 'Enter', width: 'w-24', finger: 'right-pinky', isSpecial: true }
  ],
  [
    { key: 'Shift', width: 'w-24', finger: 'left-pinky', isSpecial: true, id: 'shift-left' },
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
    { key: 'Shift', width: 'w-24', finger: 'right-pinky', isSpecial: true, id: 'shift-right' }
  ],
  [
    { key: 'Ctrl', width: 'w-16', finger: 'left-pinky', isSpecial: true },
    { key: 'Alt', width: 'w-16', finger: 'thumb', isSpecial: true },
    { key: 'Space', width: 'w-80 flex-1', finger: 'thumb', isSpecial: true },
    { key: 'Alt', width: 'w-16', finger: 'thumb', isSpecial: true },
    { key: 'Ctrl', width: 'w-16', finger: 'right-pinky', isSpecial: true }
  ]
];

export function getFingerInfo(char) {
  if (!char) return null;
  const fingerKey = CHAR_TO_FINGER[char] || CHAR_TO_FINGER[char.toLowerCase()] || 'thumb';
  const color = FINGER_COLORS[fingerKey] || FINGER_COLORS['thumb'];
  const needsShift = char !== ' ' && char !== char.toLowerCase() && /[A-Z!@#$%^&*()_+{}|:"<>?~]/.test(char);
  
  // Decide which shift key to use: opposite hand!
  let shiftHand = null;
  if (needsShift) {
    shiftHand = fingerKey.startsWith('left') ? 'Right Shift (Right Pinky)' : 'Left Shift (Left Pinky)';
  }

  return {
    fingerKey,
    ...color,
    needsShift,
    shiftHand
  };
}
