-- ============================================================
-- Undangan SaaS v2 — Full Database Schema
-- Run this in Supabase SQL Editor
-- ============================================================

-- DROP EXISTING TABLES UNTUK CLEAN REBUILD
DROP TABLE IF EXISTS public.template_purchases CASCADE;
DROP TABLE IF EXISTS public.transactions CASCADE;
DROP TABLE IF EXISTS public.guestbook CASCADE;
DROP TABLE IF EXISTS public.rsvp CASCADE;
DROP TABLE IF EXISTS public.guests CASCADE;
DROP TABLE IF EXISTS public.invitations CASCADE;
DROP TABLE IF EXISTS public.templates CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- ============================================================
-- PROFILES (extends Supabase auth.users)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'premium')),
  plan_expires_at TIMESTAMPTZ,
  referral_code TEXT UNIQUE DEFAULT substring(md5(random()::text), 1, 8),
  referred_by UUID REFERENCES public.profiles(id),
  invitation_quota INTEGER NOT NULL DEFAULT 1,
  ai_credits INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- TEMPLATES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES public.profiles(id),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('wedding', 'birthday', 'seminar', 'syukuran', 'corporate', 'memorial')),
  is_premium BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  price INTEGER NOT NULL DEFAULT 0,
  thumbnail_url TEXT,
  config_json JSONB NOT NULL DEFAULT '{}',
  sold_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- INVITATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  template_id UUID REFERENCES public.templates(id),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL DEFAULT 'wedding',
  is_published BOOLEAN NOT NULL DEFAULT false,
  
  -- Event core data
  event_date TIMESTAMPTZ,
  event_time TEXT,
  location TEXT,
  location_url TEXT,
  
  -- Content blocks (JSONB for flexibility)
  sections JSONB NOT NULL DEFAULT '[]',
  
  -- Settings
  settings JSONB NOT NULL DEFAULT '{
    "music_url": null,
    "music_autoplay": true,
    "primary_color": "#b76e79",
    "font": "Playfair Display",
    "language": "id",
    "show_countdown": true,
    "show_rsvp": true,
    "show_guestbook": true,
    "show_gift": false,
    "viral_footer": true
  }',
  
  -- Stats
  view_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- GUESTS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.guests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invitation_id UUID NOT NULL REFERENCES public.invitations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT,
  unique_token TEXT UNIQUE NOT NULL DEFAULT substring(md5(random()::text), 1, 12),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'clicked', 'rsvp_yes', 'rsvp_no')),
  clicked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- RSVP
-- ============================================================
CREATE TABLE IF NOT EXISTS public.rsvp (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invitation_id UUID NOT NULL REFERENCES public.invitations(id) ON DELETE CASCADE,
  guest_id UUID REFERENCES public.guests(id),
  guest_name TEXT NOT NULL,
  phone TEXT,
  attendance TEXT NOT NULL CHECK (attendance IN ('yes', 'no', 'maybe')),
  guest_count INTEGER NOT NULL DEFAULT 1,
  message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- GUESTBOOK (Realtime enabled)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.guestbook (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invitation_id UUID NOT NULL REFERENCES public.invitations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- TRANSACTIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id),
  type TEXT NOT NULL CHECK (type IN ('subscription', 'template_purchase', 'ai_credits')),
  amount INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed', 'refunded')),
  payment_gateway TEXT,
  external_id TEXT UNIQUE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- TEMPLATE PURCHASES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.template_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id),
  template_id UUID NOT NULL REFERENCES public.templates(id),
  transaction_id UUID REFERENCES public.transactions(id),
  price INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, template_id)
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_invitations_user_id ON public.invitations(user_id);
CREATE INDEX IF NOT EXISTS idx_invitations_slug ON public.invitations(slug);
CREATE INDEX IF NOT EXISTS idx_invitations_is_published ON public.invitations(is_published);
CREATE INDEX IF NOT EXISTS idx_guests_invitation_id ON public.guests(invitation_id);
CREATE INDEX IF NOT EXISTS idx_guests_unique_token ON public.guests(unique_token);
CREATE INDEX IF NOT EXISTS idx_rsvp_invitation_id ON public.rsvp(invitation_id);
CREATE INDEX IF NOT EXISTS idx_guestbook_invitation_id ON public.guestbook(invitation_id);
CREATE INDEX IF NOT EXISTS idx_templates_category ON public.templates(category);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON public.transactions(user_id);

-- ============================================================
-- AUTO UPDATE updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE TRIGGER trg_invitations_updated_at
  BEFORE UPDATE ON public.invitations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- AUTO CREATE PROFILE ON SIGN UP
-- ============================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rsvp ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guestbook ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.template_purchases ENABLE ROW LEVEL SECURITY;

-- Profiles: owner access
CREATE POLICY "profiles_owner" ON public.profiles FOR ALL USING (auth.uid() = id);

-- Invitations: owner CRUD + public can read published
CREATE POLICY "invitations_owner" ON public.invitations FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "invitations_public_read" ON public.invitations FOR SELECT USING (is_published = true);

-- Guests: owner manages
CREATE POLICY "guests_owner" ON public.guests FOR ALL USING (
  auth.uid() = (SELECT user_id FROM public.invitations WHERE id = invitation_id)
);

-- RSVP: anyone can insert (guests submit), owner can read
CREATE POLICY "rsvp_insert_public" ON public.rsvp FOR INSERT WITH CHECK (true);
CREATE POLICY "rsvp_owner_read" ON public.rsvp FOR SELECT USING (
  auth.uid() = (SELECT user_id FROM public.invitations WHERE id = invitation_id)
);

-- Guestbook: anyone can insert and read
CREATE POLICY "guestbook_public" ON public.guestbook FOR SELECT USING (true);
CREATE POLICY "guestbook_insert" ON public.guestbook FOR INSERT WITH CHECK (true);

-- Templates: public read active templates
CREATE POLICY "templates_public_read" ON public.templates FOR SELECT USING (is_active = true);
CREATE POLICY "templates_creator_manage" ON public.templates FOR ALL USING (auth.uid() = creator_id);

-- Transactions: user sees own
CREATE POLICY "transactions_owner" ON public.transactions FOR ALL USING (auth.uid() = user_id);

-- Template purchases: user sees own
CREATE POLICY "template_purchases_owner" ON public.template_purchases FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- REALTIME: Enable for guestbook
-- ============================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.guestbook;
ALTER PUBLICATION supabase_realtime ADD TABLE public.rsvp;

-- ============================================================
-- STORAGE BUCKETS
-- ============================================================
INSERT INTO storage.buckets (id, name, public) VALUES
  ('invitation-media', 'invitation-media', true),
  ('template-thumbnails', 'template-thumbnails', true),
  ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "invitation_media_auth_upload" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'invitation-media' AND auth.role() = 'authenticated');

CREATE POLICY "invitation_media_public_read" ON storage.objects
  FOR SELECT USING (bucket_id IN ('invitation-media', 'template-thumbnails', 'avatars'));
