-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create templates table
create table if not exists public.templates (
    id uuid primary key default uuid_generate_v4(),
    name text not null,
    category text not null,
    thumbnail_url text,
    html_template text not null,
    css_custom text,
    price numeric not null default 0,
    is_active boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create orders table
create table if not exists public.orders (
    id uuid primary key default uuid_generate_v4(),
    order_number text unique not null,
    template_id uuid references public.templates(id) not null,
    customer_name text not null,
    customer_email text not null,
    customer_phone text not null,
    event_data jsonb not null default '{}'::jsonb,
    unique_slug text unique not null,
    payment_proof_url text,
    payment_status text not null default 'unpaid', -- unpaid, pending, verified
    design_status text not null default 'pending', -- pending, generated, failed
    final_html_url text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create admin settings table
create table if not exists public.admin_settings (
    id serial primary key,
    key text unique not null,
    value text not null
);

-- RLS Policies (disable for now for simplicity, or we can enable it)
-- Since this is using Supabase from Next.js API Routes mainly, we can just allow authenticated/service_role access.

-- Insert initial templates data
insert into public.templates (name, category, thumbnail_url, html_template, price)
values 
('Classic Wedding', 'wedding', '/templates/classic.jpg', 
'<div class="classic-wedding-container">
    <div class="header">
        <h1>{{nama_pria}} & {{nama_wanita}}</h1>
        <p>We invite you to celebrate our wedding</p>
    </div>
    <div class="details">
        <p>Date: {{tanggal}}</p>
        <p>Time: {{waktu}}</p>
        <p>Venue: {{alamat}}</p>
    </div>
    <div class="story">
        <p>{{story}}</p>
    </div>
    <div class="actions">
        <a href="{{link_maps}}" target="_blank" class="btn">Open Maps</a>
        <a href="https://wa.me/{{nomor_whatsapp}}" target="_blank" class="btn">Contact via WhatsApp</a>
    </div>
</div>', 150000),

('Modern Minimalist', 'wedding', '/templates/modern.jpg', 
'<div class="modern-minimalist-container">
    <h1 class="names">{{nama_pria}} <span>and</span> {{nama_wanita}}</h1>
    <hr class="divider"/>
    <div class="event-info">
        <h2>Save the Date</h2>
        <p>{{tanggal}} | {{waktu}}</p>
        <p>{{alamat}}</p>
        <a href="{{link_maps}}" class="maps-link">View Location</a>
    </div>
</div>', 120000),

('Rustic Garden', 'wedding', '/templates/rustic.jpg', 
'<div class="rustic-garden-container">
    <div class="leaf-border"></div>
    <h1>{{nama_pria}} & {{nama_wanita}}</h1>
    <p class="subtitle">Are getting married</p>
    <p>Join us on {{tanggal}} at {{waktu}}</p>
    <p>Location: {{alamat}}</p>
    <a href="{{link_maps}}" class="btn-rustic">Google Maps</a>
</div>', 180000),

('Premium Gold', 'wedding', '/templates/premium.jpg', 
'<div class="premium-gold-container">
    <div class="gold-frame">
        <h1>{{nama_pria}} & {{nama_wanita}}</h1>
        <p class="invite-text">Cordially request the honor of your presence</p>
        <div class="date-time">
            <span>{{tanggal}}</span> | <span>{{waktu}}</span>
        </div>
        <p class="venue">{{alamat}}</p>
        <a href="{{link_maps}}" class="btn-gold">View Map</a>
    </div>
</div>', 250000);
