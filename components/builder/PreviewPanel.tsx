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

                  {section.type === 'event' && (
                    <div className="py-20 px-6 text-center bg-gray-50/50">
                      <h2 className="text-2xl font-bold mb-8 text-gray-900">Detail Acara</h2>
                      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                        <div className="text-3xl">🗓️</div>
                        <h3 className="font-semibold text-lg" style={{ color: settings.primary_color }}>
                          {section.data.date ? new Date(section.data.date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Tanggal Acara'}
                        </h3>
                        <div className="w-12 h-[1px] bg-gray-200 mx-auto my-4"></div>
                        <p className="text-gray-600 whitespace-pre-line leading-relaxed">
                          {section.data.location || 'Lokasi Acara\nAlamat Lengkap'}
                        </p>
                      </div>
                    </div>
                  )}

                  {section.type === 'rsvp' && (
                    <div className="py-20 px-6 text-center">
                      <h2 className="text-2xl font-bold mb-6 text-gray-900">Kehadiran</h2>
                      <div className="w-full bg-gray-100 h-64 rounded-xl flex items-center justify-center text-gray-400">
                        [ Form RSVP ]
                      </div>
                    </div>
                  )}

                  {section.type === 'guestbook' && (
                    <div className="py-20 px-6 text-center bg-gray-50/50">
                      <h2 className="text-2xl font-bold mb-6 text-gray-900">Buku Tamu</h2>
                      <div className="w-full bg-white border border-gray-100 h-64 rounded-xl flex items-center justify-center text-gray-400 shadow-sm">
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
