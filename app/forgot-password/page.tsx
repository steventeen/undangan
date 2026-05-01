'use client';

import Link from 'next/link';
import { useState } from 'react';
import { supabase } from '@/lib/supabase.client';
import { Loader2, CheckCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setError('Gagal mengirim email. Pastikan email Anda benar.');
    } else {
      setSent(true);
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-rose-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center">

        {sent ? (
          <>
            <div className="flex justify-center mb-4">
              <CheckCircle size={48} className="text-green-500" />
            </div>
            <h1 className="text-2xl font-serif font-bold text-gray-900 mb-2">Email Terkirim!</h1>
            <p className="text-gray-500 text-sm mb-6">
              Link reset password telah dikirim ke <strong>{email}</strong>. Silakan cek kotak masuk atau folder spam Anda.
            </p>
            <Link href="/login" className="btn btn-primary">
              Kembali ke Login
            </Link>
          </>
        ) : (
          <>
            <div className="text-4xl mb-4">🔑</div>
            <h1 className="text-2xl font-serif font-bold text-gray-900 mb-2">Lupa Password?</h1>
            <p className="text-gray-500 mb-6 text-sm">
              Masukkan email yang terdaftar untuk mengatur ulang kata sandi Anda.
            </p>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600 mb-4 text-left">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="text-left">
                <label className="label">Alamat Email</label>
                <input
                  type="email"
                  placeholder="kamu@email.com"
                  className="input"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <button type="submit" disabled={loading} className="btn btn-primary w-full">
                {loading ? <Loader2 size={16} className="animate-spin" /> : null}
                {loading ? 'Mengirim...' : 'Kirim Link Reset'}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-100">
              <Link href="/login" className="text-sm text-rose-500 hover:underline font-medium">
                ← Kembali ke Login
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
