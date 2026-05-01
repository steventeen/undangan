'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { TemplateCard } from '@/components/TemplateCard';
import { Template } from '@/types';
import { Search } from 'lucide-react';

export default function HomePage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  useEffect(() => {
    async function fetchTemplates() {
      const { data, error } = await supabase
        .from('templates')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (data) {
        setTemplates(data as Template[]);
      }
      setLoading(false);
    }
    fetchTemplates();
  }, []);

  const categories = ['all', ...Array.from(new Set(templates.map(t => t.category)))];

  const filteredTemplates = templates.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'all' || t.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight">
            Buat Undangan Digital <span className="text-blue-600 dark:text-blue-400">Elegan & Modern</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Pilih dari berbagai desain premium kami dan bagikan momen bahagia Anda dengan mudah, cepat, dan praktis tanpa ribet.
          </p>
          <div className="flex justify-center gap-4">
            <button onClick={() => document.getElementById('templates')?.scrollIntoView({ behavior: 'smooth' })} className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
              Lihat Desain
            </button>
          </div>
        </div>
      </div>

      {/* Gallery Section */}
      <div id="templates" className="container mx-auto px-4 py-16 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Galeri Template</h2>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            {/* Search */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Cari template..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            {/* Category Filter */}
            <select 
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
              className="w-full sm:w-auto px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
            >
              {categories.map(c => (
                <option key={c} value={c}>{c === 'all' ? 'Semua Kategori' : c.charAt(0).toUpperCase() + c.slice(1)}</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[1,2,3,4].map(i => (
              <div key={i} className="animate-pulse bg-gray-200 dark:bg-gray-800 h-96 rounded-xl"></div>
            ))}
          </div>
        ) : filteredTemplates.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {filteredTemplates.map((template) => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-500">
            <p className="text-xl">Template tidak ditemukan.</p>
          </div>
        )}
      </div>
    </div>
  );
}
