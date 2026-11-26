# Pankaj Typing — Bilingual Touch Typing & Exam Preparation SaaS

A professional English and Hindi typing SaaS built with React 18, Vite, Tailwind CSS, Supabase, and Razorpay. Designed specifically for Indian students and government typing examination aspirants (SSC CHSL/CGL, Allahabad/Patna/Rajasthan High Court, MP CPCT, and State Secretariat exams).

- **Live URL**: [https://veojuly66-web.github.io/typing-master-free/](https://veojuly66-web.github.io/typing-master-free/)
- **Target Exams**: SSC CHSL & CGL, High Court Steno & Clerk, MP CPCT, State Secretariat Typist
- **Typing Engines**: English (QWERTY), Hindi Inscript (मानक इंस्क्रिप्ट - BIS IS 14195:1994), Hindi Remington Gail (रेमिंगटन गेल - Krutidev/Devlys)

---

## Key Highlights

- **Bilingual English & Hindi Touch Typing**:
  - Full support for Government BIS Inscript layout.
  - Stateful Remington Gail engine handling pre-base matra (`f + k -> कि`) emitting modern Unicode Devanagari.
  - Grapheme cluster segmentation using `Intl.Segmenter` for accurate character calculation and error highlighting.
- **TCS iON Exam Simulator**:
  - Replicates official examination software with split-screen text window, real-time timer, word-count gross & net WPM, and full/half mistake penalty calculations.
  - Immediate qualification scorecards (QUALIFIED / NOT QUALIFIED) matching official board cutoffs.
- **76 Progressive Lessons Across 17 Courses**:
  - **English Track**: 5 levels (Beginner, Elementary, Intermediate, Advanced, Expert).
  - **Hindi Inscript Track**: 6 levels (Home Row to 40+ WPM Secretarial Speed).
  - **Hindi Remington Track**: 6 levels (Home Row to 40+ WPM High Court Speed).
  - Levels 1 & 2 in all tracks are free forever without login; Levels 3+ are part of Pro.
- **SaaS Subscription & Payment Architecture**:
  - **Free Starter Plan**: First 2 levels of English & Hindi, 3x 1-minute speed tests per day, 1 arcade game (Word Bubbles), 7-day stats.
  - **Pro Plan**: ₹99/month, ₹499/year (Save 58%), and ₹249 one-time Exam Pack (3 months).
  - **7-Day Free Trial**: Automatic on user signup with no credit card required.
  - **Razorpay Integration**: UPI, Debit/Credit Cards, Netbanking with server-side signature verification and webhook idempotency.
  - **Supabase Backend**: Postgres schema with Row Level Security (RLS) enforcing server-side Pro content access on `lessons_pro` and `passages_pro`.
- **Single Brand Config**: All branding, pricing, support email, legal entity, and exam presets live in a single editable file: `src/config/brand.js`.

---

## Tech Stack

- **Frontend**: React 18, Vite 5, Tailwind CSS 3, Lucide React, Canvas Confetti, jsPDF
- **Routing & State**: Hash/Browser routing, React Context (`AuthProvider`, `I18nProvider`)
- **Backend & Database**: Supabase (PostgreSQL 15, Auth, Row Level Security)
- **Serverless Compute**: Supabase Deno Edge Functions (`create-subscription`, `create-order`, `verify-payment`, `razorpay-webhook`)
- **Testing**: Vitest (100% pass across 5 test suites: stats, layouts, courses, passages, exams)
- **Deployment**: Vercel ready (`vercel.json`) & GitHub Pages build workflow

---

## Getting Started

### 1. Prerequisites
- Node.js 18+ and npm 9+
- (Optional) Supabase CLI for edge functions

### 2. Installation
```bash
git clone https://github.com/veojuly66-web/typing-master-free.git
cd typing-master-free
npm install
```

### 3. Environment Setup
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Populate your credentials:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_RAZORPAY_KEY_ID=rzp_test_yourkeyid
```
*(Note: If left empty, the application runs in local offline/guest mode with simulated test payments and guest progress saving)*

### 4. Running Locally
```bash
npm run dev
```
Open `http://localhost:5173/` in your browser.

### 5. Running Tests
```bash
npm run test
```

### 6. Production Build
```bash
npm run build
```
Generates an optimized, chunk-split PWA in `./dist`.

---

## Supabase & Database Setup

1. Create a new project in [Supabase](https://supabase.com).
2. Go to **SQL Editor** and run the migrations in order:
   - `supabase/migrations/20261126000001_create_schema_and_rls.sql` (Creates profiles, subscriptions, payments, lesson progress, test results, daily activity, and RLS policies).
   - `supabase/migrations/20261126000002_seed_pro_content.sql` (Seeds official SSC, High Court, and CPCT exam passages into `passages_pro`).
3. Deploy Edge Functions (if using live Razorpay webhooks):
   ```bash
   supabase functions deploy create-subscription
   supabase functions deploy create-order
   supabase functions deploy verify-payment
   supabase functions deploy razorpay-webhook
   ```
4. Set Supabase secrets:
   ```bash
   supabase secrets set RAZORPAY_KEY_ID=rzp_live_xxx
   supabase secrets set RAZORPAY_KEY_SECRET=your_secret_xxx
   supabase secrets set RAZORPAY_WEBHOOK_SECRET=your_webhook_secret_xxx
   ```

---

## Deployment to Vercel

The project includes `vercel.json` configured with SPA rewrites and caching headers:
1. Connect your GitHub repository to [Vercel](https://vercel.com).
2. Framework Preset: **Vite**.
3. Build Command: `npm run build`.
4. Output Directory: `dist`.
5. Add Environment Variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_RAZORPAY_KEY_ID`
6. Click **Deploy**.

---

## Customizing Brand & Pricing

Edit `src/config/brand.js` to change:
- Company and Product Name
- Support email (`support@pankajtyping.com`), phone number, and address
- Monthly, Yearly, and Exam Pack subscription prices
- GST notes and invoice details
- Colors and themes

---

## License

MIT © 2026 Pankaj Typing / Pankaj Digital Learning Solutions.
