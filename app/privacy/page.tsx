import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">
        <Link href="/" className="text-rose-500 hover:underline mb-8 inline-block font-medium">
          ← Kembali ke Beranda
        </Link>
        
        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-6">Kebijakan Privasi</h1>
        <p className="text-gray-500 mb-8">Terakhir diperbarui: {new Date().toLocaleDateString('id-ID')}</p>
        
        <div className="prose prose-rose max-w-none text-gray-700">
          <h2>1. Data yang Kami Kumpulkan</h2>
          <p>
            Kami mengumpulkan informasi pendaftaran (Email, Nama Lengkap), data transaksi pembayaran, serta aset digital yang Anda unggah (foto, teks) untuk kebutuhan pembuatan undangan.
          </p>

          <h2>2. Penggunaan Data</h2>
          <p>
            Data Anda hanya digunakan untuk fungsionalitas fitur di platform UndanganDigital. Kami tidak memperjualbelikan data tamu maupun data pengguna kepada pihak ketiga.
          </p>

          <h2>3. Cookies & Tracking</h2>
          <p>
            Kami menggunakan cookies wajib untuk sistem autentikasi (Supabase Auth) dan tracking analitik internal (Page Views RSVP tamu).
          </p>

          <h2>4. Hak Anda</h2>
          <p>
            Anda memiliki hak kapan saja untuk menghapus akun Anda dan seluruh data undangan yang terkait. Hubungi *support* kami untuk penghapusan data secara permanen.
          </p>

          <div className="mt-12 p-6 bg-rose-50 rounded-xl">
            <p className="m-0 text-sm">
              Jika Anda memiliki pertanyaan lebih lanjut mengenai privasi Anda, hubungi <a href="mailto:privacy@undangandigital.id" className="text-rose-600 font-medium">privacy@undangandigital.id</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
