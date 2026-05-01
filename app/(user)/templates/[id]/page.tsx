'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Template, EventData } from '@/types';
import { Eye, CreditCard } from 'lucide-react';
import { renderInvitation } from '@/lib/templateEngine';
import { PreviewRenderer } from '@/components/PreviewRenderer';
import { use } from 'react';

// Custom hook for debouncing value
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function TemplateDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [template, setTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);

  const [eventData, setEventData] = useState<Record<string, any>>({});

  const debouncedEventData = useDebounce(eventData, 300);

  useEffect(() => {
    async function fetchTemplate() {
      const { data } = await supabase
        .from('templates')
        .select('*')
        .eq('id', id)
        .single();
      
      if (data) {
        setTemplate(data);
        // Initialize eventData with keys from fields_config
        const initialData: Record<string, any> = {};
        (data.fields_config || []).forEach((field: any) => {
          initialData[field.name] = '';
        });
        
        // Load from draft if exists
        const draft = localStorage.getItem('undangan_draft');
        if (draft) {
          try {
            const parsed = JSON.parse(draft);
            if (parsed.templateId === id) {
              setEventData({ ...initialData, ...parsed.eventData });
            } else {
              setEventData(initialData);
            }
          } catch {
            setEventData(initialData);
          }
        } else {
          setEventData(initialData);
        }
      }
      setLoading(false);
    }
    fetchTemplate();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEventData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
// ... (rest of logic remains similar, but form rendering changes)

  const saveDraft = () => {
    localStorage.setItem('undangan_draft', JSON.stringify({ templateId: id, eventData, template }));
  };

  const handleCheckout = () => {
    saveDraft();
    router.push('/checkout');
  };

  const handlePreviewFullscreen = () => {
    saveDraft();
    const encodedData = encodeURIComponent(JSON.stringify(eventData));
    router.push(`/preview?templateId=${id}&data=${encodedData}`);
  };

  if (loading) return <div className="p-12 text-center h-screen flex items-center justify-center">Memuat template...</div>;
  if (!template) return <div className="p-12 text-center text-red-500 h-screen flex items-center justify-center">Template tidak ditemukan.</div>;

  const realTimeHtml = renderInvitation(template.html_template, debouncedEventData);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Panel */}
        <div className="lg:col-span-5 flex flex-col gap-6 h-[calc(100vh-120px)] overflow-y-auto pr-2 custom-scrollbar">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{template.name}</h1>
            <div className="flex justify-between items-center mb-4">
              <span className="text-blue-600 font-medium">{template.category}</span>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                Rp {template.price.toLocaleString('id-ID')}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Isi data acara di bawah. Tampilan di sebelah kanan akan berubah otomatis sesuai data yang Anda masukkan.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Data Acara</h2>
            <div className="space-y-4">
              {(template.fields_config || []).map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{field.label}</label>
                  {field.type === 'textarea' ? (
                    <textarea
                      name={field.name}
                      value={eventData[field.name] || ''}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder={field.placeholder}
                    />
                  ) : (
                    <input
                      type={field.type}
                      name={field.name}
                      value={eventData[field.name] || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder={field.placeholder}
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3 mt-8">
              <button onClick={handlePreviewFullscreen} className="w-full flex justify-center items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white px-4 py-3 rounded-xl font-medium transition-colors">
                <Eye size={20} /> Preview Layar Penuh
              </button>
              <button onClick={handleCheckout} className="w-full flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl font-medium shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5">
                <CreditCard size={20} /> Lanjutkan ke Checkout
              </button>
            </div>
          </div>
        </div>

        {/* Realtime Preview Panel */}
        <div className="lg:col-span-7 bg-gray-200 dark:bg-gray-800 rounded-3xl p-4 shadow-inner flex flex-col items-center justify-center h-[calc(100vh-120px)] sticky top-24 overflow-hidden">
          <div className="w-full max-w-[420px] h-full shadow-2xl rounded-2xl overflow-hidden bg-white relative ring-8 ring-gray-100 dark:ring-gray-700">
            <div className="absolute top-0 w-full h-6 bg-black flex justify-center items-center z-10">
              <div className="w-1/3 h-4 bg-black rounded-b-xl"></div>
            </div>
            <div className="w-full h-full pt-6">
              <PreviewRenderer html={realTimeHtml} cssCustom={template.css_custom || ''} />
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(156,163,175,0.4); border-radius: 10px; }
      `}} />
    </div>
  );
}
