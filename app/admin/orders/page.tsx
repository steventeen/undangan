import { AdminLayout } from '@/components/AdminLayout';

export default function AdminOrdersPage() {
  return (
    <AdminLayout>
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Pesanan</h2>
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-8 text-center">
          <p className="text-gray-400">Belum ada data pesanan.</p>
        </div>
      </div>
    </AdminLayout>
  );
}
