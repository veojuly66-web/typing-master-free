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
  // English mappings
  '1': 'left-pinky', '!': 'left-pinky', '`': 'left-pinky', '~': 'left-pinky',
  'q': 'left-pinky', 'Q': 'left-pinky',
  'a': 'left-pinky', 'A': 'left-pinky',
  'z': 'left-pinky', 'Z': 'left-pinky',
  'tab': 'left-pinky',

  '2': 'left-ring', '@': 'left-ring', '"': 'left-ring',
  'w': 'left-ring', 'W': 'left-ring',
  's': 'left-ring', 'S': 'left-ring',
  'x': 'left-ring', 'X': 'left-ring',

  '3': 'left-middle', '#': 'left-middle', '£': 'left-middle',
  'e': 'left-middle', 'E': 'left-middle',
  'd': 'left-middle', 'D': 'left-middle',
  'c': 'left-middle', 'C': 'left-middle',

  '4': 'left-index', '$': 'left-index',
  '5': 'left-index', '%': 'left-index',
  'r': 'left-index', 'R': 'left-index',
  't': 'left-index', 'T': 'left-index',
  'f': 'left-index', 'F': 'left-index',
  'g': 'left-index', 'G': 'left-index',
  'v': 'left-index', 'V': 'left-index',
  'b': 'left-index', 'B': 'left-index',

  ' ': 'thumb',

  '6': 'right-index', '^': 'right-index',
  '7': 'right-index', '&': 'right-index',
  'y': 'right-index', 'Y': 'right-index',
  'u': 'right-index', 'U': 'right-index',
  'h': 'right-index', 'H': 'right-index',
  'j': 'right-index', 'J': 'right-index',
  'n': 'right-index', 'N': 'right-index',
  'm': 'right-index', 'M': 'right-index',

  '8': 'right-middle', '*': 'right-middle',
  'i': 'right-middle', 'I': 'right-middle',
  'k': 'right-middle', 'K': 'right-middle',
  ',': 'right-middle', '<': 'right-middle',

  '9': 'right-ring', '(': 'right-ring',
  'o': 'right-ring', 'O': 'right-ring',
  'l': 'right-ring', 'L': 'right-ring',
  '.': 'right-ring', '>': 'right-ring',

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
  'backspace': 'right-pinky',

  // Devanagari Hindi Inscript key assignments
  'ौ': 'left-pinky', 'औ': 'left-pinky',
  'ो': 'left-pinky', 'ओ': 'left-pinky',
  'ॆ': 'left-pinky', 'ऒ': 'left-pinky',
  'ै': 'left-ring', 'ऐ': 'left-ring',
  'े': 'left-ring', 'ए': 'left-ring',
  'ं': 'left-ring', 'ँ': 'left-ring',
  'ा': 'left-middle', 'आ': 'left-middle',
  '्': 'left-middle', 'अ': 'left-middle',
  'म': 'left-middle', 'ण': 'left-middle',
  'ी': 'left-index', 'ई': 'left-index',
  'ू': 'left-index', 'ऊ': 'left-index',
  'ि': 'left-index', 'इ': 'left-index',
  'ु': 'left-index', 'उ': 'left-index',
  'न': 'left-index', 'ऩ': 'left-index',
  'व': 'left-index', 'ऴ': 'left-index',

  'ब': 'right-index', 'भ': 'right-index',
  'ह': 'right-index', 'ङ': 'right-index',
  'प': 'right-index', 'फ': 'right-index',
  'र': 'right-index', 'ऱ': 'right-index',
  'ल': 'right-index', 'ळ': 'right-index',
  'स': 'right-index', 'श': 'right-index',

  'ग': 'right-middle', 'घ': 'right-middle',
  'क': 'right-middle', 'ख': 'right-middle',
  'ष': 'right-middle',

  'द': 'right-ring', 'ध': 'right-ring',
  'त': 'right-ring', 'थ': 'right-ring',
  '।': 'right-ring',

  'ज': 'right-pinky', 'झ': 'right-pinky',
  'च': 'right-pinky', 'छ': 'right-pinky',
  'ट': 'right-pinky', 'ठ': 'right-pinky',
  'ड': 'right-pinky', 'ढ': 'right-pinky',
  '़': 'right-pinky', 'ञ': 'right-pinky',
  'य': 'right-pinky', 'य़': 'right-pinky'
};

