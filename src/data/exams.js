/**
 * Government Typing Exam Presets & Evaluation Criteria
 * NOTE: Verify specific criteria against the latest official recruitment notification
 * as exam boards occasionally revise rules, durations, or error thresholds per recruitment cycle.
 */

export const EXAM_PRESETS = [
  {
    id: 'ssc-chsl-en',
    title: 'SSC CHSL (English Typing Test)',
    category: 'Central Government',
    organizer: 'Staff Selection Commission',
    language: 'english',
    layout: 'us',
    durationSeconds: 600, // 10 minutes
    targetKdph: 10500, // 35 WPM (10,500 key depressions per hour)
    qualifyingSpeedWpm: 35,
    maxErrorPercentage: 7, // 7% for UR, 10% for reserved categories
    backspaceAllowed: true,
    fullMistakePenalty: 1.0, // 1 full word deducted
    halfMistakePenalty: 0.5, // 0.5 word deducted
    description: '10-minute test. Candidate must type at minimum 35 WPM (approx 1750 key depressions in 10 minutes). Full & half mistake evaluation.',
    samplePassage: 'Democracy in India thrives on the continuous engagement of its citizenry in the electoral and governance processes. Every five years, hundreds of millions of voters exercise their franchise to elect representatives to the Lok Sabha and State Legislative Assemblies. The Election Commission of India ensures that the polling process remains completely transparent, impartial, and accessible across the vast geographical expanse of the nation.'
  },
  {
    id: 'ssc-chsl-hi',
    title: 'SSC CHSL (Hindi Typing Test)',
    category: 'Central Government',
    organizer: 'Staff Selection Commission',
    language: 'hindi',
    layout: 'remington-gail', // or inscript
    durationSeconds: 600, // 10 minutes
    targetKdph: 9000, // 30 WPM (9,000 key depressions per hour)
    qualifyingSpeedWpm: 30,
    maxErrorPercentage: 7,
    backspaceAllowed: true,
    fullMistakePenalty: 1.0,
    halfMistakePenalty: 0.5,
    description: '10-minute Hindi test. Candidate must type at 30 WPM on Remington Gail or Inscript layout. 9000 key depressions per hour benchmark.',
    samplePassage: 'संसदीय शासन प्रणाली में कार्यपालिका संसद के प्रति उत्तरदायी होती है। भारतीय संविधान के निर्माताओं ने देश की विविधता और विशालता को ध्यान में रखते हुए एक सुदृढ़ संघीय ढाँचे की रचना की है। नागरिकों को प्रदान किए गए मौलिक अधिकार उनकी स्वतंत्रता और गरिमा की रक्षा करते हैं।'
  },
  {
    id: 'allahabad-hc-en',
    title: 'Allahabad High Court (RO / ARO / Clerk)',
    category: 'Judiciary',
    organizer: 'High Court of Judicature at Allahabad',
    language: 'english',
    layout: 'us',
    durationSeconds: 600, // 10 minutes
    qualifyingSpeedWpm: 30,
    maxErrorPercentage: 5,
    backspaceAllowed: false, // Strict exam environment
    description: 'Strict 10-minute speed test on legal and administrative passages. No live backspace in strict mode. Minimum 30 WPM required.',
    samplePassage: 'The High Court exercises original, appellate, and revisional jurisdiction over all subordinate courts within its territorial limits. Under Article 226 of the Constitution, the Court has powers to issue prerogative writs including habeas corpus, mandamus, prohibition, and certiorari for enforcement of fundamental rights.'
  },
  {
    id: 'allahabad-hc-hi',
    title: 'Allahabad High Court Hindi (Remington Gail)',
    category: 'Judiciary',
    organizer: 'High Court of Judicature at Allahabad',
    language: 'hindi',
    layout: 'remington-gail',
    durationSeconds: 600, // 10 minutes
    qualifyingSpeedWpm: 25,
    maxErrorPercentage: 5,
    backspaceAllowed: false,
    description: 'Hindi typing test on Remington Gail (Krutidev font mapping). Minimum 25 WPM. Accuracy is paramount.',
    samplePassage: 'न्यायालयीन प्रक्रिया में सत्यनिष्ठा और समयबद्धता का विशेष महत्व है। प्रत्येक नागरिक को निष्पक्ष न्याय प्राप्त करने का अधिकार है। अधीनस्थ न्यायालयों के निर्णयों के विरुद्ध उच्च न्यायालय में अपील की जा सकती है।'
  },
  {
    id: 'cpct-mp',
    title: 'MP CPCT (Computer Proficiency Certification Test)',
    category: 'State Exam',
    organizer: 'MPSEDC, Madhya Pradesh',
    language: 'hindi',
    layout: 'remington-gail',
    durationSeconds: 900, // 15 minutes
    qualifyingSpeedWpm: 20, // 20 WPM for Hindi CPCT score card
    maxErrorPercentage: 10,
    backspaceAllowed: true,
    description: '15-minute Hindi typing test on Remington Gail layout. Minimum 20 WPM required for qualifying scorecard (50% score).',
    samplePassage: 'मध्य प्रदेश शासन द्वारा प्रशासनिक कार्यों में सूचना प्रौद्योगिकी के उपयोग को निरंतर प्रोत्साहित किया जा रहा है। सीपीसीटी परीक्षा राज्य के युवाओं के कंप्यूटर एवं टंकण कौशल के प्रमाणीकरण का एक मानक माध्यम बन चुकी है।'
  },
  {
    id: 'patna-hc-en',
    title: 'Patna High Court DEO / Steno',
    category: 'Judiciary',
    organizer: 'Patna High Court',
    language: 'english',
    layout: 'us',
    durationSeconds: 600,
    qualifyingSpeedWpm: 40,
    maxErrorPercentage: 5,
    backspaceAllowed: true,
    description: 'High velocity benchmark of 40 WPM in English with at least 95% accuracy.',
    samplePassage: 'Administrative efficacy requires that statutory records, judicial orders, and cause lists are prepared and uploaded promptly. Accurate keyboard transcription skills ensure prompt documentation in courtroom proceedings.'
  }
];

