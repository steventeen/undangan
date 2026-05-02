'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { MailOpen, Volume2, VolumeX, MapPin, Calendar, Clock, ChevronDown, Image as ImageIcon, Sparkles } from 'lucide-react';
import type { Invitation } from '@/types';
import Link from 'next/link';
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
  
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

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

  const fontHeading = settings.font_heading || 'Playfair Display';
  const fontBody = settings.font_body || 'Inter';

  return (
    <div className="min-h-screen relative overflow-x-hidden" style={{ fontFamily: fontBody, backgroundColor: settings.primary_color + '05' }}>
      
      {/* Progress Bar */}
      <motion.div className="fixed top-0 left-0 right-0 h-1 z-[60] origin-left" style={{ scaleX, backgroundColor: settings.primary_color }} />

      {/* Floating Audio Control */}
      <AnimatePresence>
        {isOpen && settings.music_url && (
          <motion.button 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            onClick={toggleMute}
            className="fixed bottom-8 left-8 z-50 w-12 h-12 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center text-white border border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.1)] hover:bg-white/30 transition-all"
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} className="animate-pulse" />}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Cinematic Opening Screen */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ y: '-100%', opacity: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden"
          >
            {/* Immersive Background */}
            <div className="absolute inset-0 bg-black">
              {settings.cover_image && (
                <motion.img 
                  initial={{ scale: 1.1, opacity: 0.5 }}
                  animate={{ scale: 1, opacity: 0.3 }}
                  src={settings.cover_image} 
                  className="w-full h-full object-cover blur-sm" 
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
            </div>
            
            <div className="relative z-10 text-center p-8 flex flex-col items-center max-w-lg">
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-[10px] tracking-[0.5em] uppercase text-white/60 mb-8 font-bold"
              >
                Special Invitation
              </motion.p>

              <motion.h1 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="text-5xl md:text-7xl font-bold text-white mb-12 drop-shadow-2xl"
                style={{ fontFamily: fontHeading }}
              >
                {title}
              </motion.h1>
              
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mb-16"
              >
                <p className="text-white/40 text-[10px] uppercase tracking-widest mb-3">Dear Honored Guest</p>
                <div className="h-[1px] w-12 bg-white/20 mx-auto mb-6" />
                <h2 className="text-2xl font-medium text-white px-8">
                  {guestName || 'Bapak/Ibu/Saudara/i'}
                </h2>
              </motion.div>
              
              <motion.button 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ delay: 1 }}
                onClick={handleOpen}
                className="group relative px-10 py-4 bg-white text-black font-bold rounded-full overflow-hidden shadow-[0_15px_45px_rgba(255,255,255,0.15)] flex items-center gap-3"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <MailOpen size={18} /> Buka Undangan
                </span>
                <motion.div 
                  className="absolute inset-0 bg-rose-500 translate-y-full group-hover:translate-y-0 transition-transform duration-500"
                />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="relative bg-white mx-auto max-w-md min-h-screen shadow-[0_0_100px_rgba(0,0,0,0.1)]">
        {orderedSections.map((section) => (
          <motion.div 
            key={section.id} 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="w-full relative overflow-hidden"
          >
            {/* Section Specific Rendering */}
            {section.type === 'cover' && (
              <div className="min-h-[100vh] flex flex-col items-center justify-center text-center p-8 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/80 z-0" />
                <div className="relative z-10 space-y-8">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 1 }}
                  >
                    <p className="text-xs tracking-[0.4em] uppercase text-gray-400 mb-6 font-bold">The Wedding Of</p>
                    <h1 
                      className="text-6xl font-bold leading-tight drop-shadow-sm"
                      style={{ color: settings.primary_color, fontFamily: fontHeading }}
                    >
                      {section.data.headline || title}
                    </h1>
                    <div className="h-px w-24 bg-gray-100 mx-auto my-8" />
                    <p className="text-gray-500 italic text-lg">
                      {section.data.subtitle || 'We are getting married'}
                    </p>
                  </motion.div>
                  
                  <motion.div 
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute bottom-12 left-1/2 -translate-x-1/2 text-gray-300"
                  >
                    <ChevronDown size={24} />
                  </motion.div>
                </div>
              </div>
            )}

            {section.type === 'couple' && (
              <div className="py-32 px-8 text-center space-y-20 bg-white">
                <div className="space-y-6">
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="w-48 h-64 bg-gray-100 rounded-[3rem] mx-auto overflow-hidden shadow-2xl border-8 border-white"
                  >
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-5xl">🤵</div>
                  </motion.div>
                  <h3 className="text-3xl font-bold" style={{ color: settings.primary_color, fontFamily: fontHeading }}>
                    {section.data.groom_name || 'Mempelai Pria'}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed max-w-[250px] mx-auto italic">
                    Putra terkasih dari <br/>
                    <span className="font-bold text-gray-700">Bpk. {section.data.groom_father || '...'}</span> & <br/>
                    <span className="font-bold text-gray-700">Ibu {section.data.groom_mother || '...'}</span>
                  </p>
                </div>
                
                <div className="text-5xl font-serif italic py-4 opacity-30">&</div>
                
                <div className="space-y-6">
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="w-48 h-64 bg-gray-100 rounded-[3rem] mx-auto overflow-hidden shadow-2xl border-8 border-white"
                  >
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-5xl">👰</div>
                  </motion.div>
                  <h3 className="text-3xl font-bold" style={{ color: settings.primary_color, fontFamily: fontHeading }}>
                    {section.data.bride_name || 'Mempelai Wanita'}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed max-w-[250px] mx-auto italic">
                    Putri terkasih dari <br/>
                    <span className="font-bold text-gray-700">Bpk. {section.data.bride_father || '...'}</span> & <br/>
                    <span className="font-bold text-gray-700">Ibu {section.data.bride_mother || '...'}</span>
                  </p>
                </div>
              </div>
            )}

            {section.type === 'event' && (
              <div className="py-24 px-8 bg-gray-50/50">
                <div className="bg-white rounded-[3rem] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 space-y-12">
                  <div className="text-center space-y-2">
                    <h3 className="text-sm font-bold tracking-[0.3em] uppercase text-gray-400">Save the Date</h3>
                    <h4 className="text-3xl font-bold" style={{ fontFamily: fontHeading }}>Acara Pernikahan</h4>
                  </div>

                  <div className="space-y-8">
                    <div className="flex items-start gap-6">
                      <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500 shrink-0">
                        <Calendar size={24} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Tanggal</p>
                        <p className="text-lg font-bold text-gray-800">
                          {section.data.date ? new Date(section.data.date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Belum diatur'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-6">
                      <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500 shrink-0">
                        <Clock size={24} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Waktu</p>
                        <p className="text-lg font-bold text-gray-800">{section.data.time || '10:00 - Selesai'}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-6">
                      <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500 shrink-0">
                        <MapPin size={24} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Lokasi</p>
                        <p className="text-lg font-bold text-gray-800 mb-1">{section.data.location_name || 'Nama Lokasi'}</p>
                        <p className="text-sm text-gray-500 leading-relaxed">{section.data.address || 'Alamat Lengkap'}</p>
                      </div>
                    </div>
                  </div>

                  {section.data.maps_url && (
                    <Link 
                      href={section.data.maps_url} 
                      target="_blank"
                      className="flex items-center justify-center gap-2 w-full py-4 bg-gray-900 text-white rounded-2xl font-bold text-sm shadow-xl shadow-gray-200 hover:bg-gray-800 transition-all"
                    >
                      <MapPin size={18} /> Lihat Lokasi Google Maps
                    </Link>
                  )}
                </div>
              </div>
            )}

            {section.type === 'story' && (
              <div className="py-24 px-8 text-center bg-white relative overflow-hidden">
                <div className="relative z-10">
                  <h2 className="text-3xl font-bold mb-8 italic" style={{ color: settings.primary_color, fontFamily: fontHeading }}>
                    {section.data.title || 'Kisah Cinta Kami'}
                  </h2>
                  <p className="text-gray-600 leading-relaxed text-lg italic max-w-sm mx-auto">
                    "{section.data.content || 'Perjalanan cinta kami dimulai dari sebuah pertemuan yang sederhana...'}"
                  </p>
                </div>
              </div>
            )}

            {section.type === 'gallery' && (
              <div className="py-24 px-4 bg-white">
                <div className="text-center mb-12">
                  <h3 className="text-sm font-bold tracking-[0.3em] uppercase text-gray-400 mb-2">Our Moments</h3>
                  <h4 className="text-3xl font-bold" style={{ fontFamily: fontHeading }}>Galeri Foto</h4>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {section.data.images?.map((img: string, i: number) => (
                    <motion.div 
                      key={i}
                      whileHover={{ scale: 1.02 }}
                      className={`rounded-3xl overflow-hidden shadow-lg ${i % 3 === 0 ? 'col-span-2 aspect-video' : 'aspect-square'}`}
                    >
                      <img src={img} className="w-full h-full object-cover" alt={`Gallery ${i}`} />
                    </motion.div>
                  )) || (
                    <div className="col-span-2 py-20 text-center bg-gray-50 rounded-[3rem] text-gray-300">
                       <ImageIcon size={48} className="mx-auto mb-4 opacity-20" />
                       <p className="text-xs font-bold uppercase tracking-widest">Belum ada foto</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {section.type === 'rsvp' && settings.show_rsvp && (
              <div className="py-24 px-8 bg-gray-50/50">
                <RSVPForm invitationId={invitation.id!} guestId={guestId} guestName={guestName} primaryColor={settings.primary_color} fontHeading={fontHeading} />
              </div>
            )}

            {section.type === 'guestbook' && settings.show_guestbook && (
              <div className="py-24 px-8 bg-white">
                <Guestbook invitationId={invitation.id!} guestName={guestName} primaryColor={settings.primary_color} fontHeading={fontHeading} />
              </div>
            )}

            {section.type === 'gift' && (
              <div className="py-24 px-8 bg-white text-center">
                <h3 className="text-sm font-bold tracking-[0.3em] uppercase text-gray-400 mb-2">Wedding Gift</h3>
                <h4 className="text-3xl font-bold mb-8" style={{ fontFamily: fontHeading }}>Kirim Hadiah</h4>
                <div className="p-8 rounded-[3rem] border-2 border-dashed border-gray-100 space-y-6">
                  <div className="w-16 h-10 bg-rose-50 rounded-lg mx-auto flex items-center justify-center text-rose-500 font-bold italic">{section.data.bank_name || 'BANK'}</div>
                  <div>
                    <p className="text-xl font-bold tracking-widest text-gray-800">{section.data.account_number || '0000000000'}</p>
                    <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">a.n {section.data.account_holder || 'Nama Penerima'}</p>
                  </div>
                </div>
              </div>
            )}

            {section.type === 'closing' && (
              <div className="py-32 px-10 text-center bg-gray-50/50">
                <div className="space-y-8">
                  <p className="text-lg text-gray-600 leading-relaxed italic" style={{ fontFamily: fontHeading }}>
                    "{section.data.content || 'Terima kasih atas doa restu Bapak/Ibu/Saudara/i sekalian. Sampai jumpa di hari bahagia kami.'}"
                  </p>
                  <div className="h-px w-12 bg-gray-200 mx-auto" />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Kami yang berbahagia</p>
                    <h4 className="text-2xl font-bold" style={{ fontFamily: fontHeading, color: settings.primary_color }}>{title}</h4>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        ))}
        
        {/* Viral Footer */}
        {settings.viral_footer && (
          <div className="py-12 text-center bg-white border-t border-gray-100">
            <Link href="/" className="inline-flex flex-col items-center gap-1">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-300">Created with love by</span>
              <span className="text-sm font-bold tracking-tighter text-gray-900 flex items-center gap-1">
                <Sparkles size={14} className="text-rose-500" /> UndanganDigital
              </span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

// Sub-components
function RSVPForm({ invitationId, guestId, guestName, primaryColor, fontHeading }: any) {
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
    if (error) { alert('Gagal mengirim RSVP'); setStatus('idle'); }
    else { setStatus('success'); }
  }

  return (
    <div className="bg-gray-900 rounded-[3rem] p-10 text-white text-center space-y-8 shadow-2xl">
      <h3 className="text-sm font-bold tracking-[0.3em] uppercase text-white/40">Konfirmasi Kehadiran</h3>
      <h4 className="text-3xl font-bold" style={{ fontFamily: fontHeading }}>Apakah Anda akan hadir?</h4>
      {status === 'success' ? (
        <p className="text-rose-400 font-bold">Terima kasih atas konfirmasinya!</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Nama Lengkap" className="w-full bg-white/10 border border-white/10 rounded-2xl px-6 py-4 text-white text-sm focus:outline-none focus:border-rose-500 transition-all" required />
          <select value={attendance} onChange={e => setAttendance(e.target.value)} className="w-full bg-white/10 border border-white/10 rounded-2xl px-6 py-4 text-white text-sm focus:outline-none focus:border-rose-500 transition-all">
            <option value="yes" className="text-black">Ya, Saya Hadir</option>
            <option value="no" className="text-black">Maaf, Tidak Hadir</option>
          </select>
          <button type="submit" disabled={status === 'loading'} className="w-full py-4 bg-white text-black rounded-2xl font-bold text-sm hover:bg-gray-100 transition-all">
            {status === 'loading' ? 'Mengirim...' : 'Kirim Konfirmasi'}
          </button>
        </form>
      )}
    </div>
  );
}

function Guestbook({ invitationId, guestName, primaryColor, fontHeading }: any) {
  const [messages, setMessages] = useState<any[]>([]);
  const [name, setName] = useState(guestName || '');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.from('guestbook').select('*').eq('invitation_id', invitationId).order('created_at', { ascending: false }).limit(10).then((res: any) => { if (res.data) setMessages(res.data) });
  }, [invitationId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!msg.trim()) return;
    setLoading(true);
    await supabase.from('guestbook').insert({ invitation_id: invitationId, name: name || 'Tamu', message: msg });
    setMsg('');
    setLoading(false);
    // Refresh
    supabase.from('guestbook').select('*').eq('invitation_id', invitationId).order('created_at', { ascending: false }).limit(10).then((res: any) => { if (res.data) setMessages(res.data) });
  }

  return (
    <div className="space-y-12">
      <div className="text-center">
        <h3 className="text-sm font-bold tracking-[0.3em] uppercase text-gray-400 mb-2">Guestbook</h3>
        <h4 className="text-3xl font-bold" style={{ fontFamily: fontHeading }}>Buku Tamu</h4>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Nama Anda" className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-rose-500 transition-all" required />
        <textarea value={msg} onChange={e => setMsg(e.target.value)} placeholder="Tulis ucapan..." className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm h-32 resize-none focus:outline-none focus:border-rose-500 transition-all" required />
        <button type="submit" disabled={loading} className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold text-sm hover:bg-gray-800 transition-all">Kirim Ucapan</button>
      </form>
      <div className="space-y-4">
        {messages.map(m => (
          <div key={m.id} className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100 text-left">
            <p className="font-bold text-gray-900 text-sm mb-1">{m.name}</p>
            <p className="text-gray-600 text-sm italic">"{m.message}"</p>
          </div>
        ))}
      </div>
    </div>
  );
}
