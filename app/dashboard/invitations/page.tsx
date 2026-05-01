import { createServerSupabaseClient } from '@/lib/supabase.server';
import Link from 'next/link';
import { PlusCircle, Eye, Edit, Trash2, Globe, Lock } from 'lucide-react';
import { formatDate } from '@/lib/utils';

const categoryEmoji: Record<string, string> = {
  wedding: '💍', birthday: '🎂', seminar: '📚', syukuran: '🙏', corporate: '🏢', memorial: '🕯️',
};

export default async function InvitationsPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: invitations } = await supabase
    .from('invitations')
    .select('*')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false });

  return (
    <div className="p-6 md:p-8 pt-16 md:pt-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-serif font-bold text-gray-900">Undangan Saya</h1>
          <p className="text-gray-500 text-sm mt-1">{invitations?.length || 0} undangan dibuat</p>
        </div>
        <Link href="/dashboard/invitations/new" className="btn btn-primary btn-sm">
          <PlusCircle size={16} />
          Buat Baru
        </Link>
      </div>

      {!invitations || invitations.length === 0 ? (
        <div className="card p-16 text-center">
          <p className="text-5xl mb-4">💌</p>
          <h2 className="text-xl font-serif font-bold text-gray-900 mb-2">Belum ada undangan</h2>
          <p className="text-gray-500 text-sm mb-6">Buat undangan pertama Anda dengan template premium kami.</p>
          <Link href="/dashboard/invitations/new" className="btn btn-primary">
            <PlusCircle size={16} />
            Mulai Buat
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {invitations.map((inv) => (
            <div key={inv.id} className="card overflow-hidden hover:shadow-md transition-all duration-200">
              {/* Thumbnail */}
              <div className="h-36 bg-gradient-to-br from-rose-100 to-pink-50 flex items-center justify-center relative">
                <span className="text-5xl">{categoryEmoji[inv.category] || '📄'}</span>
                <div className="absolute top-3 right-3">
                  <span className={inv.is_published ? 'badge badge-green' : 'badge badge-gray'}>
                    {inv.is_published ? <Globe size={10} /> : <Lock size={10} />}
                    {inv.is_published ? 'Aktif' : 'Draft'}
                  </span>
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1 truncate">{inv.title}</h3>
                <p className="text-xs text-gray-400 mb-3">
                  {formatDate(inv.created_at)} • {inv.view_count} views
                </p>

                <div className="flex items-center gap-2">
                  <Link href={`/dashboard/invitations/${inv.id}/builder`} className="btn btn-secondary btn-sm flex-1 text-xs justify-center">
                    <Edit size={12} />
                    Edit
                  </Link>
                  {inv.is_published && (
                    <Link href={`/i/${inv.slug}`} target="_blank" className="btn btn-ghost btn-sm text-xs">
                      <Eye size={14} />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Add new card */}
          <Link
            href="/dashboard/invitations/new"
            className="card border-2 border-dashed border-gray-200 hover:border-rose-300 hover:bg-rose-50 transition-all duration-200 flex items-center justify-center h-52 text-gray-400 hover:text-rose-500"
          >
            <div className="text-center">
              <PlusCircle size={32} className="mx-auto mb-2" />
              <p className="text-sm font-medium">Buat Undangan Baru</p>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}
