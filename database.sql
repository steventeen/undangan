-- ============================================================
-- Undangan SaaS v2 — Full Database Schema
-- Run this in Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES (extends Supabase auth.users)
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

-- TEMPLATES
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

-- INVITATIONS
CREATE TABLE IF NOT EXISTS public.invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  template_id UUID REFERENCES public.templates(id),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL DEFAULT 'wedding',
  is_published BOOLEAN NOT NULL DEFAULT false,
  event_date TIMESTAMPTZ,
  event_time TEXT,
  location TEXT,
  location_url TEXT,
  sections JSONB NOT NULL DEFAULT '[]',
  settings JSONB NOT NULL DEFAULT '{}',
  view_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ORDERS / TRANSACTIONS
CREATE TABLE IF NOT EXISTS public.transactions (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references public.profiles(id) not null,
    type text not null,
    amount numeric not null,
    status text not null default 'pending',
    external_id text unique,
    metadata jsonb default '{}'::jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- GUESTS
CREATE TABLE IF NOT EXISTS public.guests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invitation_id UUID NOT NULL REFERENCES public.invitations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT,
  unique_token TEXT UNIQUE NOT NULL DEFAULT substring(md5(random()::text), 1, 12),
  status TEXT NOT NULL DEFAULT 'pending',
  clicked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RSVP
CREATE TABLE IF NOT EXISTS public.rsvp (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invitation_id UUID NOT NULL REFERENCES public.invitations(id) ON DELETE CASCADE,
  guest_id UUID REFERENCES public.guests(id),
  guest_name TEXT NOT NULL,
  phone TEXT,
  attendance TEXT NOT NULL,
  guest_count INTEGER NOT NULL DEFAULT 1,
  message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- GUESTBOOK
CREATE TABLE IF NOT EXISTS public.guestbook (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invitation_id UUID NOT NULL REFERENCES public.invitations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- INSERT INITIAL TEMPLATES
INSERT INTO public.templates (name, category, description, is_premium, price, config_json)
VALUES 
('Classic Wedding', 'wedding', 'Desain klasik nan elegan dengan sentuhan rose gold.', false, 0, '{
  "theme": { "primary": "#b76e79", "background": "#ffffff", "font_heading": "Playfair Display" },
  "sections": ["cover", "couple", "event", "story", "gallery", "rsvp", "guestbook", "closing"]
}'),
('Modern Minimalist', 'wedding', 'Simpel, bersih, dan fokus pada tipografi modern.', false, 0, '{
  "theme": { "primary": "#2d3748", "background": "#ffffff", "font_heading": "Inter" },
  "sections": ["cover", "couple", "event", "gallery", "rsvp", "guestbook", "closing"]
}'),
('Premium Gold', 'wedding', 'Kemewahan emas untuk hari spesial Anda.', true, 250000, '{
  "theme": { "primary": "#d4af37", "background": "#111111", "font_heading": "Lora" },
  "sections": ["cover", "couple", "event", "story", "gallery", "gift", "rsvp", "guestbook", "closing"]
}'),
('Ethnic Javanese', 'wedding', 'Nuansa adat Jawa yang kental dengan motif batik.', false, 0, '{
  "theme": { "primary": "#8b4513", "background": "#fff9f0", "font_heading": "Lora" },
  "sections": ["cover", "couple", "event", "gallery", "rsvp", "guestbook", "closing"]
}'),
('Dark Elegant', 'wedding', 'Desain gelap misterius dengan aksen emas yang kontras.', true, 200000, '{
  "theme": { "primary": "#d4af37", "background": "#1a1a1a", "font_heading": "Playfair Display" },
  "sections": ["cover", "couple", "event", "story", "gallery", "rsvp", "guestbook", "closing"]
}'),
('Floral Garden', 'birthday', 'Penuh bunga dan warna ceria, cocok untuk ulang tahun.', false, 0, '{
  "theme": { "primary": "#d63384", "background": "#f0f7f0", "font_heading": "Montserrat" },
  "sections": ["cover", "event", "gallery", "rsvp", "guestbook", "closing"]
}'),
('Minimalist Clean', 'corporate', 'Profesional dan rapi untuk acara perusahaan.', false, 0, '{
  "theme": { "primary": "#000000", "background": "#ffffff", "font_heading": "Inter" },
  "sections": ["cover", "event", "gallery", "rsvp", "guestbook", "closing"]
}'),
('Vintage Paper', 'wedding', 'Sentuhan kertas klasik dan gaya retro yang unik.', false, 0, '{
  "theme": { "primary": "#5d4037", "background": "#e8dcc4", "font_heading": "Playfair Display" },
  "sections": ["cover", "couple", "event", "gallery", "rsvp", "guestbook", "closing"]
}');
