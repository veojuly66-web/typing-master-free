// Hindi Keyboard Layouts (Inscript & Remington Gail)
// Finger codes:
// 1: Left Pinky (कनिष्ठिका - बायाँ)
// 2: Left Ring (अनामिका - बायाँ)
// 3: Left Middle (मध्यमा - बायाँ)
// 4: Left Index (तर्जनी - बायाँ)
// 5: Thumbs (अंगूठा - स्पेस)
// 6: Right Index (तर्जनी - दायाँ)
// 7: Right Middle (मध्यमा - दायाँ)
// 8: Right Ring (अनामिका - दायाँ)
// 9: Right Pinky (कनिष्ठिका - दायाँ)

export const FINGER_COLORS = {
  1: '#f87171', // Red - Left Pinky
  2: '#fb923c', // Orange - Left Ring
  3: '#fbbf24', // Amber - Left Middle
  4: '#34d399', // Emerald - Left Index
  5: '#60a5fa', // Blue - Thumbs (Space)
  6: '#818cf8', // Indigo - Right Index
  7: '#a78bfa', // Purple - Right Middle
  8: '#f472b6', // Pink - Right Ring
  9: '#fb7185', // Rose - Right Pinky
};

export const FINGER_NAMES = {
  1: 'बायां कनिष्ठिका (Left Pinky)',
  2: 'बायां अनामिका (Left Ring)',
  3: 'बायां मध्यमा (Left Middle)',
  4: 'बायां तर्जनी (Left Index)',
  5: 'अंगूठा (Space/Thumb)',
  6: 'दायां तर्जनी (Right Index)',
  7: 'दायां मध्यमा (Right Middle)',
  8: 'दायां अनामिका (Right Ring)',
  9: 'दायां कनिष्ठिका (Right Pinky)',
};

