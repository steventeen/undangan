import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Buat Undangan Digital Premium — Mudah, Cepat & Elegan',
  description:
    'Platform undangan digital terbaik Indonesia. Wedding, Birthday, Seminar & lebih. Template premium, AI-powered, viral sharing. Mulai gratis!',
};

const features = [
  {
    icon: '✨',
    title: 'Template Premium',
    desc: '75+ template desain profesional untuk berbagai jenis acara.',
  },
  {
    icon: '🤖',
    title: 'AI Generator',
    desc: 'Buat teks undangan, hashtag & pesan WA otomatis dengan AI.',
  },
  {
    icon: '📊',
    title: 'Analytics Real-time',
    desc: 'Pantau siapa yang membuka, RSVP, dan statistik tamu.',
  },
  {
    icon: '📱',
    title: 'Viral Sharing',
    desc: 'Link personal per tamu + auto pesan WhatsApp siap kirim.',
  },
  {
    icon: '🎵',
    title: 'Background Music',
    desc: 'Upload musik favorit yang otomatis memutar saat undangan dibuka.',
  },
  {
    icon: '💬',
    title: 'Guestbook Realtime',
    desc: 'Tamu bisa meninggalkan ucapan yang muncul langsung di undangan.',
  },
];

const categories = [
  { icon: '💍', label: 'Pernikahan', count: '30 template' },
  { icon: '🎂', label: 'Ulang Tahun', count: '15 template' },
  { icon: '🎓', label: 'Wisuda', count: '10 template' },
  { icon: '📚', label: 'Seminar', count: '15 template' },
  { icon: '🙏', label: 'Syukuran', count: '15 template' },
  { icon: '🏢', label: 'Corporate', count: '10 template' },
];