/**
 * Calculates Government Exam Scorecard Metrics
 * Distinguishes between full mistakes and half mistakes according to official evaluation norms.
 */
export function getExamById(id) {
  return EXAM_PRESETS.find(e => e.id === id);
}

export function evaluateExamScorecard({
  originalText,
  typedText,
  durationSeconds,
  qualifyingSpeedWpm,
  maxErrorPercentage = 7,
  fullMistakeWeight = 1.0,
  halfMistakeWeight = 0.5
}) {
  const origWords = originalText.trim().split(/\s+/).filter(Boolean);
  const typedWords = typedText.trim().split(/\s+/).filter(Boolean);

  let fullMistakes = 0;
  let halfMistakes = 0;
  const wordComparisons = [];

  const maxLen = Math.max(origWords.length, typedWords.length);

  for (let i = 0; i < maxLen; i++) {
    const orig = origWords[i] || '';
    const typed = typedWords[i] || '';

    if (!typed) {
      // Omission of word -> Full mistake
      fullMistakes++;
      wordComparisons.push({ orig, typed: '', status: 'omission', penalty: fullMistakeWeight });
    } else if (!orig) {
      // Addition of word -> Full mistake
      fullMistakes++;
      wordComparisons.push({ orig: '', typed, status: 'addition', penalty: fullMistakeWeight });
    } else if (orig === typed) {
      wordComparisons.push({ orig, typed, status: 'correct', penalty: 0 });
    } else if (orig.toLowerCase() === typed.toLowerCase()) {
      // Case difference -> Half mistake
      halfMistakes++;
      wordComparisons.push({ orig, typed, status: 'half_mistake', penalty: halfMistakeWeight });
    } else if (orig.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '') === typed.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '')) {
      // Punctuation mistake -> Half mistake
      halfMistakes++;
      wordComparisons.push({ orig, typed, status: 'half_mistake', penalty: halfMistakeWeight });
    } else {
      // Spelling or word substitution -> Full mistake
      fullMistakes++;
      wordComparisons.push({ orig, typed, status: 'full_mistake', penalty: fullMistakeWeight });
    }
  }

  const minutes = Math.max(durationSeconds / 60, 0.016);
  const totalTypedWords = typedWords.length;
  const totalMistakesValue = (fullMistakes * fullMistakeWeight) + (halfMistakes * halfMistakeWeight);

  const grossWpm = Math.round(totalTypedWords / minutes);
  const netWpm = Math.max(0, Math.round((totalTypedWords - totalMistakesValue) / minutes));
  const errorPercentage = totalTypedWords > 0 ? Number(((totalMistakesValue / totalTypedWords) * 100).toFixed(2)) : 0;

  const isSpeedQualified = netWpm >= qualifyingSpeedWpm;
  const isAccuracyQualified = errorPercentage <= maxErrorPercentage;
  const isQualified = isSpeedQualified && isAccuracyQualified;

  return {
    totalOriginalWords: origWords.length,
    totalTypedWords,
    fullMistakes,
    halfMistakes,
    totalMistakesValue,
    grossWpm,
    netWpm,
    errorPercentage,
    qualifyingSpeedWpm,
    maxErrorPercentage,
    isSpeedQualified,
    isAccuracyQualified,
    isQualified,
    wordComparisons: wordComparisons.slice(0, 100) // preview first 100 words
  };
}
