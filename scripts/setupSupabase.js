const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const WEDDING_FIELDS = [
  { name: 'groom_name', label: 'Nama Pria', type: 'text', placeholder: 'Budi' },
  { name: 'bride_name', label: 'Nama Wanita', type: 'text', placeholder: 'Sari' },
  { name: 'event_date', label: 'Tanggal', type: 'date' },
  { name: 'event_time', label: 'Waktu', type: 'text', placeholder: '10:00 - Selesai' },
  { name: 'venue', label: 'Tempat Acara', type: 'text', placeholder: 'Gedung Serbaguna...' },
  { name: 'maps_link', label: 'Link Google Maps', type: 'url', placeholder: 'https://goo.gl/maps/...' },
  { name: 'story', label: 'Kisah/Pesan', type: 'textarea', placeholder: 'Kisah cinta kami...' },
  { name: 'whatsapp_number', label: 'WhatsApp RSVP', type: 'text', placeholder: '628123456789' },
];

const BIRTHDAY_FIELDS = [
  { name: 'child_name', label: 'Nama Yang Berulang Tahun', type: 'text', placeholder: 'Andi' },
  { name: 'age', label: 'Usia', type: 'number', placeholder: '5' },
  { name: 'event_date', label: 'Tanggal', type: 'date' },
  { name: 'event_time', label: 'Waktu', type: 'text', placeholder: '15:00 - 18:00' },
  { name: 'venue', label: 'Tempat Acara', type: 'text', placeholder: 'Rumah Kediaman...' },
  { name: 'maps_link', label: 'Link Google Maps', type: 'url', placeholder: 'https://goo.gl/maps/...' },
];

const templates = [
  {
    name: 'Premium Earthy Split',
    category: 'wedding',
    price: 300000,
    thumbnail_url: 'https://images.unsplash.com/photo-1510076857177-7470076d4098?q=80&w=800&auto=format&fit=crop',
    fields_config: WEDDING_FIELDS,
    html_template: `<div class="premium-earthy-container"><link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600&family=Montserrat:wght@300;400&family=Mrs+Saint+Delafield&display=swap" rel="stylesheet"><div class="split-layout"><div class="sidebar"><div class="sidebar-content"><p class="the-wedding">The Wedding of</p><h1 class="main-names">{{groom_name}} <br>& {{bride_name}}</h1></div></div><div class="main-content"><section class="hero-section"><div class="hero-image-wrap"><img src="https://images.unsplash.com/photo-1510076857177-7470076d4098?q=80&w=800&auto=format&fit=crop" alt="Hero" /></div></section><section class="quote-section"><p class="script-text">God makes everything beautiful in its time.</p><p class="body-text">Ecclesiastes 3:11</p></section><section class="event-section"><div class="event-card"><div class="sideways-label">PEMBERKATAN</div><div class="event-details"><h3>Holy Matrimony</h3><p>{{event_date}}</p><p>{{event_time}}</p><p>{{venue}}</p></div></div><div class="event-card"><div class="sideways-label">RESEPSI</div><div class="event-details"><h3>Wedding Reception</h3><p>{{event_date}}</p><p>18:00 - End</p><p>{{venue}}</p></div></div></section></div></div></div>`,
    css_custom: `:root { --earth-dark: #5C5747; --earth-light: #EDE7DA; --earth-accent: #AEA288; } .premium-earthy-container { background-color: var(--earth-light); color: var(--earth-dark); font-family: 'Montserrat', sans-serif; min-height: 100vh; } .split-layout { display: flex; flex-direction: column; } @media (min-width: 1024px) { .split-layout { flex-direction: row; } .sidebar { width: 45%; height: 100vh; position: fixed; left: 0; top: 0; background-color: var(--earth-dark); color: var(--earth-light); display: flex; align-items: flex-end; padding: 60px; z-index: 10; } .main-content { width: 55%; margin-left: 45%; padding: 0; } } .sidebar { background-color: var(--earth-dark); color: var(--earth-light); padding: 60px 40px; } .the-wedding { font-family: 'Mrs Saint Delafield', cursive; font-size: 2rem; margin-bottom: 10px; } .main-names { font-family: 'Cormorant Garamond', serif; font-size: 4rem; line-height: 1; font-weight: 600; text-transform: uppercase; }`
  },
  {
    name: 'Joyful Birthday Party',
    category: 'birthday',
    price: 80000,
    thumbnail_url: 'https://images.unsplash.com/photo-1530103043960-ef38714abb15?q=80&w=800&auto=format&fit=crop',
    fields_config: BIRTHDAY_FIELDS,
    html_template: `<div class="birthday-container"><h1>{{child_name}}'s {{age}}th!</h1><p>{{event_date}}</p><p>{{venue}}</p></div>`,
    css_custom: `.birthday-container { background: #ffeb3b; color: #d32f2f; text-align: center; padding: 100px 20px; }`
  },
  // I will programmatically generate 20 more variations here
];

// Helper to add more templates
for(let i=1; i<=18; i++) {
  const categories = ['wedding', 'birthday', 'seminar', 'graduation', 'gathering'];
  const cat = categories[i % categories.length];
  templates.push({
    name: `${cat.charAt(0).toUpperCase() + cat.slice(1)} Template ${i}`,
    category: cat,
    price: 50000 + (i * 10000),
    thumbnail_url: `https://images.unsplash.com/photo-${1500000000000 + i}?q=80&w=800&auto=format&fit=crop`,
    fields_config: cat === 'wedding' ? WEDDING_FIELDS : BIRTHDAY_FIELDS,
    html_template: `<div class="template-box"><h1>{{${cat === 'wedding' ? 'groom_name' : 'child_name'}}} Event</h1><p>{{event_date}}</p><p>{{venue}}</p></div>`,
    css_custom: `.template-box { background: #f0f0f0; color: #333; text-align: center; padding: 100px 20px; }`
  });
}

async function setup() {
  console.log('--- Starting Large Scale Supabase Setup ---');
  
  // Cleanup
  const names = templates.map(t => t.name);
  await supabase.from('templates').delete().in('name', names);
  
  // Insert
  const { data, error } = await supabase.from('templates').insert(templates).select();
  
  if (error) console.error('Error:', error);
  else console.log(`Successfully inserted ${data.length} templates.`);
  
  console.log('--- Setup Completed ---');
}

setup();
