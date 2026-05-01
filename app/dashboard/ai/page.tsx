'use client';

import { useState } from 'react';
import { Sparkles, Loader2, Copy, CheckCircle } from 'lucide-react';
import type { EventCategory } from '@/types';

export default function AIGeneratorPage() {
  const [category, setCategory] = useState<EventCategory>('wedding');
  const [names, setNames] = useState('');
  const [style, setStyle] = useState('romantic');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ text: string, hashtag: string, wa: string } | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    if (!names.trim()) return;
    
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, names, style })
      });

      if (!res.ok) {
        throw new Error('Gagal menghasilkan konten. Pastikan API Key valid.');
      }

      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleCopy(text: string, type: string) {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div className="p-6 md:p-8 pt-16 md:pt-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-serif font-bold text-gray-900 flex items-center gap-2">
          <Sparkles className="text-amber-500" /> AI Content Generator
        </h1>
        <p className="text-gray-500 text-sm mt-1">Buat teks undangan, hashtag unik, dan pesan WhatsApp broadcast dalam hitungan detik.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form */}
        <div className="lg:col-span-5">
          <form onSubmit={handleGenerate} className="card p-6 space-y-5 sticky top-8">
            <div>
              <label className="label text-sm">Jenis Acara</label>
              <select 
                className="input" 
                value={category} 
                onChange={e => setCategory(e.target.value as any)}
              >
                <option value="wedding">Pernikahan</option>
                <option value="birthday">Ulang Tahun</option>
                <option value="seminar">Seminar / Event</option>
              </select>
            </div>
            
            <div>
              <label className="label text-sm">Nama Lengkap / Panggilan</label>
              <input 
                type="text" 
                required 
                className="input" 
                value={names}
                onChange={e => setNames(e.target.value)}
                placeholder={category === 'wedding' ? 'Budi & Sari' : 'Andi'} 
              />
            </div>

            <div>
              <label className="label text-sm">Gaya Bahasa</label>
              <select 
                className="input" 
                value={style} 
                onChange={e => setStyle(e.target.value)}
              >
                <option value="romantic">Romantis & Elegan</option>
                <option value="casual">Santai & Friendly</option>
                <option value="formal">Sangat Formal / Resmi</option>
                <option value="fun">Fun & Gaul</option>
              </select>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="btn bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white w-full justify-center shadow-lg shadow-amber-200"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
              {loading ? 'Membuat Keajaiban...' : 'Generate Konten'}
            </button>
          </form>
        </div>

        {/* Result */}
        <div className="lg:col-span-7">
          {!result && !loading && (
            <div className="card h-full flex flex-col items-center justify-center p-12 text-center text-gray-400 border-dashed border-2">
              <Sparkles size={48} className="mb-4 text-gray-200" />
              <p>Isi form di samping untuk mulai menghasilkan konten secara otomatis dengan AI.</p>
            </div>
          )}

          {loading && (
            <div className="card h-full flex flex-col items-center justify-center p-12 text-center text-amber-500">
              <Loader2 size={48} className="mb-4 animate-spin opacity-50" />
              <p className="font-medium animate-pulse">Menyusun kata-kata terbaik untuk Anda...</p>
            </div>
          )}

          {result && (
            <div className="space-y-6">
              {/* Teks Undangan */}
              <div className="card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-900">Teks Pembuka Undangan</h3>
                  <button onClick={() => handleCopy(result.text, 'text')} className="btn btn-ghost btn-sm text-xs">
                    {copied === 'text' ? <CheckCircle size={14} className="text-green-500" /> : <Copy size={14} />} Salin
                  </button>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-gray-700 whitespace-pre-line text-sm leading-relaxed border border-gray-100">
                  {result.text}
                </div>
              </div>

              {/* Hashtag */}
              <div className="card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-900">Ide Hashtag Viral</h3>
                  <button onClick={() => handleCopy(result.hashtag, 'hashtag')} className="btn btn-ghost btn-sm text-xs">
                    {copied === 'hashtag' ? <CheckCircle size={14} className="text-green-500" /> : <Copy size={14} />} Salin
                  </button>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-amber-600 font-medium text-sm border border-amber-100/50">
                  {result.hashtag}
                </div>
              </div>

              {/* WA Broadcast */}
              <div className="card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-900">Pesan WhatsApp Broadcast</h3>
                  <button onClick={() => handleCopy(result.wa, 'wa')} className="btn btn-ghost btn-sm text-xs">
                    {copied === 'wa' ? <CheckCircle size={14} className="text-green-500" /> : <Copy size={14} />} Salin
                  </button>
                </div>
                <div className="bg-green-50 rounded-xl p-4 text-green-900 whitespace-pre-line text-sm leading-relaxed border border-green-100">
                  {result.wa}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
