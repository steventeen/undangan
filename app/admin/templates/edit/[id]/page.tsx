'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Eye } from 'lucide-react';
import { PreviewRenderer } from '@/components/PreviewRenderer';
import { renderInvitation } from '@/lib/templateEngine';
import { use } from 'react';

const SAMPLE_DATA = {
  groom_name: 'Budi',
  bride_name: 'Sari',
  event_date: '2026-12-20',
  event_time: '10:00 WIB - Selesai',
  venue: 'Gedung Serbaguna Jakarta',
  maps_link: '#',
  story: 'Kisah cinta kami dimulai pada 2020...',
  whatsapp_number: '628123456789',
};

export default function TemplateEdit({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const isNew = id === 'new';
  const router = useRouter();

  const [form, setForm] = useState({
    name: '',
    category: 'classic',
    price: 0,
    is_active: true,
    html_template: '',
    css_custom: '',
    thumbnail_url: '',
  });
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(true);

  useEffect(() => {
    if (isNew) return;
    async function fetchTemplate() {
      const res = await fetch('/api/admin/templates');
      if (res.ok) {
        const { templates } = await res.json();
        const t = templates.find((t: any) => t.id === id);
        if (t) {
          setForm({
            name: t.name,
            category: t.category,
            price: t.price,
            is_active: t.is_active,
            html_template: t.html_template,
            css_custom: t.css_custom || '',
            thumbnail_url: t.thumbnail_url || '',
          });
        }
      }
      setLoading(false);
    }
    fetchTemplate();
  }, [id, isNew]);

  const handleSave = async () => {
    if (!form.name || !form.html_template) {
      alert('Nama dan HTML Template wajib diisi.');
      return;
    }
    setSaving(true);
    const url = isNew ? '/api/admin/templates' : `/api/admin/templates/${id}`;
    const method = isNew ? 'POST' : 'PUT';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      alert(isNew ? 'Template berhasil ditambahkan!' : 'Template berhasil diperbarui!');
      router.push('/admin/templates');
    } else {
      const err = await res.json();
      alert(`Gagal: ${err.error}`);
    }
    setSaving(false);
  };

  const previewHtml = renderInvitation(form.html_template, SAMPLE_DATA);

  if (loading) return <div className="flex h-64 items-center justify-center text-gray-400">Memuat template...</div>;

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => router.back()} className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
          <ArrowLeft size={20} className="text-gray-600 dark:text-gray-300" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isNew ? 'Tambah Template Baru' : 'Edit Template'}
          </h1>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <Eye size={16} /> {showPreview ? 'Sembunyikan' : 'Preview'}
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors disabled:opacity-70 shadow-sm"
          >
            <Save size={16} /> {saving ? 'Menyimpan...' : 'Simpan'}
          </button>
        </div>
      </div>

      <div className={`grid gap-6 ${showPreview ? 'grid-cols-1 xl:grid-cols-2' : 'grid-cols-1 max-w-3xl'}`}>
        {/* Form */}
        <div className="space-y-5">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Informasi Template</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Nama Template *</label>
                <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Classic Elegance" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Kategori</label>
                  <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white">
                    <option value="classic">Classic</option>
                    <option value="modern">Modern</option>
                    <option value="rustic">Rustic</option>
                    <option value="premium">Premium</option>
                    <option value="minimalist">Minimalist</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Harga (Rp)</label>
                  <input type="number" value={form.price} onChange={e => setForm({...form, price: parseInt(e.target.value) || 0})} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Thumbnail</label>
                <div className="flex items-center gap-4">
                  {form.thumbnail_url && (
                    <img src={form.thumbnail_url} alt="Thumbnail" className="w-20 h-20 object-cover rounded-lg border border-gray-200" />
                  )}
                  <div className="flex-1">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        
                        const uploadFormData = new FormData();
                        uploadFormData.append('file', file);
                        
                        try {
                          const res = await fetch('/api/admin/upload-thumbnail', {
                            method: 'POST',
                            body: uploadFormData
                          });
                          const data = await res.json();
                          if (data.url) setForm({...form, thumbnail_url: data.url});
                          else alert(data.error || 'Gagal upload');
                        } catch (err) {
                          alert('Terjadi kesalahan saat upload');
                        }
                      }}
                      className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" 
                    />
                    <p className="text-xs text-gray-400 mt-1">Saran ukuran: 600x800px (3:4)</p>
                  </div>
                </div>
                <input 
                  type="url" 
                  value={form.thumbnail_url} 
                  onChange={e => setForm({...form, thumbnail_url: e.target.value})} 
                  placeholder="Atau masukkan URL gambar langsung..." 
                  className="w-full px-4 py-2.5 mt-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white" 
                />
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="isActive" checked={form.is_active} onChange={e => setForm({...form, is_active: e.target.checked})} className="w-4 h-4 rounded accent-blue-600 cursor-pointer" />
                <label htmlFor="isActive" className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer">Template Aktif (tampil di galeri)</label>
              </div>
            </div>
          </div>

          {/* HTML Editor */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-gray-900 dark:text-white">HTML Template *</h2>
              <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-lg font-mono">
                {'{{nama_pria}}, {{nama_wanita}}, {{tanggal}}, ...'}
              </span>
            </div>
            <textarea
              value={form.html_template}
              onChange={e => setForm({...form, html_template: e.target.value})}
              rows={16}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-950 text-green-400 text-xs font-mono focus:ring-2 focus:ring-blue-500 outline-none resize-y"
              placeholder="<div class='classic-wedding-container'>&#10;  <h1>{{nama_pria}} &amp; {{nama_wanita}}</h1>&#10;  ..."
              spellCheck={false}
            />
          </div>

          {/* CSS Editor */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-3">CSS Kustom (Opsional)</h2>
            <textarea
              value={form.css_custom}
              onChange={e => setForm({...form, css_custom: e.target.value})}
              rows={8}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-950 text-blue-300 text-xs font-mono focus:ring-2 focus:ring-blue-500 outline-none resize-y"
              placeholder="/* CSS kustom tambahan */"
              spellCheck={false}
            />
          </div>
        </div>

        {/* Live Preview */}
        {showPreview && (
          <div className="xl:sticky xl:top-6 h-fit">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-4">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <Eye size={16} /> Preview (dengan data contoh)
              </p>
              <div className="bg-gray-200 dark:bg-gray-800 rounded-xl overflow-hidden" style={{ height: '600px' }}>
                <PreviewRenderer html={previewHtml} cssCustom={form.css_custom} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
