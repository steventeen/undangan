'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { renderInvitation } from '@/lib/templateEngine';
import { PreviewRenderer } from '@/components/PreviewRenderer';
import { ArrowLeft, CreditCard } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

function PreviewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [renderedHtml, setRenderedHtml] = useState<string>('');
  const [cssCustom, setCssCustom] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPreview() {
      const templateId = searchParams.get('templateId');
      const dataString = searchParams.get('data');
      
      if (!templateId || !dataString) {
        // Fallback to localStorage if searchParams are missing
        const draftData = localStorage.getItem('undangan_draft');
        if (!draftData) {
          router.push('/');
          return;
        }
        try {
          const parsed = JSON.parse(draftData);
          if (parsed.template && parsed.eventData) {
            const html = renderInvitation(parsed.template.html_template, parsed.eventData);
            setRenderedHtml(html);
            setCssCustom(parsed.template.css_custom || '');
          }
        } catch (e) {
          router.push('/');
        }
        setLoading(false);
        return;
      }

      try {
        const eventData = JSON.parse(decodeURIComponent(dataString));
        
        // Fetch template
        const { data: template } = await supabase
          .from('templates')
          .select('html_template, css_custom')
          .eq('id', templateId)
          .single();
          
        if (template) {
          const html = renderInvitation(template.html_template, eventData);
          setRenderedHtml(html);
          setCssCustom(template.css_custom || '');
        } else {
          router.push('/');
        }
      } catch (e) {
        router.push('/');
      }
      setLoading(false);
    }
    
    loadPreview();
  }, [router, searchParams]);

  if (loading) return <div className="p-12 text-center flex h-screen items-center justify-center">Memuat preview...</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl h-[calc(100vh-80px)] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft size={20} /> Kembali
        </button>
        <button 
          onClick={() => router.push('/checkout')}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-semibold shadow-md transition-transform hover:-translate-y-0.5"
        >
          Lanjut Checkout <CreditCard size={18} />
        </button>
      </div>
      
      <div className="flex-1 bg-gray-200 dark:bg-gray-800 rounded-3xl overflow-hidden shadow-inner flex justify-center p-6">
        <div className="w-full max-w-[500px] h-full shadow-2xl rounded-2xl overflow-hidden bg-white">
          <PreviewRenderer html={renderedHtml} cssCustom={cssCustom} />
        </div>
      </div>
    </div>
  );
}

export default function PreviewPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center flex h-screen items-center justify-center">Memuat antarmuka...</div>}>
      <PreviewContent />
    </Suspense>
  );
}
