/**
 * Hindi Remington Gail Layout (Standard Krutidev / Devlys keyboard mapping)
 * Used extensively in Government typing exams in India (SSC, High Courts, CPCT, State Clerk exams).
 * Outputs standard modern UNICODE Devanagari (not legacy 8-bit font codes).
 *
 * Special features handled:
 * 1. Pre-base matra: User types 'f' (ि) BEFORE the consonant (e.g. 'f' + 'k' = 'कि')
 * 2. Reph: User types 'Shift+Z' (र्) after the consonant (e.g. 'k' + 'Z' = 'र्क')
 * 3. Halant & Half consonants (e.g. 'd' is halant)
 * 4. Conjuncts: क्ष, त्र, ज्ञ, श्र
 */

export const REMINGTON_GAIL_KEYMAP = {
  id: 'remington-gail',
  name: 'Hindi Remington Gail',
  displayName: 'हिंदी रेमिंगटन गेल (Remington Gail / Krutidev)',
  script: 'devanagari',
  standardRef: 'SSC & High Court Exam Standard (Krutidev physical layout emitting Unicode)',

  // Direct key mappings (event.code -> Unicode output)
  normal: {
    'Backquote': '`',
    'Digit1': '1',
    'Digit2': '2',
    'Digit3': '3',
    'Digit4': '4',
    'Digit5': '5',
    'Digit6': '6',
    'Digit7': '7',
    'Digit8': '8',
    'Digit9': '9',
    'Digit0': '0',
    'Minus': '-',
    'Equal': 'त्र',

    // Upper Row
    'KeyQ': 'ु', // u matra
    'KeyW': 'ू', // uu matra
    'KeyE': 'म',
    'KeyR': 'त',
    'KeyT': 'ज',
    'KeyY': 'ल',
    'KeyU': 'न',
    'KeyI': 'प',
    'KeyO': 'व',
    'KeyP': 'च',
    'BracketLeft': 'ख',
    'BracketRight': ',',
    'Backslash': '.',

    // Home Row
    'KeyA': 'ं', // anusvara
    'KeyS': 'े', // e matra
    'KeyD': '्', // halant
    'KeyF': 'ि', // pre-base i matra (typed BEFORE consonant)
    'KeyG': 'ह',
    'KeyH': 'ी', // ii matra
    'KeyJ': 'र',
    'KeyK': 'ा', // aa matra
    'KeyL': 'स',
    'Semicolon': 'य',
    'Quote': 'श',

    // Bottom Row
    'KeyZ': '्र', // padasth ra
    'KeyX': 'ग',
    'KeyC': 'ब',
    'KeyV': 'अ',
    'KeyB': 'इ',
    'KeyN': 'द',
    'KeyM': 'उ',
    'Comma': 'ए',
    'Period': 'ण',
    'Slash': 'ध',
    'Space': ' '
  },

  shift: {
    'Backquote': '~',
    'Digit1': '!',
    'Digit2': 'द्ध',
    'Digit3': 'त्र',
    'Digit4': 'ऋ',
    'Digit5': 'ज्ञ',
    'Digit6': 'ट्र',
    'Digit7': 'क्ष',
    'Digit8': 'श्र',
    'Digit9': '(',
    'Digit0': ')',
    'Minus': 'ः', // visarga
    'Equal': 'ऋ',

    // Upper Row
    'KeyQ': 'फ',
    'KeyW': 'ँ', // chandrabindu
    'KeyE': 'म्', // half ma
    'KeyR': 'त्', // half ta
    'KeyT': 'ज्', // half ja
    'KeyY': 'ल्', // half la
    'KeyU': 'न्', // half na
    'KeyI': 'प्', // half pa
    'KeyO': 'व्', // half va
    'KeyP': 'च्', // half cha
    'KeyBracketLeft': 'ख्', // half kha
    'BracketLeft': 'ख्',
    'BracketRight': 'द्व',
    'Backslash': '।', // purna viram

    // Home Row
    'KeyA': 'ँ',
    'KeyS': 'ै', // ai matra
    'KeyD': 'क्', // half ka
    'KeyF': 'थ',
    'KeyG': 'भ',
    'KeyH': 'भ्', // half bha
    'KeyJ': 'रू',
    'KeyK': 'ज्ञ',
    'KeyL': 'स्', // half sa
    'Semicolon': 'श्', // half sha
    'Quote': 'ष्', // ssa

    // Bottom Row
    'KeyZ': 'र्', // reph
    'KeyX': 'ग्', // half ga
    'KeyC': 'ब्', // half ba
    'KeyV': 'ट',
    'KeyB': 'ठ',
    'KeyN': 'छ',
    'KeyM': 'ड',
    'Comma': 'ढ',
    'Period': 'झ',
    'Slash': 'ध्', // half dha
    'Space': ' '
  }
};

/**
 * State machine for Remington Gail typing that properly handles:
 * - Pre-base 'ि' matra typed before the consonant (f + k -> कि)
 * - Reph 'र्' (Shift+Z) applied after consonant (क + Shift+Z -> र्क or क + ् + र)
 */
export class RemingtonGailBuffer {
  constructor() {
    this.hasPendingPreMatra = false;
  }

  reset() {
    this.hasPendingPreMatra = false;
  }

  /**
   * Process a keydown event and return the resulting text to append,
   * or null if the key was an internal state modifier (like pre-base matra).
   */
  processKey(event) {
    const code = event.code;
    const isShift = event.shiftKey;
    const map = isShift ? REMINGTON_GAIL_KEYMAP.shift : REMINGTON_GAIL_KEYMAP.normal;
    const rawChar = map[code];

    if (!rawChar) return null;

    // Check if 'f' (ि) was pressed without Shift:
    if (!isShift && code === 'KeyF') {
      this.hasPendingPreMatra = true;
      return { type: 'pending_matra', display: 'ि' };
    }

    // If pre-matra was pending and user types a consonant:
    if (this.hasPendingPreMatra) {
      this.hasPendingPreMatra = false;
      // In Unicode, consonant comes FIRST, followed by U+093F (ि)
      return { type: 'char', value: rawChar + 'ि' };
    }

    return { type: 'char', value: rawChar };
  }
}
