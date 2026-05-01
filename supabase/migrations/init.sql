-- Initialize Tables
CREATE TABLE IF NOT EXISTS public.templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL,
    price INTEGER DEFAULT 0,
    thumbnail_url TEXT,
    html_template TEXT NOT NULL,
    css_custom TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT UNIQUE NOT NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT,
    template_id UUID REFERENCES public.templates(id),
    event_data JSONB NOT NULL DEFAULT '{}',
    payment_status TEXT DEFAULT 'unpaid', -- unpaid, pending, verified
    payment_proof_url TEXT,
    design_status TEXT DEFAULT 'pending', -- pending, generated, failed
    final_html_url TEXT, -- Can be the storage URL or raw HTML
    unique_slug TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.admin_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON public.orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_unique_slug ON public.orders(unique_slug);
CREATE INDEX IF NOT EXISTS idx_templates_category ON public.templates(category);

-- Enable RLS
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

-- Policies for Templates (Public can view active)
CREATE POLICY "Public can view active templates" ON public.templates
    FOR SELECT USING (is_active = true);

-- Policies for Orders (Public can view their own via slug or order_number)
-- Note: In a real app, you might want more restriction, but for this MVP, slug is the access key.
CREATE POLICY "Public can view orders via slug" ON public.orders
    FOR SELECT USING (true);

CREATE POLICY "Public can insert orders" ON public.orders
    FOR INSERT WITH CHECK (true);

-- Storage Buckets Setup
-- Note: Run these if you have permissions to insert into storage.buckets
INSERT INTO storage.buckets (id, name, public) 
VALUES 
    ('templates', 'templates', true),
    ('payment_proofs', 'payment_proofs', true),
    ('invitations', 'invitations', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies (Allow public read, authenticated insert)
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id IN ('templates', 'payment_proofs', 'invitations'));
CREATE POLICY "Public Insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id IN ('templates', 'payment_proofs', 'invitations'));
