'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, Upload, Banknote } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const [draft, setDraft] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [customer, setCustomer] = useState({ name: '', email: '', phone: '' });

  useEffect(() => {
    const draftData = localStorage.getItem('undangan_draft');
    if (!draftData) {
      router.push('/');
      return;
    }
    setDraft(JSON.parse(draftData));
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft || !customer.name || !customer.email || !customer.phone || !file) {
      alert('Mohon lengkapi semua data dan unggah bukti transfer.');
      return;
    }
    
    setLoading(true);
    try {
      // 1. Upload proof
      const formData = new FormData();
      formData.append('file', file);
      
      const uploadRes = await fetch('/api/upload-proof', { 
        method: 'POST', 
        body: formData 
      });
      
      if (!uploadRes.ok) throw new Error('Gagal mengunggah bukti pembayaran');
      const uploadData = await uploadRes.json();
      const proofUrl = uploadData.url;

      // 2. Submit order
      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId: draft.templateId,
          customer,
          eventData: draft.eventData,
          paymentProofUrl: proofUrl,
        }),
      });

      if (!orderRes.ok) {
        const errorData = await orderRes.json();
        throw new Error(errorData.error || 'Gagal membuat pesanan');
      }
      
      const orderData = await orderRes.json();

      // 3. Generate Invitation
      const generateRes = await fetch('/api/generate-invitation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: orderData.order.id
        })
      });

      if (!generateRes.ok) {
         // It might fail, but order is created. We can still proceed, but warn.
         console.warn('Generation failed, admin can regenerate later.');
      }

      localStorage.removeItem('undangan_draft');
      router.push(`/status?order=${orderData.order.order_number}`);
      
    } catch (error: any) {
      alert(error.message || 'Terjadi kesalahan. Silakan coba lagi.');
      setLoading(false);
    }
  };

  if (!draft) return <div className="p-12 text-center flex h-screen items-center justify-center">Memuat data...</div>;

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        
        <div className="bg-blue-600 p-8 text-white">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <CheckCircle className="text-white" size={32} /> Checkout
          </h1>
          <p className="text-blue-100">Selesaikan pembayaran untuk mengaktifkan undangan Anda.</p>
        </div>
        
        <div className="p-8">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl mb-8 border border-blue-100 dark:border-blue-800">
            <h3 className="font-semibold text-blue-900 dark:text-blue-300 text-lg mb-2">Ringkasan Pesanan</h3>
            <div className="flex justify-between items-center border-b border-blue-200 dark:border-blue-800/50 pb-3 mb-3">
              <span className="text-blue-800 dark:text-blue-200">Template {draft.template.name}</span>
              <span className="font-bold text-blue-900 dark:text-white text-lg">Rp {draft.template.price.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex items-start gap-4 pt-2">
              <div className="p-3 bg-white dark:bg-gray-800 rounded-xl text-blue-600 shadow-sm">
                <Banknote size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-900 dark:text-blue-300">Metode Pembayaran (Transfer Bank)</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">BCA 123-456-7890</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">a.n Admin Undangan Online</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-5">
              <h3 className="font-semibold text-gray-900 dark:text-white text-xl">Data Pemesan</h3>
              <div>
                <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Nama Lengkap</label>
                <input required type="text" value={customer.name} onChange={e => setCustomer({...customer, name: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors" placeholder="Masukkan nama Anda" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Email Lengkap</label>
                <input required type="email" value={customer.email} onChange={e => setCustomer({...customer, email: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors" placeholder="email@contoh.com" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Nomor WhatsApp</label>
                <input required type="text" value={customer.phone} onChange={e => setCustomer({...customer, phone: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors" placeholder="08123456789" />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 dark:text-white text-xl">Bukti Pembayaran</h3>
              <div className="flex items-center justify-center w-full">
                <label className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-2xl cursor-pointer transition-colors ${file ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10' : 'hover:bg-gray-50 dark:hover:bg-gray-800 border-gray-300 dark:border-gray-600'}`}>
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className={`w-10 h-10 mb-3 ${file ? 'text-blue-500' : 'text-gray-400'}`} />
                    {file ? (
                      <p className="text-sm text-blue-600 font-semibold">{file.name}</p>
                    ) : (
                      <>
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold text-blue-600">Klik untuk unggah</span> atau drag and drop</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG atau JPEG (Max. 2MB)</p>
                      </>
                    )}
                  </div>
                  <input required type="file" className="hidden" accept="image/png, image/jpeg, image/jpg" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                </label>
              </div>
            </div>

            <div className="pt-4">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-0.5"
              >
                {loading ? 'Memproses Pesanan...' : 'Konfirmasi Pemesanan'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
