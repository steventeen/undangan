'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase.client';
import { Loader2, Plus, Search, Copy, Share2, Trash2 } from 'lucide-react';
import type { Invitation, Guest } from '@/types';

export default function GuestsPage() {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [selectedInvId, setSelectedInvId] = useState<string>('');
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Add Guest Form
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    async function loadInvitations() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('invitations')
        .select('id, title, slug')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (data && data.length > 0) {
        setInvitations(data as any);
        setSelectedInvId(data[0].id);
      }
      setLoading(false);
    }
    loadInvitations();
  }, []);

  useEffect(() => {
    if (!selectedInvId) return;
    async function loadGuests() {
      const { data } = await supabase
        .from('guests')
        .select('*')
        .eq('invitation_id', selectedInvId)
        .order('created_at', { ascending: false });
      
      if (data) setGuests(data as Guest[]);
    }
    loadGuests();
  }, [selectedInvId]);

  async function handleAddGuest(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !selectedInvId) return;
    setIsAdding(true);

    const { data, error } = await supabase
      .from('guests')
      .insert({
        invitation_id: selectedInvId,
        name,
        phone,
      })
      .select()
      .single();

    if (!error && data) {
      setGuests([data as Guest, ...guests]);
      setName('');
      setPhone('');
    } else {
      alert('Gagal menambah tamu: ' + error?.message);
    }
    setIsAdding(false);
  }

  async function handleDelete(id: string) {
    if (!confirm('Hapus tamu ini?')) return;
    const { error } = await supabase.from('guests').delete().eq('id', id);
    if (!error) {
      setGuests(guests.filter(g => g.id !== id));
    }
  }

  function getUniqueLink(slug: string, token: string) {
    return `${window.location.origin}/i/${slug}?t=${token}`;
  }

  async function copyLink(link: string) {
    await navigator.clipboard.writeText(link);
    alert('Link disalin!');
  }

  if (loading) {
    return <div className="p-8 pt-20 flex justify-center"><Loader2 className="animate-spin text-rose-500" /></div>;
  }

  return (
    <div className="p-6 md:p-8 pt-16 md:pt-8 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-serif font-bold text-gray-900">Manajemen Tamu</h1>
          <p className="text-gray-500 text-sm mt-1">Kelola daftar tamu dan sebar undangan via WhatsApp.</p>
        </div>

        {invitations.length > 0 && (
          <div className="w-full md:w-64">
            <label className="label text-xs">Pilih Undangan</label>
            <select 
              className="input py-2"
              value={selectedInvId}
              onChange={(e) => setSelectedInvId(e.target.value)}
            >
              {invitations.map(inv => (
                <option key={inv.id} value={inv.id}>{inv.title}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {!selectedInvId ? (
        <div className="card p-12 text-center text-gray-500">
          Anda belum memiliki undangan. Buat undangan terlebih dahulu.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add Form */}
          <div className="lg:col-span-1">
            <div className="card p-5 sticky top-8">
              <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Plus size={18} className="text-rose-500" /> Tambah Tamu Baru
              </h2>
              <form onSubmit={handleAddGuest} className="space-y-4">
                <div>
                  <label className="label text-xs">Nama Lengkap / Panggilan</label>
                  <input 
                    type="text" 
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input py-2" 
                    placeholder="Bpk. Budi Susanto"
                  />
                </div>
                <div>
                  <label className="label text-xs">No. WhatsApp (Opsional)</label>
                  <input 
                    type="tel" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="input py-2" 
                    placeholder="08123456789"
                  />
                  <p className="text-[10px] text-gray-400 mt-1">Format: 08x atau 628x. Digunakan untuk fitur Bulk WA.</p>
                </div>
                <button type="submit" disabled={isAdding || !name.trim()} className="btn btn-primary w-full justify-center">
                  {isAdding ? <Loader2 size={16} className="animate-spin" /> : 'Simpan Tamu'}
                </button>
              </form>
            </div>
          </div>

          {/* Guest List */}
          <div className="lg:col-span-2">
            <div className="card overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900">Daftar Tamu</h3>
                  <span className="badge badge-gray">{guests.length}</span>
                </div>
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" placeholder="Cari nama..." className="input py-1.5 pl-8 text-sm w-48" />
                </div>
              </div>

              {guests.length === 0 ? (
                <div className="p-12 text-center text-gray-500 text-sm">
                  Belum ada tamu yang ditambahkan.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase border-b border-gray-100">
                      <tr>
                        <th className="px-4 py-3 font-medium">Nama Tamu</th>
                        <th className="px-4 py-3 font-medium">Status</th>
                        <th className="px-4 py-3 font-medium text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {guests.map((guest) => {
                        const invSlug = invitations.find(i => i.id === selectedInvId)?.slug || '';
                        const link = getUniqueLink(invSlug, guest.unique_token);
                        
                        return (
                          <tr key={guest.id} className="hover:bg-gray-50/50">
                            <td className="px-4 py-3">
                              <p className="font-medium text-gray-900">{guest.name}</p>
                              {guest.phone && <p className="text-xs text-gray-500">{guest.phone}</p>}
                            </td>
                            <td className="px-4 py-3">
                              <span className={`badge ${guest.status === 'clicked' ? 'badge-blue' : guest.status === 'rsvp_yes' ? 'badge-green' : 'badge-gray'}`}>
                                {guest.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right space-x-2">
                              <button 
                                onClick={() => copyLink(link)}
                                className="btn btn-ghost btn-sm px-2 text-gray-500 hover:text-rose-600"
                                title="Salin Link"
                              >
                                <Copy size={14} />
                              </button>
                              <a 
                                href={`https://wa.me/${guest.phone?.replace(/^0/, '62')}?text=${encodeURIComponent(`Halo ${guest.name}, ini undangan kami: ${link}`)}`}
                                target="_blank"
                                className={`btn btn-ghost btn-sm px-2 ${guest.phone ? 'text-green-600 hover:bg-green-50' : 'text-gray-300 pointer-events-none'}`}
                                title="Kirim WA"
                              >
                                <Share2 size={14} />
                              </a>
                              <button 
                                onClick={() => handleDelete(guest.id)}
                                className="btn btn-ghost btn-sm px-2 text-gray-400 hover:text-red-600 hover:bg-red-50"
                              >
                                <Trash2 size={14} />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
