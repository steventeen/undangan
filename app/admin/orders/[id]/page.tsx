'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, RefreshCcw, ExternalLink, Save } from 'lucide-react';
import { formatIndonesianDate } from '@/lib/utils';
import { use } from 'react';

export default function OrderDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [eventData, setEventData] = useState<Record<string, string>>({});
  const [paymentStatus, setPaymentStatus] = useState('');

  useEffect(() => {
    async function fetchOrder() {
      const res = await fetch('/api/admin/orders');
      if (res.ok) {
        const { orders } = await res.json();
        const found = orders.find((o: any) => o.id === id);
        if (found) {
          setOrder(found);
          setEventData(found.event_data || {});
          setPaymentStatus(found.payment_status);
        }
      }
      setLoading(false);
    }
    fetchOrder();
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    const res = await fetch(`/api/admin/orders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ payment_status: paymentStatus, event_data: eventData }),
    });
    setSaving(false);
    if (res.ok) alert('Pesanan berhasil diperbarui!');
    else alert('Gagal memperbarui pesanan.');
  };

  const handleRegenerate = async () => {
    const res = await fetch('/api/generate-invitation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order_id: id }),
    });
    if (res.ok) {
      alert('Undangan berhasil di-generate ulang!');
      // Re-fetch data to show updated status
      const orderRes = await fetch('/api/admin/orders');
      if (orderRes.ok) {
        const { orders } = await orderRes.json();
        const found = orders.find((o: any) => o.id === id);
        if (found) {
          setOrder(found);
          setEventData(found.event_data || {});
          setPaymentStatus(found.payment_status);
        }
      }
    } else alert('Gagal generate ulang.');
  };

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-400">Memuat...</div>;
  if (!order) return <div className="flex items-center justify-center h-64 text-red-400">Pesanan tidak ditemukan.</div>;

  const payBadge: Record<string, string> = {
    verified: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700',
    unpaid: 'bg-red-100 text-red-700',
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => router.back()} className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
          <ArrowLeft size={20} className="text-gray-600 dark:text-gray-300" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Detail Pesanan</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-mono">{order.order_number}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Informasi Pemesan</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {([
                ['Nama', order.customer_name],
                ['Email', order.customer_email],
                ['WhatsApp', order.customer_phone],
                ['Template', order.template?.name],
                ['Tanggal Pesan', formatIndonesianDate(order.created_at)],
                ['Harga', `Rp ${(order.template?.price || 0).toLocaleString('id-ID')}`],
              ] as [string, string][]).map(([label, value]) => (
                <div key={label}>
                  <p className="text-gray-500 dark:text-gray-400 text-xs mb-0.5">{label}</p>
                  <p className="font-medium text-gray-900 dark:text-white">{value || '-'}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Data Acara (Editable)</h2>
            <div className="space-y-3">
              {Object.entries(eventData).map(([key, value]) => (
                <div key={key}>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1 capitalize">{key.replace(/_/g, ' ')}</label>
                  <input
                    type="text"
                    value={String(value)}
                    onChange={e => setEventData({ ...eventData, [key]: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Status Pesanan</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1.5">Status Pembayaran</label>
                <select
                  value={paymentStatus}
                  onChange={e => setPaymentStatus(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="unpaid">Unpaid</option>
                  <option value="pending">Pending</option>
                  <option value="verified">Verified</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1.5">Status Desain</label>
                <span className={`inline-flex px-3 py-1.5 rounded-lg text-sm font-medium capitalize ${order.design_status === 'generated' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                  {order.design_status}
                </span>
              </div>
              <button onClick={handleSave} disabled={saving} className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium text-sm transition-colors disabled:opacity-70">
                <Save size={16} /> {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </div>
          </div>

          {order.payment_proof_url && (
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
              <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Bukti Pembayaran</h2>
              <a href={order.payment_proof_url} target="_blank" rel="noopener noreferrer">
                <img src={order.payment_proof_url} alt="Bukti Bayar" className="w-full rounded-xl border border-gray-100 dark:border-gray-700 object-cover hover:opacity-90 transition-opacity" />
              </a>
            </div>
          )}

          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 space-y-3">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-1">Aksi</h2>
            <button onClick={handleRegenerate} className="w-full flex items-center justify-center gap-2 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium text-sm transition-colors">
              <RefreshCcw size={16} /> Generate Ulang Undangan
            </button>
            {order.design_status === 'generated' && (
              <Link href={`/inv/${order.unique_slug}`} target="_blank" className="w-full flex items-center justify-center gap-2 py-3 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-medium text-sm transition-colors">
                <ExternalLink size={16} /> Preview Undangan
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