export const US_ROWS = [
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

export const INSCRIPT_ROWS = [
  [
    { key: '`', shiftKey: '~', sub: '`', finger: 'left-pinky' },
    { key: '1', shiftKey: 'ऍ', sub: '1', finger: 'left-pinky' },
    { key: '2', shiftKey: 'ॅ', sub: '2', finger: 'left-ring' },
    { key: '3', shiftKey: '्र', sub: '3', finger: 'left-middle' },
    { key: '4', shiftKey: 'र्', sub: '4', finger: 'left-index' },
    { key: '5', shiftKey: 'ज्ञ', sub: '5', finger: 'left-index' },
    { key: '6', shiftKey: 'त्र', sub: '6', finger: 'right-index' },
    { key: '7', shiftKey: 'क्ष', sub: '7', finger: 'right-index' },
    { key: '8', shiftKey: 'श्र', sub: '8', finger: 'right-middle' },
    { key: '9', shiftKey: '(', sub: '9', finger: 'right-ring' },
    { key: '0', shiftKey: ')', sub: '0', finger: 'right-pinky' },
    { key: '-', shiftKey: 'ः', sub: '-', finger: 'right-pinky' },
    { key: 'ृ', shiftKey: 'ऋ', sub: '=', finger: 'right-pinky' },
    { key: 'Backspace', width: 'w-20', finger: 'right-pinky', isSpecial: true }
  ],
  [
    { key: 'Tab', width: 'w-14', finger: 'left-pinky', isSpecial: true },
    { key: 'ौ', shiftKey: 'औ', sub: 'Q', finger: 'left-pinky' },
    { key: 'ै', shiftKey: 'ऐ', sub: 'W', finger: 'left-ring' },
    { key: 'ा', shiftKey: 'आ', sub: 'E', finger: 'left-middle' },
    { key: 'ी', shiftKey: 'ई', sub: 'R', finger: 'left-index' },
    { key: 'ू', shiftKey: 'ऊ', sub: 'T', finger: 'left-index' },
    { key: 'ब', shiftKey: 'भ', sub: 'Y', finger: 'right-index' },
    { key: 'ह', shiftKey: 'ङ', sub: 'U', finger: 'right-index' },
    { key: 'ग', shiftKey: 'घ', sub: 'I', finger: 'right-middle' },
    { key: 'द', shiftKey: 'ध', sub: 'O', finger: 'right-ring' },
    { key: 'ज', shiftKey: 'झ', sub: 'P', finger: 'right-pinky' },
    { key: 'ड', shiftKey: 'ढ', sub: '[', finger: 'right-pinky' },
    { key: '़', shiftKey: 'ञ', sub: ']', finger: 'right-pinky' },
    { key: 'ॉ', shiftKey: 'ऑ', sub: '\\', width: 'w-14', finger: 'right-pinky' }
  ],
  [
    { key: 'Caps', width: 'w-16', finger: 'left-pinky', isSpecial: true },
    { key: 'ो', shiftKey: 'ओ', sub: 'A', finger: 'left-pinky', isHome: true },
    { key: 'े', shiftKey: 'ए', sub: 'S', finger: 'left-ring', isHome: true },
    { key: '्', shiftKey: 'अ', sub: 'D', finger: 'left-middle', isHome: true },
    { key: 'ि', shiftKey: 'इ', sub: 'F', finger: 'left-index', isHome: true, hasBump: true },
    { key: 'ु', shiftKey: 'उ', sub: 'G', finger: 'left-index' },
    { key: 'प', shiftKey: 'फ', sub: 'H', finger: 'right-index' },
    { key: 'र', shiftKey: 'ऱ', sub: 'J', finger: 'right-index', isHome: true, hasBump: true },
    { key: 'क', shiftKey: 'ख', sub: 'K', finger: 'right-middle', isHome: true },
    { key: 'त', shiftKey: 'थ', sub: 'L', finger: 'right-ring', isHome: true },
    { key: 'च', shiftKey: 'छ', sub: ';', finger: 'right-pinky', isHome: true },
    { key: 'ट', shiftKey: 'ठ', sub: '\'', finger: 'right-pinky' },
    { key: 'Enter', width: 'w-20', finger: 'right-pinky', isSpecial: true }
  ],
  [
    { key: 'Shift', width: 'w-20', finger: 'left-pinky', isSpecial: true, id: 'shift-left' },
    { key: 'ॆ', shiftKey: 'ऒ', sub: 'Z', finger: 'left-pinky' },
    { key: 'ं', shiftKey: 'ँ', sub: 'X', finger: 'left-ring' },
    { key: 'म', shiftKey: 'ण', sub: 'C', finger: 'left-middle' },
    { key: 'न', shiftKey: 'ऩ', sub: 'V', finger: 'left-index' },
    { key: 'व', shiftKey: 'ऴ', sub: 'B', finger: 'left-index' },
    { key: 'ल', shiftKey: 'ळ', sub: 'N', finger: 'right-index' },
    { key: 'स', shiftKey: 'श', sub: 'M', finger: 'right-index' },
    { key: ',', shiftKey: 'ष', sub: ',', finger: 'right-middle' },
    { key: '.', shiftKey: '।', sub: '.', finger: 'right-ring' },
    { key: 'य', shiftKey: 'य़', sub: '/', finger: 'right-pinky' },
    { key: 'Shift', width: 'w-20', finger: 'right-pinky', isSpecial: true, id: 'shift-right' }
  ],
  [
    { key: 'Ctrl', width: 'w-14', finger: 'left-pinky', isSpecial: true },
    { key: 'Alt', width: 'w-14', finger: 'thumb', isSpecial: true },
    { key: 'Space', width: 'w-72 flex-1', finger: 'thumb', isSpecial: true },
    { key: 'AltGr', width: 'w-14', finger: 'thumb', isSpecial: true },
    { key: 'Ctrl', width: 'w-14', finger: 'right-pinky', isSpecial: true }
  ]
];

export const REMINGTON_ROWS = [
  [
    { key: '`', shiftKey: '~', sub: '`', finger: 'left-pinky' },
    { key: '1', shiftKey: '!', sub: '1', finger: 'left-pinky' },
    { key: '2', shiftKey: 'द्ध', sub: '2', finger: 'left-ring' },
    { key: '3', shiftKey: 'त्र', sub: '3', finger: 'left-middle' },
    { key: '4', shiftKey: 'ऋ', sub: '4', finger: 'left-index' },
    { key: '5', shiftKey: 'ज्ञ', sub: '5', finger: 'left-index' },
    { key: '6', shiftKey: 'ट्र', sub: '6', finger: 'right-index' },
    { key: '7', shiftKey: 'क्ष', sub: '7', finger: 'right-index' },
    { key: '8', shiftKey: 'श्र', sub: '8', finger: 'right-middle' },
    { key: '9', shiftKey: '(', sub: '9', finger: 'right-ring' },
    { key: '0', shiftKey: ')', sub: '0', finger: 'right-pinky' },
    { key: '-', shiftKey: 'ः', sub: '-', finger: 'right-pinky' },
    { key: 'त्र', shiftKey: 'ऋ', sub: '=', finger: 'right-pinky' },
    { key: 'Backspace', width: 'w-20', finger: 'right-pinky', isSpecial: true }
  ],
  [
    { key: 'Tab', width: 'w-14', finger: 'left-pinky', isSpecial: true },
    { key: 'ु', shiftKey: 'फ', sub: 'Q', finger: 'left-pinky' },
    { key: 'ू', shiftKey: 'ँ', sub: 'W', finger: 'left-ring' },
    { key: 'म', shiftKey: 'म्', sub: 'E', finger: 'left-middle' },
    { key: 'त', shiftKey: 'त्', sub: 'R', finger: 'left-index' },
    { key: 'ज', shiftKey: 'ज्', sub: 'T', finger: 'left-index' },
    { key: 'ल', shiftKey: 'ल्', sub: 'Y', finger: 'right-index' },
    { key: 'न', shiftKey: 'न्', sub: 'U', finger: 'right-index' },
    { key: 'प', shiftKey: 'प्', sub: 'I', finger: 'right-middle' },
    { key: 'व', shiftKey: 'व्', sub: 'O', finger: 'right-ring' },
    { key: 'च', shiftKey: 'च्', sub: 'P', finger: 'right-pinky' },
    { key: 'ख', shiftKey: 'ख्', sub: '[', finger: 'right-pinky' },
    { key: ',', shiftKey: 'द्व', sub: ']', finger: 'right-pinky' },
    { key: '.', shiftKey: '।', sub: '\\', width: 'w-14', finger: 'right-pinky' }
  ],
  [
    { key: 'Caps', width: 'w-16', finger: 'left-pinky', isSpecial: true },
    { key: 'ं', shiftKey: 'ँ', sub: 'A', finger: 'left-pinky', isHome: true },
    { key: 'े', shiftKey: 'ै', sub: 'S', finger: 'left-ring', isHome: true },
    { key: '्', shiftKey: 'क्', sub: 'D', finger: 'left-middle', isHome: true },
    { key: 'ि', shiftKey: 'थ', sub: 'F', finger: 'left-index', isHome: true, hasBump: true },
    { key: 'ह', shiftKey: 'भ', sub: 'G', finger: 'left-index' },
    { key: 'ी', shiftKey: 'भ्', sub: 'H', finger: 'right-index' },
    { key: 'र', shiftKey: 'रू', sub: 'J', finger: 'right-index', isHome: true, hasBump: true },
    { key: 'ा', shiftKey: 'ज्ञ', sub: 'K', finger: 'right-middle', isHome: true },
    { key: 'स', shiftKey: 'स्', sub: 'L', finger: 'right-ring', isHome: true },
    { key: 'य', shiftKey: 'श्', sub: ';', finger: 'right-pinky', isHome: true },
    { key: 'श', shiftKey: 'ष्', sub: '\'', finger: 'right-pinky' },
    { key: 'Enter', width: 'w-20', finger: 'right-pinky', isSpecial: true }
  ],
  [
    { key: 'Shift', width: 'w-20', finger: 'left-pinky', isSpecial: true, id: 'shift-left' },
    { key: '्र', shiftKey: 'र्', sub: 'Z', finger: 'left-pinky' },
    { key: 'ग', shiftKey: 'ग्', sub: 'X', finger: 'left-ring' },
    { key: 'ब', shiftKey: 'ब्', sub: 'C', finger: 'left-middle' },
    { key: 'अ', shiftKey: 'ट', sub: 'V', finger: 'left-index' },
    { key: 'इ', shiftKey: 'ठ', sub: 'B', finger: 'left-index' },
    { key: 'द', shiftKey: 'छ', sub: 'N', finger: 'right-index' },
    { key: 'उ', shiftKey: 'ड', sub: 'M', finger: 'right-index' },
    { key: 'ए', shiftKey: 'ढ', sub: ',', finger: 'right-middle' },
    { key: 'ण', shiftKey: 'झ', sub: '.', finger: 'right-ring' },
    { key: 'ध', shiftKey: 'ध्', sub: '/', finger: 'right-pinky' },
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

export const KEYBOARD_ROWS = US_ROWS;

export function getKeyboardRows(layout = 'us') {
  if (layout === 'inscript') return INSCRIPT_ROWS;
  if (layout === 'remington-gail') return REMINGTON_ROWS;
  return US_ROWS;
}

export function getFingerInfo(char) {
  if (!char) return null;
  const firstCodePoint = Array.from(char)[0];
  const fingerKey = CHAR_TO_FINGER[char] || CHAR_TO_FINGER[firstCodePoint] || CHAR_TO_FINGER[char.toLowerCase()] || 'thumb';
  const color = FINGER_COLORS[fingerKey] || FINGER_COLORS['thumb'];
  const needsShift = char !== ' ' && char !== char.toLowerCase() && /[A-Z!@#$%^&*()_+{}|:"<>?~¬£ऍॅ्रर्ज्ञत्रक्षश्रःऋऔऐआईऊभङघधझढञऑओएउफऱखथछठँणऩऴळशष।य़]/.test(char);

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
