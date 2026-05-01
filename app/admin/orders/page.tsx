'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, RefreshCw, Trash2, Eye, RefreshCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatIndonesianDate } from '@/lib/utils';

const PAGE_SIZE = 10;

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);

  const fetchOrders = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/orders');
    if (res.ok) {
      const data = await res.json();
      setOrders(data.orders);
    }
    setLoading(false);
  };

  useEffect(() => { fetchOrders(); }, []);

  const updateStatus = async (id: string, updates: object) => {
    await fetch(`/api/admin/orders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    fetchOrders();
  };

  const deleteOrder = async (id: string) => {
    if (!confirm('Hapus pesanan ini secara permanen?')) return;
    await fetch(`/api/admin/orders/${id}`, { method: 'DELETE' });
    fetchOrders();
  };

  const regenerate = async (orderId: string) => {
    const res = await fetch('/api/generate-invitation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order_id: orderId }),
    });
    if (res.ok) {
      alert('Undangan berhasil di-generate ulang!');
      fetchOrders();
    } else {
      alert('Gagal generate undangan.');
    }
  };

  const filtered = orders.filter(o => {
    const matchSearch =
      o.order_number?.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_email?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || o.payment_status === filter;
    return matchSearch && matchFilter;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const payBadge: Record<string, string> = {
    verified: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    unpaid: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  };

  const desBadge: Record<string, string> = {
    generated: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    failed: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    pending: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manajemen Pesanan</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{filtered.length} pesanan ditemukan</p>
        </div>
        <button onClick={fetchOrders} className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors self-start">
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Cari nama, email, nomor pesanan..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <select
          value={filter}
          onChange={e => { setFilter(e.target.value); setPage(1); }}
          className="px-4 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
        >
          <option value="all">Semua Status</option>
          <option value="unpaid">Unpaid</option>
          <option value="pending">Pending</option>
          <option value="verified">Verified</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wide">
                <th className="px-5 py-3.5 text-left font-semibold">No. Pesanan</th>
                <th className="px-5 py-3.5 text-left font-semibold">Pemesan</th>
                <th className="px-5 py-3.5 text-left font-semibold">Template</th>
                <th className="px-5 py-3.5 text-left font-semibold">Tanggal</th>
                <th className="px-5 py-3.5 text-left font-semibold">Bayar</th>
                <th className="px-5 py-3.5 text-left font-semibold">Desain</th>
                <th className="px-5 py-3.5 text-right font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {loading ? (
                [1,2,3,4].map(i => (
                  <tr key={i}>
                    {[1,2,3,4,5,6,7].map(j => (
                      <td key={j} className="px-5 py-4">
                        <div className="animate-pulse h-4 bg-gray-100 dark:bg-gray-800 rounded w-full" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-gray-400">Tidak ada pesanan yang sesuai filter.</td>
                </tr>
              ) : paginated.map((order: any) => (
                <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                  <td className="px-5 py-4 font-mono text-xs text-gray-900 dark:text-gray-200 font-medium">{order.order_number}</td>
                  <td className="px-5 py-4">
                    <p className="font-medium text-gray-900 dark:text-white">{order.customer_name}</p>
                    <p className="text-xs text-gray-400">{order.customer_email}</p>
                  </td>
                  <td className="px-5 py-4 text-gray-600 dark:text-gray-300 text-xs">{order.template?.name || '-'}</td>
                  <td className="px-5 py-4 text-gray-500 dark:text-gray-400 text-xs whitespace-nowrap">{formatIndonesianDate(order.created_at)}</td>
                  <td className="px-5 py-4">
                    <select
                      value={order.payment_status}
                      onChange={e => updateStatus(order.id, { payment_status: e.target.value })}
                      className={`text-xs font-medium px-2.5 py-1 rounded-lg border-0 cursor-pointer focus:ring-2 focus:ring-blue-500 outline-none ${payBadge[order.payment_status]}`}
                    >
                      <option value="unpaid">Unpaid</option>
                      <option value="pending">Pending</option>
                      <option value="verified">Verified</option>
                    </select>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-medium capitalize ${desBadge[order.design_status] || desBadge.pending}`}>
                      {order.design_status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end items-center gap-2">
                      <Link href={`/admin/orders/${order.id}`} title="Detail">
                        <Eye size={16} className="text-blue-500 hover:text-blue-700 cursor-pointer" />
                      </Link>
                      <button onClick={() => regenerate(order.id)} title="Generate Ulang">
                        <RefreshCcw size={16} className="text-green-500 hover:text-green-700 cursor-pointer" />
                      </button>
                      <button onClick={() => deleteOrder(order.id)} title="Hapus">
                        <Trash2 size={16} className="text-red-400 hover:text-red-600 cursor-pointer" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100 dark:border-gray-800">
            <p className="text-sm text-gray-500">
              Halaman {page} dari {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium bg-gray-100 dark:bg-gray-800 disabled:opacity-40 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <ChevronLeft size={16} /> Prev
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium bg-gray-100 dark:bg-gray-800 disabled:opacity-40 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
