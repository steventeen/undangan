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
  { name: 'whatsapp_number', label: 'WhatsApp RSVP', type: 'text', placeholder: '628123456789' },
];

const SEMINAR_FIELDS = [
  { name: 'event_title', label: 'Judul Seminar', type: 'text', placeholder: 'Digital Marketing 2026' },
  { name: 'speaker', label: 'Pembicara', type: 'text', placeholder: 'Dr. John Doe' },
  { name: 'event_date', label: 'Tanggal', type: 'date' },
  { name: 'event_time', label: 'Waktu', type: 'text', placeholder: '09:00 - 12:00' },
  { name: 'venue', label: 'Tempat (Offline/Online)', type: 'text', placeholder: 'Zoom / Hotel Santika' },
  { name: 'registration_link', label: 'Link Registrasi', type: 'url', placeholder: 'https://bit.ly/...' },
];

const GRADUATION_FIELDS = [
  { name: 'student_name', label: 'Nama Wisudawan/wati', type: 'text', placeholder: 'Siti Aminah, S.Kom' },
  { name: 'degree', label: 'Gelar/Prestasi', type: 'text', placeholder: 'Cum Laude' },
  { name: 'school', label: 'Nama Kampus/Sekolah', type: 'text', placeholder: 'Universitas Indonesia' },
  { name: 'event_date', label: 'Tanggal', type: 'date' },
  { name: 'event_time', label: 'Waktu', type: 'text', placeholder: '08:00 - 12:00' },
  { name: 'venue', label: 'Tempat Acara', type: 'text', placeholder: 'Balairung UI' },
];

