'use client';

import { useBuilderStore } from '@/lib/store';
import { 
  Palette, Type, LayoutTemplate, 
  Settings2, Music, Check, ChevronDown, ChevronUp, GripVertical 
} from 'lucide-react';
import { useState } from 'react';

const FONTS = [
  { value: 'Playfair Display', label: 'Playfair (Serif)' },
  { value: 'Inter', label: 'Inter (Sans)' },
  { value: 'Lora', label: 'Lora (Serif)' },
  { value: 'Montserrat', label: 'Montserrat (Sans)' },
];

const COLORS = [
  { value: '#b76e79', label: 'Rose Gold', class: 'bg-[#b76e79]' },
  { value: '#d4af37', label: 'Gold', class: 'bg-[#d4af37]' },
  { value: '#5a6b4e', label: 'Sage Green', class: 'bg-[#5a6b4e]' },
  { value: '#1a365d', label: 'Navy Blue', class: 'bg-[#1a365d]' },
  { value: '#2d3748', label: 'Charcoal', class: 'bg-[#2d3748]' },
];

export default function SettingsPanel() {
  const { invitation, updateSettings, updateSection, toggleSection, activeSection, setActiveSection, reorderSections } = useBuilderStore();
  const [activeTab, setActiveTab] = useState<'content' | 'design' | 'settings'>('content');

  if (!invitation) return null;

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Tabs */}
      <div className="flex border-b border-gray-100 p-2 gap-1 bg-white sticky top-0 z-10">
        {[
          { id: 'content', icon: LayoutTemplate, label: 'Konten' },
          { id: 'design', icon: Palette, label: 'Desain' },
          { id: 'settings', icon: Settings2, label: 'Pengaturan' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 py-2.5 px-2 text-xs font-medium rounded-lg flex flex-col items-center gap-1.5 transition-all ${
              activeTab === tab.id 
                ? 'bg-rose-50 text-rose-600 shadow-sm border border-rose-100/50' 
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* === CONTENT TAB === */}
        {activeTab === 'content' && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-1">Urutan Bagian</h3>
            
            {invitation.sections.sort((a,b) => a.order - b.order).map((section, index) => {
              const isExpanded = activeSection === section.id;
              
              return (
                <div key={section.id} className={`border rounded-xl bg-white overflow-hidden transition-all duration-200 ${isExpanded ? 'border-rose-200 ring-4 ring-rose-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  {/* Section Header */}
                  <div className="flex items-center p-3 gap-3">
                    <button className="text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing">
                      <GripVertical size={16} />
                    </button>
                    
                    <div 
                      className="flex-1 font-medium text-sm text-gray-700 cursor-pointer flex items-center justify-between"
                      onClick={() => setActiveSection(isExpanded ? null : section.id)}
                    >
                      <span className="capitalize">{section.type}</span>
                      {isExpanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                    </div>
                    
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={section.enabled}
                        onChange={(e) => toggleSection(section.id, e.target.checked)}
                      />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-rose-500"></div>
                    </label>
                  </div>
                  
                  {/* Section Content Editor (Dynamic based on type) */}
                  {isExpanded && section.enabled && (
                    <div className="p-4 border-t border-gray-100 bg-gray-50/50 space-y-4">
                      {section.type === 'cover' && (
                        <>
                          <div>
                            <label className="label text-xs">Judul Utama</label>
                            <input 
                              type="text" 
                              className="input py-2 text-sm" 
                              value={section.data.headline || ''} 
                              onChange={(e) => updateSection(section.id, { headline: e.target.value })}
                              placeholder="Budi & Sari"
                            />
                          </div>
                          <div>
                            <label className="label text-xs">Sub-judul / Tagline</label>
                            <input 
                              type="text" 
                              className="input py-2 text-sm" 
                              value={section.data.subtitle || ''} 
                              onChange={(e) => updateSection(section.id, { subtitle: e.target.value })}
                              placeholder="We are getting married"
                            />
                          </div>
                        </>
                      )}
                      
                      {section.type === 'event' && (
                        <>
                          <div>
                            <label className="label text-xs">Tanggal</label>
                            <input 
                              type="date" 
                              className="input py-2 text-sm" 
                              value={section.data.date || ''} 
                              onChange={(e) => updateSection(section.id, { date: e.target.value })}
                            />
                          </div>
                          <div>
                            <label className="label text-xs">Lokasi</label>
                            <textarea 
                              className="input py-2 text-sm h-20 resize-none" 
                              value={section.data.location || ''} 
                              onChange={(e) => updateSection(section.id, { location: e.target.value })}
                              placeholder="Nama gedung & alamat lengkap"
                            />
                          </div>
                        </>
                      )}
                      
                      {/* Placeholder for other section types */}
                      {['rsvp', 'guestbook', 'gallery'].includes(section.type) && (
                        <p className="text-xs text-gray-500 italic text-center py-2">
                          Tidak ada pengaturan teks untuk bagian ini.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* === DESIGN TAB === */}
        {activeTab === 'design' && (
          <div className="space-y-8">
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-1 flex items-center gap-2">
                <Palette size={14} /> Warna Utama
              </h3>
              <div className="flex flex-wrap gap-3 px-1">
                {COLORS.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => updateSettings({ primary_color: color.value })}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-110 ${color.class} ${invitation.settings.primary_color === color.value ? 'ring-2 ring-offset-2 ring-gray-900' : ''}`}
                    title={color.label}
                  >
                    {invitation.settings.primary_color === color.value && <Check size={16} className="text-white drop-shadow-md" />}
                  </button>
                ))}
                {/* Custom Color Input */}
                <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors">
                  <input 
                    type="color" 
                    value={invitation.settings.primary_color}
                    onChange={(e) => updateSettings({ primary_color: e.target.value })}
                    className="absolute inset-[-10px] w-[200%] h-[200%] cursor-pointer opacity-0"
                  />
                  <div className="w-6 h-6 rounded-full" style={{ backgroundColor: invitation.settings.primary_color }} />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-1 flex items-center gap-2">
                <Type size={14} /> Tipografi
              </h3>
              <div className="space-y-2 px-1">
                {FONTS.map((font) => (
                  <button
                    key={font.value}
                    onClick={() => updateSettings({ font: font.value })}
                    className={`w-full p-3 border rounded-xl text-left transition-all ${
                      invitation.settings.font === font.value 
                        ? 'border-rose-500 bg-rose-50/50 ring-1 ring-rose-500/20' 
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <span style={{ fontFamily: font.value }} className="text-lg text-gray-900">{font.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* === SETTINGS TAB === */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-4">
              <h3 className="font-medium text-gray-900 flex items-center gap-2 mb-2">
                <Music size={16} className="text-rose-500" /> Musik Latar
              </h3>
              
              <div>
                <label className="label text-xs">URL Musik (MP3)</label>
                <input 
                  type="url" 
                  className="input py-2 text-sm" 
                  value={invitation.settings.music_url || ''} 
                  onChange={(e) => updateSettings({ music_url: e.target.value })}
                  placeholder="https://contoh.com/lagu.mp3"
                />
                <p className="text-[11px] text-gray-400 mt-1">Kosongkan jika tidak menggunakan musik.</p>
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 text-rose-500 rounded border-gray-300 focus:ring-rose-500"
                  checked={invitation.settings.music_autoplay}
                  onChange={(e) => updateSettings({ music_autoplay: e.target.checked })}
                />
                <span className="text-sm text-gray-700">Putar otomatis (Autoplay)</span>
              </label>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-4">
              <h3 className="font-medium text-gray-900 mb-2">Preferensi Umum</h3>
              
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 text-rose-500 rounded border-gray-300 focus:ring-rose-500"
                  checked={invitation.settings.show_countdown}
                  onChange={(e) => updateSettings({ show_countdown: e.target.checked })}
                />
                <span className="text-sm text-gray-700">Tampilkan Hitung Mundur</span>
              </label>
              
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 text-rose-500 rounded border-gray-300 focus:ring-rose-500"
                  checked={invitation.settings.viral_footer}
                  onChange={(e) => updateSettings({ viral_footer: e.target.checked })}
                />
                <span className="text-sm text-gray-700">Tampilkan Footer "Buat Undangan"</span>
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
