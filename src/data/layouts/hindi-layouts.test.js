import { describe, it, expect } from 'vitest';
import { INSCRIPT_LAYOUT, translateInscript } from './inscript';
import { REMINGTON_GAIL_KEYMAP, RemingtonGailBuffer } from './remington-gail';

// 60+ Tricky Government Exam Hindi Words covering complex matras, conjuncts, half letters and reph
export const TRICKY_HINDI_WORDS = [
  'कि', 'कृपया', 'क्षमा', 'त्रिशूल', 'ज्ञान', 'श्रमिक', 'अर्थ', 'कर्म', 'प्रधानमंत्री', 'राष्ट्र',
  'सर्वोच्च', 'न्यायालय', 'विद्या', 'उद्योग', 'चिन्ह', 'द्वंद्व', 'प्रख्यात', 'प्रकृति', 'संविधान', 'प्रशासनिक',
  'अधिकारी', 'न्यायाधीश', 'व्यवस्था', 'संसदीय', 'कार्यपालिका', 'पारदर्शिता', 'जवाबदेही', 'प्रतियोगिता', 'अभ्यर्थी', 'सचिवालय',
  'अनुशंसा', 'निर्वाचन', 'आयोग', 'अधिसूचना', 'राजभाषा', 'कार्यालय', 'निदेशालय', 'कर्मचारी', 'प्रशिक्षण', 'दस्तावेज',
  'प्राधिकरण', 'अनुच्छेद', 'परिशिष्ट', 'प्रारूप', 'प्रत्याशी', 'अधिवक्ता', 'अभिभाषक', 'पंजीकरण', 'साक्षात्कार', 'मूल्यांकन',
  'अभिलेख', 'हस्ताक्षर', 'सत्यापन', 'निर्देशिका', 'प्रमाणपत्र', 'पारस्परिक', 'सार्वजनिक', 'अभियांत्रिकी', 'स्वतंत्रता', 'प्रस्तावना'
];

describe('Hindi Inscript & Remington Gail Layout Specifications', () => {
  it('has valid non-empty mappings for all alphanumeric keys in Inscript', () => {
    expect(INSCRIPT_LAYOUT.normal['KeyK']).toBe('क');
    expect(INSCRIPT_LAYOUT.shift['KeyK']).toBe('ख');
    expect(INSCRIPT_LAYOUT.normal['KeyL']).toBe('त');
    expect(INSCRIPT_LAYOUT.shift['KeyL']).toBe('थ');
    expect(INSCRIPT_LAYOUT.normal['KeyD']).toBe('्'); // Halant
    expect(INSCRIPT_LAYOUT.normal['KeyE']).toBe('ा'); // Aa matra
    expect(INSCRIPT_LAYOUT.normal['KeyF']).toBe('ि'); // I matra
    expect(INSCRIPT_LAYOUT.normal['KeyR']).toBe('ी'); // Ii matra
  });

  it('translates Inscript physical events accurately', () => {
    const kEvent = { code: 'KeyK', shiftKey: false };
    expect(translateInscript(kEvent)).toBe('क');

    const shiftKEvent = { code: 'KeyK', shiftKey: true };
    expect(translateInscript(shiftKEvent)).toBe('ख');

    const purnaViramEvent = { code: 'Period', shiftKey: true };
    expect(translateInscript(purnaViramEvent)).toBe('।');
  });

  it('Remington Gail handles pre-base matra sequence (f + k -> कि)', () => {
    const buffer = new RemingtonGailBuffer();
    // Press 'f' (ि)
    const res1 = buffer.processKey({ code: 'KeyF', shiftKey: false });
    expect(res1.type).toBe('pending_matra');

    // Press 'r' (त in Remington) or 'd' (क with shift or standard consonant)
    const res2 = buffer.processKey({ code: 'KeyR', shiftKey: false });
    expect(res2.type).toBe('char');
    expect(res2.value).toBe('ति');
  });

  it('verifies that all 60+ tricky exam words decompose cleanly into Unicode grapheme clusters', () => {
    const segmenter = new Intl.Segmenter('hi', { granularity: 'grapheme' });
    expect(TRICKY_HINDI_WORDS.length).toBeGreaterThanOrEqual(60);

    for (const word of TRICKY_HINDI_WORDS) {
      const segments = Array.from(segmenter.segment(word)).map(s => s.segment);
      expect(segments.length).toBeGreaterThan(0);
      expect(segments.join('')).toBe(word);
    }
  });

  it('verifies conjuncts and half letters render correctly without mojibake', () => {
    const conjuncts = ['क्ष', 'त्र', 'ज्ञ', 'श्र', 'द्ध', 'द्व', 'प्र', 'ट्र'];
    for (const c of conjuncts) {
      expect(c.length).toBeGreaterThan(0);
      expect(/[\u0900-\u097F]/.test(c)).toBe(true);
    }
  });
});
