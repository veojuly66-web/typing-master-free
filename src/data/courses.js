/**
 * Pankaj Typing Course Curriculum
 * 
 * Tracks:
 * - English (QWERTY): 5 Levels (Levels 1-2 Free, Levels 3-5 Pro)
 * - Hindi Inscript (मानक इंस्क्रिप्ट - BIS IS 14195:1994): 6 Levels (Levels 1-2 Free, Levels 3-6 Pro)
 * - Hindi Remington Gail (रेमिंगटन गेल): 6 Levels (Levels 1-2 Free, Levels 3-6 Pro)
 */

export const ENGLISH_COURSES = [
  {
    id: 'course-basics',
    track: 'english',
    title: 'Beginner: Home Row & Top Row',
    description: 'Master proper finger placement on the home row (ASDF JKL;) and learn smooth upward reaches for E, I, R, U, T, and Y.',
    badge: 'Beginner',
    level: 1,
    isPro: false,
    icon: 'Keyboard',
    lessons: [
      {
        id: 'c1-l1',
        track: 'english',
        isPro: false,
        title: 'Home Row: ASDF and JKL;',
        intro: 'Rest your left fingers on A S D F and your right fingers on J K L ;. Feel the tactile bumps on F and J with your index fingers.',
        keysTaught: ['a', 's', 'd', 'f', 'j', 'k', 'l', ';', ' '],
        targetWpm: 15,
        targetAccuracy: 95,
        content: 'asdf jkl; asdf jkl; a s d f j k l ; ff jj dd kk ss ll aa ;; asdf jkl; fdsa ;lkj asdf jkl; a s d f j k l ;'
      },
      {
        id: 'c1-l2',
        track: 'english',
        isPro: false,
        title: 'Home Row Words',
        intro: 'Form real English words using only the home row keys. Maintain a steady rhythm and keep your fingers resting softly on the home keys.',
        keysTaught: ['a', 's', 'd', 'f', 'j', 'k', 'l', ';'],
        targetWpm: 18,
        targetAccuracy: 95,
        content: 'all ask dad fall flask glad salad lad sad dash flash lass fad fall flask glad dad all ask salad dash fad lass'
      },
      {
        id: 'c1-l3',
        track: 'english',
        isPro: false,
        title: 'Introducing Keys E and I',
        intro: 'Reach up from D to press E with your left middle finger. Reach up from K to press I with your right middle finger. Return to the home row right away.',
        keysTaught: ['e', 'i', 'd', 'k'],
        targetWpm: 20,
        targetAccuracy: 95,
        content: 'de de de ki ki ki dede kiki ded kik ed ik de ki see ill kill fell die lie silk like life side safe dial leaf fail'
      },
      {
        id: 'c1-l4',
        track: 'english',
        isPro: false,
        title: 'Words with E and I',
        intro: 'Practice fluid finger movement between the home row and top row keys E and I. Speed comes naturally from smooth accuracy.',
        keysTaught: ['e', 'i', 'a', 's', 'd', 'f', 'j', 'k', 'l'],
        targetWpm: 22,
        targetAccuracy: 95,
        content: 'field desk silk leaf sail fake dislike ideal alkali file safe alike shield slide detail dial slide fake like leaf'
      },
      {
        id: 'c1-l5',
        track: 'english',
        isPro: false,
        title: 'Introducing Keys R and U',
        intro: 'Reach up from F to press R with your left index finger. Reach up from J to press U with your right index finger.',
        keysTaught: ['r', 'u', 'f', 'j'],
        targetWpm: 24,
        targetAccuracy: 95,
        content: 'fr fr fr ju ju ju frfr juju red run fur jar rule fire dark user sure rural true real flour rule rare rush rail'
      },
      {
        id: 'c1-l6',
        track: 'english',
        isPro: false,
        title: 'Review Drill: E, I, R, U',
        intro: 'Combine your new top row keys with the home row. Keep your eyes on the screen, not your fingers.',
        isReview: true,
        reviewLabel: 'Review',
        keysTaught: ['e', 'i', 'r', 'u'],
        targetWpm: 25,
        targetAccuracy: 95,
        content: 'fair rule desk lure ruler fruit fluid flare rider fire sure failure ladder dealer drill relief flair radar dark'
      },
      {
        id: 'c1-l7',
        track: 'english',
        isPro: false,
        title: 'Introducing Keys T and Y',
        intro: 'Stretch your left index finger right and up to reach T. Stretch your right index finger left and up to reach Y.',
        keysTaught: ['t', 'y', 'f', 'j'],
        targetWpm: 26,
        targetAccuracy: 95,
        content: 'ft ft ft jy jy jy they stay year trust yesterday story treaty yet tray try youth tasty dusty yeast daily yesterday'
      },
      {
        id: 'c1-l8',
        track: 'english',
        isPro: false,
        title: 'Words with T and Y',
        intro: 'Practice smooth stretches for T and Y without lifting your wrists off their rest position.',
        isReview: true,
        reviewLabel: 'Review',
        keysTaught: ['t', 'y'],
        targetWpm: 28,
        targetAccuracy: 95,
        content: 'today trust try pretty target duty study safety utility reality easily royalty dirty dairy layer layout totally'
      }
    ]
  },
  {
    id: 'course-elementary',
    track: 'english',
    title: 'Elementary: Bottom Row & Shift',
    description: 'Learn downward finger reaches to C, V, B, N, M, comma, period, and master opposite-hand Shift key coordination.',
    badge: 'Elementary',
    level: 2,
    isPro: false,
    icon: 'CornerDownRight',
    lessons: [
      {
        id: 'c1-l9',
        track: 'english',
        isPro: false,
        title: 'Introducing Keys C and Comma',
        intro: 'Reach down from D with your left middle finger to press C. Reach down from K with your right middle finger to press comma (,).',
        keysTaught: ['c', ',', 'd', 'k'],
        targetWpm: 28,
        targetAccuracy: 95,
        content: 'dc dc dc k, k, k, call, care, face, nice, fact, track, clock, race, rice, cake, lock, cool, dice, case, card, clay,'
      },
      {
        id: 'c1-l10',
        track: 'english',
        isPro: false,
        title: 'Introducing Keys G and H',
        intro: 'Reach your left index finger to the right for G. Reach your right index finger to the left for H. Both sit on the home row.',
        keysTaught: ['g', 'h', 'f', 'j'],
        targetWpm: 30,
        targetAccuracy: 95,
        content: 'fg fg jh jh glad high ghost huge faith rough light guide fight tight flight graph heart right height ghost slight'
      },
      {
        id: 'c1-l11',
        track: 'english',
        isPro: false,
        title: 'Capital Letters & Shift Keys',
        intro: 'Hold the opposite Shift key with your pinky: right Shift for left-hand letters, and left Shift for right-hand letters.',
        isReview: true,
        reviewLabel: 'Shift drill',
        keysTaught: ['Shift'],
        targetWpm: 30,
        targetAccuracy: 95,
        content: 'Paris London Tokyo Berlin Rome Jack Sarah David Alice India America Friday Sunday Grace Frank Henry Tyler Jason'
      },
      {
        id: 'c1-l12',
        track: 'english',
        isPro: false,
        title: 'Basics Mastery Assessment',
        intro: 'Demonstrate touch typing across all home row, top row, and bottom row letters. Aim for at least 95% accuracy.',
        isReview: true,
        reviewLabel: 'Assessment',
        keysTaught: [],
        targetWpm: 32,
        targetAccuracy: 95,
        content: 'The quick brown fox jumps over the lazy dog. Bright stars shine high in the night sky. Trust your fingers and keep a steady rhythm.'
      }
    ]
  },
  {
    id: 'course-speed',
    track: 'english',
    title: 'Intermediate: Speed Building & Flow',
    description: 'Build typing velocity through muscle memory drills, high-frequency letter patterns, and steady cadence.',
    badge: 'Intermediate',
    level: 3,
    isPro: true,
    icon: 'Zap',
    lessons: [
      {
        id: 'c2-l1',
        track: 'english',
        isPro: true,
        title: 'High Frequency Letter Pairs',
        intro: 'Certain letter clusters occur in nearly every English word. Training these builds quick finger reflexes.',
        keysTaught: ['t', 'h', 'e', 'i', 'n', 'r', 'a'],
        targetWpm: 35,
        targetAccuracy: 96,
        content: 'the there then they where when other rather another that path math north south water mother father together weather'
      },
      {
        id: 'c2-l2',
        track: 'english',
        isPro: true,
        title: 'Common Prefixes & Suffixes',
        intro: 'Type word parts in single fluid motions: -ing, -tion, -ment, -able, dis-, and pre-.',
        keysTaught: ['i', 'n', 'g', 't', 'o', 'm', 'e'],
        targetWpm: 38,
        targetAccuracy: 96,
        content: 'action direction mention emotion section running playing thinking movement payment agreement predictable comfortable preview'
      },
      {
        id: 'c2-l3',
        track: 'english',
        isPro: true,
        title: 'Top 100 Common Words',
        intro: 'These common words make up a large portion of everyday English writing. Build muscle memory for each one.',
        isReview: true,
        reviewLabel: 'Core words',
        keysTaught: [],
        targetWpm: 40,
        targetAccuracy: 96,
        content: 'the of and a to in is you that it he was for on are as with his they I at be this have from or one had by word but not what all were'
      },
      {
        id: 'c2-l4',
        track: 'english',
        isPro: true,
        title: 'Finger Independence & Cadence',
        intro: 'Focus on uniform key strikes. Avoid rushing easy words and stumbling on difficult ones; keep a steady beat.',
        isReview: true,
        reviewLabel: 'Cadence',
        keysTaught: [],
        targetWpm: 42,
        targetAccuracy: 96,
        content: 'silver stream bright pebble ancient forest steady rhythm crystal water peaceful morning golden sunset whisper softly through branches'
      },
      {
        id: 'c2-l5',
        track: 'english',
        isPro: true,
        title: 'Short Word Bursts',
        intro: 'Short 3- to 5-letter words. Practice smooth transitions from one word to the next while avoiding mistakes.',
        isReview: true,
        reviewLabel: 'Speed burst',
        keysTaught: [],
        targetWpm: 45,
        targetAccuracy: 96,
        content: 'quick wind fast storm jump high soar blue bird leap bold swift wave glow fire spark dash rush blaze sprint surge flash bolt'
      },
      {
        id: 'c2-l6',
        track: 'english',
        isPro: true,
        title: 'Speed Sprint: 50 WPM Goal',
        intro: 'Combine your speed habits into an unbroken flow. Breathe calmly and let your fingers move steadily.',
        isReview: true,
        reviewLabel: 'Assessment',
        keysTaught: [],
        targetWpm: 50,
        targetAccuracy: 96,
        content: 'True speed is not about hurrying; it is about eliminating unnecessary hesitation. When every key location is second nature, thoughts flow directly through your hands onto the screen without conscious effort.'
      }
    ]
  },
  {
    id: 'course-numbers',
    track: 'english',
    title: 'Advanced: Numbers & Symbols',
    description: 'Learn the top number row, math operators, code brackets, and punctuation without looking down.',
    badge: 'Advanced',
    level: 4,
    isPro: true,
    icon: 'Hash',
    lessons: [
      {
        id: 'c3-l1',
        track: 'english',
        isPro: true,
        title: 'Number Row: 1 2 3 4 5',
        intro: 'Reach up with your left hand: 1 (pinky), 2 (ring), 3 (middle), 4 and 5 (index).',
        keysTaught: ['1', '2', '3', '4', '5'],
        targetWpm: 25,
        targetAccuracy: 94,
        content: '1 2 3 4 5 12 34 51 25 43 15 24 35 123 451 234 543 215 142 352 1122 3344 5511 2233 4455'
      },
      {
        id: 'c3-l2',
        track: 'english',
        isPro: true,
        title: 'Number Row: 6 7 8 9 0',
        intro: 'Reach up with your right hand: 6 and 7 (index), 8 (middle), 9 (ring), 0 (pinky).',
        keysTaught: ['6', '7', '8', '9', '0'],
        targetWpm: 25,
        targetAccuracy: 94,
        content: '6 7 8 9 0 67 89 06 70 86 97 08 69 789 067 890 760 896 907 6677 8899 0066 7788 9900'
      },
      {
        id: 'c3-l3',
        track: 'english',
        isPro: true,
        title: 'Dates and Phone Numbers',
        intro: 'Practice practical numbers: dates, telephone formats, and serial codes.',
        keysTaught: ['-', '/', '(', ')'],
        targetWpm: 28,
        targetAccuracy: 95,
        content: '2026-11-22 1998-04-15 (555) 019-2834 800-555-0199 Order #94820 Room 402 flight 747 in year 2030'
      },
      {
        id: 'c3-l4',
        track: 'english',
        isPro: true,
        title: 'Common Symbols & Punctuation',
        intro: 'Hold Shift to type symbols on the number row: ! @ # $ % ^ & * ( ).',
        keysTaught: ['!', '@', '#', '$', '%', '&', '*', '(', ')'],
        targetWpm: 25,
        targetAccuracy: 94,
        content: 'user@email.com $199.99 100% genuine! Item #42 (Best Price) Save 25% & enjoy free shipping! Wow! (Note: 10 + 20 = 30)'
      },
      {
        id: 'c3-l5',
        track: 'english',
        isPro: true,
        title: 'Code Syntax and Brackets',
        intro: 'Practice brackets and punctuation common in software and technical writing: { } [ ] < > ; : " \' / \\',
        keysTaught: ['{', '}', '[', ']', '<', '>', ';', ':', '/', '\\'],
        targetWpm: 26,
        targetAccuracy: 94,
        content: 'function sum(a, b) { return a + b; } const arr = [1, 2, 3]; if (x > 0 && y <= 10) { console.log("Success!"); }'
      },
      {
        id: 'c3-l6',
        track: 'english',
        isPro: true,
        title: 'Numbers and Symbols Review',
        intro: 'Combine prose, numbers, and technical symbols at a comfortable speed with steady accuracy.',
        isReview: true,
        reviewLabel: 'Review',
        keysTaught: [],
        targetWpm: 30,
        targetAccuracy: 95,
        content: 'Server status: 200 OK (uptime: 99.99%). Budget: $14,500 [Q3-2026]. Contact admin_team@cloud.io or call +1-800-421-9000 for #support.'
      }
    ]
  },
  {
    id: 'course-mastery',
    track: 'english',
    title: 'Expert: Real Paragraphs & Literature',
    description: 'Build endurance and precision with complete paragraphs, historical texts, and literature excerpts.',
    badge: 'Expert',
    level: 5,
    isPro: true,
    icon: 'Award',
    lessons: [
      {
        id: 'c4-l1',
        track: 'english',
        isPro: true,
        title: 'The Origin of Touch Typing',
        intro: 'Learn how touch typing was developed by Frank Edward McGurrin in 1888 and became the standard for typing.',
        isReview: true,
        reviewLabel: 'History',
        keysTaught: [],
        targetWpm: 40,
        targetAccuracy: 97,
        content: 'In 1888, a court stenographer named Frank Edward McGurrin won a typing contest in Cincinnati, proving the overwhelming superiority of touch typing over the sight method. McGurrin memorized the layout completely, relying solely on tactile feedback.'
      },
      {
        id: 'c4-l2',
        track: 'english',
        isPro: true,
        title: 'Focus and Flow State',
        intro: 'Learn how deep focus and effortless typing connect your thoughts with the screen.',
        isReview: true,
        reviewLabel: 'Flow',
        keysTaught: [],
        targetWpm: 45,
        targetAccuracy: 97,
        content: 'Flow is an optimal state of consciousness where we feel our best and perform our best. Mental chatter recedes, time seems to stretch or vanish, and every action, movement, and thought follows inevitably from the previous one.'
      },
      {
        id: 'c4-l3',
        track: 'english',
        isPro: true,
        title: 'Technological Innovation',
        intro: 'Type about computing history, modern engineering, and digital communication.',
        isReview: true,
        reviewLabel: 'Technology',
        keysTaught: [],
        targetWpm: 45,
        targetAccuracy: 97,
        content: 'The rapid evolution of modern computing has revolutionized how knowledge is created and shared across humanity. Through neural architectures and quantum interfaces, our ability to express thoughts at digital speed has never been more vital.'
      },
      {
        id: 'c4-l4',
        track: 'english',
        isPro: true,
        title: 'Classic Literature Cadence',
        intro: 'Expressive phrasing and varied cadence from classic literature.',
        isReview: true,
        reviewLabel: 'Literature',
        keysTaught: [],
        targetWpm: 45,
        targetAccuracy: 97,
        content: 'It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity, it was the season of light, it was the season of darkness, it was the spring of hope.'
      },
      {
        id: 'c4-l5',
        track: 'english',
        isPro: true,
        title: 'Clear Software Design',
        intro: 'Writing about software craft, readability, and clear communication in engineering.',
        isReview: true,
        reviewLabel: 'Engineering',
        keysTaught: [],
        targetWpm: 42,
        targetAccuracy: 97,
        content: 'Clean code is simple and direct. It reads like well-written prose. Clean code never obscures the designer intent but rather is full of crisp abstractions and straightforward lines of control, leaving bugs no shadowy place to hide.'
      },
      {
        id: 'c4-l6',
        track: 'english',
        isPro: true,
        title: 'Endurance Championship',
        intro: 'A sustained typing challenge. Maintain 50+ WPM with 98% accuracy to complete the course.',
        isReview: true,
        reviewLabel: 'Assessment',
        keysTaught: [],
        targetWpm: 50,
        targetAccuracy: 98,
        content: 'Excellence is an art won by training and habituation. We do not act rightly because we have virtue or excellence, but we rather have those because we have acted rightly. We are what we repeatedly do. Excellence, then, is not an act but a habit.'
      }
    ]
  }
];

