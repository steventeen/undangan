'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { formatIndonesianDate } from '@/lib/utils';
import { CheckCircle2, Clock, XCircle, Search, ExternalLink, Share2 } from 'lucide-react';

function StatusContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [query, setQuery] = useState(searchParams.get('order') || '');
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    // Auto-search jika ada query dari URL
    const orderParam = searchParams.get('order');
    if (orderParam) {
      setQuery(orderParam);
      handleSearch(orderParam);
    }
  }, []);

  const handleSearch = async (searchQuery?: string) => {
    const q = searchQuery || query;
    if (!q.trim()) return;

    setLoading(true);
    setError('');
    setOrder(null);
    setSearched(true);

    const { data, error } = await supabase
      .from('orders')
      .select('*, template:templates(name, thumbnail_url)')
      .or(`order_number.eq.${q},customer_email.eq.${q}`)
      .single();

    if (error || !data) {
      setError('Pesanan tidak ditemukan. Pastikan nomor pesanan atau email yang Anda masukkan benar.');
    } else {
      setOrder(data);
    }
    setLoading(false);
  };

  const getPaymentBadge = (status: string) => {
    switch (status) {
      case 'verified': return { icon: <CheckCircle2 size={16} />, label: 'Terverifikasi', className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' };
      case 'pending': return { icon: <Clock size={16} />, label: 'Menunggu Verifikasi', className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' };
      default: return { icon: <XCircle size={16} />, label: 'Belum Bayar', className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' };
    }
  };

  const getDesignBadge = (status: string) => {
    switch (status) {
      case 'generated': return { icon: <CheckCircle2 size={16} />, label: 'Undangan Siap', className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' };
      case 'failed': return { icon: <XCircle size={16} />, label: 'Gagal Generate', className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' };
      default: return { icon: <Clock size={16} />, label: 'Diproses Admin', className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' };
    }
  };

  const invitationUrl = order ? `${typeof window !== 'undefined' ? window.location.origin : ''}/inv/${order.unique_slug}` : '';
  const shareMessage = order ? encodeURIComponent(`Undangan Pernikahan ${order.event_data?.groom_name} & ${order.event_data?.bride_name}\n\n${invitationUrl}`) : '';

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Cek Status Pesanan</h1>
        <p className="text-gray-600 dark:text-gray-400">Masukkan nomor pesanan (INV/...) atau email Anda</p>
      </div>

      {/* Search Form */}
      <div className="flex gap-3 mb-10">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="INV/2026/XXXXXX atau email@contoh.com"
            className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white"
          />
        </div>
        <button
          onClick={() => handleSearch()}
          disabled={loading}
          className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors disabled:opacity-70 whitespace-nowrap"
        >
          {loading ? 'Mencari...' : 'Cek Status'}
        </button>
      </div>

      {/* Error State */}
      {searched && error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6 text-center">
          <XCircle className="mx-auto mb-3 text-red-500" size={40} />
          <p className="text-red-700 dark:text-red-400 font-medium">{error}</p>
        </div>
      )}

      {/* Result */}
      {order && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
            <p className="text-blue-200 text-sm font-medium mb-1">Nomor Pesanan</p>
            <p className="text-2xl font-bold">{order.order_number}</p>
            <p className="text-blue-200 text-sm mt-1">
              Dipesan pada {formatIndonesianDate(order.created_at)}
            </p>
          </div>

          <div className="p-6 space-y-6">
            {/* Status Badges */}
            <div className="grid grid-cols-2 gap-4">
              {(() => {
                const payBadge = getPaymentBadge(order.payment_status);
                return (
                  <div className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium ${payBadge.className}`}>
                    {payBadge.icon} {payBadge.label}
                  </div>
                );
              })()}
              {(() => {
                const desBadge = getDesignBadge(order.design_status);
                return (
                  <div className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium ${desBadge.className}`}>
                    {desBadge.icon} {desBadge.label}
                  </div>
                );
              })()}
            </div>

            {/* Order Detail */}
            <div className="border-t border-gray-100 dark:border-gray-700 pt-5 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Template</span>
                <span className="font-medium text-gray-900 dark:text-white">{order.template?.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Nama Pemesan</span>
                <span className="font-medium text-gray-900 dark:text-white">{order.customer_name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Email</span>
                <span className="font-medium text-gray-900 dark:text-white">{order.customer_email}</span>
              </div>
              {order.event_data?.groom_name && order.event_data?.bride_name && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Mempelai</span>
                  <span className="font-medium text-gray-900 dark:text-white">{order.event_data.groom_name} & {order.event_data.bride_name}</span>
                </div>
              )}
              {order.event_data?.event_date && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Tanggal Acara</span>
                  <span className="font-medium text-gray-900 dark:text-white">{formatIndonesianDate(order.event_data.event_date)}</span>
                </div>
              )}
            </div>

            {/* Invitation Link - Show only when generated */}
            {order.design_status === 'generated' && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="text-green-600 dark:text-green-400" size={20} />
                  <p className="font-semibold text-green-800 dark:text-green-300">Undangan Anda Siap!</p>
                </div>
                <p className="text-green-700 dark:text-green-400 text-sm mb-4 break-all">{invitationUrl}</p>
                <div className="flex gap-3">
                  <Link
                    href={`/inv/${order.unique_slug}`}
                    target="_blank"
                    className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg font-medium text-sm transition-colors"
                  >
                    <ExternalLink size={16} /> Buka Undangan
                  </Link>
                  <a
                    href={`https://wa.me/?text=${shareMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1da851] text-white py-2.5 rounded-lg font-medium text-sm transition-colors"
                  >
                    <Share2 size={16} /> Bagikan via WA
                  </a>
                </div>
              </div>
            )}

            {/* Info jika belum generated */}
            {order.design_status !== 'generated' && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-5 text-sm text-yellow-800 dark:text-yellow-300">
                <p className="font-semibold mb-1">Undangan Sedang Diproses</p>
                <p>Tim kami akan memverifikasi pembayaran dan menyiapkan undangan Anda dalam 1x24 jam. Hubungi kami via WhatsApp jika ada pertanyaan.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function StatusPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center flex h-screen items-center justify-center">Memuat...</div>}>
      <StatusContent />
    </Suspense>
  );
}
