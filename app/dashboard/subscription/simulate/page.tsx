'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CreditCard, CheckCircle2, Loader2, ArrowRight, ShieldCheck } from 'lucide-react';

function SimulationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('order_id');
  const plan = searchParams.get('plan');
  
  const [status, setStatus] = useState<'idle' | 'processing' | 'success'>('idle');

  const handlePay = async () => {
    setStatus('processing');
    
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Redirect to mock webhook
    router.push(`/api/payment/webhook?mock_success=true&order_id=${orderId}`);
  };

  if (!orderId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="card max-w-md w-full p-8 text-center">
          <p className="text-red-500 font-medium">Order ID tidak ditemukan.</p>
          <button onClick={() => router.push('/dashboard/subscription')} className="btn btn-primary mt-4 w-full">Kembali</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white mx-auto shadow-lg shadow-blue-200 mb-4">
            <CreditCard size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Simulasi Pembayaran</h1>
          <p className="text-gray-500 text-sm mt-1">Anda berada di lingkungan simulasi testing.</p>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
          <div className="p-6 border-b border-gray-50 bg-gray-50/50">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Detail Pesanan</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700">TESTING MODE</span>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Paket</span>
                <span className="font-bold text-gray-900 uppercase">{plan || 'PRO'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Order ID</span>
                <span className="font-mono text-gray-900">{orderId}</span>
              </div>
            </div>
          </div>

          <div className="p-8">
            {status === 'idle' && (
              <div className="space-y-6">
                <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex gap-3">
                  <ShieldCheck className="text-blue-600 shrink-0" size={20} />
                  <p className="text-xs text-blue-800 leading-relaxed">
                    Ini adalah simulator pembayaran. Menekan tombol di bawah akan mengaktifkan paket Anda secara otomatis untuk keperluan testing.
                  </p>
                </div>
                
                <button 
                  onClick={handlePay}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-blue-200 transition-all hover:-translate-y-0.5 active:translate-y-0"
                >
                  Bayar Sekarang <ArrowRight size={18} />
                </button>
                
                <button 
                  onClick={() => router.push('/dashboard/subscription')}
                  className="w-full text-gray-400 text-sm font-medium hover:text-gray-600 transition-colors"
                >
                  Batalkan Pembayaran
                </button>
              </div>
            )}

            {status === 'processing' && (
              <div className="text-center py-10 space-y-4">
                <Loader2 className="animate-spin text-blue-600 mx-auto" size={48} />
                <p className="font-medium text-gray-900">Memproses Pembayaran...</p>
                <p className="text-sm text-gray-500">Jangan tutup halaman ini.</p>
              </div>
            )}

            {status === 'success' && (
              <div className="text-center py-10 space-y-4 animate-scale-in">
                <CheckCircle2 className="text-green-500 mx-auto" size={48} />
                <p className="font-bold text-xl text-gray-900">Pembayaran Berhasil!</p>
                <p className="text-sm text-gray-500">Mengalihkan Anda kembali ke dashboard...</p>
              </div>
            )}
          </div>
        </div>
        
        <p className="text-center text-[10px] text-gray-400 mt-8 uppercase tracking-[0.2em]">
          Securely Processed by Internal Sandbox
        </p>
      </div>
    </div>
  );
}

export default function SubscriptionSimulatePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-rose-500" /></div>}>
      <SimulationContent />
    </Suspense>
  );
}