export const INSCRIPT_COURSES = [
  {
    id: 'inscript-level-1',
    track: 'inscript',
    title: 'Inscript 1: Home Row Consonants & Matras',
    description: 'Learn standard BIS Inscript finger placement. Master right hand consonants (प, र, क, त, च, ट) and left hand basic vowel matras (ो, े, ्, ि, ु).',
    badge: 'Beginner',
    level: 1,
    isPro: false,
    icon: 'Keyboard',
    lessons: [
      {
        id: 'ins-l1',
        track: 'inscript',
        isPro: false,
        title: 'Right Hand Home Row: प, र, क, त',
        intro: 'Keep your right fingers on H (प), J (र), K (क), L (त). Practice striking each consonant cleanly.',
        keysTaught: ['h', 'j', 'k', 'l'],
        targetWpm: 15,
        targetAccuracy: 95,
        content: 'पर कर तर पक रख तत परर ककक ततत पर कर तर पर कर तर पक रख'
      },
      {
        id: 'ins-l2',
        track: 'inscript',
        isPro: false,
        title: 'Extended Home Row: च, ट',
        intro: 'Reach your right pinky to semicolon ; for च and quote \' for ट. Return to resting position immediately.',
        keysTaught: [';', "'"],
        targetWpm: 18,
        targetAccuracy: 95,
        content: 'चट पट कट रत तट कच सच रच चर पर कर चट पट कट तट रच सच'
      },
      {
        id: 'ins-l3',
        track: 'inscript',
        isPro: false,
        title: 'Left Hand Matras: ि (f) and ु (g)',
        intro: 'Use your left index finger for g (ु) and left index for f (ि). Combine with right-hand consonants.',
        keysTaught: ['f', 'g'],
        targetWpm: 20,
        targetAccuracy: 95,
        content: 'पि कि ति पु कु तु रति रुचि पुट किट पितु कुरि पितर किट पुट रति'
      },
      {
        id: 'ins-l4',
        track: 'inscript',
        isPro: false,
        title: 'Left Hand Matras: ो (a) and े (s)',
        intro: 'Press a with left pinky for ो and s with left ring finger for े.',
        keysTaught: ['a', 's'],
        targetWpm: 22,
        targetAccuracy: 95,
        content: 'पो को तो पे के ते पोते टोके रोक चोर मोर पैर तोप रेत कोर'
      },
      {
        id: 'ins-l5',
        track: 'inscript',
        isPro: false,
        title: 'Home Row Word Flow',
        intro: 'Combine all home row consonants and vowel signs into natural Devanagari words.',
        isReview: true,
        reviewLabel: 'Review',
        keysTaught: [],
        targetWpm: 25,
        targetAccuracy: 95,
        content: 'पर कर तर पट कट चर चोर कोकिला टोकरी रोक तक तकिया परिवार'
      },
      {
        id: 'ins-l6',
        track: 'inscript',
        isPro: false,
        title: 'Home Row Mastery Drill',
        intro: 'Complete sentences using home row keys. Maintain steady typing posture.',
        isReview: true,
        reviewLabel: 'Assessment',
        keysTaught: [],
        targetWpm: 28,
        targetAccuracy: 95,
        content: 'कविता प्रतिदिन समय पर पाठशाला जाती है और लगन से परिश्रम करती है।'
      }
    ]
  },
  {
    id: 'inscript-level-2',
    track: 'inscript',
    title: 'Inscript 2: Top Row Reaches & Vowels',
    description: 'Learn upward reaches to top row consonants (ग, ब, म, न, व) and independent vowels and matras (ू, ी, ृ).',
    badge: 'Elementary',
    level: 2,
    isPro: false,
    icon: 'CornerDownRight',
    lessons: [
      {
        id: 'ins-l7',
        track: 'inscript',
        isPro: false,
        title: 'Top Row Right Hand: ग, ब, म',
        intro: 'Reach up from JKL to press u (ग), i (ब), o (म) with your right hand.',
        keysTaught: ['u', 'i', 'o'],
        targetWpm: 22,
        targetAccuracy: 95,
        content: 'गब बम मग गज बक मत गति गम बस बात मगर गगन भारत नगर'
      },
      {
        id: 'ins-l8',
        track: 'inscript',
        isPro: false,
        title: 'Top Row Matras: ू (w), ी (e)',
        intro: 'Reach up from SDF to press w (ू) with left ring finger and e (ी) with left middle finger.',
        keysTaught: ['w', 'e'],
        targetWpm: 24,
        targetAccuracy: 95,
        content: 'रूप गीत तीर मीत कूप दूर फूल गीत मीठा रीता शीतल सीमा'
      },
      {
        id: 'ins-l9',
        track: 'inscript',
        isPro: false,
        title: 'Top Row Consonants: न, व, य, द',
        intro: 'Practice reaching for v (न), b (व), p (य), and [ (द).',
        keysTaught: ['v', 'b', 'p', '['],
        targetWpm: 26,
        targetAccuracy: 95,
        content: 'नर वन दया दान नदी नाव नगर दिवस युवा याद दिया पवन दवा'
      },
      {
        id: 'ins-l10',
        track: 'inscript',
        isPro: false,
        title: 'Top & Home Row Sentence Drill',
        intro: 'Read smoothly ahead by one or two words to build steady typing cadence.',
        isReview: true,
        reviewLabel: 'Assessment',
        keysTaught: [],
        targetWpm: 28,
        targetAccuracy: 95,
        content: 'सुंदर भारत हमारा देश है। हम सब मिलकर निरंतर राष्ट्र की प्रगति का मार्ग चुनते हैं।'
      }
    ]
  },
  {
    id: 'inscript-level-3',
    track: 'inscript',
    title: 'Inscript 3: Bottom Row & Shift Vowels',
    description: 'Master downward reaches and Shift modifier keys for aspirate consonants (ख, घ, छ, झ, ठ, थ, फ, भ) and full vowels.',
    badge: 'Intermediate',
    level: 3,
    isPro: true,
    icon: 'Zap',
    lessons: [
      {
        id: 'ins-l11',
        track: 'inscript',
        isPro: true,
        title: 'Bottom Row Consonants: म, न, व, ल, स',
        intro: 'Reach down with your fingers to strike bottom row consonants and return promptly to home row.',
        keysTaught: ['c', 'v', 'b', 'n', 'm'],
        targetWpm: 28,
        targetAccuracy: 95,
        content: 'मन नव वन सम मल कलम सरल समय नमक महल सहज सफर समतल'
      },
      {
        id: 'ins-l12',
        track: 'inscript',
        isPro: true,
        title: 'Shift Consonants: ख, घ, छ, थ, फ, भ',
        intro: 'Hold Shift with the opposite pinky to type aspirate consonants (Shift+K = ख, Shift+U = घ).',
        keysTaught: ['Shift'],
        targetWpm: 30,
        targetAccuracy: 95,
        content: 'फल ऋण खत थाल छत ठाठ खाट खोल थाली पंख भालू भवन भाषा'
      },
      {
        id: 'ins-l13',
        track: 'inscript',
        isPro: true,
        title: 'Independent Vowels: अ, आ, इ, ई, उ, ऊ, ए',
        intro: 'Type independent full vowels (Shift+D = अ, Shift+E = आ, Shift+F = इ).',
        isReview: true,
        reviewLabel: 'Vowels',
        keysTaught: [],
        targetWpm: 30,
        targetAccuracy: 95,
        content: 'अमर आज इधर ईश्वर उपवन ऊपर एक ऐनक ओस औरत उत्सव आनंद'
      },
      {
        id: 'ins-l14',
        track: 'inscript',
        isPro: true,
        title: 'Intermediate Flow & Precision',
        intro: 'Sustained typing drill covering all vowel forms and aspirate consonants.',
        isReview: true,
        reviewLabel: 'Assessment',
        keysTaught: [],
        targetWpm: 32,
        targetAccuracy: 95,
        content: 'कठिन परिश्रम ही सफलता की सच्ची कुंजी है। निरंतर और नियमबद्ध अभ्यास से गति तीव्र होती है।'
      }
    ]
  },
  {
    id: 'inscript-level-4',
    track: 'inscript',
    title: 'Inscript 4: Halant & Conjuncts (संयुक्ताक्षर)',
    description: 'Learn the Devanagari halant key (d) to form half letters, conjuncts (क्, त्, प्, न्), and special combinations (प्र, त्र, ज्ञ, श्र, द्ध).',
    badge: 'Advanced',
    level: 4,
    isPro: true,
    icon: 'Hash',
    lessons: [
      {
        id: 'ins-l15',
        track: 'inscript',
        isPro: true,
        title: 'Halant & Half Letters (क्, त्, प्, न्)',
        intro: 'Type consonant + Halant (d) + consonant to create conjuncts (e.g., k + d + y = क + ् + य = क्य).',
        keysTaught: ['d'],
        targetWpm: 28,
        targetAccuracy: 95,
        content: 'क्या प्यार न्याय त्याग मुख्य स्पष्ट सच्चा बच्चा पक्का सम्मान वक्त'
      },
      {
        id: 'ins-l16',
        track: 'inscript',
        isPro: true,
        title: 'R-Forms: प्र, त्र, श्र, धर्म, कर्म',
        intro: 'Master ra-kār (क + ् + र = क्र) and reph (र + ् + म = र्म).',
        keysTaught: ['j', 'd'],
        targetWpm: 30,
        targetAccuracy: 95,
        content: 'प्रकाश प्रथम त्रिभुज श्रम कर्म धर्म कार्य वर्ष राष्ट्र ट्रक ग्राम'
      },
      {
        id: 'ins-l17',
        track: 'inscript',
        isPro: true,
        title: 'Complex Ligatures: द्ध, द्य, ष्ठ, ज्ञ, क्ष',
        intro: 'Type common government exam ligatures: विद्या, युद्ध, प्रसिद्ध, ज्ञान, रक्षा।',
        isReview: true,
        reviewLabel: 'Ligatures',
        keysTaught: [],
        targetWpm: 30,
        targetAccuracy: 95,
        content: 'विद्या युद्ध प्रसिद्ध ज्ञान विज्ञान शिक्षा क्षेत्र रक्षा श्रेष्ठ उद्देश्य'
      },
      {
        id: 'ins-l18',
        track: 'inscript',
        isPro: true,
        title: 'Constitution & Polity Conjunct Drill',
        intro: 'Official examination style passage featuring complex Hindi conjuncts.',
        isReview: true,
        reviewLabel: 'Assessment',
        keysTaught: [],
        targetWpm: 32,
        targetAccuracy: 96,
        content: 'भारतीय संविधान में प्रत्येक नागरिक को समता, स्वतंत्रता और न्याय का मूलभूत अधिकार प्रदत्त किया गया है।'
      }
    ]
  },
  {
    id: 'inscript-level-5',
    track: 'inscript',
    title: 'Inscript 5: Official Terminology & Numerals',
    description: 'Master Devanagari and Arabic numerals, administrative vocabulary, and government office drafting phrases.',
    badge: 'Expert',
    level: 5,
    isPro: true,
    icon: 'Award',
    lessons: [
      {
        id: 'ins-l19',
        track: 'inscript',
        isPro: true,
        title: 'Devanagari Numerals & Dates',
        intro: 'Practice typing numbers and dates in both Devanagari (१ २ ३) and standard format.',
        keysTaught: ['1', '2', '3', '4', '5'],
        targetWpm: 28,
        targetAccuracy: 95,
        content: 'दिनांक १५ अगस्त १९४७ को भारत स्वाधीन हुआ था। कुल संख्या ५०० में से ४५० उपस्थित रहे।'
      },
      {
        id: 'ins-l20',
        track: 'inscript',
        isPro: true,
        title: 'Administrative Terminology',
        intro: 'High-frequency administrative terms appearing in SSC and Secretariat tests.',
        isReview: true,
        reviewLabel: 'Vocab',
        keysTaught: [],
        targetWpm: 32,
        targetAccuracy: 96,
        content: 'कार्यालय ज्ञापन परिपत्र अधिसूचना अनुमोदन प्रतिहस्ताक्षर राजपत्र प्राधिकारी संस्तुति कार्यवृत्त'
      },
      {
        id: 'ins-l21',
        track: 'inscript',
        isPro: true,
        title: 'Secretariat Note Drafting Drill',
        intro: 'Official government memo and noting format with punctuation.',
        isReview: true,
        reviewLabel: 'Drafting',
        keysTaught: [],
        targetWpm: 34,
        targetAccuracy: 96,
        content: 'उपर्युक्त विषय पर मुझे यह कहने का निर्देश हुआ है कि सक्षम प्राधिकारी द्वारा स्वीकृति प्रदान कर दी गई है।'
      }
    ]
  },
  {
    id: 'inscript-level-6',
    track: 'inscript',
    title: 'Inscript 6: High Speed Exam Simulation (35+ WPM)',
    description: 'Realistic speed qualification drills modeled after SSC CHSL/CGL and High Court 10-minute stenographer and clerk benchmarks.',
    badge: 'Master',
    level: 6,
    isPro: true,
    icon: 'Award',
    lessons: [
      {
        id: 'ins-l22',
        track: 'inscript',
        isPro: true,
        title: 'Court Judgement Speed Sprint (30 WPM)',
        intro: 'Maintain strict accuracy without looking down at the keyboard.',
        isReview: true,
        reviewLabel: 'Court Speed',
        keysTaught: [],
        targetWpm: 30,
        targetAccuracy: 97,
        content: 'न्यायालय के समक्ष प्रस्तुत साक्ष्यों एवं गवाहों के बयानों के आधार पर यह निर्णय ससम्मान पारित किया जाता है।'
      },
      {
        id: 'ins-l23',
        track: 'inscript',
        isPro: true,
        title: 'Secretariat Committee Report (35 WPM)',
        intro: 'High-density prose designed to build continuous typing rhythm.',
        isReview: true,
        reviewLabel: 'Secretariat',
        keysTaught: [],
        targetWpm: 35,
        targetAccuracy: 97,
        content: 'संसदीय समिति की अनुशंसा के अनुसार आगामी वित्तीय वर्ष के बजट में आवश्यक वित्तीय प्रावधान सुनिश्चित किए जाएं।'
      },
      {
        id: 'ins-l24',
        track: 'inscript',
        isPro: true,
        title: 'Final Inscript Speed Championship (40+ WPM)',
        intro: 'Full length benchmark test to earn the Certified Touch Typist badge.',
        isReview: true,
        reviewLabel: 'Championship',
        keysTaught: [],
        targetWpm: 40,
        targetAccuracy: 98,
        content: 'राष्ट्र के सर्वांगीण विकास हेतु सुशासन, पारदर्शिता और त्वरित न्याय व्यवस्था का सुदृढ़ीकरण अनिवार्य है। प्रत्येक नागरिक का परम कर्तव्य है कि वह देश की संप्रभुता और अखंडता की रक्षा में अपना सर्वस्व योगदान दे।'
      }
    ]
  }
];

