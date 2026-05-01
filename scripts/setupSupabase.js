const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const defaultTemplates = [
  {
    name: 'Classic Wedding Floral',
    category: 'classic',
    price: 150000,
    thumbnail_url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800&auto=format&fit=crop',
    html_template: `
<div class="classic-wedding-container">
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Great+Vibes&display=swap" rel="stylesheet">
  <div class="content">
    <p class="intro">The Wedding of</p>
    <h1 class="names">{{groom_name}} & {{bride_name}}</h1>
    <div class="divider">✿</div>
    <div class="date-section">
      <p class="day-name">Save the Date</p>
      <p class="full-date">{{event_date}}</p>
      <p class="time">{{event_time}}</p>
    </div>
    <div class="venue-section">
      <p class="at">At</p>
      <p class="venue-name">{{venue}}</p>
    </div>
    <div class="story-box">
      <p>{{story}}</p>
    </div>
    <div class="actions">
      <a href="{{maps_link}}" class="btn-classic">Open Google Maps</a>
    </div>
  </div>
</div>`,
    css_custom: `.classic-wedding-container { background-color: #ffffff; color: #4a4a4a; font-family: 'Playfair Display', serif; text-align: center; min-height: 100vh; padding: 40px 20px; border: 15px solid #fdf5f6; } .classic-wedding-container .names { font-family: 'Great Vibes', cursive; font-size: 3.5rem; color: #b76e79; margin: 20px 0; } .classic-wedding-container .btn-classic { display: inline-block; padding: 12px 25px; background: #b76e79; color: white; text-decoration: none; border-radius: 30px; margin: 10px; font-size: 0.9rem; }`
  },
  {
    name: 'Modern Minimalist Line',
    category: 'modern',
    price: 125000,
    thumbnail_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop',
    html_template: `
<div class="modern-minimalist-container">
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;600&display=swap" rel="stylesheet">
  <div class="main-content">
    <div class="hero">
      <h1 class="names">{{groom_name}} & {{bride_name}}</h1>
      <p class="tagline">WE ARE GETTING MARRIED</p>
    </div>
    <div class="info-grid">
      <div class="info-item"><label>DATE</label><p>{{event_date}}</p></div>
      <div class="info-item"><label>TIME</label><p>{{event_time}}</p></div>
      <div class="info-item full"><label>LOCATION</label><p>{{venue}}</p></div>
    </div>
    <div class="nav-links">
      <a href="{{maps_link}}" class="btn-modern">VIEW LOCATION</a>
    </div>
  </div>
</div>`,
    css_custom: `.modern-minimalist-container { background-color: #f8f9fa; color: #2d3436; font-family: 'Poppins', sans-serif; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 40px; } .modern-minimalist-container .names { font-size: 2.5rem; font-weight: 600; letter-spacing: -1px; margin-bottom: 10px; } .modern-minimalist-container .btn-modern { display: block; background: #2d3436; color: white; padding: 15px; text-decoration: none; font-size: 0.8rem; letter-spacing: 2px; }`
  },
  {
    name: 'Rustic Sage Garden',
    category: 'rustic',
    price: 135000,
    thumbnail_url: 'https://images.unsplash.com/photo-1522673607200-164848371868?q=80&w=800&auto=format&fit=crop',
    html_template: `
<div class="rustic-garden-container">
  <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
  <div class="inner-wrap">
    <p class="invite-text">You are cordially invited to the wedding of</p>
    <h1 class="names">{{groom_name}} & {{bride_name}}</h1>
    <div class="location"><h3>Wedding Venue</h3><p>{{venue}}</p><p class="time">{{event_time}}</p></div>
    <div class="footer-links">
      <a href="{{maps_link}}" class="btn-rustic">Google Maps</a>
    </div>
  </div>
</div>`,
    css_custom: `.rustic-garden-container { background-color: #f1f3f0; color: #4a5d4e; font-family: 'Lora', serif; min-height: 100vh; padding: 50px 20px; text-align: center; display: flex; align-items: center; justify-content: center; } .rustic-garden-container .inner-wrap { border: 1px solid #c4cdc5; padding: 40px 20px; max-width: 450px; width: 100%; } .rustic-garden-container .names { font-size: 3rem; margin: 20px 0; color: #5a6b5d; } .rustic-garden-container .btn-rustic { display: inline-block; padding: 10px 20px; background: #5a6b5d; color: white; text-decoration: none; margin: 5px; font-size: 0.9rem; }`
  },
  {
    name: 'Premium Noir Gold',
    category: 'premium',
    price: 250000,
    thumbnail_url: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?q=80&w=800&auto=format&fit=crop',
    html_template: `
<div class="premium-gold-container">
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
  <div class="gold-border">
    <div class="main">
      <p class="request">The Honor of Your Presence is Requested at the Wedding of</p>
      <h1 class="names">{{groom_name}} & {{bride_name}}</h1>
      <div class="event-details">
        <div class="date">{{event_date}}</div>
        <div class="time">{{event_time}}</div>
        <div class="venue">{{venue}}</div>
      </div>
      <div class="button-wrap">
        <a href="{{maps_link}}" class="btn-gold">LOCATION MAPS</a>
      </div>
    </div>
  </div>
</div>`,
    css_custom: `.premium-gold-container { background-color: #000000; color: #d4af37; font-family: 'Cormorant Garamond', serif; min-height: 100vh; padding: 30px; display: flex; align-items: center; justify-content: center; } .premium-gold-container .gold-border { border: 2px solid #d4af37; padding: 50px 20px; width: 100%; max-width: 500px; text-align: center; } .premium-gold-container .names { font-size: 3.5rem; font-weight: 400; margin: 30px 0; letter-spacing: 2px; } .premium-gold-container .btn-gold { display: block; background: #d4af37; color: #000; padding: 15px; text-decoration: none; font-weight: bold; letter-spacing: 2px; }`
  }
];

