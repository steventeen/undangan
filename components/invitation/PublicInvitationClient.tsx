'use client';

import { useState, useRef, useEffect } from 'react';
import { MailOpen, Volume2, VolumeX, MapPin, Calendar, Clock } from 'lucide-react';
import type { Invitation } from '@/types';
import Link from 'next/link';
import { getTimeUntil } from '@/lib/utils';
import { supabase } from '@/lib/supabase.client';

interface Props {
  invitation: Partial<Invitation>;
  guestName: string | null;
  guestId: string | null;
}

export default function PublicInvitationClient({ invitation, guestName, guestId }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { settings, sections, title } = invitation;
  
  const orderedSections = [...(sections || [])].sort((a, b) => a.order - b.order).filter(s => s.enabled);
  
  // Audio logic
  useEffect(() => {
    if (settings?.music_url) {
      audioRef.current = new Audio(settings.music_url);
      audioRef.current.loop = true;
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [settings?.music_url]);

  const handleOpen = () => {
    setIsOpen(true);
    if (audioRef.current && settings?.music_autoplay) {
      audioRef.current.play().catch(e => console.log('Audio play failed:', e));
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
      setIsMuted(!isMuted);
    }
  };

  if (!settings) return null;

  return (
    <div className="min-h-screen bg-gray-900 relative" style={{ fontFamily: settings.font }}>
      
      {/* Floating Audio Control */}
      {isOpen && settings.music_url && (
        <button 
          onClick={toggleMute}
          className="fixed bottom-6 left-6 z-50 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30 shadow-lg hover:bg-white/30 transition-all animate-fade-in"
        >
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} className="animate-pulse" />}
        </button>
      )}

      {/* Opening Screen (Cover) */}
      <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center transition-transform duration-1000 ease-in-out ${isOpen ? '-translate-y-full' : 'translate-y-0'}`}>
        <div className="absolute inset-0 bg-white">
          <div className="absolute inset-0 opacity-10" style={{ backgroundColor: settings.primary_color }}></div>
        </div>
        
        <div className="relative z-10 text-center p-8 flex flex-col items-center justify-center min-h-screen">
          <p className="text-sm tracking-[0.3em] uppercase text-gray-500 mb-6 animate-fade-in stagger-1">
            Undangan Spesial
          </p>
          <h1 
            className="text-4xl md:text-5xl font-bold mb-10 animate-fade-in stagger-2"
            style={{ color: settings.primary_color }}
          >
            {title}
          </h1>
          
          <div className="mb-10 animate-fade-in stagger-3">
            <p className="text-gray-500 text-sm mb-2">Kepada Yth.</p>
            <p className="text-xl font-semibold text-gray-900 bg-white px-6 py-3 rounded-xl shadow-sm border border-gray-100 inline-block min-w-[200px]">
              {guestName || 'Bapak/Ibu/Saudara/i'}
            </p>
          </div>
          
          <button 
            onClick={handleOpen}
            className="btn text-white px-8 py-3 rounded-full flex items-center gap-2 animate-fade-in stagger-4 shadow-lg hover:-translate-y-1 transition-all"
            style={{ backgroundColor: settings.primary_color }}
          >
            <MailOpen size={18} />
            Buka Undangan
          </button>
        </div>
      </div>

      {/* Main Content (Only render if opened to prevent heavy DOM and autoplay issues) */}
      {isOpen && (
        <div className="relative bg-white mx-auto max-w-md min-h-screen shadow-2xl animate-fade-in">
          {orderedSections.map((section) => (
            <div key={section.id} id={section.id} className="w-full relative">
              
              {/* === COVER SECTION === */}
              {section.type === 'cover' && (
                <div className="min-h-[90vh] flex flex-col items-center justify-center text-center p-8 relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10" style={{ backgroundColor: settings.primary_color }}></div>
                  <div className="relative z-10 space-y-6">
                    <p className="text-xs tracking-[0.3em] uppercase text-gray-500">The Wedding Of</p>
                    <h1 
                      className="text-5xl font-bold leading-tight"
                      style={{ color: settings.primary_color }}
                    >
                      {section.data.headline || title}
                    </h1>
                    <p className="text-gray-600 italic">
                      {section.data.subtitle || 'We are getting married'}
                    </p>
                  </div>
                </div>
              )}

              {/* === EVENT SECTION === */}
              {section.type === 'event' && (
                <div className="py-20 px-6 text-center bg-gray-50/50">
                  <h2 className="text-2xl font-bold mb-8 text-gray-900">Detail Acara</h2>
                  
                  <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2" style={{ backgroundColor: settings.primary_color }}></div>
                    
                    <div className="w-16 h-16 mx-auto bg-rose-50 rounded-full flex items-center justify-center mb-4">
                      <Calendar className="text-rose-500" size={24} />
                    </div>
                    
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">Resepsi Pernikahan</h3>
                    
                    {section.data.date && (
                      <p className="text-gray-600 font-medium mb-1">
                        {new Date(section.data.date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-center gap-2 text-gray-500 text-sm mb-6">
                      <Clock size={14} /> 09:00 - Selesai
                    </div>
                    
                    <div className="w-12 h-[1px] bg-gray-200 mx-auto my-4"></div>
                    
                    <div className="flex items-start justify-center gap-2 text-gray-600 mb-6">
                      <MapPin size={16} className="mt-1 shrink-0 text-rose-500" />
                      <p className="text-sm leading-relaxed whitespace-pre-line text-left">
                        {section.data.location || 'Lokasi Acara'}
                      </p>
                    </div>

                    <a 
                      href={section.data.location_url || `https://maps.google.com/?q=${encodeURIComponent(section.data.location || '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block px-6 py-2 rounded-full text-sm font-medium text-white shadow-md hover:-translate-y-0.5 transition-transform"
                      style={{ backgroundColor: settings.primary_color }}
                    >
                      Buka Google Maps
                    </a>
                  </div>
                </div>
              )}

              {/* === RSVP SECTION === */}
              {section.type === 'rsvp' && settings.show_rsvp && (
                <RSVPForm invitationId={invitation.id!} guestId={guestId} guestName={guestName} primaryColor={settings.primary_color} />
              )}

              {/* === GUESTBOOK SECTION === */}
              {section.type === 'guestbook' && settings.show_guestbook && (
                <Guestbook invitationId={invitation.id!} guestName={guestName} primaryColor={settings.primary_color} />
              )}

            </div>
          ))}

          {/* Viral Footer */}
          {settings.viral_footer && (
            <div className="py-8 text-center border-t border-gray-100 bg-gray-50">
              <p className="text-xs text-gray-500 mb-2">Ingin membuat undangan digital seperti ini?</p>
              <Link href="/" target="_blank" className="inline-flex items-center gap-2 font-serif font-bold text-gray-900 hover:text-rose-600 transition-colors">
                <span className="text-xl">💌</span> UndanganDigital
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Sub-component for RSVP to keep it clean
function RSVPForm({ invitationId, guestId, guestName, primaryColor }: { invitationId: string, guestId: string | null, guestName: string | null, primaryColor: string }) {
  const [status, setStatus] = useState<'idle'|'loading'|'success'>('idle');
  const [attendance, setAttendance] = useState('yes');
  const [count, setCount] = useState('1');
  const [name, setName] = useState(guestName || '');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    
    const { error } = await supabase.from('rsvp').insert({
      invitation_id: invitationId,
      guest_id: guestId,
      guest_name: name,
      attendance,
      guest_count: parseInt(count),
    });

    if (error) {
      alert('Gagal mengirim RSVP');
      setStatus('idle');
    } else {
      setStatus('success');
      if (guestId && attendance !== 'maybe') {
        supabase.from('guests').update({ status: attendance === 'yes' ? 'rsvp_yes' : 'rsvp_no' }).eq('id', guestId).then();
      }
    }
  }

  return (
    <div className="py-20 px-6 bg-white border-t border-gray-50">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Konfirmasi Kehadiran</h2>
        <p className="text-gray-500 text-sm">Merupakan kehormatan bagi kami apabila Anda berkenan hadir.</p>
      </div>

      {status === 'success' ? (
        <div className="bg-green-50 text-green-700 p-6 rounded-2xl text-center border border-green-100">
          <p className="text-4xl mb-2">✅</p>
          <p className="font-medium">Terima kasih atas konfirmasinya!</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="text" 
            required 
            value={name} 
            onChange={e => setName(e.target.value)} 
            placeholder="Nama Lengkap" 
            className="input w-full bg-gray-50 border-gray-100" 
            readOnly={!!guestName}
          />
          <select 
            value={attendance} 
            onChange={e => setAttendance(e.target.value)} 
            className="input w-full bg-gray-50 border-gray-100"
          >
            <option value="yes">Ya, Saya Akan Hadir</option>
            <option value="no">Maaf, Tidak Bisa Hadir</option>
            <option value="maybe">Mungkin Hadir</option>
          </select>
          {attendance === 'yes' && (
            <select 
              value={count} 
              onChange={e => setCount(e.target.value)} 
              className="input w-full bg-gray-50 border-gray-100"
            >
              <option value="1">1 Orang</option>
              <option value="2">2 Orang</option>
            </select>
          )}
          <button 
            type="submit" 
            className="btn text-white w-full shadow-md"
            style={{ backgroundColor: primaryColor }}
            disabled={status === 'loading'}
          >
            {status === 'loading' ? 'Mengirim...' : 'Kirim Konfirmasi'}
          </button>
        </form>
      )}
    </div>
  );
}

// Sub-component for Guestbook (Realtime)
function Guestbook({ invitationId, guestName, primaryColor }: { invitationId: string, guestName: string | null, primaryColor: string }) {
  const [messages, setMessages] = useState<any[]>([]);
  const [name, setName] = useState(guestName || '');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Initial fetch
    supabase.from('guestbook')
      .select('*')
      .eq('invitation_id', invitationId)
      .order('created_at', { ascending: false })
      .limit(20)
      .then(({ data }) => { if (data) setMessages(data) });

    // Subscribe to realtime
    const channel = supabase.channel('realtime_guestbook')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'guestbook',
        filter: `invitation_id=eq.${invitationId}`
      }, (payload) => {
        setMessages(prev => [payload.new, ...prev]);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [invitationId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!msg.trim()) return;
    setLoading(true);

    await supabase.from('guestbook').insert({
      invitation_id: invitationId,
      name: name || 'Tamu',
      message: msg
    });

    setMsg('');
    setLoading(false);
  }

  return (
    <div className="py-20 px-6 bg-gray-50/50">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Buku Tamu</h2>
        <p className="text-gray-500 text-sm">Tinggalkan pesan dan harapan Anda.</p>
      </div>

      <form onSubmit={handleSubmit} className="mb-8 space-y-3 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <input 
          type="text" 
          value={name} 
          onChange={e => setName(e.target.value)} 
          placeholder="Nama Anda" 
          className="input text-sm py-2" 
          required 
          readOnly={!!guestName}
        />
        <textarea 
          value={msg} 
          onChange={e => setMsg(e.target.value)} 
          placeholder="Tulis ucapan dan doa restu..." 
          className="input text-sm h-20 resize-none" 
          required 
        />
        <button 
          type="submit" 
          disabled={loading} 
          className="btn text-white w-full py-2 text-sm"
          style={{ backgroundColor: primaryColor }}
        >
          Kirim Ucapan
        </button>
      </form>

      <div className="space-y-3 max-h-96 overflow-y-auto pr-2 no-scrollbar">
        {messages.map(m => (
          <div key={m.id} className="bg-white p-4 rounded-xl border border-gray-100 text-left">
            <p className="font-semibold text-gray-900 text-sm">{m.name}</p>
            <p className="text-gray-600 text-sm mt-1">{m.message}</p>
            <p className="text-[10px] text-gray-400 mt-2">
              {new Date(m.created_at).toLocaleDateString('id-ID', { month: 'short', day: 'numeric' })}
            </p>
          </div>
        ))}
        {messages.length === 0 && (
          <p className="text-center text-gray-400 text-sm italic">Belum ada ucapan.</p>
        )}
      </div>
    </div>
  );
}
