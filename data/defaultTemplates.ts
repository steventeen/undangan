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
  }
];
