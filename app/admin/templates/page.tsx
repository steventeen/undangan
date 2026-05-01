'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { RefreshCw, Plus, Pencil, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';

export default function AdminTemplates() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTemplates = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/templates');
    if (res.ok) {
      const data = await res.json();
      setTemplates(data.templates);
    }
    setLoading(false);
  };

  useEffect(() => { fetchTemplates(); }, []);

  const deleteTemplate = async (id: string, name: string) => {
    if (!confirm(`Hapus template "${name}" secara permanen?`)) return;
    await fetch(`/api/admin/templates/${id}`, { method: 'DELETE' });
    fetchTemplates();
  };

  const toggleActive = async (id: string, current: boolean) => {
    await fetch(`/api/admin/templates/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: !current }),
    });
    fetchTemplates();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manajemen Template</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{templates.length} template terdaftar</p>
        </div>
        <div className="flex gap-3">
          <button onClick={fetchTemplates} className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
          <Link href="/admin/templates/add" className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm">
            <Plus size={18} /> Tambah Template
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {loading ? (
          [1,2,3,4].map(i => (
            <div key={i} className="animate-pulse bg-gray-100 dark:bg-gray-800 rounded-2xl h-72" />
          ))
        ) : templates.length === 0 ? (
          <div className="col-span-full text-center py-16 text-gray-400">
            <p className="text-lg">Belum ada template.</p>
            <Link href="/admin/templates/add" className="mt-3 inline-block text-blue-600 hover:underline text-sm">+ Tambah template pertama</Link>
          </div>
        ) : templates.map(template => (
          <div key={template.id} className={`bg-white dark:bg-gray-900 rounded-2xl shadow-sm border overflow-hidden transition-all hover:-translate-y-1 hover:shadow-md ${template.is_active ? 'border-gray-100 dark:border-gray-800' : 'border-red-200 dark:border-red-900/30 opacity-70'}`}>
            {/* Thumbnail */}
            <div className="aspect-[3/4] bg-gray-100 dark:bg-gray-800 relative overflow-hidden">
              {template.thumbnail_url ? (
                <img src={template.thumbnail_url} alt={template.name} className="w-full h-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <span className="text-gray-400 text-sm">No Preview</span>
                </div>
              )}
              {/* Status Badge */}
              <div className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-semibold ${template.is_active ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}`}>
                {template.is_active ? 'Aktif' : 'Nonaktif'}
              </div>
            </div>

            {/* Info */}
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate">{template.name}</h3>
              <p className="text-xs text-gray-500 mt-0.5 mb-2">{template.category}</p>
              <p className="font-bold text-gray-900 dark:text-white">Rp {template.price.toLocaleString('id-ID')}</p>

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                <button onClick={() => toggleActive(template.id, template.is_active)} className="text-gray-400 hover:text-blue-600 transition-colors" title={template.is_active ? 'Nonaktifkan' : 'Aktifkan'}>
                  {template.is_active ? <ToggleRight size={22} className="text-blue-600" /> : <ToggleLeft size={22} />}
                </button>
                <div className="flex gap-3">
                  <Link href={`/admin/templates/edit/${template.id}`} className="text-blue-500 hover:text-blue-700 transition-colors" title="Edit">
                    <Pencil size={16} />
                  </Link>
                  <button onClick={() => deleteTemplate(template.id, template.name)} className="text-red-400 hover:text-red-600 transition-colors" title="Hapus">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
