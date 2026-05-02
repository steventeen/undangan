export interface StylePack {
  id: string;
  name: string;
  description: string;
  theme: {
    primary: string;
    accent: string;
    background: string;
    text: string;
    font_heading: string;
    font_body: string;
    gradient?: string;
  };
  animation: 'fade' | 'slide' | 'parallax' | 'zoom';
  thumbnail: string;
}

export const stylePacks: StylePack[] = [
  {
    id: 'luxury-gold',
    name: 'Luxury Gold',
    description: 'Kemewahan emas dengan latar belakang gelap yang elegan.',
    theme: {
      primary: '#d4af37',
      accent: '#fcf6ba',
      background: '#111111',
      text: '#ffffff',
      font_heading: 'Playfair Display',
      font_body: 'Lora',
      gradient: 'linear-gradient(45deg, #bf953f, #fcf6ba, #b38728, #fbf5b7)'
    },
    animation: 'parallax',
    thumbnail: '✨'
  },
  {
    id: 'minimal-clean',
    name: 'Minimal Clean',
    description: 'Bersih, modern, dan fokus pada keindahan ruang kosong.',
    theme: {
      primary: '#2d3748',
      accent: '#edf2f7',
      background: '#ffffff',
      text: '#1a202c',
      font_heading: 'Inter',
      font_body: 'Inter'
    },
    animation: 'fade',
    thumbnail: '⚪'
  },
  {
    id: 'korean-pastel',
    name: 'Korean Soft Pastel',
    description: 'Nuansa lembut dan romantis ala estetika Korea.',
    theme: {
      primary: '#f8d7da',
      accent: '#ffffff',
      background: '#fff5f5',
      text: '#4a5568',
      font_heading: 'Cormorant Garamond',
      font_body: 'Montserrat'
    },
    animation: 'slide',
    thumbnail: '🌸'
  },
  {
    id: 'dark-elegant',
    name: 'Dark Elegant',
    description: 'Misterius dan berkelas dengan kontras tinggi.',
    theme: {
      primary: '#ffffff',
      accent: '#d4af37',
      background: '#1a1a1a',
      text: '#e2e8f0',
      font_heading: 'Cinzel',
      font_body: 'Raleway'
    },
    animation: 'zoom',
    thumbnail: '🖤'
  },
  {
    id: 'floral-romantic',
    name: 'Floral Romantic',
    description: 'Penuh dengan elemen alam dan sentuhan klasik.',
    theme: {
      primary: '#6b8e23',
      accent: '#fffaf0',
      background: '#fdf5e6',
      text: '#2f4f4f',
      font_heading: 'Dancing Script',
      font_body: 'Source Sans Pro'
    },
    animation: 'fade',
    thumbnail: '🌿'
  }
];
