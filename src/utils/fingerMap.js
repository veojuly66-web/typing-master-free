export const FINGER_COLORS = {
  'left-pinky': { bg: 'bg-[#FCE7E4] dark:bg-[#382221]', border: 'border-[#F4CCC6] dark:border-[#4E2B29]', text: 'text-[#9A3428] dark:text-[#F3B2AC]', dot: 'bg-rose-400', name: 'Left pinky' },
  'left-ring': { bg: 'bg-[#FDEFD9] dark:bg-[#3A2E1D]', border: 'border-[#F6DCB6] dark:border-[#523F23]', text: 'text-[#8C5E18] dark:text-[#F4D19B]', dot: 'bg-amber-400', name: 'Left ring' },
  'left-middle': { bg: 'bg-[#E6F4EA] dark:bg-[#1B3124]', border: 'border-[#C8E7D1] dark:border-[#274B34]', text: 'text-[#1E7038] dark:text-[#A8E2B9]', dot: 'bg-emerald-400', name: 'Left middle' },
  'left-index': { bg: 'bg-[#E3EEFB] dark:bg-[#1C293B]', border: 'border-[#C2DBF7] dark:border-[#273F5E]', text: 'text-[#1C5CA8] dark:text-[#ABC9F5]', dot: 'bg-blue-400', name: 'Left index' },
  'thumb': { bg: 'bg-[#EEEDEA] dark:bg-[#282725]', border: 'border-[#DDDCD6] dark:border-[#383733]', text: 'text-[#55534E] dark:text-[#C7C5BF]', dot: 'bg-stone-400', name: 'Thumb' },
  'right-index': { bg: 'bg-[#E3EEFB] dark:bg-[#1C293B]', border: 'border-[#C2DBF7] dark:border-[#273F5E]', text: 'text-[#1C5CA8] dark:text-[#ABC9F5]', dot: 'bg-blue-400', name: 'Right index' },
  'right-middle': { bg: 'bg-[#E6F4EA] dark:bg-[#1B3124]', border: 'border-[#C8E7D1] dark:border-[#274B34]', text: 'text-[#1E7038] dark:text-[#A8E2B9]', dot: 'bg-emerald-400', name: 'Right middle' },
  'right-ring': { bg: 'bg-[#FDEFD9] dark:bg-[#3A2E1D]', border: 'border-[#F6DCB6] dark:border-[#523F23]', text: 'text-[#8C5E18] dark:text-[#F4D19B]', dot: 'bg-amber-400', name: 'Right ring' },
  'right-pinky': { bg: 'bg-[#EEE8FB] dark:bg-[#2A213B]', border: 'border-[#D8CEF7] dark:border-[#40305C]', text: 'text-[#5B3CA8] dark:text-[#CBBBF5]', dot: 'bg-purple-400', name: 'Right pinky' }
};

export const CHAR_TO_FINGER = {
  // Left Pinky
  '1': 'left-pinky', '!': 'left-pinky', '`': 'left-pinky', '~': 'left-pinky',
  'q': 'left-pinky', 'Q': 'left-pinky',
  'a': 'left-pinky', 'A': 'left-pinky',
  'z': 'left-pinky', 'Z': 'left-pinky',
  'tab': 'left-pinky',

  // Left Ring
  '2': 'left-ring', '@': 'left-ring', '"': 'left-ring',
  'w': 'left-ring', 'W': 'left-ring',
  's': 'left-ring', 'S': 'left-ring',
  'x': 'left-ring', 'X': 'left-ring',

  // Left Middle
  '3': 'left-middle', '#': 'left-middle', '£': 'left-middle',
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
  '\'': 'right-pinky',
  '/': 'right-pinky', '?': 'right-pinky',
  'enter': 'right-pinky',
  'backspace': 'right-pinky'
};

const US_ROWS = [
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

const UK_ROWS = [
  [
    { key: '`', shiftKey: '¬', finger: 'left-pinky' },
    { key: '1', shiftKey: '!', finger: 'left-pinky' },
    { key: '2', shiftKey: '"', finger: 'left-ring' },
    { key: '3', shiftKey: '£', finger: 'left-middle' },
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
    { key: 'Enter', width: 'w-14', finger: 'right-pinky', isSpecial: true }
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
    { key: '\'', shiftKey: '@', finger: 'right-pinky' },
    { key: '#', shiftKey: '~', finger: 'right-pinky' }
  ],
  [
    { key: 'Shift', width: 'w-16', finger: 'left-pinky', isSpecial: true, id: 'shift-left' },
    { key: '\\', shiftKey: '|', finger: 'left-pinky' },
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
    { key: 'Ctrl', width: 'w-14', finger: 'left-pinky', isSpecial: true },
    { key: 'Alt', width: 'w-14', finger: 'thumb', isSpecial: true },
    { key: 'Space', width: 'w-72 flex-1', finger: 'thumb', isSpecial: true },
    { key: 'AltGr', width: 'w-14', finger: 'thumb', isSpecial: true },
    { key: 'Ctrl', width: 'w-14', finger: 'right-pinky', isSpecial: true }
  ]
];

export const KEYBOARD_ROWS = US_ROWS;

export function getKeyboardRows(layout = 'us') {
  return layout === 'uk' ? UK_ROWS : US_ROWS;
}

export function getFingerInfo(char) {
  if (!char) return null;
  const fingerKey = CHAR_TO_FINGER[char] || CHAR_TO_FINGER[char.toLowerCase()] || 'thumb';
  const color = FINGER_COLORS[fingerKey] || FINGER_COLORS['thumb'];
  const needsShift = char !== ' ' && char !== char.toLowerCase() && /[A-Z!@#$%^&*()_+{}|:"<>?~¬£]/.test(char);

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