// Inscript Layout Mapping (GoI Standard / Mangal Inscript)
export const INSCRIPT_LAYOUT = {
  name: 'इनस्क्रिप्ट (Inscript - Mangal)',
  id: 'inscript',
  description: 'भारत सरकार का आधिकारिक मानक कीबोर्ड (सभी सरकारी परीक्षाओं एवं आधुनिक प्रणालियों में मान्य)',
  rows: [
    // Number row
    [
      { code: 'Backquote', key: '`', normal: '`', shift: '~', finger: 1 },
      { code: 'Digit1', key: '1', normal: '१', shift: '!', finger: 1 },
      { code: 'Digit2', key: '2', normal: '२', shift: '@', finger: 1 },
      { code: 'Digit3', key: '3', normal: '३', shift: '#', finger: 2 },
      { code: 'Digit4', key: '4', normal: '४', shift: '$', finger: 3 },
      { code: 'Digit5', key: '5', normal: '५', shift: '%', finger: 4 },
      { code: 'Digit6', key: '6', normal: '६', shift: '^', finger: 4 },
      { code: 'Digit7', key: '7', normal: '७', shift: '&', finger: 6 },
      { code: 'Digit8', key: '8', normal: '८', shift: '*', finger: 6 },
      { code: 'Digit9', key: '9', normal: '९', shift: '(', finger: 7 },
      { code: 'Digit0', key: '0', normal: '०', shift: ')', finger: 8 },
      { code: 'Minus', key: '-', normal: '-', shift: '_', finger: 9 },
      { code: 'Equal', key: '=', normal: 'ृ', shift: 'ऋ', finger: 9 },
      { code: 'Backspace', key: 'Backspace', normal: 'Backspace', shift: 'Backspace', finger: 9, width: 'wide' }
    ],
    // Top Row
    [
      { code: 'Tab', key: 'Tab', normal: 'Tab', shift: 'Tab', finger: 1, width: 'medium' },
      { code: 'KeyQ', key: 'q', normal: 'ौ', shift: 'औ', finger: 1, hint: 'ौ / औ' },
      { code: 'KeyW', key: 'w', normal: 'ै', shift: 'ऐ', finger: 2, hint: 'ै / ऐ' },
      { code: 'KeyE', key: 'e', normal: 'ा', shift: 'आ', finger: 3, hint: 'ा / आ' },
      { code: 'KeyR', key: 'r', normal: 'ी', shift: 'ई', finger: 4, hint: 'ी / ई' },
      { code: 'KeyT', key: 't', normal: 'ू', shift: 'ऊ', finger: 4, hint: 'ू / ऊ' },
      { code: 'KeyY', key: 'y', normal: 'ब', shift: 'भ', finger: 6, hint: 'ब / भ' },
      { code: 'KeyU', key: 'u', normal: 'ह', shift: 'ङ', finger: 6, hint: 'ह / ङ' },
      { code: 'KeyI', key: 'i', normal: 'ग', shift: 'घ', finger: 7, hint: 'ग / घ' },
      { code: 'KeyO', key: 'o', normal: 'द', shift: 'ध', finger: 8, hint: 'द / ध' },
      { code: 'KeyP', key: 'p', normal: 'ज', shift: 'झ', finger: 9, hint: 'ज / झ' },
      { code: 'BracketLeft', key: '[', normal: 'ड', shift: 'ढ', finger: 9, hint: 'ड / ढ' },
      { code: 'BracketRight', key: ']', normal: '़', shift: 'ञ', finger: 9, hint: '़ / ञ' },
      { code: 'Backslash', key: '\\', normal: 'ॉ', shift: 'ऑ', finger: 9, width: 'medium' }
    ],
    // Home Row
    [
      { code: 'CapsLock', key: 'CapsLock', normal: 'Caps', shift: 'Caps', finger: 1, width: 'caps' },
      { code: 'KeyA', key: 'a', normal: 'ो', shift: 'ओ', finger: 1, hint: 'ो / ओ' },
      { code: 'KeyS', key: 's', normal: 'े', shift: 'ए', finger: 2, hint: 'े / ए' },
      { code: 'KeyD', key: 'd', normal: '्', shift: 'अ', finger: 3, hint: '् / अ' },
      { code: 'KeyF', key: 'f', normal: 'ि', shift: 'इ', finger: 4, hint: 'ि / इ' },
      { code: 'KeyG', key: 'g', normal: 'ु', shift: 'उ', finger: 4, hint: 'ु / उ' },
      { code: 'KeyH', key: 'h', normal: 'प', shift: 'फ', finger: 6, hint: 'प / फ' },
      { code: 'KeyJ', key: 'j', normal: 'र', shift: 'ऱ', finger: 6, hint: 'र / ऱ' },
      { code: 'KeyK', key: 'k', normal: 'क', shift: 'ख', finger: 7, hint: 'क / ख' },
      { code: 'KeyL', key: 'l', normal: 'त', shift: 'थ', finger: 8, hint: 'त / थ' },
      { code: 'Semicolon', key: ';', normal: 'च', shift: 'छ', finger: 9, hint: 'च / छ' },
      { code: 'Quote', key: "'", normal: 'ट', shift: 'ठ', finger: 9, hint: 'ट / ठ' },
      { code: 'Enter', key: 'Enter', normal: 'Enter', shift: 'Enter', finger: 9, width: 'wide' }
    ],
    // Bottom Row
    [
      { code: 'ShiftLeft', key: 'Shift', normal: 'Shift', shift: 'Shift', finger: 1, width: 'shift' },
      { code: 'KeyZ', key: 'z', normal: 'ॆ', shift: 'ऒ', finger: 1, hint: 'ॆ / ऒ' },
      { code: 'KeyX', key: 'x', normal: 'ं', shift: 'ँ', finger: 2, hint: 'ं / ँ' },
      { code: 'KeyC', key: 'c', normal: 'म', shift: 'ण', finger: 3, hint: 'म / ण' },
      { code: 'KeyV', key: 'v', normal: 'न', shift: 'ऩ', finger: 4, hint: 'न / ऩ' },
      { code: 'KeyB', key: 'b', normal: 'व', shift: 'ऴ', finger: 4, hint: 'व / ऴ' },
      { code: 'KeyN', key: 'n', normal: 'ल', shift: 'ळ', finger: 6, hint: 'ल / ळ' },
      { code: 'KeyM', key: 'm', normal: 'स', shift: 'श', finger: 6, hint: 'स / श' },
      { code: 'Comma', key: ',', normal: ',', shift: 'ष', finger: 7, hint: ', / ष' },
      { code: 'Period', key: '.', normal: '.', shift: '।', finger: 8, hint: '. / ।' },
      { code: 'Slash', key: '/', normal: 'य', shift: '?', finger: 9, hint: 'य / ?' },
      { code: 'ShiftRight', key: 'Shift', normal: 'Shift', shift: 'Shift', finger: 9, width: 'shift' }
    ],
    // Space Row
    [
      { code: 'ControlLeft', key: 'Ctrl', normal: 'Ctrl', shift: 'Ctrl', finger: 1, width: 'control' },
      { code: 'AltLeft', key: 'Alt', normal: 'Alt', shift: 'Alt', finger: 1, width: 'control' },
      { code: 'Space', key: ' ', normal: 'स्पेस (Space)', shift: 'स्पेस (Space)', finger: 5, width: 'space' },
      { code: 'AltRight', key: 'Alt', normal: 'Alt', shift: 'Alt', finger: 9, width: 'control' },
      { code: 'ControlRight', key: 'Ctrl', normal: 'Ctrl', shift: 'Ctrl', finger: 9, width: 'control' }
    ]
  ]
};

