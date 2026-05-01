# Undangan Online Platform

Platform pembuatan undangan digital multi-kategori (Wedding, Birthday, Seminar, Graduation, Gathering) yang elegan, responsif, dan dinamis.

## ✨ Fitur Utama Baru

- **Multi-Kategori**: Tidak hanya pernikahan, sekarang mendukung berbagai jenis acara.
- **Form Dinamis**: Form pengisian data otomatis menyesuaikan dengan konsep template yang dipilih.
- **20+ Template Premium**: Berbagai pilihan desain mulai dari minimalis hingga mewah.
- **Real-time Editor**: Preview langsung perubahan data pada desain undangan.
- **Admin Panel**: Manajemen pesanan dan kustomisasi template penuh.

## 🛠️ Langkah Penting: Update Database

Karena adanya fitur **Form Dinamis**, Anda wajib menambahkan kolom `fields_config` ke tabel `templates`. 

1. Buka **SQL Editor** di Supabase Dashboard.
2. Jalankan perintah berikut:
```sql
ALTER TABLE public.templates ADD COLUMN IF NOT EXISTS fields_config JSONB NOT NULL DEFAULT '[]';
```
3. (Opsional) Jika ingin mereset total, jalankan seluruh isi file `supabase/migrations/init.sql`.

## 🚀 Cara Setup Lokal

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Isi `.env.local` dengan API Key Supabase Anda.

3. **Populasi 20+ Template**
   ```bash
   npm run db:setup
   ```

4. **Jalankan**
   ```bash
   npm run dev
   ```

## 🌐 Live Demo
[https://undangan-spesial.vercel.app/](https://undangan-spesial.vercel.app/)

---
Developed with ❤️ using Next.js 15 & Supabase.
