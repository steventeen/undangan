'use client';

import { useEffect } from 'react';
import { useBuilderStore } from '@/lib/store';
import { supabase } from '@/lib/supabase.client';
import SettingsPanel from './SettingsPanel';
import PreviewPanel from './PreviewPanel';
import { Loader2, Save, ArrowLeft, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import type { Invitation } from '@/types';
import { useRouter } from 'next/navigation';

export default function BuilderClient({ initialData }: { initialData: Invitation }) {
  const router = useRouter();
  const { invitation, setInvitation, isSaving, setSaving, hasChanges } = useBuilderStore();

  useEffect(() => {
    setInvitation(initialData);
  }, [initialData, setInvitation]);

  async function handleSave() {
    if (!invitation) return;
    setSaving(true);
    
    const { error } = await supabase
      .from('invitations')
      .update({
        title: invitation.title,
        sections: invitation.sections,
        settings: invitation.settings,
        is_published: invitation.is_published,
      })
      .eq('id', invitation.id);
      
    if (error) {
      alert('Gagal menyimpan: ' + error.message);
    }
    
    setSaving(false);
  }

  if (!invitation) {
    return <div className="flex-1 flex items-center justify-center"><Loader2 className="animate-spin text-rose-500" /></div>;
  }

  return (
    <>
      {/* Mobile Header (visible only on small screens) */}
      <div className="md:hidden flex items-center justify-between bg-white border-b border-gray-200 p-4 shrink-0">
        <Link href="/dashboard/invitations" className="text-gray-500">
          <ArrowLeft size={20} />
        </Link>
        <span className="font-medium text-sm truncate max-w-[200px]">{invitation.title}</span>
        <button 
          onClick={handleSave} 
          disabled={!hasChanges || isSaving}
          className={`btn btn-sm ${hasChanges ? 'btn-primary' : 'bg-gray-100 text-gray-400'}`}
        >
          {isSaving ? <Loader2 size={14} className="animate-spin" /> : 'Simpan'}
        </button>
      </div>

      {/* Desktop Sidebar (Settings Panel) */}
      <div className="w-full md:w-80 lg:w-96 bg-white border-r border-gray-200 flex flex-col h-[calc(100vh-60px)] md:h-screen shrink-0 relative z-10 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <div className="hidden md:flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/50">
          <Link href="/dashboard/invitations" className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-rose-600 transition-colors">
            <ArrowLeft size={16} /> Kembali
          </Link>
          <div className="flex items-center gap-2">
            {invitation.is_published && (
              <Link href={`/i/${invitation.slug}`} target="_blank" className="btn btn-ghost btn-sm text-gray-500 hover:text-rose-600 px-2">
                <ExternalLink size={16} />
              </Link>
            )}
            <button 
              onClick={handleSave} 
              disabled={!hasChanges || isSaving}
              className={`btn btn-sm ${hasChanges ? 'btn-primary shadow-rose-200/50' : 'bg-gray-100 text-gray-400'}`}
            >
              {isSaving ? <Loader2 size={14} className="animate-spin" /> : <><Save size={14} /> Simpan</>}
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto no-scrollbar">
          <SettingsPanel />
        </div>
      </div>

      {/* Preview Area */}
      <div className="hidden md:flex flex-1 bg-gray-100/80 items-center justify-center p-4 lg:p-8 relative overflow-hidden">
        {/* Background decorative pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        
        <PreviewPanel />
      </div>
    </>
  );
}
