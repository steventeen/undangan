'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase.client';
import { Loader2, Eye, Users, CheckCircle, XCircle, HelpCircle } from 'lucide-react';
import type { Invitation, RSVP } from '@/types';
import { formatDate } from '@/lib/utils';

export default function AnalyticsPage() {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [selectedInvId, setSelectedInvId] = useState<string>('');
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('invitations')
        .select('id, title, view_count, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (data && data.length > 0) {
        setInvitations(data as any);
        setSelectedInvId(data[0].id);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  useEffect(() => {
    if (!selectedInvId) return;
    async function loadRsvp() {
      const { data } = await supabase
        .from('rsvp')
        .select('*')
        .eq('invitation_id', selectedInvId)
        .order('created_at', { ascending: false });
      
      if (data) setRsvps(data as RSVP[]);
    }
    loadRsvp();
  }, [selectedInvId]);

  if (loading) {
    return <div className="p-8 pt-20 flex justify-center"><Loader2 className="animate-spin text-rose-500" /></div>;
  }

  const selectedInv = invitations.find(i => i.id === selectedInvId);
  const yesCount = rsvps.filter(r => r.attendance === 'yes').reduce((acc, curr) => acc + curr.guest_count, 0);
  const noCount = rsvps.filter(r => r.attendance === 'no').length;
  const maybeCount = rsvps.filter(r => r.attendance === 'maybe').length;

  return (
    <div className="p-6 md:p-8 pt-16 md:pt-8 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-serif font-bold text-gray-900">Analytics & RSVP</h1>
          <p className="text-gray-500 text-sm mt-1">Pantau statistik undangan dan konfirmasi kehadiran.</p>
        </div>

        {invitations.length > 0 && (
          <div className="w-full md:w-64">
            <select 
              className="input py-2 bg-white"
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
          Belum ada undangan untuk dianalisis.
        </div>
      ) : (
        <>
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="card p-5 border-l-4 border-l-blue-500">
              <div className="flex justify-between items-start">
                <p className="text-sm text-gray-500">Total Views</p>
                <Eye size={16} className="text-blue-500" />
              </div>
              <p className="text-3xl font-bold text-gray-900 mt-2">{selectedInv?.view_count || 0}</p>
            </div>
            
            <div className="card p-5 border-l-4 border-l-green-500">
              <div className="flex justify-between items-start">
                <p className="text-sm text-gray-500">Hadir (Orang)</p>
                <CheckCircle size={16} className="text-green-500" />
              </div>
              <p className="text-3xl font-bold text-gray-900 mt-2">{yesCount}</p>
            </div>

            <div className="card p-5 border-l-4 border-l-red-500">
              <div className="flex justify-between items-start">
                <p className="text-sm text-gray-500">Tidak Hadir</p>
                <XCircle size={16} className="text-red-500" />
              </div>
              <p className="text-3xl font-bold text-gray-900 mt-2">{noCount}</p>
            </div>

            <div className="card p-5 border-l-4 border-l-amber-500">
              <div className="flex justify-between items-start">
                <p className="text-sm text-gray-500">Mungkin Hadir</p>
                <HelpCircle size={16} className="text-amber-500" />
              </div>
              <p className="text-3xl font-bold text-gray-900 mt-2">{maybeCount}</p>
            </div>
          </div>

          {/* RSVP Table */}
          <div className="card overflow-hidden">
            <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Data RSVP Terbaru</h3>
              <button className="btn btn-secondary btn-sm bg-white text-xs">Export CSV</button>
            </div>
            
            {rsvps.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-4xl mb-3">📝</p>
                <p className="text-gray-500 text-sm">Belum ada tamu yang mengisi RSVP.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-white text-gray-500 text-xs uppercase border-b border-gray-100">
                    <tr>
                      <th className="px-5 py-3 font-medium">Tanggal</th>
                      <th className="px-5 py-3 font-medium">Nama Tamu</th>
                      <th className="px-5 py-3 font-medium">Kehadiran</th>
                      <th className="px-5 py-3 font-medium text-center">Jumlah</th>
                      <th className="px-5 py-3 font-medium">Pesan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {rsvps.map((rsvp) => (
                      <tr key={rsvp.id} className="hover:bg-gray-50/50">
                        <td className="px-5 py-3 text-gray-500 text-xs whitespace-nowrap">
                          {formatDate(rsvp.created_at)}
                        </td>
                        <td className="px-5 py-3 font-medium text-gray-900">
                          {rsvp.guest_name}
                        </td>
                        <td className="px-5 py-3">
                          <span className={`badge ${
                            rsvp.attendance === 'yes' ? 'badge-green' : 
                            rsvp.attendance === 'no' ? 'badge-rose' : 'badge-amber'
                          }`}>
                            {rsvp.attendance === 'yes' ? 'Hadir' : rsvp.attendance === 'no' ? 'Tidak' : 'Mungkin'}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-center font-medium">
                          {rsvp.attendance === 'yes' ? rsvp.guest_count : '-'}
                        </td>
                        <td className="px-5 py-3 text-gray-600 italic text-xs max-w-xs truncate">
                          "{rsvp.message || '-'}"
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