async function setup() {
  console.log('--- Starting Supabase Setup ---');

  // 1. Clear existing templates to avoid conflicts if UNIQUE is not set
  console.log('Cleaning up existing default templates...');
  const templateNames = defaultTemplates.map(t => t.name);
  await supabase.from('templates').delete().in('name', templateNames);

  // 2. Insert Templates
  console.log('Inserting fresh templates with images...');
  const { data: templates, error: tError } = await supabase
    .from('templates')
    .insert(defaultTemplates)
    .select();

  if (tError) {
    console.error('Error inserting templates:', tError);
  } else {
    console.log(`Successfully inserted ${templates.length} templates.`);
  }

  // 3. Insert Sample Order (Optional)
  if (templates && templates.length > 0) {
    console.log('Inserting sample order...');
    const sampleOrder = {
      order_number: 'INV/2026/SAMPLE',
      customer_name: 'John Doe',
      customer_email: 'john@example.com',
      customer_phone: '081234567890',
      template_id: templates[0].id,
      event_data: {
        groom_name: 'John',
        bride_name: 'Jane',
        event_date: '2026-05-20',
        event_time: '09:00 - 21:00',
        venue: 'Grand Ballroom Jakarta',
        maps_link: 'https://maps.google.com',
        story: 'We met at a coffee shop and the rest is history.'
      },
      payment_status: 'verified',
      design_status: 'pending',
      unique_slug: 'john-jane-wedding-sample'
    };

    // Clean up sample order if exists
    await supabase.from('orders').delete().eq('order_number', sampleOrder.order_number);

    const { error: oError } = await supabase
      .from('orders')
      .insert(sampleOrder);

    if (oError) {
      console.error('Error inserting sample order:', oError);
    } else {
      console.log('Successfully inserted sample order.');
    }
  }

  console.log('--- Setup Completed ---');
}

setup();
