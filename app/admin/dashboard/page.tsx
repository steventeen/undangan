'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ShoppingCart, CheckCircle, Clock, LayoutTemplate,
  TrendingUp, ArrowUpRight, RefreshCw
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts';
import { formatIndonesianDate } from '@/lib/utils';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ total: 0, thisMonth: 0, revenue: 0, activeTemplates: 0 });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    const res = await fetch('/api/admin/orders');
    const tmplRes = await fetch('/api/admin/templates');

    if (res.ok && tmplRes.ok) {
      const { orders } = await res.json();
      const { templates } = await tmplRes.json();

      const now = new Date();
      const thisMonth = orders.filter((o: any) => {
        const d = new Date(o.created_at);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      });

      const revenue = orders
        .filter((o: any) => o.payment_status === 'verified')
        .reduce((sum: number, o: any) => sum + (o.template?.price || 0), 0);

      setStats({
        total: orders.length,
        thisMonth: thisMonth.length,
        revenue,
        activeTemplates: templates.filter((t: any) => t.is_active).length,
      });

      setRecentOrders(orders.slice(0, 5));

      // Build chart data - last 6 months
      const months: Record<string, number> = {};
      for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        const key = d.toLocaleString('id-ID', { month: 'short', year: '2-digit' });
        months[key] = 0;
      }
      orders.forEach((o: any) => {
        const d = new Date(o.created_at);
        const key = d.toLocaleString('id-ID', { month: 'short', year: '2-digit' });
        if (key in months) months[key]++;
      });
      setChartData(Object.entries(months).map(([month, count]) => ({ month, count })));
    }
    setLoading(false);
  }

  const statCards = [
    { label: 'Total Pesanan', value: stats.total, icon: ShoppingCart, color: 'blue', change: `+${stats.thisMonth} bulan ini` },
    { label: 'Pesanan Bulan Ini', value: stats.thisMonth, icon: TrendingUp, color: 'indigo', change: 'periode saat ini' },
    { label: 'Pendapatan', value: `Rp ${stats.revenue.toLocaleString('id-ID')}`, icon: CheckCircle, color: 'green', change: 'dari pesanan verified' },
    { label: 'Template Aktif', value: stats.activeTemplates, icon: LayoutTemplate, color: 'purple', change: 'tersedia di galeri' },
  ];

  const colorMap: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
    indigo: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400',
    green: 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400',
    purple: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
  };

  const paymentBadge: Record<string, string> = {
    verified: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700',
    unpaid: 'bg-red-100 text-red-700',
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Selamat datang di panel admin Undangan Online.</p>
        </div>
        <button onClick={fetchData} className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {statCards.map(({ label, value, icon: Icon, color, change }) => (
          <div key={label} className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{label}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{loading ? '—' : value}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{change}</p>
              </div>
              <div className={`p-3 rounded-xl ${colorMap[color]}`}>
                <Icon size={22} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="xl:col-span-2 bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-5">Pesanan per Bulan</h2>
          {loading ? (
            <div className="h-48 flex items-center justify-center text-gray-400">Memuat grafik...</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-100 dark:stroke-gray-800" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9ca3af' }} />
                <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: 12, color: '#f9fafb' }}
                  labelStyle={{ color: '#9ca3af' }}
                />
                <Bar dataKey="count" fill="#2563eb" radius={[6, 6, 0, 0]} name="Pesanan" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Quick Stats */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-5">Status Pembayaran</h2>
          <div className="space-y-4">
            {[
              { label: 'Verified', color: 'bg-green-500', key: 'verified' },
              { label: 'Pending', color: 'bg-yellow-500', key: 'pending' },
              { label: 'Unpaid', color: 'bg-red-500', key: 'unpaid' },
            ].map(({ label, color, key }) => {
              const count = recentOrders.filter(o => o.payment_status === key).length;
              const total = recentOrders.length || 1;
              const pct = Math.round((count / total) * 100);
              return (
                <div key={key}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400">{label}</span>
                    <span className="font-medium text-gray-900 dark:text-white">{count}</span>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 mt-6">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <h2 className="font-semibold text-gray-900 dark:text-white">5 Pesanan Terbaru</h2>
          <Link href="/admin/orders" className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1 font-medium">
            Lihat Semua <ArrowUpRight size={14} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wide">
                <th className="px-6 py-3 text-left font-medium">No. Pesanan</th>
                <th className="px-6 py-3 text-left font-medium">Pemesan</th>
                <th className="px-6 py-3 text-left font-medium">Template</th>
                <th className="px-6 py-3 text-left font-medium">Tanggal</th>
                <th className="px-6 py-3 text-left font-medium">Status</th>
                <th className="px-6 py-3 text-left font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-400">Memuat data...</td></tr>
              ) : recentOrders.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-400">Belum ada pesanan</td></tr>
              ) : recentOrders.map((order: any) => (
                <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4 font-mono font-medium text-gray-900 dark:text-white text-xs">{order.order_number}</td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900 dark:text-white">{order.customer_name}</p>
                    <p className="text-gray-400 text-xs">{order.customer_email}</p>
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{order.template?.name || '-'}</td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-xs">{formatIndonesianDate(order.created_at)}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium capitalize ${paymentBadge[order.payment_status]}`}>
                      {order.payment_status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Link href={`/admin/orders/${order.id}`} className="text-blue-600 hover:text-blue-800 text-xs font-medium">Detail →</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
