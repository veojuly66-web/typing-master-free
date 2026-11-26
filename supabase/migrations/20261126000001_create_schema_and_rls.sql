-- 01: Create Tables, Constraints, Indexes, and Hardened Row Level Security for Pankaj Typing SaaS

-- Non-exposed schema for privileged helper & trigger functions (never listed in Data API Exposed Schemas)
CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC;

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

-- 2. Subscriptions Table (1 active/latest row per user for .single() & upsert)
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
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
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  razorpay_payment_id TEXT UNIQUE NOT NULL,
  razorpay_order_id TEXT,
  razorpay_signature TEXT,
  amount INT NOT NULL CHECK (amount >= 0), -- in paise (e.g. 9900 = ₹99)
  currency TEXT DEFAULT 'INR',
  status TEXT NOT NULL,
  plan TEXT NOT NULL,
  method TEXT, -- 'upi', 'card', 'netbanking'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payments_user ON public.payments(user_id);

-- 4. Lesson Progress Table
CREATE TABLE IF NOT EXISTS public.lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

CREATE INDEX IF NOT EXISTS idx_test_results_user_created ON public.test_results(user_id, created_at DESC);

-- 6. Key Stats Table (Keystroke Heatmap & Analytics)
CREATE TABLE IF NOT EXISTS public.key_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_date DATE NOT NULL,
  practice_seconds INT DEFAULT 0,
  lessons_count INT DEFAULT 0,
  tests_count INT DEFAULT 0,
  UNIQUE(user_id, activity_date)
);

-- 8. Achievements Table
CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id TEXT NOT NULL,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- 9. Certificates Table (Owner access only; public QR lookup happens via verify_certificate RPC)
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

CREATE INDEX IF NOT EXISTS idx_certificates_user ON public.certificates(user_id);

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
-- LEAST-PRIVILEGE GRANTS (DEFENSE IN DEPTH WITH RLS)
-- =======================================================

-- Remove unnecessary anonymous table privileges on all user/pro tables
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM PUBLIC, anon;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM PUBLIC, anon;

-- Grant minimum required privileges to authenticated users
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM authenticated;
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT SELECT ON public.subscriptions TO authenticated;
GRANT SELECT ON public.payments TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lesson_progress TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.test_results TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.key_stats TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.daily_activity TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.achievements TO authenticated;
GRANT SELECT, INSERT ON public.certificates TO authenticated;
GRANT SELECT ON public.lessons_pro TO authenticated;
GRANT SELECT ON public.passages_pro TO authenticated;

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

-- Remove old insecure/exposed helper if present
DROP POLICY IF EXISTS "Pro subscribers read pro lessons" ON public.lessons_pro;
DROP POLICY IF EXISTS "Pro subscribers read pro passages" ON public.passages_pro;
DROP FUNCTION IF EXISTS public.has_active_pro(UUID);

-- Private helper: checks caller's own auth.uid() inside a non-exposed schema
CREATE OR REPLACE FUNCTION private.has_active_pro()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.subscriptions
    WHERE user_id = (SELECT auth.uid())
      AND (
        (status = 'active' AND current_period_end > NOW())
        OR (status = 'trialing' AND trial_end > NOW())
      )
  );
$$;

REVOKE ALL ON FUNCTION private.has_active_pro() FROM PUBLIC, anon;
GRANT USAGE ON SCHEMA private TO authenticated;
GRANT EXECUTE ON FUNCTION private.has_active_pro() TO authenticated;

-- Scoped Certificate Verification RPC (prevents table scraping / user_id leakage while allowing QR check)
CREATE OR REPLACE FUNCTION public.verify_certificate(cert_id TEXT)
RETURNS TABLE (
  id TEXT,
  recipient_name TEXT,
  track TEXT,
  test_title TEXT,
  net_wpm INT,
  gross_wpm INT,
  accuracy INT,
  duration INT,
  issued_date TEXT
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT
    c.id,
    c.recipient_name,
    c.track,
    c.test_title,
    c.net_wpm,
    c.gross_wpm,
    c.accuracy,
    c.duration,
    c.issued_date
  FROM public.certificates c
  WHERE c.id = cert_id
  LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.verify_certificate(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.verify_certificate(TEXT) TO anon, authenticated;

-- Profiles: Authenticated users can view, insert, and update only their own profile
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT auth.uid()) = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING ((SELECT auth.uid()) = id)
  WITH CHECK ((SELECT auth.uid()) = id);

-- Subscriptions: Read-only for authenticated owner (writes via Service Role / webhooks only)
DROP POLICY IF EXISTS "Users can view own subscriptions" ON public.subscriptions;
CREATE POLICY "Users can view own subscriptions"
  ON public.subscriptions FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

-- Payments: Read-only for authenticated owner
DROP POLICY IF EXISTS "Users can view own payments" ON public.payments;
CREATE POLICY "Users can view own payments"
  ON public.payments FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

-- Progress & Activity: Users manage only their own rows
DROP POLICY IF EXISTS "Users manage own lesson progress" ON public.lesson_progress;
CREATE POLICY "Users manage own lesson progress"
  ON public.lesson_progress FOR ALL
  TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users manage own test results" ON public.test_results;
CREATE POLICY "Users manage own test results"
  ON public.test_results FOR ALL
  TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users manage own key stats" ON public.key_stats;
CREATE POLICY "Users manage own key stats"
  ON public.key_stats FOR ALL
  TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users manage own daily activity" ON public.daily_activity;
CREATE POLICY "Users manage own daily activity"
  ON public.daily_activity FOR ALL
  TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users manage own achievements" ON public.achievements;
CREATE POLICY "Users manage own achievements"
  ON public.achievements FOR ALL
  TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

-- Certificates: Owner-only direct table access (public verification goes through public.verify_certificate RPC)
DROP POLICY IF EXISTS "Anyone can view certificate by ID" ON public.certificates;
DROP POLICY IF EXISTS "Users view own certificates" ON public.certificates;
CREATE POLICY "Users view own certificates"
  ON public.certificates FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert own certificate" ON public.certificates;
CREATE POLICY "Users can insert own certificate"
  ON public.certificates FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT auth.uid()) = user_id);

-- Pro Content: Enforced on the Server using cached initPlan lookup
CREATE POLICY "Pro subscribers read pro lessons"
  ON public.lessons_pro FOR SELECT
  TO authenticated
  USING ((SELECT private.has_active_pro()));

CREATE POLICY "Pro subscribers read pro passages"
  ON public.passages_pro FOR SELECT
  TO authenticated
  USING ((SELECT private.has_active_pro()));

-- =======================================================
-- AUTOMATIC PROFILE & 7-DAY TRIAL INITIALIZATION TRIGGER
-- =======================================================

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

CREATE OR REPLACE FUNCTION private.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- 1. Insert Profile
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, NEW.id::text || '@noemail.local'),
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(COALESCE(NEW.email, 'Typist'), '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;

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
  )
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION private.handle_new_user() FROM PUBLIC, anon, authenticated;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE private.handle_new_user();
