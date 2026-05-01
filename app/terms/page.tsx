import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">
        <Link href="/" className="text-rose-500 hover:underline mb-8 inline-block font-medium">
          ← Kembali ke Beranda
        </Link>
        
        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-6">Syarat & Ketentuan</h1>
        <p className="text-gray-500 mb-8">Terakhir diperbarui: {new Date().toLocaleDateString('id-ID')}</p>
        
        <div className="prose prose-rose max-w-none text-gray-700">
          <h2>1. Penerimaan Syarat</h2>
          <p>
            Dengan mendaftar dan menggunakan layanan UndanganDigital, Anda menyetujui seluruh Syarat dan Ketentuan yang berlaku.
          </p>

          <h2>2. Penggunaan Layanan</h2>
          <p>
            Layanan ini diperuntukkan bagi pembuatan undangan digital secara legal. Pengguna dilarang mengunggah konten yang melanggar hak cipta, asusila, atau merugikan pihak lain.
          </p>

          <h2>3. Pembayaran & Langganan</h2>
          <p>
            Paket berlangganan (Pro/Premium) bersifat *non-refundable* (tidak dapat dikembalikan). Semua transaksi menggunakan *payment gateway* pihak ketiga (Midtrans) dan dijamin keamanannya.
          </p>

          <h2>4. Batasan Tanggung Jawab</h2>
          <p>
            UndanganDigital tidak bertanggung jawab atas kerugian materiil akibat kesalahan penginputan data undangan oleh pengguna.
          </p>

          <div className="mt-12 p-6 bg-rose-50 rounded-xl">
            <p className="m-0 text-sm">
              Jika Anda memiliki pertanyaan lebih lanjut, hubungi kami di <a href="mailto:support@undangandigital.id" className="text-rose-600 font-medium">support@undangandigital.id</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
