export const defaultTemplates = [
  {
    name: 'Classic Wedding Floral',
    category: 'classic',
    price: 150000,
    thumbnail_url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800&auto=format&fit=crop',
    html_template: `
<div class="classic-wedding-container">
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Great+Vibes&display=swap" rel="stylesheet">
  
  <div class="header-decor"></div>
  
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
      <a href="https://wa.me/{{whatsapp_number}}" class="btn-whatsapp">Send Wishes (WA)</a>
    </div>
  </div>
  
  <div class="footer-decor"></div>
</div>`,
    css_custom: `
.classic-wedding-container {
  background-color: #ffffff;
  color: #4a4a4a;
  font-family: 'Playfair Display', serif;
  text-align: center;
  min-height: 100vh;
  padding: 40px 20px;
  position: relative;
  overflow: hidden;
  border: 15px solid #fdf5f6;
}
.classic-wedding-container .header-decor, .classic-wedding-container .footer-decor {
  height: 100px;
  background-image: url('https://www.transparenttextures.com/patterns/natural-paper.png'), url('https://images.unsplash.com/photo-1533616688419-b7a585564566?q=80&w=400&auto=format&fit=crop');
  background-size: cover;
  opacity: 0.1;
}
.classic-wedding-container .names {
  font-family: 'Great Vibes', cursive;
  font-size: 3.5rem;
  color: #b76e79;
  margin: 20px 0;
}
.classic-wedding-container .divider {
  font-size: 1.5rem;
  color: #b76e79;
  margin-bottom: 30px;
}
.classic-wedding-container .date-section {
  margin: 40px 0;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
  padding: 20px 0;
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
  transition: opacity 0.3s;
}
.classic-wedding-container .btn-whatsapp {
  display: inline-block;
  padding: 12px 25px;
  background: #25D366;
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
  
  <div class="line top-left"></div>
  <div class="line bottom-right"></div>
  
  <div class="main-content">
    <div class="hero">
      <h1 class="names">{{groom_name}} & {{bride_name}}</h1>
      <p class="tagline">WE ARE GETTING MARRIED</p>
    </div>

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

    <div class="story-section">
      <p>{{story}}</p>
    </div>

    <div class="nav-links">
      <a href="{{maps_link}}" class="btn-modern">VIEW LOCATION</a>
      <a href="https://wa.me/{{whatsapp_number}}" class="btn-wa-modern">CONTACT US</a>
    </div>
  </div>
</div>`,
    css_custom: `
.modern-minimalist-container {
  background-color: #f8f9fa;
  color: #2d3436;
  font-family: 'Poppins', sans-serif;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  position: relative;
}
.modern-minimalist-container .line {
  position: absolute;
  width: 150px;
  height: 150px;
  border: 2px solid #dfe6e9;
  z-index: 0;
}
.modern-minimalist-container .top-left { top: 20px; left: 20px; border-right: 0; border-bottom: 0; }
.modern-minimalist-container .bottom-right { bottom: 20px; right: 20px; border-left: 0; border-top: 0; }
.modern-minimalist-container .main-content { position: relative; z-index: 1; text-align: center; max-width: 500px; }
.modern-minimalist-container .names { font-size: 2.5rem; font-weight: 600; letter-spacing: -1px; margin-bottom: 10px; }
.modern-minimalist-container .tagline { font-weight: 300; letter-spacing: 5px; color: #636e72; font-size: 0.8rem; margin-bottom: 50px; }
.modern-minimalist-container .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 40px; }
.modern-minimalist-container .info-item label { display: block; font-size: 0.7rem; font-weight: 600; color: #b2bec3; margin-bottom: 5px; }
.modern-minimalist-container .info-item p { font-size: 1rem; margin: 0; }
.modern-minimalist-container .full { grid-column: span 2; }
.modern-minimalist-container .btn-modern { display: block; background: #2d3436; color: white; padding: 15px; text-decoration: none; font-size: 0.8rem; letter-spacing: 2px; margin-bottom: 10px; }
.modern-minimalist-container .btn-wa-modern { display: block; border: 1px solid #2d3436; color: #2d3436; padding: 15px; text-decoration: none; font-size: 0.8rem; letter-spacing: 2px; }
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
  
  <div class="leaf-decor tl">🌿</div>
  <div class="leaf-decor tr">🌿</div>
  <div class="leaf-decor bl">🌿</div>
  <div class="leaf-decor br">🌿</div>

  <div class="inner-wrap">
    <p class="invite-text">You are cordially invited to the wedding of</p>
    <h1 class="names">{{groom_name}} & {{bride_name}}</h1>
    
    <div class="date-circle">
      <span class="month">{{event_date}}</span>
    </div>

    <div class="location">
      <h3>Wedding Venue</h3>
      <p>{{venue}}</p>
      <p class="time">{{event_time}}</p>
    </div>

    <div class="story">
      <p><i>"{{story}}"</i></p>
    </div>

    <div class="footer-links">
      <a href="{{maps_link}}" class="btn-rustic">Google Maps</a>
      <a href="https://wa.me/{{whatsapp_number}}" class="btn-wa-rustic">WhatsApp</a>
    </div>
  </div>
</div>`,
    css_custom: `
.rustic-garden-container {
  background-color: #f1f3f0; /* Sage-ish white */
  color: #4a5d4e;
  font-family: 'Lora', serif;
  min-height: 100vh;
  padding: 50px 20px;
  text-align: center;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
.rustic-garden-container .inner-wrap { border: 1px solid #c4cdc5; padding: 40px 20px; max-width: 450px; width: 100%; position: relative; }
.rustic-garden-container .names { font-size: 3rem; margin: 20px 0; color: #5a6b5d; }
.rustic-garden-container .leaf-decor { position: absolute; font-size: 2rem; opacity: 0.4; }
.rustic-garden-container .tl { top: 10px; left: 10px; }
.rustic-garden-container .tr { top: 10px; right: 10px; transform: scaleX(-1); }
.rustic-garden-container .bl { bottom: 10px; left: 10px; transform: scaleY(-1); }
.rustic-garden-container .br { bottom: 10px; right: 10px; transform: scale(-1); }
.rustic-garden-container .btn-rustic { display: inline-block; padding: 10px 20px; background: #5a6b5d; color: white; text-decoration: none; margin: 5px; font-size: 0.9rem; }
.rustic-garden-container .btn-wa-rustic { display: inline-block; padding: 10px 20px; border: 1px solid #5a6b5d; color: #5a6b5d; text-decoration: none; margin: 5px; font-size: 0.9rem; }
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
    <div class="decor-top">✧ ✦ ✧</div>
    
    <div class="main">
      <p class="request">The Honor of Your Presence is Requested at the Wedding of</p>
      <h1 class="names">{{groom_name}} & {{bride_name}}</h1>
      
      <div class="event-details">
        <div class="date">{{event_date}}</div>
        <div class="time">{{event_time}}</div>
        <div class="venue">{{venue}}</div>
      </div>

      <div class="story-block">
        <p>{{story}}</p>
      </div>

      <div class="button-wrap">
        <a href="{{maps_link}}" class="btn-gold">LOCATION MAPS</a>
        <a href="https://wa.me/{{whatsapp_number}}" class="btn-gold-outline">RSVP VIA WHATSAPP</a>
      </div>
    </div>
    
    <div class="decor-bottom">✧ ✦ ✧</div>
  </div>
</div>`,
    css_custom: `
.premium-gold-container {
  background-color: #000000;
  color: #d4af37;
  font-family: 'Cormorant Garamond', serif;
  min-height: 100vh;
  padding: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.premium-gold-container .gold-border {
  border: 2px solid #d4af37;
  padding: 50px 20px;
  width: 100%;
  max-width: 500px;
  text-align: center;
  position: relative;
}
.premium-gold-container .names { font-size: 3.5rem; font-weight: 400; margin: 30px 0; letter-spacing: 2px; }
.premium-gold-container .event-details { margin: 40px 0; letter-spacing: 3px; font-size: 1.2rem; }
.premium-gold-container .btn-gold {
  display: block;
  background: #d4af37;
  color: #000;
  padding: 15px;
  text-decoration: none;
  font-weight: bold;
  letter-spacing: 2px;
  margin-bottom: 10px;
}
.premium-gold-container .btn-gold-outline {
  display: block;
  border: 1px solid #d4af37;
  color: #d4af37;
  padding: 15px;
  text-decoration: none;
  font-weight: bold;
  letter-spacing: 2px;
}
.premium-gold-container .decor-top, .premium-gold-container .decor-bottom { font-size: 1.2rem; margin: 10px 0; }
`
  }
];
