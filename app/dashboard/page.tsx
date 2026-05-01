import { createServerSupabaseClient } from '@/lib/supabase.server';
import Link from 'next/link';
import { PlusCircle, Eye, Users, CheckCircle, FileText } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [{ data: profile }, { data: invitations }, { data: rsvpData }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user!.id).single(),
    supabase.from('invitations').select('id, title, slug, is_published, view_count, category, created_at').eq('user_id', user!.id).order('created_at', { ascending: false }).limit(5),
    supabase.from('rsvp').select('invitation_id, attendance').in(
      'invitation_id',
      (await supabase.from('invitations').select('id').eq('user_id', user!.id)).data?.map(i => i.id) || []
    ),
  ]);

  const totalViews = invitations?.reduce((sum, i) => sum + i.view_count, 0) || 0;
  const totalRsvp = rsvpData?.length || 0;
  const rsvpYes = rsvpData?.filter(r => r.attendance === 'yes').length || 0;

  const categoryEmoji: Record<string, string> = {
    wedding: '💍', birthday: '🎂', seminar: '📚', syukuran: '🙏', corporate: '🏢', memorial: '🕯️',
  };

  return (
    <div className="p-6 md:p-8 pt-16 md:pt-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-serif font-bold text-gray-900">
            Halo, {profile?.full_name?.split(' ')[0] || 'Teman'} 👋
          </h1>
          <p className="text-gray-500 text-sm mt-1">Kelola semua undangan digital Anda di sini.</p>
        </div>
        <Link href="/dashboard/invitations/new" className="btn btn-primary btn-sm hidden md:inline-flex">
          <PlusCircle size={16} />
          Buat Undangan
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Undangan', value: invitations?.length || 0, icon: FileText, color: 'rose' },
          { label: 'Total Views', value: totalViews, icon: Eye, color: 'blue' },
          { label: 'Total RSVP', value: totalRsvp, icon: Users, color: 'green' },
          { label: 'Hadir', value: rsvpYes, icon: CheckCircle, color: 'emerald' },
        ].map((stat) => (
          <div key={stat.label} className="card p-5">
            <div className="flex items-start justify-between mb-3">
              <p className="text-sm text-gray-500">{stat.label}</p>
              <div className={`w-8 h-8 rounded-lg bg-${stat.color}-50 flex items-center justify-center`}>
                <stat.icon size={16} className={`text-${stat.color}-500`} />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          { icon: '✨', title: 'Template Baru', desc: 'Pilih dari 75+ desain premium', href: '/dashboard/invitations/new', color: 'bg-rose-50 border-rose-100' },
          { icon: '🤖', title: 'AI Generator', desc: 'Buat teks & hashtag otomatis', href: '/dashboard/ai', color: 'bg-amber-50 border-amber-100' },
          { icon: '📊', title: 'Analytics', desc: 'Lihat statistik lengkap', href: '/dashboard/analytics', color: 'bg-blue-50 border-blue-100' },
        ].map((action) => (
          <Link key={action.title} href={action.href} className={`card border ${action.color} p-5 hover:-translate-y-1 transition-all duration-200`}>
            <div className="text-3xl mb-3">{action.icon}</div>
            <h3 className="font-semibold text-gray-900 text-sm">{action.title}</h3>
            <p className="text-gray-500 text-xs mt-1">{action.desc}</p>
          </Link>
        ))}
      </div>

      {/* Recent invitations */}
      <div className="card">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Undangan Terbaru</h2>
          <Link href="/dashboard/invitations" className="text-sm text-rose-500 hover:underline">Lihat semua →</Link>
        </div>
        {!invitations || invitations.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-4xl mb-3">💌</p>
            <p className="text-gray-500 text-sm mb-4">Belum ada undangan. Mulai buat sekarang!</p>
            <Link href="/dashboard/invitations/new" className="btn btn-primary btn-sm">
              <PlusCircle size={14} />
              Buat Pertama Kali
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {invitations.map((inv) => (
              <div key={inv.id} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{categoryEmoji[inv.category] || '📄'}</span>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{inv.title}</p>
                    <p className="text-xs text-gray-400">{formatDate(inv.created_at)} • {inv.view_count} views</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={inv.is_published ? 'badge badge-green' : 'badge badge-gray'}>
                    {inv.is_published ? 'Aktif' : 'Draft'}
                  </span>
                  <Link href={`/dashboard/invitations/${inv.id}/builder`} className="btn btn-secondary btn-sm text-xs">
                    Edit
                  </Link>
                  {inv.is_published && (
                    <Link href={`/i/${inv.slug}`} target="_blank" className="btn btn-ghost btn-sm text-xs">
                      <Eye size={12} />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
