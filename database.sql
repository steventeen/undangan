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
</div>', 250000),

('Ethnic Javanese', 'wedding', '/templates/ethnic.jpg', 
'<div class="ethnic-javanese-container" style="background:#fff9f0; color:#4a3728; border:10px solid #8b4513;">
    <h2 style="font-family:serif;">Serat Ulem</h2>
    <h1>{{nama_pria}} & {{nama_wanita}}</h1>
    <p>Kanti rumaos syukur dumateng Gusti Ingkang Moho Agung...</p>
    <p>{{tanggal}} | {{waktu}}</p>
    <p>{{alamat}}</p>
</div>', 175000),

('Dark Elegant', 'wedding', '/templates/dark.jpg', 
'<div class="dark-elegant-container" style="background:#1a1a1a; color:#d4af37; padding:60px 20px;">
    <h1 style="font-size:3rem;">{{nama_pria}} & {{nama_wanita}}</h1>
    <p style="letter-spacing:4px; color:#fff;">SAVE THE DATE</p>
    <div style="margin:40px 0; border:1px solid #d4af37; padding:20px;">
        <p>{{tanggal}}</p>
        <p>{{alamat}}</p>
    </div>
</div>', 200000),

('Floral Garden', 'birthday', '/templates/floral.jpg', 
'<div class="floral-garden-container" style="background:#f0f7f0; color:#2d5a27; border-radius:30px; padding:40px;">
    <h1 style="color:#d63384;">{{title}}</h1>
    <p>Join us for a floral celebration!</p>
    <p>Date: {{tanggal}}</p>
    <p>Location: {{alamat}}</p>
</div>', 100000),

('Minimalist Clean', 'corporate', '/templates/minimal.jpg', 
'<div class="minimalist-clean-container" style="background:#fff; color:#000; padding:100px 40px; border:1px solid #eee;">
    <h1 style="font-weight:900; letter-spacing:-2px;">{{title}}</h1>
    <hr style="width:50px; margin:30px 0; border-top:5px solid #000;"/>
    <p>{{tanggal}} • {{waktu}}</p>
    <p>{{alamat}}</p>
</div>', 150000),

('Vintage Paper', 'wedding', '/templates/vintage.jpg', 
'<div class="vintage-paper-container" style="background:#e8dcc4; color:#5d4037; border:2px solid #a1887f; padding:50px;">
    <h1 style="font-family:''Old English Text MT'', serif;">{{nama_pria}} & {{nama_wanita}}</h1>
    <p style="font-style:italic;">Request the pleasure of your company</p>
    <p>{{tanggal}}</p>
    <p>{{alamat}}</p>
</div>', 180000);
