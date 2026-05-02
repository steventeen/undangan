'use client';

import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { supabase } from '@/lib/supabase.client';
import { 
  Users, 
  ShoppingCart, 
  LayoutTemplate, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  TrendingUp,
  CreditCard
} from 'lucide-react';

interface Stats {
  totalTemplates: number;
  totalOrders: number;
  verifiedOrders: number;
  totalRevenue: number;
}

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  payment_status: string;
  created_at: string;
  total_price?: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats>({
    totalTemplates: 0,
    totalOrders: 0,
    verifiedOrders: 0,
    totalRevenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        // Fetch Stats
        const [templatesRes, ordersRes] = await Promise.all([
          supabase.from('templates').select('*', { count: 'exact', head: true }),
          supabase.from('orders').select('payment_status, price', { count: 'exact' }) // Note: check if price exists in orders or join templates
        ]);

        // Actually let's fetch orders with price
        const { data: ordersData } = await supabase
          .from('orders')
          .select('id, order_number, customer_name, payment_status, created_at, templates(price)');

        const totalTemplates = templatesRes.count || 0;
        const totalOrders = ordersData?.length || 0;
        const verifiedOrders = ordersData?.filter(o => o.payment_status === 'verified').length || 0;
        const totalRevenue = ordersData?.filter(o => o.payment_status === 'verified')
          .reduce((acc, o: any) => acc + (o.templates?.price || 0), 0) || 0;

        setStats({
          totalTemplates,
          totalOrders,
          verifiedOrders,
          totalRevenue,
        });

        // Recent Orders
        const formattedOrders = ordersData?.slice(0, 5).map((o: any) => ({
          id: o.id,
          order_number: o.order_number,
          customer_name: o.customer_name,
          payment_status: o.payment_status,
          created_at: o.created_at,
          total_price: o.templates?.price
        })) || [];

        setRecentOrders(formattedOrders);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  const statCards = [
    { 
      label: 'Total Templates', 
      value: stats.totalTemplates, 
      icon: LayoutTemplate, 
      color: 'blue',
      trend: '+12%' 
    },
    { 
      label: 'Total Pesanan', 
      value: stats.totalOrders, 
      icon: ShoppingCart, 
      color: 'purple',
      trend: '+5%' 
    },
    { 
      label: 'Pesanan Terverifikasi', 
      value: stats.verifiedOrders, 
      icon: CheckCircle2, 
      color: 'green',
      trend: '+18%' 
    },
    { 
      label: 'Total Pendapatan', 
      value: `Rp ${stats.totalRevenue.toLocaleString('id-ID')}`, 
      icon: CreditCard, 
      color: 'amber',
      trend: '+24%' 
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Ringkasan Statistik</h2>
          <p className="text-gray-500 text-sm mt-1">Pantau performa bisnis Anda secara real-time.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat) => (
            <div key={stat.label} className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className={`p-3 rounded-2xl bg-${stat.color}-50 dark:bg-${stat.color}-900/20`}>
                  <stat.icon className={`text-${stat.color}-600 dark:text-${stat.color}-400`} size={24} />
                </div>
                <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full flex items-center gap-1">
                  <TrendingUp size={12} /> {stat.trend}
                </span>
              </div>
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{loading ? '...' : stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Orders Section */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <h3 className="font-bold text-gray-900 dark:text-white">Pesanan Terbaru</h3>
            <button className="text-sm text-blue-600 font-medium hover:underline">Lihat Semua</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/50 text-left">
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tanggal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {loading ? (
                  [...Array(3)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={5} className="px-6 py-4"><div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-full"></div></td>
                    </tr>
                  ))
                ) : recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-400">Belum ada pesanan masuk.</td>
                  </tr>
                ) : (
                  recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">#{order.order_number}</td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{order.customer_name}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                          order.payment_status === 'verified' ? 'bg-green-100 text-green-700' :
                          order.payment_status === 'pending' ? 'bg-amber-100 text-amber-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {order.payment_status === 'verified' ? <CheckCircle2 size={12} /> : 
                           order.payment_status === 'pending' ? <Clock size={12} /> : 
                           <AlertCircle size={12} />}
                          {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                        Rp {order.total_price?.toLocaleString('id-ID')}
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-sm">
                        {new Date(order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
