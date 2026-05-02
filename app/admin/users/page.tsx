'use client';

import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { 
  Users, 
  Search, 
  Mail, 
  Calendar, 
  ChevronRight, 
  ShieldCheck, 
  UserPlus,
  ArrowUpDown,
  Filter
} from 'lucide-react';

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  plan: string;
  invitation_quota: number;
  ai_credits: number;
  created_at: string;
  last_sign_in_at?: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch('/api/admin/users');
        const data = await res.json();
        if (Array.isArray(data)) {
          setUsers(data);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => 
    user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getPlanBadge = (plan: string) => {
    switch (plan) {
      case 'premium':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-700 border border-amber-200 uppercase">Premium</span>;
      case 'pro':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-700 border border-rose-200 uppercase">Pro</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-700 border border-gray-200 uppercase">Free</span>;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Users className="text-blue-600" /> Manajemen Pengguna
            </h2>
            <p className="text-gray-500 text-sm mt-1">Kelola dan pantau semua pengguna yang terdaftar di platform.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Cari nama atau email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 w-full md:w-64 transition-all"
              />
            </div>
            <button className="p-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-gray-500 hover:text-gray-700 transition-colors">
              <Filter size={18} />
            </button>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Pengguna</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{loading ? '...' : users.length}</p>
          </div>
          <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <p className="text-sm text-gray-500 dark:text-gray-400">Pengguna Pro/Premium</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {loading ? '...' : users.filter(u => u.plan !== 'free').length}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <p className="text-sm text-gray-500 dark:text-gray-400">Pendaftaran Baru (Bulan Ini)</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {loading ? '...' : users.filter(u => {
                const date = new Date(u.created_at);
                const now = new Date();
                return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
              }).length}
            </p>
          </div>
        </div>

        {/* Table Content */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center gap-2">Nama & Email <ArrowUpDown size={12} /></div>
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Paket</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Kuota / AI</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Tgl Bergabung</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={6} className="px-6 py-4">
                        <div className="h-10 bg-gray-100 dark:bg-gray-800 rounded-xl w-full"></div>
                      </td>
                    </tr>
                  ))
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-400">Tidak ada pengguna ditemukan.</td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center font-bold text-sm">
                            {user.full_name?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 dark:text-white text-sm">{user.full_name || 'Tanpa Nama'}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
                              <Mail size={12} /> {user.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getPlanBadge(user.plan)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs">
                          <p className="text-gray-700 dark:text-gray-300 font-medium">Undangan: {user.invitation_quota === -1 ? '∞' : user.invitation_quota}</p>
                          <p className="text-gray-500 mt-0.5">AI: {user.ai_credits}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={14} />
                          {new Date(user.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {user.last_sign_in_at ? (
                          <span className="flex items-center gap-1.5 text-xs text-green-600 font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Aktif
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 text-xs text-gray-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span> Belum Login
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors opacity-0 group-hover:opacity-100">
                          <ChevronRight size={18} />
                        </button>
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
