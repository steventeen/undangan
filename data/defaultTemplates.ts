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
  { name: 'child_name', label: 'Nama Berulang Tahun', type: 'text', placeholder: 'Andi' },
  { name: 'age', label: 'Usia', type: 'number', placeholder: '5' },
  { name: 'event_date', label: 'Tanggal', type: 'date' },
  { name: 'event_time', label: 'Waktu', type: 'text', placeholder: '15:00 - 18:00' },
  { name: 'venue', label: 'Tempat Acara', type: 'text', placeholder: 'Rumah Kediaman...' },
  { name: 'maps_link', label: 'Link Google Maps', type: 'url', placeholder: 'https://goo.gl/maps/...' },
];

const SEMINAR_FIELDS = [
  { name: 'event_title', label: 'Judul Seminar', type: 'text', placeholder: 'Digital Marketing 2026' },
  { name: 'speaker', label: 'Pembicara', type: 'text', placeholder: 'Dr. John Doe' },
  { name: 'event_date', label: 'Tanggal', type: 'date' },
  { name: 'event_time', label: 'Waktu', type: 'text', placeholder: '09:00 - 12:00' },
  { name: 'venue', label: 'Tempat', type: 'text', placeholder: 'Zoom / Hotel Santika' },
  { name: 'registration_link', label: 'Link Registrasi', type: 'url', placeholder: 'https://bit.ly/...' },
];

export const defaultTemplates = [
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
  {
    name: 'Tech Seminar Dark',
    category: 'seminar',
    price: 50000,
    thumbnail_url: 'https://images.unsplash.com/photo-1540575861501-7ad0582371f3?q=80&w=800&auto=format&fit=crop',
    fields_config: SEMINAR_FIELDS,
    html_template: `<div class="seminar-container"><h1>{{event_title}}</h1><p>Speaker: {{speaker}}</p><p>{{event_date}}</p><p>{{venue}}</p></div>`,
    css_custom: `.seminar-container { background: #0f172a; color: white; text-align: center; padding: 100px 20px; }`
  },
  {
    name: 'Elegant Gold Wedding',
    category: 'wedding',
    price: 250000,
    thumbnail_url: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?q=80&w=800&auto=format&fit=crop',
    fields_config: WEDDING_FIELDS,
    html_template: `<div class="gold-wedding"><h1>{{groom_name}} & {{bride_name}}</h1><p>{{event_date}}</p></div>`,
    css_custom: `.gold-wedding { background: #000; color: #d4af37; text-align: center; padding: 100px 20px; }`
  },
  {
    name: 'Pastel Baby Shower',
    category: 'gathering',
    price: 70000,
    thumbnail_url: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=800&auto=format&fit=crop',
    fields_config: [{ name: 'mom_name', label: 'Nama Ibu', type: 'text' }, { name: 'event_date', label: 'Tanggal', type: 'date' }],
    html_template: `<div class="baby-shower"><h1>Baby Shower for {{mom_name}}</h1><p>{{event_date}}</p></div>`,
    css_custom: `.baby-shower { background: #fff5f8; color: #ff8fb1; text-align: center; padding: 100px 20px; }`
  }
];

// Generate 15 more templates programmatically to reach 20
for(let i = 1; i <= 15; i++) {
  const cat = ['wedding', 'birthday', 'seminar', 'graduation', 'gathering'][i % 5];
  const config = cat === 'wedding' ? WEDDING_FIELDS : cat === 'birthday' ? BIRTHDAY_FIELDS : cat === 'seminar' ? SEMINAR_FIELDS : WEDDING_FIELDS;
  
  defaultTemplates.push({
    name: `${cat.charAt(0).toUpperCase() + cat.slice(1)} Pro ${i}`,
    category: cat,
    price: 50000 + (i * 10000),
    thumbnail_url: `https://images.unsplash.com/photo-${1500000000000 + (i * 1000000)}?q=80&w=800&auto=format&fit=crop`,
    fields_config: config,
    html_template: `<div class="gen-template"><h1>{{${config[0].name}}}</h1><p>{{event_date}}</p><p>{{venue}}</p></div>`,
    css_custom: `.gen-template { background: #f8f9fa; color: #333; text-align: center; padding: 100px 20px; border: 5px solid #eee; }`
  });
}
