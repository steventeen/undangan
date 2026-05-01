# Undangan Online Platform

Platform pembuatan undangan pernikahan online berbasis web yang elegan, responsif, dan mudah digunakan.

## Fitur Utama

- **Pilihan Template**: Berbagai kategori (Classic, Modern, Rustic, Premium).
- **Preview Real-time**: Pengguna dapat melihat perubahan desain secara langsung saat mengisi data.
- **Sistem Checkout**: Pembayaran via transfer bank dengan upload bukti pembayaran.
- **Admin Panel**: Dashboard statistik, manajemen pesanan, dan editor template HTML/CSS.
- **WhatsApp Share**: Integrasi tombol bagikan ke WhatsApp untuk setiap undangan.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database & Auth**: Supabase
- **Styling**: Tailwind CSS
- **Components**: Lucide React, Recharts
- **Security**: DOMPurify, Middleware Protection

## Cara Setup Lokal

1. **Clone Repository**
   ```bash
   git clone <repository-url>
   cd undangan
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Konfigurasi Supabase**
   - Buat proyek baru di [Supabase Console](https://app.supabase.com).
   - Jalankan SQL yang ada di `supabase/migrations/init.sql` pada menu **SQL Editor**.
   - Pastikan bucket `templates`, `payment_proofs`, dan `invitations` telah dibuat (otomatis oleh script SQL).

4. **Environment Variables**
   - Copy `.env.local.example` menjadi `.env.local`.
   - Isi `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
   - Isi `SUPABASE_SERVICE_ROLE_KEY` (untuk operasi server-side).

5. **Populasi Data Awal**
   ```bash
   npm run db:setup
   ```

6. **Jalankan Aplikasi**
   ```bash
   npm run dev
   ```

## Deploy ke Vercel

1. Hubungkan repository GitHub ke Vercel.
2. Tambahkan semua Environment Variables dari `.env.local` ke pengaturan Vercel.
3. Klik **Deploy**.

## Akun Admin Default

- **Email**: `admin@undangan.com`
- **Password**: `admin123`

## Lisensi

MIT