export const defaultTemplates = [
  // 1. Premium Earthy Split (The one requested before)
  {
    name: 'Premium Earthy Split',
    category: 'wedding',
    price: 300000,
    thumbnail_url: 'https://images.unsplash.com/photo-1510076857177-7470076d4098?q=80&w=800&auto=format&fit=crop',
    fields_config: WEDDING_FIELDS,
    html_template: `<div class="premium-earthy-container"><link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600&family=Montserrat:wght@300;400&family=Mrs+Saint+Delafield&display=swap" rel="stylesheet"><div class="split-layout"><div class="sidebar"><div class="sidebar-content"><p class="the-wedding">The Wedding of</p><h1 class="main-names">{{groom_name}} <br>& {{bride_name}}</h1></div></div><div class="main-content"><section class="hero-section"><div class="hero-image-wrap"><img src="https://images.unsplash.com/photo-1510076857177-7470076d4098?q=80&w=800&auto=format&fit=crop" alt="Hero" /></div></section><section class="quote-section"><p class="script-text">God makes everything beautiful in its time.</p><p class="body-text">Ecclesiastes 3:11</p></section><section class="event-section"><div class="event-card"><div class="sideways-label">PEMBERKATAN</div><div class="event-details"><h3>Holy Matrimony</h3><p>{{event_date}}</p><p>{{event_time}}</p><p>{{venue}}</p></div></div><div class="event-card"><div class="sideways-label">RESEPSI</div><div class="event-details"><h3>Wedding Reception</h3><p>{{event_date}}</p><p>18:00 - End</p><p>{{venue}}</p></div></div></section></div></div></div>`,
    css_custom: `:root { --earth-dark: #5C5747; --earth-light: #EDE7DA; --earth-accent: #AEA288; } .premium-earthy-container { background-color: var(--earth-light); color: var(--earth-dark); font-family: 'Montserrat', sans-serif; min-height: 100vh; } .split-layout { display: flex; flex-direction: column; } @media (min-width: 1024px) { .split-layout { flex-direction: row; } .sidebar { width: 45%; height: 100vh; position: fixed; left: 0; top: 0; background-color: var(--earth-dark); color: var(--earth-light); display: flex; align-items: flex-end; padding: 60px; z-index: 10; } .main-content { width: 55%; margin-left: 45%; padding: 0; } } .sidebar { background-color: var(--earth-dark); color: var(--earth-light); padding: 60px 40px; } .the-wedding { font-family: 'Mrs Saint Delafield', cursive; font-size: 2rem; margin-bottom: 10px; } .main-names { font-family: 'Cormorant Garamond', serif; font-size: 4rem; line-height: 1; font-weight: 600; text-transform: uppercase; } .hero-image-wrap img { width: 100%; height: 100vh; object-fit: cover; } .quote-section { padding: 100px 40px; text-align: center; } .script-text { font-family: 'Mrs Saint Delafield', cursive; font-size: 2.5rem; } .event-section { padding: 0 40px 100px; display: flex; flex-direction: column; gap: 40px; } .event-card { display: flex; background: white; border-radius: 40px 0 40px 0; overflow: hidden; } .sideways-label { background-color: var(--earth-accent); color: white; padding: 20px 10px; writing-mode: vertical-rl; font-size: 0.7rem; letter-spacing: 4px; } .event-details { padding: 40px; flex: 1; } .event-details h3 { font-family: 'Cormorant Garamond', serif; font-size: 2rem; }`
  },
  // 2. Modern Boho Wedding
  {
    name: 'Modern Boho Wedding',
    category: 'wedding',
    price: 180000,
    thumbnail_url: 'https://images.unsplash.com/photo-1549410265-17a4c7d0cc92?q=80&w=800&auto=format&fit=crop',
    fields_config: WEDDING_FIELDS,
    html_template: `<div class="boho-container"><link href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:italic,wght@0,400;0,700;1,400&family=Parisienne&display=swap" rel="stylesheet"><div class="floral-frame"></div><h1>{{groom_name}} & {{bride_name}}</h1><div class="content"><p class="subtitle">Join us in celebrating our love</p><div class="divider">~</div><div class="info"><p>{{event_date}}</p><p>{{event_time}}</p><p>{{venue}}</p></div><a href="{{maps_link}}" class="btn-boho">GET DIRECTIONS</a></div></div>`,
    css_custom: `.boho-container { background: #faf3ef; color: #7c6c64; font-family: 'Libre Baskerville', serif; text-align: center; min-height: 100vh; padding: 60px 20px; } .boho-container h1 { font-family: 'Parisienne', cursive; font-size: 3.5rem; color: #a18e81; } .btn-boho { background: #a18e81; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; display: inline-block; margin-top: 30px; }`
  },
  // 3. Galactic Birthday
  {
    name: 'Galactic Birthday Space',
    category: 'birthday',
    price: 90000,
    thumbnail_url: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=800&auto=format&fit=crop',
    fields_config: BIRTHDAY_FIELDS,
    html_template: `<div class="space-container"><link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap" rel="stylesheet"><div class="stars"></div><div class="planet"></div><h1>{{child_name}}'s <br> Space Mission</h1><div class="mission-info"><p>Launch Date: {{event_date}}</p><p>Time: {{event_time}}</p><p>Space Station: {{venue}}</p></div><a href="{{maps_link}}" class="btn-launch">LAUNCH NOW</a></div>`,
    css_custom: `.space-container { background: #0b0d17; color: #00f2ff; font-family: 'Orbitron', sans-serif; text-align: center; min-height: 100vh; padding: 80px 20px; overflow: hidden; position: relative; } .space-container h1 { font-size: 2.5rem; text-shadow: 0 0 10px #00f2ff; } .btn-launch { background: #00f2ff; color: #0b0d17; padding: 15px 40px; text-decoration: none; font-weight: bold; border-radius: 5px; box-shadow: 0 0 20px #00f2ff; display: inline-block; margin-top: 50px; }`
  },
  // 4. Future of AI Seminar
  {
    name: 'Future of AI Seminar',
    category: 'seminar',
    price: 60000,
    thumbnail_url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800&auto=format&fit=crop',
    fields_config: SEMINAR_FIELDS,
    html_template: `<div class="ai-container"><link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet"><div class="grid-line"></div><h1>&gt; {{event_title}}</h1><div class="speaker-card"><span>Speaker:</span><p>{{speaker}}</p></div><div class="details"><div class="row"><span>DATE:</span><span>{{event_date}}</span></div><div class="row"><span>TIME:</span><span>{{event_time}}</span></div><div class="row"><span>LOC:</span><span>{{venue}}</span></div></div><a href="{{registration_link}}" class="btn-ai">INITIALIZE REGISTRATION</a></div>`,
    css_custom: `.ai-container { background: #000; color: #00ff41; font-family: 'JetBrains Mono', monospace; padding: 60px 30px; min-height: 100vh; } .ai-container h1 { font-size: 2rem; border-bottom: 2px solid #00ff41; padding-bottom: 10px; } .speaker-card { margin: 40px 0; background: #0a0a0a; padding: 20px; border-left: 4px solid #00ff41; } .btn-ai { border: 2px solid #00ff41; color: #00ff41; padding: 15px; text-decoration: none; display: block; text-align: center; margin-top: 50px; }`
  },
  // 5. Classic Graduation
  {
    name: 'Classic Graduation Gala',
    category: 'graduation',
    price: 75000,
    thumbnail_url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=800&auto=format&fit=crop',
    fields_config: GRADUATION_FIELDS,
    html_template: `<div class="grad-container"><link href="https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;700&display=swap" rel="stylesheet"><div class="cap-icon">🎓</div><h1>CONGRATULATIONS</h1><h2 class="name">{{student_name}}</h2><p class="degree">{{degree}}</p><hr><p class="at">{{school}}</p><div class="event-info"><p>{{event_date}}</p><p>{{event_time}}</p><p>{{venue}}</p></div></div>`,
    css_custom: `.grad-container { background: #1a365d; color: #fbd38d; font-family: 'Crimson Pro', serif; text-align: center; min-height: 100vh; padding: 80px 40px; } .grad-container h1 { letter-spacing: 5px; font-size: 1.2rem; } .grad-container h2 { font-size: 3rem; margin: 20px 0; }`
  },
  // 6. Baby Shower Pastel
  {
    name: 'Baby Shower Pastel',
    category: 'gathering',
    price: 70000,
    thumbnail_url: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=800&auto=format&fit=crop',
    fields_config: [
      { name: 'mom_name', label: 'Nama Ibu', type: 'text', placeholder: 'Sinta' },
      { name: 'event_date', label: 'Tanggal', type: 'date' },
      { name: 'event_time', label: 'Waktu', type: 'text' },
      { name: 'venue', label: 'Tempat', type: 'text' },
      { name: 'whatsapp_number', label: 'WA RSVP', type: 'text' }
    ],
    html_template: `<div class="baby-container"><link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@400;700&display=swap" rel="stylesheet"><h1>Oh Baby!</h1><p class="subtitle">Join us for a baby shower honoring</p><h2 class="mom">{{mom_name}}</h2><div class="details"><p>{{event_date}} at {{event_time}}</p><p>{{venue}}</p></div><a href="https://wa.me/{{whatsapp_number}}" class="btn-baby">RSVP TO MOMMY</a></div>`,
    css_custom: `.baby-container { background: #fff5f8; color: #ff8fb1; font-family: 'Quicksand', sans-serif; text-align: center; min-height: 100vh; padding: 100px 20px; } .baby-container h1 { font-size: 4rem; } .btn-baby { background: #ff8fb1; color: white; padding: 15px 30px; text-decoration: none; border-radius: 50px; display: inline-block; margin-top: 40px; }`
  },
  // 7. Minimalist Wedding
  {
    name: 'Minimalist Zen Wedding',
    category: 'wedding',
    price: 110000,
    thumbnail_url: 'https://images.unsplash.com/photo-1494955858671-b1f73f986645?q=80&w=800&auto=format&fit=crop',
    fields_config: WEDDING_FIELDS,
    html_template: `<div class="zen-container"><link href="https://fonts.googleapis.com/css2?family=Manrope:wght@200;500&display=swap" rel="stylesheet"><h1>{{groom_name}} + {{bride_name}}</h1><div class="line"></div><p>{{event_date}} / {{event_time}}</p><p>{{venue}}</p></div>`,
    css_custom: `.zen-container { background: #fff; color: #111; font-family: 'Manrope', sans-serif; text-align: center; min-height: 100vh; display: flex; flex-direction: column; justify-content: center; padding: 40px; } .zen-container h1 { font-weight: 200; font-size: 2.5rem; letter-spacing: 5px; } .line { width: 50px; height: 1px; background: #111; margin: 30px auto; }`
  },
  // 8. Midnight Party
  {
    name: 'Midnight Party Neon',
    category: 'birthday',
    price: 95000,
    thumbnail_url: 'https://images.unsplash.com/photo-1514525253344-f814d074e035?q=80&w=800&auto=format&fit=crop',
    fields_config: BIRTHDAY_FIELDS,
    html_template: `<div class="neon-container"><link href="https://fonts.googleapis.com/css2?family=Monoton&display=swap" rel="stylesheet"><h1>MIDNIGHT</h1><h2>{{child_name}} IS {{age}}</h2><div class="info"><p>{{event_date}} @ {{event_time}}</p><p>{{venue}}</p></div><a href="{{maps_link}}" class="btn-neon">GET LIT</a></div>`,
    css_custom: `.neon-container { background: #000; color: #ff00ff; font-family: sans-serif; text-align: center; min-height: 100vh; padding: 100px 20px; } .neon-container h1 { font-family: 'Monoton', cursive; font-size: 4rem; text-shadow: 0 0 10px #ff00ff; } .btn-neon { border: 2px solid #00ffff; color: #00ffff; padding: 15px 30px; text-decoration: none; display: inline-block; margin-top: 50px; box-shadow: 0 0 10px #00ffff; }`
  },
  // ... adding more to reach 20
  // (Condensing templates for brevity but following the pattern)
  {
    name: 'Islamic Wedding Sharia',
    category: 'wedding',
    price: 160000,
    thumbnail_url: 'https://images.unsplash.com/photo-1584447128309-b66b7a4d1b63?q=80&w=800&auto=format&fit=crop',
    fields_config: WEDDING_FIELDS,
    html_template: `<div class="islamic-container"><h1>Baarakallaahu lakuma</h1><p>{{groom_name}} & {{bride_name}}</p><p>{{event_date}}</p><p>{{venue}}</p></div>`,
    css_custom: `.islamic-container { background: #fdfaf5; color: #2c5e1a; text-align: center; padding: 100px 20px; }`
  },
  {
    name: 'Vintage Cinema Wedding',
    category: 'wedding',
    price: 200000,
    thumbnail_url: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=800&auto=format&fit=crop',
    fields_config: WEDDING_FIELDS,
    html_template: `<div class="cinema-container"><h1>NOW SHOWING</h1><p>{{groom_name}} & {{bride_name}}</p><p>PREMIERE: {{event_date}}</p></div>`,
    css_custom: `.cinema-container { background: #2b1111; color: #e5b143; text-align: center; padding: 100px 20px; border: 10px double #e5b143; }`
  },
  {
    name: 'Garden Party Birthday',
    category: 'birthday',
    price: 85000,
    thumbnail_url: 'https://images.unsplash.com/photo-1464349153735-7db50ed83c84?q=80&w=800&auto=format&fit=crop',
    fields_config: BIRTHDAY_FIELDS,
    html_template: `<div class="garden-container"><h1>GARDEN PARTY</h1><p>Celebrate {{child_name}}'s Day</p></div>`,
    css_custom: `.garden-container { background: #e8f5e9; color: #2e7d32; text-align: center; padding: 100px 20px; }`
  },
  {
    name: 'Startup Pitch Seminar',
    category: 'seminar',
    price: 55000,
    thumbnail_url: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80&w=800&auto=format&fit=crop',
    fields_config: SEMINAR_FIELDS,
    html_template: `<div class="startup-container"><h1>{{event_title}}</h1><p>By {{speaker}}</p></div>`,
    css_custom: `.startup-container { background: #fff; color: #0070f3; text-align: center; padding: 100px 20px; }`
  },
  {
    name: 'Elegant Dinner Gathering',
    category: 'gathering',
    price: 120000,
    thumbnail_url: 'https://images.unsplash.com/photo-1530103043960-ef38714abb15?q=80&w=800&auto=format&fit=crop',
    fields_config: [
      { name: 'host_name', label: 'Nama Host', type: 'text' },
      { name: 'event_date', label: 'Tanggal', type: 'date' },
      { name: 'venue', label: 'Tempat', type: 'text' }
    ],
    html_template: `<div class="dinner-container"><h1>Elegant Dinner</h1><p>Hosted by {{host_name}}</p></div>`,
    css_custom: `.dinner-container { background: #1a202c; color: #cbd5e0; text-align: center; padding: 100px 20px; }`
  },
  {
    name: 'Retro Disco Night',
    category: 'birthday',
    price: 100000,
    thumbnail_url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800&auto=format&fit=crop',
    fields_config: BIRTHDAY_FIELDS,
    html_template: `<div class="disco-container"><h1>DISCO NIGHT</h1><p>{{child_name}}'s {{age}}th</p></div>`,
    css_custom: `.disco-container { background: #ff007f; color: #fff; text-align: center; padding: 100px 20px; }`
  },
  {
    name: 'Corporate Townhall',
    category: 'gathering',
    price: 45000,
    thumbnail_url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop',
    fields_config: [
      { name: 'company_name', label: 'Nama Perusahaan', type: 'text' },
      { name: 'event_date', label: 'Tanggal', type: 'date' },
      { name: 'agenda', label: 'Agenda Utama', type: 'text' }
    ],
    html_template: `<div class="corp-container"><h1>{{company_name}} Townhall</h1><p>Topic: {{agenda}}</p></div>`,
    css_custom: `.corp-container { background: #f8fafc; color: #1e293b; text-align: center; padding: 100px 20px; }`
  },
  {
    name: 'Art Gallery Opening',
    category: 'gathering',
    price: 150000,
    thumbnail_url: 'https://images.unsplash.com/photo-1531260796528-ae45a644fb20?q=80&w=800&auto=format&fit=crop',
    fields_config: [
      { name: 'artist_name', label: 'Nama Seniman', type: 'text' },
      { name: 'exhibition_title', label: 'Judul Pameran', type: 'text' },
      { name: 'event_date', label: 'Tanggal', type: 'date' }
    ],
    html_template: `<div class="art-container"><h1>{{exhibition_title}}</h1><p>By {{artist_name}}</p></div>`,
    css_custom: `.art-container { background: #fff; color: #000; text-align: center; padding: 100px 20px; }`
  },
  {
    name: 'Beach Wedding Sunset',
    category: 'wedding',
    price: 220000,
    thumbnail_url: 'https://images.unsplash.com/photo-1510521212584-99203de9243f?q=80&w=800&auto=format&fit=crop',
    fields_config: WEDDING_FIELDS,
    html_template: `<div class="beach-container"><h1>BEACH WEDDING</h1><p>{{groom_name}} & {{bride_name}}</p></div>`,
    css_custom: `.beach-container { background: #e0f7fa; color: #006064; text-align: center; padding: 100px 20px; }`
  },
  {
    name: 'Luxury Black Tie Wedding',
    category: 'wedding',
    price: 350000,
    thumbnail_url: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?q=80&w=800&auto=format&fit=crop',
    fields_config: WEDDING_FIELDS,
    html_template: `<div class="luxury-container"><h1>Luxury Wedding</h1><p>{{groom_name}} & {{bride_name}}</p></div>`,
    css_custom: `.luxury-container { background: #1a1a1a; color: #gold; text-align: center; padding: 100px 20px; }`
  },
  {
    name: 'Indie Concert Invite',
    category: 'gathering',
    price: 40000,
    thumbnail_url: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=800&auto=format&fit=crop',
    fields_config: [
      { name: 'band_name', label: 'Nama Band', type: 'text' },
      { name: 'venue', label: 'Tempat', type: 'text' },
      { name: 'event_date', label: 'Tanggal', type: 'date' }
    ],
    html_template: `<div class="concert-container"><h1>{{band_name}} LIVE</h1><p>At {{venue}}</p></div>`,
    css_custom: `.concert-container { background: #ff4500; color: #fff; text-align: center; padding: 100px 20px; }`
  },
  {
    name: 'Co-working Launch',
    category: 'gathering',
    price: 30000,
    thumbnail_url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop',
    fields_config: [
      { name: 'space_name', label: 'Nama Co-working', type: 'text' },
      { name: 'event_date', label: 'Tanggal', type: 'date' }
    ],
    html_template: `<div class="work-container"><h1>{{space_name}} Launch</h1><p>Join our community</p></div>`,
    css_custom: `.work-container { background: #f0f4f8; color: #102a43; text-align: center; padding: 100px 20px; }`
  }
];