export const REMINGTON_COURSES = [
  {
    id: 'remington-level-1',
    track: 'remington',
    title: 'Remington Gail 1: Home Row Standard',
    description: 'Master standard Krutidev/Devlys typewriter placement. Learn home row consonants (र, स, य, ह, श) and aa matra (ा).',
    badge: 'Beginner',
    level: 1,
    isPro: false,
    icon: 'Keyboard',
    lessons: [
      {
        id: 'rem-l1',
        track: 'remington',
        isPro: false,
        title: 'Home Row Right Hand: र (j), ा (k), स (l), य (;)',
        intro: 'Keep your right fingers on j (र), k (ा matra), l (स), ; (य). Practice smooth strokes.',
        keysTaught: ['j', 'k', 'l', ';'],
        targetWpm: 15,
        targetAccuracy: 95,
        content: 'रा सा या रस राय यार सारा सारा यार राय रस सारा रा सा यार'
      },
      {
        id: 'rem-l2',
        track: 'remington',
        isPro: false,
        title: 'Home Row Left Reaches: ह (g), ी (h), े (s)',
        intro: 'Reach your left index to g (ह), right index to h (ी), and left ring finger to s (े).',
        keysTaught: ['g', 'h', 's'],
        targetWpm: 18,
        targetAccuracy: 95,
        content: 'हरी सही सारे हीरा सीमा सेरा रह सही सारा हीरा सारे सही'
      },
      {
        id: 'rem-l3',
        track: 'remington',
        isPro: false,
        title: 'Home Row Full Words',
        intro: 'Combine home row keys into meaningful words without looking down.',
        isReview: true,
        reviewLabel: 'Review',
        keysTaught: [],
        targetWpm: 20,
        targetAccuracy: 95,
        content: 'सहारा सारा समय सही रास्ता सरस साया हरा भरा सही सारा'
      },
      {
        id: 'rem-l4',
        track: 'remington',
        isPro: false,
        title: 'Home Row Sentence Assessment',
        intro: 'Complete sentence drill using only Remington home row keys.',
        isReview: true,
        reviewLabel: 'Assessment',
        keysTaught: [],
        targetWpm: 22,
        targetAccuracy: 95,
        content: 'समय का सही उपयोग ही मनुष्य को जीवन में सफल बनाता है।'
      }
    ]
  },
  {
    id: 'remington-level-2',
    track: 'remington',
    title: 'Remington Gail 2: Top Row Consonants & Matras',
    description: 'Learn upward reaches to top row keys: म (e), त (r), ज (t), ल (y), न (u), प (i), व (o), च (p) and vowel signs ु (q), ू (w).',
    badge: 'Elementary',
    level: 2,
    isPro: false,
    icon: 'CornerDownRight',
    lessons: [
      {
        id: 'rem-l5',
        track: 'remington',
        isPro: false,
        title: 'Top Row Center: म (e), त (r), ज (t), ल (y)',
        intro: 'Reach up from SDF and JKL to type top row letters cleanly.',
        keysTaught: ['e', 'r', 't', 'y'],
        targetWpm: 22,
        targetAccuracy: 95,
        content: 'मत जल तेज माल ताल जाल मेला राजा ताज तारा जीत ताज'
      },
      {
        id: 'rem-l6',
        track: 'remington',
        isPro: false,
        title: 'Top Row Right: न (u), प (i), व (o), च (p)',
        intro: 'Practice right hand upward reaches for u (न), i (प), o (व), p (च).',
        keysTaught: ['u', 'i', 'o', 'p'],
        targetWpm: 24,
        targetAccuracy: 95,
        content: 'नाव पवन चमक पान वन चार वचन विचार पाचन चुनाव वचन'
      },
      {
        id: 'rem-l7',
        track: 'remington',
        isPro: false,
        title: 'Top Row Matras: ु (q), ू (w)',
        intro: 'Reach left pinky up to q for ु matra and left ring up to w for ू matra.',
        keysTaught: ['q', 'w'],
        targetWpm: 26,
        targetAccuracy: 95,
        content: 'मुख सुख पूरब सूरज मूल फूल सुमन सुबह पूजा सूचना पूरक'
      },
      {
        id: 'rem-l8',
        track: 'remington',
        isPro: false,
        title: 'Top Row Sentence Assessment',
        intro: 'Integrate top row letters and matras with home row characters.',
        isReview: true,
        reviewLabel: 'Assessment',
        keysTaught: [],
        targetWpm: 28,
        targetAccuracy: 95,
        content: 'सुबह का सूरज जीवन में नई ऊर्जा और नया प्रकाश लेकर आता है।'
      }
    ]
  },
  {
    id: 'remington-level-3',
    track: 'remington',
    title: 'Remington Gail 3: Pre-Base Matra (ि) & Bottom Row',
    description: 'Master the stateful pre-base छोटी इ की मात्रा (f) followed by consonant, plus bottom row keys ग (x), ब (c), द (n).',
    badge: 'Intermediate',
    level: 3,
    isPro: true,
    icon: 'Zap',
    lessons: [
      {
        id: 'rem-l9',
        track: 'remington',
        isPro: true,
        title: 'Pre-base Matra (ि) Typing Flow',
        intro: 'In Remington, press f first, then the consonant (e.g. f + k = कि). Our engine converts it to valid Unicode automatically.',
        keysTaught: ['f'],
        targetWpm: 26,
        targetAccuracy: 95,
        content: 'दिन मिल सिर किस रवि कवि पिता किला विचार विकास किरण मित्र'
      },
      {
        id: 'rem-l10',
        track: 'remington',
        isPro: true,
        title: 'Bottom Row Consonants: ग (x), ब (c), द (n)',
        intro: 'Reach down with left index/middle fingers for x (ग), c (ब), n (द).',
        keysTaught: ['x', 'c', 'n'],
        targetWpm: 28,
        targetAccuracy: 95,
        content: 'गति बात दिन बदल गेंद बादल गुलाब दीपक दबाव गणित बयान'
      },
      {
        id: 'rem-l11',
        track: 'remington',
        isPro: true,
        title: 'Bottom Row Word Synthesis',
        intro: 'Build smooth speed across top, home, and bottom rows.',
        isReview: true,
        reviewLabel: 'Synthesis',
        keysTaught: [],
        targetWpm: 30,
        targetAccuracy: 95,
        content: 'कवि ने प्रकृति की सुंदरता का बहुत ही मनमोहक और अद्भुत वर्णन किया है।'
      },
      {
        id: 'rem-l12',
        track: 'remington',
        isPro: true,
        title: 'Intermediate Speed Assessment',
        intro: 'Sustained typing assessment with pre-base matras and bottom row keys.',
        isReview: true,
        reviewLabel: 'Assessment',
        keysTaught: [],
        targetWpm: 32,
        targetAccuracy: 95,
        content: 'शिक्षा वह अनमोल धन है जिसे कोई चुरा नहीं सकता। ज्ञान सदैव बांटने से बढ़ता रहता है।'
      }
    ]
  },
  {
    id: 'remington-level-4',
    track: 'remington',
    title: 'Remington Gail 4: Halant, Half Letters & R-Forms',
    description: 'Master typewriter halant (d), half-character Shift combinations (क्, त्, पन्, श्व), and r-forms (प्र, त्र, ज्ञ, र्म).',
    badge: 'Advanced',
    level: 4,
    isPro: true,
    icon: 'Hash',
    lessons: [
      {
        id: 'rem-l13',
        track: 'remington',
        isPro: true,
        title: 'Halant & Half Letters: क्या, न्याय, त्याग',
        intro: 'Use d for halant or Shift combinations for half-letters in standard Remington typing.',
        keysTaught: ['d'],
        targetWpm: 28,
        targetAccuracy: 95,
        content: 'क्या त्याग न्याय मुख्य स्पष्ट सच्चा बच्चा पक्का सम्मान वक्त'
      },
      {
        id: 'rem-l14',
        track: 'remington',
        isPro: true,
        title: 'R-Forms: प्रकाश, धर्म, कर्म, राष्ट्र',
        intro: 'Practice reph (Z/Shift) and ra-kār (Shift+3 or Shift+1) combinations.',
        isReview: true,
        reviewLabel: 'R-Forms',
        keysTaught: [],
        targetWpm: 30,
        targetAccuracy: 95,
        content: 'प्रकाश प्रथम त्रिभुज श्रम कर्म धर्म कार्य वर्ष राष्ट्र ट्रक ग्राम'
      },
      {
        id: 'rem-l15',
        track: 'remington',
        isPro: true,
        title: 'Shift Keys & Special Punctuations',
        intro: 'Master Shift layer punctuation marks and inverted question marks.',
        isReview: true,
        reviewLabel: 'Shift drill',
        keysTaught: ['Shift'],
        targetWpm: 32,
        targetAccuracy: 95,
        content: 'भारत माता की जय! सत्यमेव जयते। क्या आप पूर्ण रूप से तैयार हैं?'
      },
      {
        id: 'rem-l16',
        track: 'remington',
        isPro: true,
        title: 'Advanced Legal & Judicial Conjuncts',
        intro: 'High Court style passage testing complex half letters and legal vocabulary.',
        isReview: true,
        reviewLabel: 'Assessment',
        keysTaught: [],
        targetWpm: 34,
        targetAccuracy: 96,
        content: 'न्यायिक प्रक्रिया में साक्ष्यों की सत्यता सर्वोपरि होती है। निष्पक्ष निर्णय ही न्याय है।'
      }
    ]
  },
  {
    id: 'remington-level-5',
    track: 'remington',
    title: 'Remington Gail 5: High Court & CPCT Special Alt-Codes',
    description: 'Learn tricky characters: द्व, द्ध, ष्ट, ्र, Devanagari numbers, and formal administrative drafting terms.',
    badge: 'Expert',
    level: 5,
    isPro: true,
    icon: 'Award',
    lessons: [
      {
        id: 'rem-l17',
        track: 'remington',
        isPro: true,
        title: 'Special Ligatures: द्व, द्ध, ष्ट',
        intro: 'Special ligatures frequently tested in Allahabad, Patna, and Rajasthan High Court clerk examinations.',
        keysTaught: [],
        targetWpm: 30,
        targetAccuracy: 95,
        content: 'द्वार द्वितीय युद्ध विद्या बुद्धि राष्ट्र राष्ट्रीय दृष्टांत उद्देश्य'
      },
      {
        id: 'rem-l18',
        track: 'remington',
        isPro: true,
        title: 'Legal Terminology Sprint',
        intro: 'Essential court terms: अपीलार्थी, प्रत्यर्थी, वादपत्र, स्थगनादेश, शपथपत्र।',
        isReview: true,
        reviewLabel: 'Legal Vocab',
        keysTaught: [],
        targetWpm: 32,
        targetAccuracy: 96,
        content: 'अपीलार्थी प्रत्यर्थी वादपत्र स्थगनादेश साक्षी जिरह शपथपत्र साक्ष्य प्रतिवादी'
      },
      {
        id: 'rem-l19',
        track: 'remington',
        isPro: true,
        title: 'High Court Judicial Notification',
        intro: 'Full length judicial draft simulating actual exam paper.',
        isReview: true,
        reviewLabel: 'Judicial',
        keysTaught: [],
        targetWpm: 34,
        targetAccuracy: 96,
        content: 'माननीय उच्च न्यायालय के आदेशानुसार याचिकाकर्ता को तीन सप्ताह का समय प्रदान किया जाता है।'
      }
    ]
  },
  {
    id: 'remington-level-6',
    track: 'remington',
    title: 'Remington Gail 6: Speed Mastery (35-40 WPM)',
    description: 'Top-tier speed qualification drills designed for MP CPCT, SSC Hindi Stenographer, and Court Typist exams.',
    badge: 'Master',
    level: 6,
    isPro: true,
    icon: 'Award',
    lessons: [
      {
        id: 'rem-l20',
        track: 'remington',
        isPro: true,
        title: 'CPCT Speed Qualifier (30 WPM)',
        intro: 'Test your steady speed and minimal backspace usage under 30 WPM condition.',
        isReview: true,
        reviewLabel: 'CPCT Qualifier',
        keysTaught: [],
        targetWpm: 30,
        targetAccuracy: 97,
        content: 'कंप्यूटर दक्षता प्रमाणीकरण परीक्षा में गति एवं शुद्धता दोनों का समान महत्व है।'
      },
      {
        id: 'rem-l21',
        track: 'remington',
        isPro: true,
        title: 'High Court Clerk Bench Sprint (35 WPM)',
        intro: 'Complex legal arguments requiring flawless punctuation and spacing.',
        isReview: true,
        reviewLabel: 'HC Sprint',
        keysTaught: [],
        targetWpm: 35,
        targetAccuracy: 97,
        content: 'विद्वान अधिवक्ता द्वारा प्रस्तुत तर्कों के परिप्रेक्ष्य में यह सुस्पष्ट है कि अभियोजन पक्ष संदेह से परे आरोप सिद्ध करने में सफल रहा है।'
      },
      {
        id: 'rem-l22',
        track: 'remington',
        isPro: true,
        title: 'Remington Gail Speed Championship (40 WPM)',
        intro: 'The ultimate Remington Gail benchmark for top-ranking typing candidates.',
        isReview: true,
        reviewLabel: 'Championship',
        keysTaught: [],
        targetWpm: 40,
        targetAccuracy: 98,
        content: 'प्रजातांत्रिक व्यवस्था में विधि का शासन सर्वोपरि है। नागरिकों के मौलिक अधिकारों का संरक्षण न्यायपालिका का प्राथमिक उत्तरदायित्व है। निष्पक्ष और त्वरित न्याय से ही समाज में विश्वास सुदृढ़ होता है।'
      }
    ]
  }
];

