import Link from 'next/link';

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-rose-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center">
        <h1 className="text-2xl font-serif font-bold text-gray-900 mb-2">Lupa Password?</h1>
        <p className="text-gray-500 mb-6 text-sm">
          Masukkan email yang terdaftar untuk mengatur ulang kata sandi Anda.
        </p>
        
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div className="text-left">
            <label className="label">Email</label>
            <input type="email" placeholder="kamu@email.com" className="input" required />
          </div>
          <button type="submit" className="btn btn-primary w-full">
            Kirim Link Reset
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-100">
          <Link href="/login" className="text-sm text-rose-500 hover:underline font-medium">
            Kembali ke Login
          </Link>
        </div>
      </div>
    </div>
  );
}
