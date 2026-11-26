-- 01: Create Tables, Enums, and Row Level Security for Pankaj Typing SaaS

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  preferred_language TEXT DEFAULT 'en' CHECK (preferred_language IN ('en', 'hi')),
  active_track TEXT DEFAULT 'english' CHECK (active_track IN ('english', 'inscript', 'remington')),
  daily_goal_minutes INT DEFAULT 10,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Subscriptions Table
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan TEXT NOT NULL CHECK (plan IN ('free', 'pro_monthly', 'pro_yearly', 'exam_pack_3m')),
  status TEXT NOT NULL CHECK (status IN ('active', 'trialing', 'canceled', 'past_due', 'expired')),
  razorpay_customer_id TEXT,
  razorpay_subscription_id TEXT,
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  current_period_start TIMESTAMPTZ DEFAULT NOW(),
  current_period_end TIMESTAMPTZ NOT NULL,
  trial_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user_status ON public.subscriptions(user_id, status);

-- 3. Payments Table
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  razorpay_payment_id TEXT NOT NULL,
  razorpay_order_id TEXT,
  razorpay_signature TEXT,
  amount INT NOT NULL, -- in paise (e.g. 9900 = ₹99)
  currency TEXT DEFAULT 'INR',
  status TEXT NOT NULL,
  plan TEXT NOT NULL,
  method TEXT, -- 'upi', 'card', 'netbanking'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payments_user ON public.payments(user_id);

-- 4. Lesson Progress Table
CREATE TABLE IF NOT EXISTS public.lesson_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  track TEXT NOT NULL CHECK (track IN ('english', 'inscript', 'remington')),
  lesson_id TEXT NOT NULL,
  net_wpm INT NOT NULL,
  gross_wpm INT NOT NULL,
  accuracy INT NOT NULL,
  stars INT DEFAULT 3 CHECK (stars BETWEEN 1 AND 3),
  passed BOOLEAN DEFAULT TRUE,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, track, lesson_id)
);

-- 5. Test Results Table
CREATE TABLE IF NOT EXISTS public.test_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  track TEXT NOT NULL CHECK (track IN ('english', 'inscript', 'remington')),
  test_id TEXT NOT NULL,
  test_title TEXT NOT NULL,
  duration INT NOT NULL, -- seconds
  net_wpm INT NOT NULL,
  gross_wpm INT NOT NULL,
  accuracy INT NOT NULL,
  consistency INT,
  kph INT,
  errors_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Key Stats Table (Keystroke Heatmap & Analytics)
CREATE TABLE IF NOT EXISTS public.key_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  track TEXT NOT NULL CHECK (track IN ('english', 'inscript', 'remington')),
  key_char TEXT NOT NULL,
  hits INT DEFAULT 0,
  errors INT DEFAULT 0,
  total_latency_ms BIGINT DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, track, key_char)
);

-- 7. Daily Activity Table
CREATE TABLE IF NOT EXISTS public.daily_activity (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_date DATE NOT NULL,
  practice_seconds INT DEFAULT 0,
  lessons_count INT DEFAULT 0,
  tests_count INT DEFAULT 0,
  UNIQUE(user_id, activity_date)
);

-- 8. Achievements Table
CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id TEXT NOT NULL,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- 9. Certificates Table (Public read by certificate ID for verification)
CREATE TABLE IF NOT EXISTS public.certificates (
  id TEXT PRIMARY KEY, -- e.g. PT-ABC123
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_name TEXT NOT NULL,
  track TEXT NOT NULL,
  test_title TEXT NOT NULL,
  net_wpm INT NOT NULL,
  gross_wpm INT NOT NULL,
  accuracy INT NOT NULL,
  duration INT NOT NULL,
  issued_date TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Pro Lessons Table (Content stored in database, gated to Pro subscribers)
CREATE TABLE IF NOT EXISTS public.lessons_pro (
  id TEXT PRIMARY KEY,
  track TEXT NOT NULL CHECK (track IN ('english', 'inscript', 'remington')),
  level INT NOT NULL,
  lesson_number INT NOT NULL,
  title TEXT NOT NULL,
  intro TEXT,
  content TEXT NOT NULL,
  target_wpm INT NOT NULL,
  target_accuracy INT NOT NULL,
  keys_taught TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Pro Exam Passages Table
CREATE TABLE IF NOT EXISTS public.passages_pro (
  id TEXT PRIMARY KEY,
  language TEXT NOT NULL CHECK (language IN ('english', 'hindi')),
  exam_type TEXT NOT NULL, -- 'ssc', 'high_court', 'cpct', 'general'
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  duration INT NOT NULL, -- standard seconds
  word_count INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =======================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =======================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.key_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons_pro ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.passages_pro ENABLE ROW LEVEL SECURITY;

-- Helper function: Check if user has active Pro subscription or trial
CREATE OR REPLACE FUNCTION public.has_active_pro(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.subscriptions
    WHERE user_id = user_uuid
      AND (
        (status = 'active' AND current_period_end > NOW())
        OR (status = 'trialing' AND trial_end > NOW())
      )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles: Users can view and update their own profile
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Subscriptions: Users can read their own subscriptions
CREATE POLICY "Users can view own subscriptions" ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);

-- Payments: Users can view their own payment history
CREATE POLICY "Users can view own payments" ON public.payments FOR SELECT USING (auth.uid() = user_id);

-- Progress & Activity: Users manage their own data
CREATE POLICY "Users manage own lesson progress" ON public.lesson_progress FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own test results" ON public.test_results FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own key stats" ON public.key_stats FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own daily activity" ON public.daily_activity FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own achievements" ON public.achievements FOR ALL USING (auth.uid() = user_id);

-- Certificates: Users can insert/view their own certificates; ANYONE can view by ID (for QR code verification)
CREATE POLICY "Anyone can view certificate by ID" ON public.certificates FOR SELECT USING (true);
CREATE POLICY "Users can insert own certificate" ON public.certificates FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Pro Content: Enforced on the Server!
-- Only users with active Pro subscription or valid trial can read Pro lessons and passages
CREATE POLICY "Pro subscribers read pro lessons" ON public.lessons_pro FOR SELECT USING (public.has_active_pro(auth.uid()));
CREATE POLICY "Pro subscribers read pro passages" ON public.passages_pro FOR SELECT USING (public.has_active_pro(auth.uid()));

-- =======================================================
-- AUTOMATIC PROFILE & 7-DAY TRIAL INITIALIZATION TRIGGER
-- =======================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- 1. Insert Profile
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );

  -- 2. Automatically grant 7-day free Pro trial (no credit card required)
  INSERT INTO public.subscriptions (
    user_id,
    plan,
    status,
    current_period_start,
    current_period_end,
    trial_end
  )
  VALUES (
    NEW.id,
    'pro_monthly',
    'trialing',
    NOW(),
    NOW() + INTERVAL '7 days',
    NOW() + INTERVAL '7 days'
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
