'use client';

import { useEffect } from 'react';
import { useBuilderStore } from '@/lib/store';
import { supabase } from '@/lib/supabase.client';
import SettingsPanel from './SettingsPanel';
import VisualCanvas from './VisualCanvas';
import { Loader2, Save, ArrowLeft, ExternalLink, Sparkles } from 'lucide-react';
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
      <div className="w-full md:w-80 lg:w-[400px] bg-white border-r border-gray-200 flex flex-col h-[calc(100vh-60px)] md:h-screen shrink-0 relative z-20 shadow-[10px_0_40px_rgba(0,0,0,0.03)]">
        <div className="hidden md:flex items-center justify-between p-4 border-b border-gray-100 bg-white">
          <Link href="/dashboard/invitations" className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-rose-500 transition-colors uppercase tracking-widest">
            <ArrowLeft size={16} /> Dashboard
          </Link>
          <div className="flex items-center gap-2">
            {invitation.is_published && (
              <Link href={`/i/${invitation.slug}`} target="_blank" className="p-2 text-gray-400 hover:text-rose-500 transition-colors">
                <ExternalLink size={18} />
              </Link>
            )}
            <button 
              onClick={handleSave} 
              disabled={!hasChanges || isSaving}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                hasChanges 
                  ? 'bg-rose-500 text-white shadow-lg shadow-rose-200 hover:-translate-y-0.5' 
                  : 'bg-gray-100 text-gray-300 cursor-not-allowed'
              }`}
            >
              {isSaving ? <Loader2 size={14} className="animate-spin" /> : <><Save size={14} /> Save</>}
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto no-scrollbar">
          <SettingsPanel />
        </div>
      </div>

      {/* Preview Area (Visual Canvas) */}
      <div className="hidden md:flex flex-1 h-screen overflow-hidden">
        <VisualCanvas />
      </div>
    </>
  );
}
