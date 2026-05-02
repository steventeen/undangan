import { AdminLayout } from '@/components/AdminLayout';

export default function AdminDashboardPage() {
  return (
    <AdminLayout>
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Dashboard Admin</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { label: 'Total Pesanan', value: '—', color: 'blue' },
            { label: 'Total Template', value: '—', color: 'purple' },
            { label: 'Pendapatan', value: '—', color: 'green' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
              <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
