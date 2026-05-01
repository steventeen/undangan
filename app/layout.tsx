import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Undangan Digital — Platform Undangan Online Terbaik Indonesia',
    template: '%s | Undangan Digital',
  },
  description:
    'Buat undangan digital pernikahan, ulang tahun, seminar, dan acara lainnya dengan mudah. Template premium, AI-powered, dan viral sharing.',
  keywords: ['undangan digital', 'undangan pernikahan online', 'undangan online', 'wedding invitation'],
  authors: [{ name: 'Undangan Digital' }],
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: 'Undangan Digital',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased bg-white text-gray-900 min-h-screen">
        {children}
      </body>
    </html>
  );
}
