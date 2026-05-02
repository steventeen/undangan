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
              
              {/* === COUPLE SECTION === */}
              {section.type === 'couple' && (
                <div className="py-20 px-6 text-center space-y-12 bg-white">
                  <div className="space-y-4 animate-fade-in">
                    <div className="w-40 h-40 bg-gray-100 rounded-full mx-auto flex items-center justify-center text-4xl border-4 shadow-xl" style={{ borderColor: settings.primary_color }}>🤵</div>
                    <h3 className="text-3xl font-bold text-gray-900" style={{ color: settings.primary_color }}>{section.data.groom_name || 'Nama Mempelai Pria'}</h3>
                    <p className="text-sm text-gray-600 px-8 leading-relaxed">
                      Putra dari <br/>
                      <span className="font-bold">Bpk. {section.data.groom_father || '...'}</span> <br/>
                      & <span className="font-bold">Ibu {section.data.groom_mother || '...'}</span>
                    </p>
                    {section.data.groom_ig && (
                      <a href={`https://instagram.com/${section.data.groom_ig}`} target="_blank" className="inline-block text-xs font-medium text-rose-500 bg-rose-50 px-3 py-1 rounded-full">@{section.data.groom_ig}</a>
                    )}
                  </div>
                  
                  <div className="text-5xl font-serif italic py-4" style={{ color: settings.primary_color }}>&</div>
                  
                  <div className="space-y-4 animate-fade-in">
                    <div className="w-40 h-40 bg-gray-100 rounded-full mx-auto flex items-center justify-center text-4xl border-4 shadow-xl" style={{ borderColor: settings.primary_color }}>👰</div>
                    <h3 className="text-3xl font-bold text-gray-900" style={{ color: settings.primary_color }}>{section.data.bride_name || 'Nama Mempelai Wanita'}</h3>
                    <p className="text-sm text-gray-600 px-8 leading-relaxed">
                      Putri dari <br/>
                      <span className="font-bold">Bpk. {section.data.bride_father || '...'}</span> <br/>
                      & <span className="font-bold">Ibu {section.data.bride_mother || '...'}</span>
                    </p>
                    {section.data.bride_ig && (
                      <a href={`https://instagram.com/${section.data.bride_ig}`} target="_blank" className="inline-block text-xs font-medium text-rose-500 bg-rose-50 px-3 py-1 rounded-full">@{section.data.bride_ig}</a>
                    )}
                  </div>
                </div>
              )}

              {/* === EVENT SECTION === */}
              {section.type === 'event' && (
                <div className="py-20 px-6 text-center bg-gray-50/50">
                  <h2 className="text-2xl font-bold mb-8 text-gray-900">Detail Acara</h2>
                  
                  <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-shadow">
                    <div className="absolute top-0 left-0 w-full h-2" style={{ backgroundColor: settings.primary_color }}></div>
                    
                    <div className="w-16 h-16 mx-auto bg-rose-50 rounded-full flex items-center justify-center mb-6">
                      <Calendar className="text-rose-500" size={24} />
                    </div>
                    
                    <h3 className="font-bold text-xl text-gray-900 mb-2">Resepsi Pernikahan</h3>
                    
                    {section.data.date && (
                      <p className="text-lg font-bold text-gray-900" style={{ color: settings.primary_color }}>
                        {new Date(section.data.date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-center gap-2 text-gray-600 font-medium mb-6">
                      <Clock size={16} /> {section.data.time || '10:00 - Selesai'}
                    </div>
                    
                    <div className="w-12 h-[1px] bg-gray-200 mx-auto my-6"></div>
                    
                    <div className="space-y-2 mb-8">
                      <p className="font-bold text-gray-900 text-lg uppercase tracking-wide">{section.data.location_name || 'Nama Lokasi'}</p>
                      <div className="flex items-start justify-center gap-2 text-gray-500 px-4">
                        <MapPin size={16} className="mt-1 shrink-0 text-rose-500" />
                        <p className="text-sm leading-relaxed whitespace-pre-line text-left">
                          {section.data.address || section.data.location || 'Alamat Lengkap'}
                        </p>
                      </div>
                    </div>

                    <a 
                      href={section.data.maps_url || section.data.location_url || `https://maps.google.com/?q=${encodeURIComponent(section.data.location_name || section.data.location || '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-8 py-3 rounded-full text-sm font-bold text-white shadow-lg hover:scale-105 active:scale-95 transition-all"
                      style={{ backgroundColor: settings.primary_color }}
                    >
                      <MapPin size={16} /> Buka Google Maps
                    </a>
                  </div>
                </div>
              )}

              {/* === STORY SECTION === */}
              {section.type === 'story' && (
                <div className="py-24 px-8 text-center bg-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-gray-50 rounded-full translate-y-1/2 -translate-x-1/2"></div>
                  
                  <div className="relative z-10">
                    <h2 className="text-3xl font-serif font-bold mb-8 italic" style={{ color: settings.primary_color }}>
                      {section.data.title || 'Kisah Cinta Kami'}
                    </h2>
                    <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-line italic">
                      "{section.data.content || 'Perjalanan cinta kami dimulai dari sebuah pertemuan yang sederhana...'}"
                    </p>
                  </div>
                </div>
              )}

              {/* === GALLERY SECTION === */}
              {section.type === 'gallery' && (
                <div className="py-20 px-4 text-center bg-gray-50/50">
                  <h2 className="text-2xl font-bold mb-8 text-gray-900">Galeri Kebahagiaan</h2>
                  <div className="grid grid-cols-2 gap-3">
                    {section.data.images && section.data.images.length > 0 ? (
                      section.data.images.map((img: string, i: number) => (
                        <div key={i} className="aspect-[3/4] bg-gray-200 rounded-2xl overflow-hidden shadow-sm border-2 border-white">
                          <img src={img} alt="Gallery" className="w-full h-full object-cover" />
                        </div>
                      ))
                    ) : (
                      [...Array(4)].map((_, i) => (
                        <div key={i} className="aspect-[3/4] bg-gray-200 rounded-2xl flex items-center justify-center text-gray-400 border-2 border-white">🖼️</div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* === GIFT SECTION === */}
              {section.type === 'gift' && (
                <div className="py-20 px-6 text-center bg-white">
                  <h2 className="text-2xl font-bold mb-4 text-gray-900">Kado Digital</h2>
                  <p className="text-gray-500 text-sm mb-8 px-4">Doa restu Anda merupakan kado terindah, namun jika Anda ingin memberikan tanda kasih lainnya, silakan melalui:</p>
                  
                  <div className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100 space-y-4 shadow-inner">
                    <div className="w-16 h-10 bg-white rounded-lg mx-auto flex items-center justify-center shadow-sm border border-gray-100 font-bold text-gray-900">
                      {section.data.bank_name || 'BANK'}
                    </div>
                    <p className="text-2xl font-mono font-bold tracking-wider" style={{ color: settings.primary_color }}>
                      {section.data.account_number || '0000000000'}
                    </p>
                    <p className="text-sm font-medium text-gray-700">a.n {section.data.account_holder || 'Nama Pemilik'}</p>
                    
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(section.data.account_number || '');
                        alert('Nomor rekening berhasil disalin!');
                      }}
                      className="text-xs font-bold text-rose-500 uppercase tracking-widest mt-4"
                    >
                      Salin Rekening
                    </button>
                  </div>
                </div>
              )}

              {/* === CLOSING SECTION === */}
              {section.type === 'closing' && (
                <div className="py-24 px-10 text-center bg-white relative">
                  <div className="absolute inset-0 opacity-5" style={{ backgroundColor: settings.primary_color }}></div>
                  <div className="relative z-10">
                    <p className="text-gray-600 leading-relaxed text-sm mb-12">
                      {section.data.content || 'Terima kasih atas perhatian dan doa restu Anda. Sampai jumpa di hari bahagia kami.'}
                    </p>
                    <h3 className="text-xl font-bold text-gray-900">Kami Yang Berbahagia,</h3>
                    <p className="text-3xl font-serif font-bold mt-4" style={{ color: settings.primary_color }}>
                      {invitation.title}
                    </p>
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
      .then((res: any) => { if (res.data) setMessages(res.data) });

    // Subscribe to realtime
    const channel = supabase.channel('realtime_guestbook')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'guestbook',
        filter: `invitation_id=eq.${invitationId}`
      }, (payload: any) => {
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