const plans = [
  {
    name: 'Gratis',
    price: 'Rp 0',
    period: 'selamanya',
    color: 'gray',
    features: ['1 undangan aktif', '3 pilihan template', 'Maks. 50 tamu', 'Link undangan standar'],
    cta: 'Mulai Gratis',
    href: '/register',
    highlight: false,
  },
  {
    name: 'Pro',
    price: 'Rp 99.000',
    period: 'per bulan',
    color: 'rose',
    features: [
      '10 undangan aktif',
      'Semua template premium',
      'Maks. 500 tamu',
      'Analytics lengkap',
      'Export tamu (CSV)',
    ],
    cta: 'Mulai Pro',
    href: '/register?plan=pro',
    highlight: true,
  },
  {
    name: 'Premium',
    price: 'Rp 199.000',
    period: 'per bulan',
    color: 'amber',
    features: [
      'Undangan tak terbatas',
      'Semua template + marketplace',
      'Tamu tak terbatas',
      'AI Generator (20x/bulan)',
      'Bulk WhatsApp kirim',
      'Custom domain',
    ],
    cta: 'Mulai Premium',
    href: '/register?plan=premium',
    highlight: false,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* ===== NAVBAR ===== */}
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur-md">
        <div className="container-xl mx-auto px-4 flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">💌</span>
            <span className="font-serif font-bold text-xl text-gray-900">Undangan<span className="text-rose-500">Digital</span></span>
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <Link href="#fitur" className="hover:text-rose-500 transition-colors">Fitur</Link>
            <Link href="#kategori" className="hover:text-rose-500 transition-colors">Kategori</Link>
            <Link href="#harga" className="hover:text-rose-500 transition-colors">Harga</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login" className="btn btn-ghost btn-sm hidden md:inline-flex">Masuk</Link>
            <Link href="/register" className="btn btn-primary btn-sm">Daftar Gratis</Link>
          </div>
        </div>
      </header>

      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-rose-50 via-white to-white pt-20 pb-32 px-4">
        {/* Background decorations */}
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-rose-100/40 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-20 w-80 h-80 rounded-full bg-pink-100/30 blur-3xl pointer-events-none" />

        <div className="container-md mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-rose-50 border border-rose-100 px-4 py-1.5 text-sm text-rose-600 font-medium mb-8 animate-fade-in">
            <span>🎉</span> Platform Undangan Digital #1 Indonesia
          </div>

          <h1 className="text-5xl md:text-7xl font-serif font-bold text-gray-900 leading-tight mb-6 animate-fade-in stagger-1">
            Undangan Digital
            <br />
            <span className="text-gradient">yang Bikin Kagum</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10 animate-fade-in stagger-2">
            Buat undangan pernikahan, ulang tahun, seminar & acara lainnya dalam hitungan menit.
            Template premium, AI-powered, viral sharing — semua dalam satu platform.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in stagger-3">
            <Link href="/register" className="btn btn-primary btn-lg">
              Buat Undangan Gratis →
            </Link>
            <Link href="#demo" className="btn btn-secondary btn-lg">
              Lihat Demo
            </Link>
          </div>

          <p className="mt-5 text-sm text-gray-400 animate-fade-in stagger-4">
            Gratis selamanya • Tidak perlu kartu kredit
          </p>

          {/* Hero mockup */}
          <div className="mt-16 relative mx-auto max-w-sm animate-fade-in stagger-5">
            <div className="rounded-3xl overflow-hidden shadow-2xl shadow-rose-200/50 border border-rose-100">
              <div className="bg-gradient-to-b from-stone-800 to-stone-900 p-8 text-center">
                <p className="text-stone-400 text-xs tracking-widest mb-3">THE WEDDING OF</p>
                <h2 className="font-serif text-white text-4xl mb-1">Budi & Sari</h2>
                <p className="text-amber-400 text-sm font-medium mb-6">20 Mei 2026</p>
                <div className="bg-stone-700/50 rounded-2xl p-4 text-left mb-4">
                  <p className="text-stone-300 text-xs">📍 Grand Ballroom Jakarta</p>
                  <p className="text-stone-300 text-xs mt-1">🕙 09:00 – 22:00 WIB</p>
                </div>
                <button className="w-full bg-amber-500 text-stone-900 font-bold py-3 rounded-xl text-sm">
                  RSVP Kehadiran →
                </button>
              </div>
            </div>
            {/* Floating badge */}
            <div className="absolute -top-3 -right-3 bg-white rounded-2xl shadow-lg px-3 py-2 border border-gray-100 animate-float">
              <p className="text-xs font-semibold text-gray-700">✓ 245 tamu konfirmasi</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="py-12 border-y border-gray-100 bg-gray-50">
        <div className="container-lg mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: '50.000+', label: 'Undangan Dibuat' },
            { value: '2 Juta+', label: 'Tamu Diundang' },
            { value: '98%', label: 'Kepuasan Pengguna' },
            { value: '75+', label: 'Template Premium' },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-3xl font-serif font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section id="fitur" className="section bg-white">
        <div className="container-lg mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">
              Semua yang Kamu Butuhkan
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Bukan sekadar template — ini adalah ekosistem lengkap untuk membuat undangan yang berkesan.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="card p-6 hover:shadow-md hover:-translate-y-1 transition-all duration-200">
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="font-serif font-bold text-xl text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CATEGORIES ===== */}
      <section id="kategori" className="section bg-gray-50">
        <div className="container-lg mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">
              Untuk Semua Jenis Acara
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((c) => (
              <Link
                key={c.label}
                href={`/register?category=${c.label.toLowerCase()}`}
                className="card p-5 text-center hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer"
              >
                <div className="text-4xl mb-2">{c.icon}</div>
                <p className="font-semibold text-gray-900 text-sm">{c.label}</p>
                <p className="text-xs text-gray-400 mt-1">{c.count}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PRICING ===== */}
      <section id="harga" className="section bg-white">
        <div className="container-lg mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">Harga Transparan</h2>
            <p className="text-gray-500">Mulai gratis, upgrade kapan saja.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`card p-8 flex flex-col ${plan.highlight ? 'ring-2 ring-rose-500 shadow-xl shadow-rose-100' : ''}`}
              >
                {plan.highlight && (
                  <div className="badge badge-rose mb-4 self-start">Paling Populer</div>
                )}
                <h3 className="font-serif font-bold text-2xl text-gray-900 mb-1">{plan.name}</h3>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {plan.price}
                  <span className="text-sm font-normal text-gray-400 ml-1">/{plan.period}</span>
                </p>
                <ul className="space-y-3 my-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.href}
                  className={plan.highlight ? 'btn btn-primary w-full justify-center' : 'btn btn-secondary w-full justify-center'}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA BOTTOM ===== */}
      <section className="section bg-gradient-to-r from-rose-500 to-pink-500 text-white text-center">
        <div className="container-md mx-auto px-4">
          <h2 className="text-4xl font-serif font-bold mb-4">Siap Membuat Undangan?</h2>
          <p className="text-rose-100 mb-8 text-lg">Bergabung bersama 50.000+ pengguna yang sudah mempercayakan momen spesial mereka.</p>
          <Link href="/register" className="btn bg-white text-rose-600 hover:bg-rose-50 btn-lg shadow-xl">
            Mulai Gratis Sekarang →
          </Link>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="py-12 bg-gray-900 text-gray-400 text-sm px-4">
        <div className="container-xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">💌</span>
            <span className="font-serif text-white font-bold">UndanganDigital</span>
          </div>
          <p>© 2026 UndanganDigital. Made with ❤️ in Indonesia.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
