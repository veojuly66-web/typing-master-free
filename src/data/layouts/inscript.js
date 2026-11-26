/**
 * Hindi Inscript Keyboard Layout (Bureau of Indian Standards IS 14195:1994)
 * Maps QWERTY physical Key codes (event.code) to Unicode Devanagari characters.
 * Standard Government of India layout used in government typing exams and mobile devices.
 */

export const INSCRIPT_LAYOUT = {
  id: 'inscript',
  name: 'Hindi Inscript',
  displayName: 'हिंदी इनस्क्रिप्ट (Inscript)',
  script: 'devanagari',
  standardRef: 'Bureau of Indian Standards IS 14195:1994',

  // Normal (Unshifted) key mappings: event.code -> Unicode
  normal: {
    // Number Row
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
    'Equal': 'ृ', // vocalic r matra

    // Upper Row
    'KeyQ': 'ौ', // au matra
    'KeyW': 'ै', // ai matra
    'KeyE': 'ा', // aa matra
    'KeyR': 'ी', // ii matra
    'KeyT': 'ू', // uu matra
    'KeyY': 'ब', // ba
    'KeyU': 'ह', // ha
    'KeyI': 'ग', // ga
    'KeyO': 'द', // da
    'KeyP': 'ज', // ja
    'BracketLeft': 'ड', // dda
    'BracketRight': '़', // nukta
    'Backslash': 'ॉ', // chandra o matra

    // Home Row
    'KeyA': 'ो', // o matra
    'KeyS': 'े', // e matra
    'KeyD': '्', // virama / halant
    'KeyF': 'ि', // i matra
    'KeyG': 'ु', // u matra
    'KeyH': 'प', // pa
    'KeyJ': 'र', // ra
    'KeyK': 'क', // ka
    'KeyL': 'त', // ta
    'Semicolon': 'च', // cha
    'Quote': 'ट', // tta

    // Bottom Row
    'KeyZ': 'ॆ', // short e matra
    'KeyX': 'ं', // anusvara
    'KeyC': 'म', // ma
    'KeyV': 'न', // na
    'KeyB': 'व', // va
    'KeyN': 'ल', // la
    'KeyM': 'स', // sa
    'Comma': ',',
    'Period': '.',
    'Slash': 'य', // ya
    'Space': ' '
  },

  // Shifted key mappings: event.code -> Unicode
  shift: {
    // Number Row
    'Backquote': '~',
    'Digit1': 'ऍ', // candra e
    'Digit2': 'ॅ', // candra e matra
    'Digit3': '्र', // padasth ra (halant ra)
    'Digit4': 'र्', // reph
    'Digit5': 'ज्ञ', // jna
    'Digit6': 'त्र', // tra
    'Digit7': 'क्ष', // ksha
    'Digit8': 'श्र', // shra
    'Digit9': '(',
    'Digit0': ')',
    'Minus': 'ः', // visarga
    'Equal': 'ऋ', // vocalic r

    // Upper Row
    'KeyQ': 'औ',
    'KeyW': 'ऐ',
    'KeyE': 'आ',
    'KeyR': 'ई',
    'KeyT': 'ऊ',
    'KeyY': 'भ',
    'KeyU': 'ङ',
    'KeyI': 'घ',
    'KeyO': 'ध',
    'KeyP': 'झ',
    'BracketLeft': 'ढ',
    'BracketRight': 'ञ',
    'Backslash': 'ऑ',

    // Home Row
    'KeyA': 'ओ',
    'KeyS': 'ए',
    'KeyD': 'अ',
    'KeyF': 'इ',
    'KeyG': 'उ',
    'KeyH': 'फ',
    'KeyJ': 'ऱ',
    'KeyK': 'ख',
    'KeyL': 'थ',
    'Semicolon': 'छ',
    'Quote': 'ठ',

    // Bottom Row
    'KeyZ': 'ऒ',
    'KeyX': 'ँ', // chandrabindu
    'KeyC': 'ण',
    'KeyV': 'ऩ',
    'KeyB': 'ऴ',
    'KeyN': 'ळ',
    'KeyM': 'श',
    'Comma': 'ष',
    'Period': '।', // purna viram
    'Slash': 'य़',
    'Space': ' '
  }
};

/**
 * Translates a keyboard event to Inscript Devanagari character
 */
export function translateInscript(event) {
  const code = event.code;
  if (!code) return null;

  if (event.shiftKey) {
    return INSCRIPT_LAYOUT.shift[code] || null;
  }
  return INSCRIPT_LAYOUT.normal[code] || null;
}
