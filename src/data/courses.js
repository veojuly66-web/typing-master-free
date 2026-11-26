export const COURSES = [
  {
    id: 'course-basics',
    title: 'Touch Typing Basics',
    description: 'Master the home row, learn proper finger placement, and type without looking at the keyboard.',
    badge: 'Beginner',
    icon: 'Keyboard',
    lessons: [
      {
        id: 'c1-l1',
        title: 'Home Row: ASDF and JKL;',
        intro: 'Rest your left fingers on A S D F and your right fingers on J K L ;. Feel the tactile bumps on F and J with your index fingers.',
        keysTaught: ['a', 's', 'd', 'f', 'j', 'k', 'l', ';', ' '],
        targetWpm: 15,
        targetAccuracy: 95,
        content: 'asdf jkl; asdf jkl; a s d f j k l ; ff jj dd kk ss ll aa ;; asdf jkl; fdsa ;lkj asdf jkl; a s d f j k l ;'
      },
      {
        id: 'c1-l2',
        title: 'Home Row Words',
        intro: 'Form real English words using only the home row keys. Maintain a steady rhythm and keep your fingers resting softly on the home keys.',
        keysTaught: ['a', 's', 'd', 'f', 'j', 'k', 'l', ';'],
        targetWpm: 18,
        targetAccuracy: 95,
        content: 'all ask dad fall flask glad salad lad sad dash flash lass fad fall flask glad dad all ask salad dash fad lass'
      },
      {
        id: 'c1-l3',
        title: 'Introducing Keys E and I',
        intro: 'Reach up from D to press E with your left middle finger. Reach up from K to press I with your right middle finger. Return to the home row right away.',
        keysTaught: ['e', 'i', 'd', 'k'],
        targetWpm: 20,
        targetAccuracy: 95,
        content: 'de de de ki ki ki dede kiki ded kik ed ik de ki see ill kill fell die lie silk like life side safe dial leaf fail'
      },
      {
        id: 'c1-l4',
        title: 'Words with E and I',
        intro: 'Practice fluid finger movement between the home row and top row keys E and I. Speed comes naturally from smooth accuracy.',
        keysTaught: ['e', 'i', 'a', 's', 'd', 'f', 'j', 'k', 'l'],
        targetWpm: 22,
        targetAccuracy: 95,
        content: 'field desk silk leaf sail fake dislike ideal alkali file safe alike shield slide detail dial slide fake like leaf'
      },
      {
        id: 'c1-l5',
        title: 'Introducing Keys R and U',
        intro: 'Reach up from F to press R with your left index finger. Reach up from J to press U with your right index finger.',
        keysTaught: ['r', 'u', 'f', 'j'],
        targetWpm: 24,
        targetAccuracy: 95,
        content: 'fr fr fr ju ju ju frfr juju red run fur jar rule fire dark user sure rural true real flour rule rare rush rail'
      },
      {
        id: 'c1-l6',
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
        title: 'Introducing Keys T and Y',
        intro: 'Stretch your left index finger right and up to reach T. Stretch your right index finger left and up to reach Y.',
        keysTaught: ['t', 'y', 'f', 'j'],
        targetWpm: 26,
        targetAccuracy: 95,
        content: 'ft ft ft jy jy jy they stay year trust yesterday story treaty yet tray try youth tasty dusty yeast daily yesterday'
      },
      {
        id: 'c1-l8',
        title: 'Words with T and Y',
        intro: 'Practice smooth stretches for T and Y without lifting your wrists off their rest position.',
        isReview: true,
        reviewLabel: 'Review',
        keysTaught: ['t', 'y'],
        targetWpm: 28,
        targetAccuracy: 95,
        content: 'today trust try pretty target duty study safety utility reality easily royalty dirty dairy layer layout totally'
      },
      {
        id: 'c1-l9',
        title: 'Introducing Keys C and Comma',
        intro: 'Reach down from D with your left middle finger to press C. Reach down from K with your right middle finger to press comma (,).',
        keysTaught: ['c', ',', 'd', 'k'],
        targetWpm: 28,
        targetAccuracy: 95,
        content: 'dc dc dc k, k, k, call, care, face, nice, fact, track, clock, race, rice, cake, lock, cool, dice, case, card, clay,'
      },
      {
        id: 'c1-l10',
        title: 'Introducing Keys G and H',
        intro: 'Reach your left index finger to the right for G. Reach your right index finger to the left for H. Both sit on the home row.',
        keysTaught: ['g', 'h', 'f', 'j'],
        targetWpm: 30,
        targetAccuracy: 95,
        content: 'fg fg jh jh glad high ghost huge faith rough light guide fight tight flight graph heart right height ghost slight'
      },
      {
        id: 'c1-l11',
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
        title: 'Basics Mastery Assessment',
        intro: 'Demonstrate touch typing across all home row and top row letters. Aim for at least 95% accuracy.',
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
    title: 'Speed Building & Flow',
    description: 'Build typing velocity through muscle memory drills, high-frequency letter patterns, and steady cadence.',
    badge: 'Intermediate',
    icon: 'Zap',
    lessons: [
      {
        id: 'c2-l1',
        title: 'High Frequency Letter Pairs',
        intro: 'Certain letter clusters occur in nearly every English word. Training these builds quick finger reflexes.',
        keysTaught: ['t', 'h', 'e', 'i', 'n', 'r', 'a'],
        targetWpm: 35,
        targetAccuracy: 96,
        content: 'the there then they where when other rather another that path math north south water mother father together weather'
      },
      {
        id: 'c2-l2',
        title: 'Common Prefixes & Suffixes',
        intro: 'Type word parts in single fluid motions: -ing, -tion, -ment, -able, dis-, and pre-.',
        keysTaught: ['i', 'n', 'g', 't', 'o', 'm', 'e'],
        targetWpm: 38,
        targetAccuracy: 96,
        content: 'action direction mention emotion section running playing thinking movement payment agreement predictable comfortable preview'
      },
      {
        id: 'c2-l3',
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
    title: 'Numbers & Symbols',
    description: 'Learn the top number row, math operators, code brackets, and punctuation without looking down.',
    badge: 'Advanced',
    icon: 'Hash',
    lessons: [
      {
        id: 'c3-l1',
        title: 'Number Row: 1 2 3 4 5',
        intro: 'Reach up with your left hand: 1 (pinky), 2 (ring), 3 (middle), 4 and 5 (index).',
        keysTaught: ['1', '2', '3', '4', '5'],
        targetWpm: 25,
        targetAccuracy: 94,
        content: '1 2 3 4 5 12 34 51 25 43 15 24 35 123 451 234 543 215 142 352 1122 3344 5511 2233 4455'
      },
      {
        id: 'c3-l2',
        title: 'Number Row: 6 7 8 9 0',
        intro: 'Reach up with your right hand: 6 and 7 (index), 8 (middle), 9 (ring), 0 (pinky).',
        keysTaught: ['6', '7', '8', '9', '0'],
        targetWpm: 25,
        targetAccuracy: 94,
        content: '6 7 8 9 0 67 89 06 70 86 97 08 69 789 067 890 760 896 907 6677 8899 0066 7788 9900'
      },
      {
        id: 'c3-l3',
        title: 'Dates and Phone Numbers',
        intro: 'Practice practical numbers: dates, telephone formats, and serial codes.',
        keysTaught: ['-', '/', '(', ')'],
        targetWpm: 28,
        targetAccuracy: 95,
        content: '2026-11-22 1998-04-15 (555) 019-2834 800-555-0199 Order #94820 Room 402 flight 747 in year 2030'
      },
      {
        id: 'c3-l4',
        title: 'Common Symbols & Punctuation',
        intro: 'Hold Shift to type symbols on the number row: ! @ # $ % ^ & * ( ).',
        keysTaught: ['!', '@', '#', '$', '%', '&', '*', '(', ')'],
        targetWpm: 25,
        targetAccuracy: 94,
        content: 'user@email.com $199.99 100% genuine! Item #42 (Best Price) Save 25% & enjoy free shipping! Wow! (Note: 10 + 20 = 30)'
      },
      {
        id: 'c3-l5',
        title: 'Code Syntax and Brackets',
        intro: 'Practice brackets and punctuation common in software and technical writing: { } [ ] < > ; : " \' / \\',
        keysTaught: ['{', '}', '[', ']', '<', '>', ';', ':', '/', '\\'],
        targetWpm: 26,
        targetAccuracy: 94,
        content: 'function sum(a, b) { return a + b; } const arr = [1, 2, 3]; if (x > 0 && y <= 10) { console.log("Success!"); }'
      },
      {
        id: 'c3-l6',
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
    title: 'Prose & Literature',
    description: 'Build endurance and precision with complete paragraphs, historical texts, and literature excerpts.',
    badge: 'Expert',
    icon: 'Award',
    lessons: [
      {
        id: 'c4-l1',
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
        title: 'Classic Literature Excerpt',
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
        title: 'Endurance Assessment',
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
    description: 'A comprehensive 5-minute typing test for precision and endurance, eligible for a Certificate of Completion.',
    text: 'Patience and consistency are the cornerstones of all genuine mastery. When beginners start learning to touch type, their fingers often feel clumsy and slow. They are tempted to glance down at the keys to speed up temporarily. However, resisting that urge is the single greatest breakthrough in the entire journey. By forcing your mind to rely solely on muscle memory, neural connections form between the concept of each letter and the precise movement of the corresponding finger. Within weeks, words flow seamlessly through your fingertips without friction.'
  }
];
