'use client';

import { useBuilderStore } from '@/lib/store';
import { Smartphone, Monitor } from 'lucide-react';
import { useState } from 'react';

export default function PreviewPanel() {
  const { invitation } = useBuilderStore();
  const [device, setDevice] = useState<'mobile' | 'desktop'>('mobile');

  if (!invitation) return null;

  const { settings, sections } = invitation;
  const orderedSections = [...sections].sort((a, b) => a.order - b.order).filter(s => s.enabled);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full relative">
      {/* Device Toggle */}
      <div className="absolute top-4 right-4 bg-white rounded-full shadow-sm border border-gray-200 p-1 flex gap-1 z-20">
        <button 
          onClick={() => setDevice('mobile')}
          className={`p-2 rounded-full transition-colors ${device === 'mobile' ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <Smartphone size={16} />
        </button>
        <button 
          onClick={() => setDevice('desktop')}
          className={`p-2 rounded-full transition-colors ${device === 'desktop' ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <Monitor size={16} />
        </button>
      </div>

      {/* Frame */}
      <div 
        className={`bg-white shadow-2xl overflow-hidden transition-all duration-500 ease-in-out border border-gray-200 ${
          device === 'mobile' 
            ? 'w-[375px] h-[812px] rounded-[3rem] ring-8 ring-gray-900' 
            : 'w-full max-w-4xl h-[80vh] rounded-xl'
        }`}
      >
        {/* Dynamic Content Container */}
        <div 
          className="w-full h-full overflow-y-auto no-scrollbar relative"
          style={{ 
            fontFamily: settings.font,
            backgroundColor: '#ffffff'
          }}
        >
          {orderedSections.length === 0 ? (
            <div className="h-full flex items-center justify-center text-gray-400 text-sm">
              Tidak ada bagian yang diaktifkan.
            </div>
          ) : (
            <div className="flex flex-col min-h-full">
              {orderedSections.map((section) => (
                <div 
                  key={section.id} 
                  className="w-full relative group"
                >
                  {/* === MOCK SECTIONS FOR PREVIEW === */}
                  
                  {section.type === 'cover' && (
                    <div className="min-h-screen flex flex-col items-center justify-center text-center p-8 relative overflow-hidden">
                      <div className="absolute inset-0 opacity-10" style={{ backgroundColor: settings.primary_color }}></div>
                      
                      <div className="relative z-10 space-y-6">
                        <p className="text-sm tracking-[0.3em] uppercase text-gray-500">The Wedding Of</p>
                        <h1 
                          className="text-5xl md:text-6xl font-bold leading-tight"
                          style={{ color: settings.primary_color }}
                        >
                          {section.data.headline || 'Nama Pasangan'}
                        </h1>
                        <p className="text-gray-600 italic">
                          {section.data.subtitle || 'We are getting married'}
                        </p>
                      </div>
                    </div>
                  )}

                  {section.type === 'couple' && (
                    <div className="py-20 px-6 text-center space-y-12">
                      <div className="space-y-4">
                        <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto flex items-center justify-center text-2xl border-2" style={{ borderColor: settings.primary_color }}>🤵</div>
                        <h3 className="text-2xl font-bold text-gray-900">{section.data.groom_name || 'Nama Mempelai Pria'}</h3>
                        <p className="text-sm text-gray-500">Putra dari Bpk. {section.data.groom_father || '...'} & Ibu {section.data.groom_mother || '...'}</p>
                      </div>
                      <div className="text-4xl font-serif" style={{ color: settings.primary_color }}>&</div>
                      <div className="space-y-4">
                        <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto flex items-center justify-center text-2xl border-2" style={{ borderColor: settings.primary_color }}>👰</div>
                        <h3 className="text-2xl font-bold text-gray-900">{section.data.bride_name || 'Nama Mempelai Wanita'}</h3>
                        <p className="text-sm text-gray-500">Putri dari Bpk. {section.data.bride_father || '...'} & Ibu {section.data.bride_mother || '...'}</p>
                      </div>
                    </div>
                  )}

                  {section.type === 'event' && (
                    <div className="py-20 px-6 text-center bg-gray-50/50">
                      <h2 className="text-2xl font-bold mb-8 text-gray-900">Detail Acara</h2>
                      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                        <div className="text-3xl">🗓️</div>
                        <h3 className="font-semibold text-lg" style={{ color: settings.primary_color }}>
                          {section.data.date ? new Date(section.data.date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Tanggal Acara'}
                        </h3>
                        <p className="text-gray-600">{section.data.time || '10:00 - Selesai'}</p>
                        <div className="w-12 h-[1px] bg-gray-200 mx-auto my-4"></div>
                        <p className="font-bold text-gray-900">{section.data.location_name || 'Nama Lokasi'}</p>
                        <p className="text-gray-500 text-sm whitespace-pre-line leading-relaxed">
                          {section.data.address || 'Alamat Lengkap'}
                        </p>
                        {section.data.maps_url && (
                          <div className="pt-4">
                            <span className="inline-block px-6 py-2 rounded-full text-white text-sm font-medium" style={{ backgroundColor: settings.primary_color }}>Buka Peta</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {section.type === 'story' && (
                    <div className="py-20 px-6 text-center">
                      <h2 className="text-2xl font-bold mb-6 text-gray-900">{section.data.title || 'Cerita Kami'}</h2>
                      <p className="text-gray-600 text-sm italic leading-relaxed whitespace-pre-line">
                        {section.data.content || 'Bagikan kisah perjalanan cinta Anda di sini...'}
                      </p>
                    </div>
                  )}

                  {section.type === 'gallery' && (
                    <div className="py-20 px-6 text-center bg-gray-50/50">
                      <h2 className="text-2xl font-bold mb-8 text-gray-900">Galeri</h2>
                      <div className="grid grid-cols-2 gap-3">
                        {section.data.images && section.data.images.length > 0 ? (
                          section.data.images.slice(0, 4).map((img: string, i: number) => (
                            <div key={i} className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                              <img src={img} alt="Gallery" className="w-full h-full object-cover" />
                            </div>
                          ))
                        ) : (
                          [...Array(4)].map((_, i) => (
                            <div key={i} className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">🖼️</div>
                          ))
                        )}
                      </div>
                    </div>
                  )}

                  {section.type === 'gift' && (
                    <div className="py-20 px-6 text-center">
                      <h2 className="text-2xl font-bold mb-6 text-gray-900">Kado Digital</h2>
                      <div className="bg-gray-50 p-6 rounded-2xl border border-dashed border-gray-200 space-y-2">
                        <p className="font-bold text-gray-900 uppercase tracking-wider">{section.data.bank_name || 'BANK'}</p>
                        <p className="text-xl font-mono" style={{ color: settings.primary_color }}>{section.data.account_number || '0000000000'}</p>
                        <p className="text-sm text-gray-500 italic">a.n {section.data.account_holder || 'Nama Pemilik'}</p>
                      </div>
                    </div>
                  )}

                  {section.type === 'closing' && (
                    <div className="py-20 px-8 text-center bg-white">
                      <p className="text-gray-600 italic leading-relaxed">
                        {section.data.content || 'Terima kasih atas doa restunya.'}
                      </p>
                      <h3 className="mt-8 font-bold text-xl" style={{ color: settings.primary_color }}>
                        Sampai Jumpa di Hari Bahagia Kami!
                      </h3>
                    </div>
                  )}

                  {section.type === 'rsvp' && (
                    <div className="py-20 px-6 text-center bg-gray-50/50">
                      <h2 className="text-2xl font-bold mb-6 text-gray-900">Konfirmasi Kehadiran</h2>
                      <div className="w-full bg-white border border-gray-200 h-64 rounded-xl flex items-center justify-center text-gray-400 shadow-sm">
                        [ Form RSVP ]
                      </div>
                    </div>
                  )}

                  {section.type === 'guestbook' && (
                    <div className="py-20 px-6 text-center">
                      <h2 className="text-2xl font-bold mb-6 text-gray-900">Ucapan & Doa</h2>
                      <div className="w-full bg-gray-50 border border-gray-100 h-64 rounded-xl flex items-center justify-center text-gray-400">
                        [ List Ucapan ]
                      </div>
                    </div>
                  )}

                </div>
              ))}

              {settings.viral_footer && (
                <div className="py-8 text-center border-t border-gray-100 mt-auto bg-white">
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-2">Powered by</p>
                  <p className="text-xs font-medium text-gray-900">UndanganDigital</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