// Remington Gail Layout Mapping (Widely used in SSC, High Court, Police, Stenographer exams)
export const REMINGTON_LAYOUT = {
  name: 'रेमिंगटन गेल (Remington Gail / Krutidev)',
  id: 'remington',
  description: 'सरकारी परीक्षाओं (SSC, High Court, UPSSSC, CRPF, Police) का सबसे लोकप्रिय टाइपराइटर लेआउट',
  rows: [
    // Number row
    [
      { code: 'Backquote', key: '`', normal: '`', shift: '~', finger: 1 },
      { code: 'Digit1', key: '1', normal: '१', shift: '!', finger: 1 },
      { code: 'Digit2', key: '2', normal: '२', shift: '@', finger: 1 },
      { code: 'Digit3', key: '3', normal: '३', shift: '#', finger: 2 },
      { code: 'Digit4', key: '4', normal: '४', shift: '$', finger: 3 },
      { code: 'Digit5', key: '5', normal: '५', shift: '%', finger: 4 },
      { code: 'Digit6', key: '6', normal: '६', shift: '^', finger: 4 },
      { code: 'Digit7', key: '7', normal: '७', shift: '&', finger: 6 },
      { code: 'Digit8', key: '8', normal: '८', shift: '*', finger: 6 },
      { code: 'Digit9', key: '9', normal: '९', shift: '(', finger: 7 },
      { code: 'Digit0', key: '0', normal: '०', shift: ')', finger: 8 },
      { code: 'Minus', key: '-', normal: '-', shift: 'ऋ', finger: 9 },
      { code: 'Equal', key: '=', normal: 'ृ', shift: '्', finger: 9 },
      { code: 'Backspace', key: 'Backspace', normal: 'Backspace', shift: 'Backspace', finger: 9, width: 'wide' }
    ],
    // Top Row
    [
      { code: 'Tab', key: 'Tab', normal: 'Tab', shift: 'Tab', finger: 1, width: 'medium' },
      { code: 'KeyQ', key: 'q', normal: 'ु', shift: 'फ', finger: 1, hint: 'ु / फ' },
      { code: 'KeyW', key: 'w', normal: 'ू', shift: 'ँ', finger: 2, hint: 'ू / ँ' },
      { code: 'KeyE', key: 'e', normal: 'म', shift: 'म्', finger: 3, hint: 'म / म्' },
      { code: 'KeyR', key: 'r', normal: 'त', shift: 'त्', finger: 4, hint: 'त / त्' },
      { code: 'KeyT', key: 't', normal: 'ज', shift: 'ज्', finger: 4, hint: 'ज / ज्' },
      { code: 'KeyY', key: 'y', normal: 'ल', shift: 'ल्', finger: 6, hint: 'ल / ल्' },
      { code: 'KeyU', key: 'u', normal: 'न', shift: 'न्', finger: 6, hint: 'न / न्' },
      { code: 'KeyI', key: 'i', normal: 'प', shift: 'प्', finger: 7, hint: 'प / प्' },
      { code: 'KeyO', key: 'o', normal: 'व', shift: 'व्', finger: 8, hint: 'व / व्' },
      { code: 'KeyP', key: 'p', normal: 'च', shift: 'च्', finger: 9, hint: 'च / च्' },
      { code: 'BracketLeft', key: '[', normal: 'ख', shift: 'ख्', finger: 9, hint: 'ख / ख्' },
      { code: 'BracketRight', key: ']', normal: ',', shift: ']', finger: 9 },
      { code: 'Backslash', key: '\\', normal: '?', shift: '/', finger: 9, width: 'medium' }
    ],
    // Home Row
    [
      { code: 'CapsLock', key: 'CapsLock', normal: 'Caps', shift: 'Caps', finger: 1, width: 'caps' },
      { code: 'KeyA', key: 'a', normal: 'ं', shift: 'ा', finger: 1, hint: 'ं / ा' },
      { code: 'KeyS', key: 's', normal: 'े', shift: 'ै', finger: 2, hint: 'े / ै' },
      { code: 'KeyD', key: 'd', normal: '्', shift: 'क्', finger: 3, hint: '् / क्' },
      { code: 'KeyF', key: 'f', normal: 'ि', shift: 'थ', finger: 4, hint: 'ि / थ' },
      { code: 'KeyG', key: 'g', normal: 'ह', shift: 'भ', finger: 4, hint: 'ह / भ' },
      { code: 'KeyH', key: 'h', normal: 'ी', shift: 'ी', finger: 6, hint: 'ी / भ्' },
      { code: 'KeyJ', key: 'j', normal: 'र', shift: 'श्र', finger: 6, hint: 'र / श्र' },
      { code: 'KeyK', key: 'k', normal: 'ा', shift: 'ज्ञ', finger: 7, hint: 'ा / ज्ञ' },
      { code: 'KeyL', key: 'l', normal: 'स', shift: 'स्', finger: 8, hint: 'स / स्' },
      { code: 'Semicolon', key: ';', normal: 'य', shift: 'य्', finger: 9, hint: 'य / य्' },
      { code: 'Quote', key: "'", normal: 'श', shift: 'ष्', finger: 9, hint: 'श / ष्' },
      { code: 'Enter', key: 'Enter', normal: 'Enter', shift: 'Enter', finger: 9, width: 'wide' }
    ],
    // Bottom Row
    [
      { code: 'ShiftLeft', key: 'Shift', normal: 'Shift', shift: 'Shift', finger: 1, width: 'shift' },
      { code: 'KeyZ', key: 'z', normal: '्र', shift: 'र्', finger: 1, hint: '्र / र्' },
      { code: 'KeyX', key: 'x', normal: 'ग', shift: 'ग्', finger: 2, hint: 'ग / ग्' },
      { code: 'KeyC', key: 'c', normal: 'ब', shift: 'ब्', finger: 3, hint: 'ब / ब्' },
      { code: 'KeyV', key: 'v', normal: 'अ', shift: 'ट', finger: 4, hint: 'अ / ट' },
      { code: 'KeyB', key: 'b', normal: 'इ', shift: 'ठ', finger: 4, hint: 'इ / ठ' },
      { code: 'KeyN', key: 'n', normal: 'द', shift: 'छ', finger: 6, hint: 'द / छ' },
      { code: 'KeyM', key: 'm', normal: 'उ', shift: 'ड', finger: 6, hint: 'उ / ड' },
      { code: 'Comma', key: ',', normal: 'ए', shift: 'ढ', finger: 7, hint: 'ए / ढ' },
      { code: 'Period', key: '.', normal: 'ण्', shift: 'झ', finger: 8, hint: 'ण् / झ' },
      { code: 'Slash', key: '/', normal: 'ध', shift: 'ध्', finger: 9, hint: 'ध / ध्' },
      { code: 'ShiftRight', key: 'Shift', normal: 'Shift', shift: 'Shift', finger: 9, width: 'shift' }
    ],
    // Space Row
    [
      { code: 'ControlLeft', key: 'Ctrl', normal: 'Ctrl', shift: 'Ctrl', finger: 1, width: 'control' },
      { code: 'AltLeft', key: 'Alt', normal: 'Alt', shift: 'Alt', finger: 1, width: 'control' },
      { code: 'Space', key: ' ', normal: 'स्पेस (Space)', shift: 'स्पेस (Space)', finger: 5, width: 'space' },
      { code: 'AltRight', key: 'Alt', normal: 'Alt', shift: 'Alt', finger: 9, width: 'control' },
      { code: 'ControlRight', key: 'Ctrl', normal: 'Ctrl', shift: 'Ctrl', finger: 9, width: 'control' }
    ]
  ]
};

// Fast lookup maps for layout characters
export function buildLookupMap(layout) {
  const charToKey = {};
  const codeToChar = {};

  layout.rows.forEach(row => {
    row.forEach(item => {
      // Normal
      if (item.normal && item.normal.length > 0 && item.code !== 'Space') {
        charToKey[item.normal] = { code: item.code, shift: false, finger: item.finger, char: item.normal };
      }
      // Shift
      if (item.shift && item.shift.length > 0 && item.code !== 'Space') {
        charToKey[item.shift] = { code: item.code, shift: true, finger: item.finger, char: item.shift };
      }
      codeToChar[item.code] = {
        normal: item.normal,
        shift: item.shift,
        finger: item.finger
      };
    });
  });

  // Space
  charToKey[' '] = { code: 'Space', shift: false, finger: 5, char: ' ' };
  codeToChar['Space'] = { normal: ' ', shift: ' ', finger: 5 };

  return { charToKey, codeToChar };
}
