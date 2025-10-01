# CV. Jaya Kencana Company Profile

Proyek web company profile lengkap untuk CV. Jaya Kencana yang terdiri dari backend (Express.js + Sequelize + MySQL) dan frontend (React.js + Vite). Seluruh kode siap dijalankan untuk kebutuhan produksi maupun pengembangan.

## Struktur Proyek

```
.
├── server/              # Backend Express.js
└── client/              # Frontend React + Vite
```

## Persiapan Awal

1. **Kloning repositori** (jika belum)
   ```bash
   git clone <repo-url>
   cd company-profile-jaya-kencana
   ```

2. **Buat database MySQL**
   ```sql
   CREATE DATABASE jaya_kencana;
   ```

3. **Salin file environment**
   ```bash
   cd server
   cp .env.example .env
   ```
   Sesuaikan nilai `DB_USER`, `DB_PASSWORD`, dan konfigurasi lain jika diperlukan.

## Menjalankan Backend (server/)

1. Install dependensi
   ```bash
   cd server
   npm install
   ```

2. Jalankan server (mode produksi)
   ```bash
   npm start
   ```
   atau gunakan `npm run dev` untuk mode pengembangan dengan nodemon.

3. Server akan berjalan pada `http://localhost:5000`. Endpoint utama tersedia di prefix `/api`.

Saat pertama kali berjalan, server akan otomatis:
- Menjalankan migrasi (sequelize sync) dan membuat tabel yang dibutuhkan.
- Membuat akun admin default (`admin@jayakencana.co.id / admin123`) jika belum ada.
- Membuat data profil perusahaan dasar jika belum tersedia.

## Menjalankan Frontend (client/)

1. Install dependensi
   ```bash
   cd client
   npm install
   ```

2. Jalankan Vite development server
   ```bash
   npm run dev
   ```

3. Akses aplikasi pada `http://localhost:5173`. Vite sudah dikonfigurasikan untuk melakukan proxy request `/api` ke backend.

## Fitur Utama

### Backend
- Autentikasi JWT (register & login) dengan hash password bcrypt.
- CRUD untuk profil perusahaan, produk, proyek, galeri, dan pesan.
- Upload file gambar menggunakan Multer (tersimpan di `server/public/uploads`).
- Proteksi endpoint admin menggunakan middleware JWT.
- Helmet & CORS untuk keamanan API.

### Frontend
- Halaman publik: Home, About, Products, Portfolio, Gallery, Contact.
- Form kontak terhubung langsung ke endpoint `/api/messages`.
- Panel admin lengkap dengan manajemen profil perusahaan, produk, proyek, galeri, serta daftar pesan masuk.
- Sistem login admin menggunakan JWT dan penyimpanan token di localStorage.

## Build Produksi

Untuk build frontend siap produksi:
```bash
cd client
npm run build
```
Hasil build dapat ditemukan di `client/dist`.

## Kredensial Admin Default
- Email: `admin@jayakencana.co.id`
- Password: `admin123`

Ubah nilai password default melalui environment variable `ADMIN_PASSWORD` sebelum menjalankan di lingkungan produksi.

## Lisensi
Proyek ini dibuat untuk kebutuhan profil perusahaan CV. Jaya Kencana. Gunakan dan modifikasi sesuai kebutuhan internal.
