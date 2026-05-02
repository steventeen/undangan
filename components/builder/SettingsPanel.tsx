'use client';

import { useBuilderStore } from '@/lib/store';
import { 
  Palette, 
  Layout, 
  Settings, 
  Plus, 
  Image as ImageIcon, 
  Type, 
  Zap,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  MousePointer2
} from 'lucide-react';
import { useState } from 'react';
import { stylePacks } from '@/lib/style-packs';

export default function SettingsPanel() {
  const { invitation, activeSection, updateSection, updateSettings, toggleSection } = useBuilderStore();
  const [activeTab, setActiveTab] = useState<'blocks' | 'styles' | 'settings'>('styles');

  if (!invitation) return null;

  const currentSection = invitation.sections.find(s => s.id === activeSection);

  const applyStylePack = (packId: string) => {
    const pack = stylePacks.find(p => p.id === packId);
    if (!pack) return;

    updateSettings({
      theme_preset: pack.id,
      primary_color: pack.theme.primary,
      accent_color: pack.theme.accent,
      font_heading: pack.theme.font_heading,
      font_body: pack.theme.font_body,
      animation_preset: pack.animation
    });
  };

  return (
    <div className="w-full h-full bg-white flex flex-col">
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-100 p-2 gap-1 bg-gray-50/50">
        {[
          { id: 'styles', icon: Palette, label: 'Design' },
          { id: 'blocks', icon: Plus, label: 'Blocks' },
          { id: 'settings', icon: Settings, label: 'Editor' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex flex-col items-center py-2 rounded-xl transition-all ${
              activeTab === tab.id 
                ? 'bg-white shadow-sm text-rose-500 font-bold scale-[1.02]' 
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <tab.icon size={18} className="mb-1" />
            <span className="text-[10px] uppercase tracking-wider">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-6">
        {/* === DESIGN / STYLE PACKS TAB === */}
        {activeTab === 'styles' && (
          <div className="space-y-8 animate-fade-in">
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles size={16} className="text-amber-500" />
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest">Style Packs</h3>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {stylePacks.map((pack) => (
                  <button
                    key={pack.id}
                    onClick={() => applyStylePack(pack.id)}
                    className={`group relative p-4 rounded-2xl border-2 text-left transition-all hover:shadow-lg ${
                      invitation.settings.theme_preset === pack.id 
                        ? 'border-rose-500 bg-rose-50/30' 
                        : 'border-gray-100 hover:border-rose-200'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-gray-100 flex items-center justify-center text-xl">
                        {pack.thumbnail}
                      </div>
                      {invitation.settings.theme_preset === pack.id && (
                        <CheckCircle2 size={18} className="text-rose-500 fill-white" />
                      )}
                    </div>
                    <h4 className="font-bold text-gray-900 text-sm">{pack.name}</h4>
                    <p className="text-[10px] text-gray-400 mt-1 line-clamp-2">{pack.description}</p>
                    
                    <div className="flex gap-1.5 mt-4">
                      {[pack.theme.primary, pack.theme.accent, pack.theme.background].map((color, i) => (
                        <div key={i} className="w-4 h-1.5 rounded-full" style={{ backgroundColor: color }} />
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4">Typography</h3>
              <div className="space-y-4">
                <div>
                  <label className="label text-[10px]">Heading Font</label>
                  <select 
                    className="input py-2 text-xs"
                    value={invitation.settings.font_heading}
                    onChange={(e) => updateSettings({ font_heading: e.target.value })}
                  >
                    <option value="Playfair Display">Playfair Display</option>
                    <option value="Inter">Inter</option>
                    <option value="Lora">Lora</option>
                    <option value="Cinzel">Cinzel</option>
                  </select>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* === BLOCKS TAB === */}
        {activeTab === 'blocks' && (
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4">Available Blocks</h3>
            <div className="grid grid-cols-2 gap-3">
              {invitation.sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => toggleSection(section.id, !section.enabled)}
                  className={`p-4 rounded-2xl border-2 text-center transition-all ${
                    section.enabled 
                      ? 'border-rose-500 bg-rose-50/30' 
                      : 'border-gray-100 opacity-50 grayscale hover:grayscale-0 hover:border-rose-200'
                  }`}
                >
                  <div className="w-8 h-8 mx-auto mb-2 bg-white rounded-lg shadow-sm border border-gray-100 flex items-center justify-center text-gray-400 group-hover:text-rose-500">
                    <Plus size={16} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider">{section.type}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* === EDITOR / SETTINGS TAB === */}
        {activeTab === 'settings' && (
          <div className="animate-fade-in">
            {!currentSection ? (
              <div className="py-20 text-center space-y-4">
                <div className="w-16 h-16 bg-gray-50 rounded-full mx-auto flex items-center justify-center text-gray-300">
                  <MousePointer2 size={32} />
                </div>
                <p className="text-sm text-gray-400 font-medium">Klik elemen di canvas <br/> untuk mengedit.</p>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <div>
                    <h3 className="font-bold text-gray-900 capitalize">{currentSection.type}</h3>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Section Editor</p>
                  </div>
                </div>

                <section className="space-y-4">
                  <div className="flex items-center gap-2 text-rose-500">
                    <Type size={16} />
                    <h4 className="text-[10px] font-bold uppercase tracking-wider">Content</h4>
                  </div>
                  
                  {/* Dynamic Content Inputs */}
                  {currentSection.type === 'cover' && (
                    <div className="space-y-4">
                      <div>
                        <label className="label text-[10px]">Headline</label>
                        <input 
                          type="text" 
                          className="input" 
                          value={currentSection.data.headline || ''} 
                          onChange={(e) => updateSection(currentSection.id, { headline: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="label text-[10px]">Subtitle</label>
                        <textarea 
                          className="input h-20 resize-none" 
                          value={currentSection.data.subtitle || ''} 
                          onChange={(e) => updateSection(currentSection.id, { subtitle: e.target.value })}
                        />
                      </div>
                    </div>
                  )}

                  {currentSection.type === 'couple' && (
                     <div className="space-y-4">
                        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                          <p className="text-[9px] font-bold text-gray-400 uppercase mb-3">Mempelai Pria</p>
                          <input 
                            type="text" 
                            className="input mb-3" 
                            placeholder="Nama Pria"
                            value={currentSection.data.groom_name || ''} 
                            onChange={(e) => updateSection(currentSection.id, { groom_name: e.target.value })}
                          />
                        </div>
                        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                          <p className="text-[9px] font-bold text-gray-400 uppercase mb-3">Mempelai Wanita</p>
                          <input 
                            type="text" 
                            className="input" 
                            placeholder="Nama Wanita"
                            value={currentSection.data.bride_name || ''} 
                            onChange={(e) => updateSection(currentSection.id, { bride_name: e.target.value })}
                          />
                        </div>
                     </div>
                  )}
                </section>

                <section className="space-y-4">
                  <div className="flex items-center gap-2 text-rose-500">
                    <Palette size={16} />
                    <h4 className="text-[10px] font-bold uppercase tracking-wider">Visual & Layout</h4>
                  </div>
                  
                  <div>
                    <label className="label text-[10px]">Background</label>
                    <div className="flex bg-gray-100 p-1 rounded-xl gap-1">
                      {['color', 'image', 'gradient'].map((t) => (
                        <button 
                          key={t}
                          onClick={() => updateSection(currentSection.id, {}, { background_type: t })}
                          className={`flex-1 py-1.5 rounded-lg text-[9px] font-bold uppercase transition-all ${
                            currentSection.style?.background_type === t ? 'bg-white shadow-sm text-gray-900' : 'text-gray-400'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="label text-[10px]">Animation</label>
                    <select 
                      className="input py-2 text-xs"
                      value={currentSection.style?.animation || 'none'}
                      onChange={(e) => updateSection(currentSection.id, {}, { animation: e.target.value })}
                    >
                      <option value="none">None</option>
                      <option value="fade-in">Fade In</option>
                      <option value="slide-up">Slide Up</option>
                      <option value="zoom-in">Zoom In</option>
                    </select>
                  </div>
                </section>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer Status */}
      <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] font-medium text-gray-500 uppercase tracking-widest">Live Syncing</span>
        </div>
        <span className="text-[10px] text-gray-300 font-mono">v2.0-canva</span>
      </div>
    </div>
  );
}