export const COURSES = [
  ...ENGLISH_COURSES,
  ...INSCRIPT_COURSES,
  ...REMINGTON_COURSES
];

export function getCoursesByTrack(track = 'english') {
  if (track === 'inscript') return INSCRIPT_COURSES;
  if (track === 'remington') return REMINGTON_COURSES;
  return ENGLISH_COURSES;
}

export const TYPING_TESTS = [
  {
    id: 'test-1m-easy',
    title: '1-Minute Quick Sprint',
    duration: 60,
    difficulty: 'Easy',
    description: 'A brisk one-minute test with common everyday words to quickly check your baseline WPM.',
    text: 'Typing is one of the most valuable skills you can learn in the modern world. When you can type as fast as you think, computer work becomes effortless, productive, and enjoyable. Practice every single day for just ten minutes to build long-lasting muscle memory.'
  },
  {
    id: 'test-2m-medium',
    title: '2-Minute Standard Benchmark',
    duration: 120,
    difficulty: 'Medium',
    description: 'The standard two-minute benchmark used to measure sustained typing rhythm and accuracy.',
    text: 'Every morning brings a new opportunity to learn, create, and inspire. When we cultivate good habits and dedication, great achievements naturally follow. In touch typing, your fingers develop their own intelligence. They remember where each letter lives on the board without needing your eyes to search. Keep your posture upright, relax your wrists, and maintain a calm, steady rhythm from start to finish.'
  },
  {
    id: 'test-3m-endurance',
    title: '3-Minute Endurance Challenge',
    duration: 180,
    difficulty: 'Hard',
    description: 'Tests your speed endurance and sustained concentration over three uninterrupted minutes.',
    text: 'The history of communication spans ancient cave drawings, carved stone tablets, the Gutenberg printing press, telegraph wires, and now the global internet. At each monumental leap, the speed of transmitting human thought accelerated. Today, our keyboards are the primary instruments through which software is built, stories are published, and scientific discoveries are documented. To master the keyboard is to master the language of modern creation.'
  },
  {
    id: 'test-5m-master',
    title: '5-Minute Certification Exam',
    duration: 300,
    difficulty: 'Expert',
    description: 'A comprehensive 5-minute typing test for precision and endurance, eligible for a Certificate of Typing Speed.',
    text: 'Patience and consistency are the cornerstones of all genuine mastery. When beginners start learning to touch type, their fingers often feel clumsy and slow. They are tempted to glance down at the keys to speed up temporarily. However, resisting that urge is the single greatest breakthrough in the entire journey. By forcing your mind to rely solely on muscle memory, neural connections form between the concept of each letter and the precise movement of the corresponding finger. Within weeks, words flow seamlessly through your fingertips without friction.'
  }
];
