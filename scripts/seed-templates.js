const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase env vars in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// We'll read the array from the compiled TS file or just redefine it here to avoid TS config issues in the script
const templates = [
  {
    name: 'Elegance Rose',
    category: 'wedding',
    description: 'Desain elegan dengan sentuhan warna rose gold dan font serif klasik.',
    is_premium: false,
    price: 0,
    thumbnail_url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=400&auto=format&fit=crop',
    config_json: {
      theme: {
        primary: '#b76e79',
        secondary: '#fdf2f4',
        background: '#ffffff',
        text: '#2d3748',
        font_heading: 'Playfair Display',
        font_body: 'Inter'
      },
      animation: 'fade',
      layout: 'full-scroll',
      sections: ['cover', 'event', 'gallery', 'rsvp', 'guestbook']
    }
  },
  {
    name: 'Royal Gold',
    category: 'wedding',
    description: 'Kemewahan warna emas untuk pernikahan bertema megah.',
    is_premium: true,
    price: 49000,
    thumbnail_url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=400&auto=format&fit=crop',
    config_json: {
      theme: {
        primary: '#d4af37',
        secondary: '#fffbf0',
        background: '#1a1a1a',
        text: '#f3f4f6',
        font_heading: 'Playfair Display',
        font_body: 'Lora'
      },
      animation: 'slide',
      layout: 'full-scroll',
      sections: ['cover', 'event', 'story', 'gallery', 'rsvp', 'guestbook', 'gift']
    }
  },
  {
    name: 'Rustic Sage',
    category: 'wedding',
    description: 'Tema rustic dengan nuansa hijau sage yang menenangkan.',
    is_premium: true,
    price: 49000,
    thumbnail_url: 'https://images.unsplash.com/photo-1522037617300-349fc710bb15?q=80&w=400&auto=format&fit=crop',
    config_json: {
      theme: {
        primary: '#5a6b4e',
        secondary: '#f0f4ef',
        background: '#fafaf9',
        text: '#3f3f46',
        font_heading: 'Lora',
        font_body: 'Inter'
      },
      animation: 'fade',
      layout: 'full-scroll',
      sections: ['cover', 'event', 'gallery', 'rsvp', 'guestbook']
    }
  },
  {
    name: 'Sweet Seventeen',
    category: 'birthday',
    description: 'Desain ceria dan manis untuk ulang tahun ke-17.',
    is_premium: false,
    price: 0,
    thumbnail_url: 'https://images.unsplash.com/photo-1530103862676-de8892ebe18e?q=80&w=400&auto=format&fit=crop',
    config_json: {
      theme: {
        primary: '#f472b6',
        secondary: '#fdf2f8',
        background: '#ffffff',
        text: '#1f2937',
        font_heading: 'Montserrat',
        font_body: 'Inter'
      },
      animation: 'zoom',
      layout: 'full-scroll',
      sections: ['cover', 'event', 'rsvp', 'guestbook']
    }
  },
  {
    name: 'Professional Summit',
    category: 'seminar',
    description: 'Desain bersih dan profesional untuk acara korporat atau seminar.',
    is_premium: false,
    price: 0,
    thumbnail_url: 'https://images.unsplash.com/photo-1540317580384-e5d43616b9aa?q=80&w=400&auto=format&fit=crop',
    config_json: {
      theme: {
        primary: '#1d4ed8',
        secondary: '#eff6ff',
        background: '#ffffff',
        text: '#111827',
        font_heading: 'Inter',
        font_body: 'Inter'
      },
      animation: 'slide',
      layout: 'full-scroll',
      sections: ['cover', 'event', 'rsvp']
    }
  },
  {
    name: 'Tasyakuran Aqiqah',
    category: 'syukuran',
    description: 'Desain lembut dan islami untuk acara tasyakuran atau aqiqah.',
    is_premium: false,
    price: 0,
    thumbnail_url: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=400&auto=format&fit=crop',
    config_json: {
      theme: {
        primary: '#0d9488',
        secondary: '#f0fdfa',
        background: '#ffffff',
        text: '#334155',
        font_heading: 'Lora',
        font_body: 'Inter'
      },
      animation: 'fade',
      layout: 'full-scroll',
      sections: ['cover', 'event', 'rsvp', 'guestbook']
    }
  }
];

async function seed() {
  console.log('Clearing existing templates...');
  await supabase.from('templates').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  
  console.log(`Seeding ${templates.length} templates...`);
  const { data, error } = await supabase.from('templates').insert(templates).select();
  
  if (error) {
    console.error('Seed error:', error);
  } else {
    console.log('Seed successful! Added templates:', data.length);
  }
}

seed();
