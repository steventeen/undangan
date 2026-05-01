export const defaultTemplates = [
  {
    name: 'Classic Wedding Floral',
    category: 'classic',
    price: 150000,
    thumbnail_url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800&auto=format&fit=crop',
    html_template: `
<div class="classic-wedding-container">
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Great+Vibes&display=swap" rel="stylesheet">
  
  <div class="hero-image">
    <img src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop" alt="Wedding" />
  </div>
  
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
    css_custom: `
.classic-wedding-container {
  background-color: #ffffff;
  color: #4a4a4a;
  font-family: 'Playfair Display', serif;
  text-align: center;
  min-height: 100vh;
  padding: 0 0 40px 0;
  position: relative;
  overflow: hidden;
}
.classic-wedding-container .hero-image img {
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-bottom: 5px solid #fdf5f6;
}
.classic-wedding-container .content { padding: 20px; }
.classic-wedding-container .names {
  font-family: 'Great Vibes', cursive;
  font-size: 3.5rem;
  color: #b76e79;
  margin: 20px 0;
}
.classic-wedding-container .btn-classic {
  display: inline-block;
  padding: 12px 25px;
  background: #b76e79;
  color: white;
  text-decoration: none;
  border-radius: 30px;
  margin: 10px;
  font-size: 0.9rem;
}
`
  },
  {
    name: 'Modern Minimalist Line',
    category: 'modern',
    price: 125000,
    thumbnail_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop',
    html_template: `
<div class="modern-minimalist-container">
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;600&display=swap" rel="stylesheet">
  
  <div class="hero-wrap">
    <img src="https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=800&auto=format&fit=crop" alt="Modern" />
    <div class="hero-overlay">
      <h1 class="names">{{groom_name}} & {{bride_name}}</h1>
    </div>
  </div>
  
  <div class="main-content">
    <p class="tagline">WE ARE GETTING MARRIED</p>

    <div class="info-grid">
      <div class="info-item">
        <label>DATE</label>
        <p>{{event_date}}</p>
      </div>
      <div class="info-item">
        <label>TIME</label>
        <p>{{event_time}}</p>
      </div>
      <div class="info-item full">
        <label>LOCATION</label>
        <p>{{venue}}</p>
      </div>
    </div>

    <div class="nav-links">
      <a href="{{maps_link}}" class="btn-modern">VIEW LOCATION</a>
    </div>
  </div>
</div>`,
    css_custom: `
.modern-minimalist-container {
  background-color: #f8f9fa;
  color: #2d3436;
  font-family: 'Poppins', sans-serif;
  min-height: 100vh;
}
.modern-minimalist-container .hero-wrap { position: relative; height: 400px; }
.modern-minimalist-container .hero-wrap img { width: 100%; height: 100%; object-fit: cover; }
.modern-minimalist-container .hero-overlay {
  position: absolute; inset: 0; background: rgba(0,0,0,0.3);
  display: flex; align-items: center; justify-content: center;
}
.modern-minimalist-container .names { color: white; font-size: 2.5rem; font-weight: 600; text-shadow: 0 2px 10px rgba(0,0,0,0.5); }
.modern-minimalist-container .main-content { padding: 40px; text-align: center; }
.modern-minimalist-container .tagline { font-weight: 300; letter-spacing: 5px; color: #636e72; font-size: 0.8rem; margin-bottom: 40px; }
.modern-minimalist-container .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 40px; }
.modern-minimalist-container .info-item label { display: block; font-size: 0.7rem; font-weight: 600; color: #b2bec3; margin-bottom: 5px; }
.modern-minimalist-container .btn-modern { display: block; background: #2d3436; color: white; padding: 15px; text-decoration: none; font-size: 0.8rem; letter-spacing: 2px; }
`
  },
  {
    name: 'Rustic Sage Garden',
    category: 'rustic',
    price: 135000,
    thumbnail_url: 'https://images.unsplash.com/photo-1522673607200-164848371868?q=80&w=800&auto=format&fit=crop',
    html_template: `
<div class="rustic-garden-container">
  <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
  
  <div class="top-photo">
    <img src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=800&auto=format&fit=crop" alt="Rustic" />
  </div>

  <div class="inner-wrap">
    <p class="invite-text">The Wedding of</p>
    <h1 class="names">{{groom_name}} & {{bride_name}}</h1>
    
    <div class="location">
      <p>{{event_date}}</p>
      <p>{{venue}}</p>
      <p class="time">{{event_time}}</p>
    </div>

    <div class="footer-links">
      <a href="{{maps_link}}" class="btn-rustic">Google Maps</a>
    </div>
  </div>
</div>`,
    css_custom: `
.rustic-garden-container {
  background-color: #f1f3f0;
  color: #4a5d4e;
  font-family: 'Lora', serif;
  min-height: 100vh;
  text-align: center;
}
.rustic-garden-container .top-photo img { width: 100%; height: 250px; object-fit: cover; }
.rustic-garden-container .inner-wrap { padding: 40px 20px; }
.rustic-garden-container .names { font-size: 3rem; margin: 20px 0; color: #5a6b5d; }
.rustic-garden-container .btn-rustic { display: inline-block; padding: 10px 20px; background: #5a6b5d; color: white; text-decoration: none; margin: 5px; font-size: 0.9rem; }
`
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
    <div class="luxury-photo">
      <img src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop" alt="Premium" />
    </div>
    
    <div class="main">
      <h1 class="names">{{groom_name}} & {{bride_name}}</h1>
      
      <div class="event-details">
        <div class="date">{{event_date}}</div>
        <div class="venue">{{venue}}</div>
      </div>

      <div class="button-wrap">
        <a href="{{maps_link}}" class="btn-gold">LOCATION MAPS</a>
      </div>
    </div>
  </div>
</div>`,
    css_custom: `
.premium-gold-container {
  background-color: #000000;
  color: #d4af37;
  font-family: 'Cormorant Garamond', serif;
  min-height: 100vh;
  padding: 20px;
}
.premium-gold-container .gold-border { border: 1px solid #d4af37; }
.premium-gold-container .luxury-photo img { width: 100%; height: 300px; object-fit: cover; filter: sepia(0.3) contrast(1.1); }
.premium-gold-container .main { padding: 40px 20px; text-align: center; }
.premium-gold-container .names { font-size: 3rem; font-weight: 400; margin-bottom: 20px; }
.premium-gold-container .btn-gold {
  display: block; background: #d4af37; color: #000; padding: 15px; text-decoration: none; font-weight: bold;
}
`
  },
  {
    name: 'Premium Earthy Split',
    category: 'premium',
    price: 300000,
    thumbnail_url: 'https://images.unsplash.com/photo-1510076857177-7470076d4098?q=80&w=800&auto=format&fit=crop',
    html_template: `
<div class="premium-earthy-container">
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600&family=Montserrat:wght@300;400&family=Mrs+Saint+Delafield&display=swap" rel="stylesheet">
  
  <div class="split-layout">
    <!-- Left Sidebar (Fixed on Desktop) -->
    <div class="sidebar">
      <div class="sidebar-content">
        <p class="the-wedding">The Wedding of</p>
        <h1 class="main-names">{{groom_name}} <br>& {{bride_name}}</h1>
        <div class="scroll-indicator">
          <span>SCROLL</span>
          <div class="mouse"></div>
        </div>
      </div>
    </div>

    <!-- Right Content (Scrollable) -->
    <div class="main-content">
      <section class="hero-section">
        <div class="hero-image-wrap">
          <img src="https://images.unsplash.com/photo-1510076857177-7470076d4098?q=80&w=800&auto=format&fit=crop" alt="Hero" />
        </div>
      </section>

      <section class="quote-section">
        <p class="script-text">God makes everything beautiful in its time.</p>
        <p class="body-text">Ecclesiastes 3:11</p>
      </section>

      <section class="event-section">
        <div class="event-card">
          <div class="sideways-label">PEMBERKATAN</div>
          <div class="event-details">
            <h3>Holy Matrimony</h3>
            <p class="date">{{event_date}}</p>
            <p class="time">{{event_time}}</p>
            <p class="venue">{{venue}}</p>
            <a href="{{maps_link}}" class="btn-earth">OPEN MAPS</a>
          </div>
        </div>
        
        <div class="event-card">
          <div class="sideways-label">RESEPSI</div>
          <div class="event-details">
            <h3>Wedding Reception</h3>
            <p class="date">{{event_date}}</p>
            <p class="time">18:00 - End</p>
            <p class="venue">{{venue}}</p>
            <a href="{{maps_link}}" class="btn-earth">OPEN MAPS</a>
          </div>
        </div>
      </section>

      <section class="story-section">
        <h2 class="section-title">Our Story</h2>
        <p class="story-text">{{story}}</p>
      </section>
    </div>
  </div>

  <div class="floating-music">
    <div class="music-icon">♪</div>
  </div>
</div>`,
    css_custom: `
:root {
  --earth-dark: #5C5747;
  --earth-light: #EDE7DA;
  --earth-accent: #AEA288;
}

.premium-earthy-container {
  background-color: var(--earth-light);
  color: var(--earth-dark);
  font-family: 'Montserrat', sans-serif;
  min-height: 100vh;
}

.split-layout {
  display: flex;
  flex-direction: column;
}

@media (min-width: 1024px) {
  .split-layout { flex-direction: row; }
  .sidebar {
    width: 45%;
    height: 100vh;
    position: fixed;
    left: 0;
    top: 0;
    background-color: var(--earth-dark);
    color: var(--earth-light);
    display: flex;
    align-items: flex-end;
    padding: 60px;
    z-index: 10;
  }
  .main-content {
    width: 55%;
    margin-left: 45%;
    padding: 0;
  }
}

.sidebar {
  background-color: var(--earth-dark);
  color: var(--earth-light);
  padding: 60px 40px;
  text-align: left;
}

.the-wedding {
  font-family: 'Mrs+Saint+Delafield', cursive;
  font-size: 2rem;
  margin-bottom: 10px;
  opacity: 0.8;
}

.main-names {
  font-family: 'Cormorant Garamond', serif;
  font-size: 4rem;
  line-height: 1;
  font-weight: 600;
  text-transform: uppercase;
}

.scroll-indicator {
  margin-top: 40px;
  display: flex;
  align-items: center;
  gap: 15px;
  font-size: 0.7rem;
  letter-spacing: 3px;
}

.mouse {
  width: 20px;
  height: 35px;
  border: 1px solid var(--earth-light);
  border-radius: 10px;
}

.hero-image-wrap img {
  width: 100%;
  height: 100vh;
  object-fit: cover;
}

.quote-section {
  padding: 100px 40px;
  text-align: center;
}

.script-text {
  font-family: 'Mrs+Saint+Delafield', cursive;
  font-size: 2.5rem;
  margin-bottom: 20px;
}

.event-section {
  padding: 0 40px 100px;
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.event-card {
  display: flex;
  background: white;
  border-radius: 40px 0 40px 0;
  overflow: hidden;
  box-shadow: 10px 10px 30px rgba(0,0,0,0.05);
}

.sideways-label {
  background-color: var(--earth-accent);
  color: white;
  padding: 20px 10px;
  writing-mode: vertical-rl;
  text-orientation: mixed;
  font-size: 0.7rem;
  letter-spacing: 4px;
  font-weight: 600;
}

.event-details {
  padding: 40px;
  flex: 1;
}

.event-details h3 {
  font-family: 'Cormorant Garamond', serif;
  font-size: 2rem;
  margin-bottom: 20px;
}

.btn-earth {
  display: inline-block;
  margin-top: 20px;
  padding: 12px 30px;
  background: var(--earth-dark);
  color: white;
  text-decoration: none;
  border-radius: 30px;
  font-size: 0.8rem;
  letter-spacing: 2px;
}

.story-section {
  padding: 80px 40px;
  background-color: #f4f1ea;
}

.section-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 2.5rem;
  margin-bottom: 30px;
  text-align: center;
}

.floating-music {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 50px;
  height: 50px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  z-index: 100;
  cursor: pointer;
}
`
  }
];
