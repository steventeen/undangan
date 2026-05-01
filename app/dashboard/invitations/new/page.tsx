'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase.client';
import { generateSlug } from '@/lib/utils';
import { Loader2, ChevronRight, Check } from 'lucide-react';
import type { EventCategory, Template } from '@/types';

const categories: { value: EventCategory; icon: string; label: string; desc: string }[] = [
  { value: 'wedding', icon: '💍', label: 'Pernikahan', desc: 'Akad nikah & resepsi' },
  { value: 'birthday', icon: '🎂', label: 'Ulang Tahun', desc: 'Sweet 17, 50th, dll' },
  { value: 'seminar', icon: '📚', label: 'Seminar / Webinar', desc: 'Konferensi, workshop' },
  { value: 'syukuran', icon: '🙏', label: 'Syukuran', desc: 'Aqiqah, khitanan, dll' },
  { value: 'corporate', icon: '🏢', label: 'Corporate', desc: 'Company event, dinner' },
  { value: 'memorial', icon: '🕯️', label: 'Memorial', desc: 'Peringatan, duka cita' },
];

export default function NewInvitationPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState<EventCategory>('wedding');
  const [title, setTitle] = useState('');
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  
  const [loading, setLoading] = useState(false);
  const [fetchingTemplates, setFetchingTemplates] = useState(false);
  const [error, setError] = useState('');

  // Fetch templates when category changes and we move to step 3
  useEffect(() => {
    if (step === 3) {
      async function fetchTemplates() {
        setFetchingTemplates(true);
        const { data } = await supabase
          .from('templates')
          .select('*')
          .eq('category', category)
          .eq('is_active', true);
        
        if (data && data.length > 0) {
          setTemplates(data as Template[]);
          setSelectedTemplateId(data[0].id);
        } else {
          setTemplates([]);
        }
        setFetchingTemplates(false);
      }
      fetchTemplates();
    }
  }, [step, category]);

  async function handleCreate() {
    if (!title.trim() || !selectedTemplateId) { 
      setError('Harap lengkapi semua data.'); 
      return; 
    }
    setLoading(true);
    setError('');

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push('/login'); return; }

    const slug = generateSlug(title);
    const selectedTemplate = templates.find(t => t.id === selectedTemplateId);
    
    // Convert template configuration to builder sections/settings format
    const theme = selectedTemplate?.config_json?.theme;
    
    const settings = {
      primary_color: theme?.primary || '#b76e79',
      font: theme?.font_heading || 'Playfair Display',
      language: 'id',
      show_countdown: true,
      show_rsvp: true,
      show_guestbook: true,
      show_gift: false,
      viral_footer: true,
      music_autoplay: false
    };

    const sectionTypes = selectedTemplate?.config_json?.sections || ['cover', 'event', 'gallery', 'rsvp', 'guestbook'];
    
    const sections = sectionTypes.map((type: string, index: number) => ({
      id: type, // simplified ID for initial generation
      type: type as any,
      enabled: true,
      order: index,
      data: type === 'cover' ? { headline: title, subtitle: '' } : {}
    }));

    const { data, error: createError } = await supabase
      .from('invitations')
      .insert({
        user_id: user.id,
        template_id: selectedTemplateId,
        title,
        slug,
        category,
        settings,
        sections,
      })
      .select('id')
      .single();

    if (createError || !data) {
      setError('Gagal membuat undangan: ' + createError?.message);
      setLoading(false);
      return;
    }

    router.push(`/dashboard/invitations/${data.id}/builder`);
  }

  return (
    <div className="p-6 md:p-8 pt-16 md:pt-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-serif font-bold text-gray-900 mb-2">Buat Undangan Baru</h1>

        {/* Progress Tracker */}
        <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-2">
          {['Pilih Kategori', 'Judul', 'Pilih Template'].map((s, i) => (
            <div key={s} className="flex items-center gap-2 whitespace-nowrap">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step > i + 1 ? 'bg-rose-500 text-white' : step === i + 1 ? 'bg-rose-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                {step > i + 1 ? '✓' : i + 1}
              </div>
              <span className={`text-xs ${step === i + 1 ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>{s}</span>
              {i < 2 && <ChevronRight size={14} className="text-gray-300" />}
            </div>
          ))}
        </div>
      </div>

      {step === 1 && (
        <div className="max-w-2xl">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Pilih jenis acara</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setCategory(cat.value)}
                className={`card p-4 text-left transition-all duration-150 ${category === cat.value ? 'ring-2 ring-rose-500 border-rose-200 bg-rose-50' : 'hover:bg-gray-50'}`}
              >
                <span className="text-3xl block mb-2">{cat.icon}</span>
                <p className="font-semibold text-sm text-gray-900">{cat.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{cat.desc}</p>
              </button>
            ))}
          </div>
          <button onClick={() => setStep(2)} className="btn btn-primary w-full justify-center">Lanjut →</button>
        </div>
      )}

      {step === 2 && (
        <div className="max-w-xl">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Judul undangan</h2>
          <p className="text-gray-400 text-sm mb-5">Ini akan tampil sebagai nama undangan Anda. Bisa diubah nanti.</p>

          <div className="mb-2">
            <label className="label">Judul Undangan</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input text-lg"
              placeholder={category === 'wedding' ? 'Pernikahan Budi & Sari' : 'Ulang Tahun Andi'}
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && title.trim() && setStep(3)}
            />
          </div>
          <p className="text-xs text-gray-400 mb-6">
            URL: undangandigital.id/i/<span className="text-gray-600 font-mono">{generateSlug(title || 'judul')}</span>
          </p>

          <div className="flex gap-3">
            <button onClick={() => setStep(1)} className="btn btn-secondary flex-1 justify-center">← Kembali</button>
            <button onClick={() => { if(title.trim()) setStep(3) }} className="btn btn-primary flex-1 justify-center">Pilih Template →</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Pilih Desain Template</h2>
              <p className="text-gray-500 text-sm">Pilih template yang sesuai dengan tema acara Anda.</p>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>

          {fetchingTemplates ? (
            <div className="py-20 flex flex-col items-center justify-center text-rose-500">
              <Loader2 size={32} className="animate-spin mb-4" />
              <p className="text-sm font-medium">Memuat template...</p>
            </div>
          ) : templates.length === 0 ? (
            <div className="py-20 text-center text-gray-500 border-2 border-dashed rounded-2xl">
              Belum ada template tersedia untuk kategori ini.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
              {templates.map((template) => (
                <div 
                  key={template.id} 
                  onClick={() => setSelectedTemplateId(template.id)}
                  className={`card overflow-hidden cursor-pointer transition-all ${
                    selectedTemplateId === template.id 
                      ? 'ring-4 ring-rose-500 border-rose-500 shadow-xl scale-[1.02]' 
                      : 'hover:shadow-md hover:-translate-y-1'
                  }`}
                >
                  <div className="h-48 relative bg-gray-100">
                    {/* Fallback pattern if thumbnail fails */}
                    <div className="absolute inset-0 opacity-20" style={{ backgroundColor: template.config_json.theme.primary, backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '12px 12px' }}></div>
                    
                    {/* Actual Thumbnail (can use next/image in production, using img for simplicity) */}
                    {template.thumbnail_url && (
                      <img src={template.thumbnail_url} alt={template.name} className="absolute inset-0 w-full h-full object-cover" />
                    )}
                    
                    {selectedTemplateId === template.id && (
                      <div className="absolute top-3 right-3 bg-rose-500 text-white rounded-full p-1 shadow-md">
                        <Check size={16} />
                      </div>
                    )}
                    
                    {template.is_premium && (
                      <div className="absolute bottom-3 left-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-md uppercase tracking-wider">
                        Premium
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900">{template.name}</h3>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{template.description}</p>
                    <div className="flex gap-2 mt-3">
                      <div className="w-4 h-4 rounded-full border border-gray-200" style={{ backgroundColor: template.config_json.theme.primary }}></div>
                      <div className="w-4 h-4 rounded-full border border-gray-200" style={{ backgroundColor: template.config_json.theme.background }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-3 max-w-xl mx-auto mt-8">
            <button onClick={() => setStep(2)} className="btn btn-secondary flex-1 justify-center">← Kembali</button>
            <button 
              onClick={handleCreate} 
              disabled={loading || !selectedTemplateId} 
              className="btn btn-primary flex-1 justify-center"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? 'Menyiapkan Builder...' : 'Buat Undangan ✨'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
