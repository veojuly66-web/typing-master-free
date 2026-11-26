/**
 * Single source of truth for branding, pricing, support contacts and configuration.
 * Change this file to rebrand the entire application in one place.
 */

export const BRAND = {
  // Brand Identity
  name: 'Pankaj Typing',
  legalEntity: 'Pankaj Typing Technologies',
  tagline: 'Typing practice that gets you exam-ready — in English and Hindi',
  shortTagline: 'Professional English & Hindi Typing SaaS',
  description: 'Structured touch-typing courses, government exam simulators (SSC, High Court, CPCT), and adaptive weak-key training for students and job aspirants.',
  url: 'https://pankajtyping.com', // Replace with production custom domain
  adminEmail: 'pankajmarch45@gmail.com', // Admin panel access gate

  // Support & Company Details (used in Contact, Footer, Legal & Invoices)
  contact: {
    email: 'support@pankajtyping.com', // PLACEHOLDER: Update with your real support email
    phone: '+91 98765 43210',          // PLACEHOLDER: Update with your phone/WhatsApp support
    address: 'VPO Dari, Dharamshala, District Kangra, Himachal Pradesh - 176215, India', // PLACEHOLDER: Business address
    hours: 'Monday to Saturday, 9:00 AM – 6:00 PM IST',
    whatsappSupportUrl: 'https://wa.me/919876543210' // Optional WhatsApp chat link
  },

  // Color Tokens (Synchronized with Tailwind & CSS variables)
  colors: {
    accent: '#1F6F54',        // Deep forest green
    accentHover: '#185A44',
    accentSoft: '#E8F2ED',
    pro: '#9A6B12',           // Pro plan amber/gold
    proHover: '#7D550A',
    proSoft: '#FEF3C7',
    error: '#C2410C',
    warning: '#B45309'
  },

  // Subscription Plans & Pricing (in Indian Rupees INR)
  pricing: {
    currency: 'INR',
    currencySymbol: '₹',
    gstNote: 'Inclusive of 18% GST. No hidden convenience fees.',
    freeTrialDays: 7,

    plans: {
      free: {
        id: 'free',
        name: 'Free Starter',
        price: 0,
        billing: 'Forever free',
        description: 'For beginners starting their touch-typing journey.',
        features: [
          'First 2 levels of English lessons (12 drills)',
          'First 2 levels of Hindi lessons (Inscript & Remington)',
          '3 daily 1-minute speed tests',
          'Word Bubbles arcade game',
          'Basic stats dashboard (last 7 days)',
          'No account required to start'
        ],
        ctaText: 'Start Free'
      },

      monthly: {
        id: 'pro_monthly',
        name: 'Pro Monthly',
        price: 99,
        period: 'month',
        billing: 'Billed monthly',
        description: 'Flexible plan for active exam preparation and daily speed building.',
        badge: null,
        razorpayPlanId: 'plan_monthly_99', // Set in Supabase / Razorpay Dashboard
        features: [
          'All 5 English levels (30+ comprehensive drills)',
          'All 6 Hindi Inscript levels (full conjuncts & matras)',
          'All 6 Hindi Remington Gail levels (Krutidev exam layout)',
          'All Government Exam Simulators (SSC, High Court, CPCT)',
          'Full 1 to 10-minute speed tests & unlimited attempts',
          'Keybr-style adaptive weak-key practice engine',
          'All 3 arcade games (Word Attack, Bubbles, Speed Race)',
          'Unlimited verifiable Certificates (PDF & PNG with QR code)',
          'Cloud sync across all your devices & browsers',
          'Zero advertisements & priority email support'
        ],
        ctaText: 'Start 7-Day Free Trial'
      },

      yearly: {
        id: 'pro_yearly',
        name: 'Pro Yearly',
        price: 499,
        period: 'year',
        billing: '₹41.58 / month, billed annually',
        originalPrice: 1188,
        discountLabel: 'Save 58%',
        badge: 'Best Value',
        isPopular: true,
        razorpayPlanId: 'plan_yearly_499', // Set in Supabase / Razorpay Dashboard
        features: [
          'Everything in Pro Monthly',
          '58% discount compared to monthly plan',
          'Guaranteed exam access for full 12 months',
          'New exam passages & layouts updated automatically',
          'Priority WhatsApp & email support'
        ],
        ctaText: 'Start 7-Day Free Trial'
      },

      examPack: {
        id: 'exam_pack_3m',
        name: 'Exam Pack (3 Months)',
        price: 249,
        period: '3 months',
        billing: 'One-time payment for 90 days access',
        badge: 'Exam Aspirants',
        isOneTime: true,
        description: 'Complete Pro features for 90 days. Ideal for aspirants appearing in upcoming typing tests.',
        features: [
          'All Pro features for 90 days',
          'One-time payment (no recurring debit)',
          'Dedicated SSC & High Court mock tests',
          'Detailed mistake-by-mistake evaluation scorecards',
          'Valid for 1 user account'
        ],
        ctaText: 'Get 3 Months Access'
      }
    }
  },

  // Target Government Exams in India
  exams: [
    { id: 'ssc-chsl', name: 'SSC CHSL', languages: ['English (35 WPM)', 'Hindi (30 WPM)'], minSpeed: 35, duration: 10 },
    { id: 'ssc-cgl', name: 'SSC CGL', languages: ['English (27 WPM)'], minSpeed: 27, duration: 15 },
    { id: 'allahabad-hc', name: 'Allahabad High Court ARO/Clerk', languages: ['English (30 WPM)', 'Hindi (25 WPM)'], minSpeed: 30, duration: 10 },
    { id: 'patna-hc', name: 'Patna High Court Stenographer/DEO', languages: ['English (40 WPM)', 'Hindi (30 WPM)'], minSpeed: 40, duration: 10 },
    { id: 'cpct-mp', name: 'MP CPCT Exam', languages: ['English (30 WPM)', 'Hindi Remington (20 WPM)'], minSpeed: 30, duration: 15 },
    { id: 'rajasthan-hc', name: 'Rajasthan High Court LDC', languages: ['English (26.6 WPM)', 'Hindi (26.6 WPM)'], minSpeed: 27, duration: 10 },
    { id: 'upsssc-junior-assistant', name: 'UPSSSC Junior Assistant', languages: ['Hindi (25 WPM)', 'English (30 WPM)'], minSpeed: 30, duration: 5 }
  ],

  // Free Tier Limits (enforced client & server side)
  freeLimits: {
    maxLessonsPerTrack: 12,
    dailySpeedTests: 3,
    maxTestDurationSeconds: 60,
    historyDays: 7,
    allowedGames: ['word-bubbles']
  }
};
