-- Upscavra Supabase Database Setup v2.0
-- Güncellenmiş iş modeli ve referans sistemi

-- ============================================
-- 1. PROFILES TABLE (User accounts & credits)
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  credits INTEGER DEFAULT 10,           -- Günlük ücretsiz kredi (artırıldı)
  is_premium BOOLEAN DEFAULT FALSE,
  daily_limit INTEGER DEFAULT 10,       -- Free kullanıcılar için günlük limit
  last_reset_date DATE DEFAULT CURRENT_DATE,
  premium_expiry_date DATE,
  premium_tier TEXT CHECK (premium_tier IN ('starter', 'pro', 'business')),
  referral_code TEXT UNIQUE,
  referred_by UUID REFERENCES profiles(id),
  total_referrals INTEGER DEFAULT 0,    -- Toplam referans sayısı
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own profile
CREATE POLICY "Users can read own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Policy: Allow insert for auth triggers
CREATE POLICY "Allow insert for auth" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);


-- ============================================
-- 2. SUPPORT TICKETS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS support_tickets (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  is_premium BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  created_at TIMESTAMP DEFAULT NOW(),
  resolved_at TIMESTAMP,
  admin_notes TEXT
);

ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create tickets" ON support_tickets
  FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Service role can read all" ON support_tickets
  FOR SELECT USING (auth.role() = 'service_role');


-- ============================================
-- 3. REFERRAL LOG TABLE (Takip için)
-- ============================================
CREATE TABLE IF NOT EXISTS referral_log (
  id SERIAL PRIMARY KEY,
  referrer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  referred_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  credits_given INTEGER DEFAULT 3,      -- Her iki tarafa verilen kredi
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(referred_id)                   -- Bir kullanıcı sadece bir kez referans edilebilir
);

ALTER TABLE referral_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own referrals" ON referral_log
  FOR SELECT USING (auth.uid() = referrer_id);


-- ============================================
-- 4. REFERRAL PROCESSING FUNCTION (Güncellenmiş)
-- ============================================
CREATE OR REPLACE FUNCTION process_referral(new_user_id UUID, referrer_code TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  referrer_uuid UUID;
  bonus_credits INTEGER := 3;  -- Her iki tarafa 3 kredi
BEGIN
  -- Referrer'ı bul (referral_code'a göre)
  SELECT id INTO referrer_uuid 
  FROM profiles 
  WHERE referral_code = referrer_code;
  
  -- Referrer bulunamadıysa
  IF referrer_uuid IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Kendine referans yapamaz
  IF referrer_uuid = new_user_id THEN
    RETURN FALSE;
  END IF;
  
  -- Daha önce referans edildiyse
  IF EXISTS (SELECT 1 FROM referral_log WHERE referred_id = new_user_id) THEN
    RETURN FALSE;
  END IF;
  
  -- Yeni kullanıcıya referrer'ı kaydet
  UPDATE profiles SET referred_by = referrer_uuid WHERE id = new_user_id;
  
  -- Her iki tarafa kredi ver
  UPDATE profiles SET credits = credits + bonus_credits WHERE id = referrer_uuid;
  UPDATE profiles SET credits = credits + bonus_credits WHERE id = new_user_id;
  
  -- Referrer'ın toplam referans sayısını artır
  UPDATE profiles SET total_referrals = total_referrals + 1 WHERE id = referrer_uuid;
  
  -- Log'a kaydet
  INSERT INTO referral_log (referrer_id, referred_id, credits_given)
  VALUES (referrer_uuid, new_user_id, bonus_credits);
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ============================================
-- 5. TRIGGER: Auto-create profile on signup
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, credits, daily_limit, referral_code)
  VALUES (
    NEW.id,
    NEW.email,
    10,  -- Başlangıç kredisi (free user)
    10,  -- Günlük limit
    UPPER(SUBSTRING(MD5(NEW.id::TEXT || NOW()::TEXT) FROM 1 FOR 6))  -- 6 karakterlik benzersiz kod
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ============================================
-- 6. UPSCALE HISTORY TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS upscale_history (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  original_filename TEXT,
  output_filename TEXT,
  scale_factor INTEGER DEFAULT 4,
  processing_time_ms INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE upscale_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own history" ON upscale_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own history" ON upscale_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);


-- ============================================
-- 7. PREMIUM PURCHASE FUNCTION (Lemon Squeezy webhook'tan çağrılır)
-- ============================================
CREATE OR REPLACE FUNCTION apply_premium_purchase(
  p_user_id UUID,
  p_tier TEXT,
  p_credits INTEGER
)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE profiles SET 
    credits = credits + p_credits,
    is_premium = TRUE,
    premium_tier = p_tier,
    updated_at = NOW()
  WHERE id = p_user_id;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ============================================
-- 8. DAILY CREDIT RESET FUNCTION (Cron job ile çalıştırılabilir)
-- ============================================
CREATE OR REPLACE FUNCTION reset_daily_credits()
RETURNS void AS $$
BEGIN
  -- Free kullanıcıların kredilerini resetle (sadece 0 olanları)
  UPDATE profiles 
  SET 
    credits = daily_limit,
    last_reset_date = CURRENT_DATE
  WHERE 
    is_premium = FALSE 
    AND last_reset_date < CURRENT_DATE
    AND credits < daily_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ============================================
-- TIER BENEFITS (Reference - not a table)
-- ============================================
-- FREE:     10 kredi/gün, 4x max, reklamlı, normal hız
-- STARTER:  75 kredi, 8x max, reklamsız (kredi varken), normal hız
-- PRO:      200 kredi, 8x max, reklamsız, 2x hız, geçmiş
-- BUSINESS: 600 kredi, 16x max, reklamsız, 4x hız, geçmiş, toplu yükleme, API

-- ============================================
-- DONE! Database ready.
-- ============================================
