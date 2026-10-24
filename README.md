# DormDuty — Sistem Manajemen & Verifikasi Piket Asrama

DormDuty adalah aplikasi berbasis web untuk mempermudah pengelolaan jadwal piket kebersihan, pelaporan bukti pengerjaan, dan proses verifikasi oleh pengurus asrama secara terstruktur dan transparan.

Proyek ini dibangun sebagai tugas praktikum Pemrograman Aplikasi Berbasis Web Enterprise (PABWE).

---

## Arsitektur & Teknologi

Repo ini merupakan monorepo yang terdiri dari backend dan frontend:

- **Backend (`dormduty-backend/`)**:
  - Node.js (ESM) + Express.js
  - SQLite (`better-sqlite3`)
  - Autentikasi JWT & enkripsi kata sandi menggunakan `bcryptjs`
  - Upload file multipart dengan `multer`
  - Berjalan di port `5000` (Base URL: `http://localhost:5000/api/v1`)

- **Frontend (`dormduty-frontend/`)**:
  - React 19 + Vite
  - Tailwind CSS v4
  - Redux Toolkit (state management dengan aksi & reducer konsisten)
  - React Router DOM v7
  - SweetAlert2 (notifikasi toast & dialog konfirmasi interaktif)
  - Vitest + Testing Library React (pengujian unit & integrasi dengan cakupan tinggi > 95%)
  - Berjalan di port `3000` (atau port default Vite)

---

## Prasyarat Sistem

- **Node.js**: Versi 20+ (direkomendasikan Node.js 24)
- **NPM**: Versi 10+
- **Sistem Operasi**: Windows (PowerShell / Command Prompt), macOS, atau Linux

---

## Panduan Instalasi & Menjalankan Aplikasi

### 1. Backend

Buka terminal dan arahkan ke folder `dormduty-backend`:

```bash
cd dormduty-backend

# 1. Pasang dependensi
npm install

# 2. Inisialisasi basis data dan data awal (seed)
npm run seed

# 3. Jalankan server pengembangan (mode watch)
npm run dev
```

Server backend akan berjalan di `http://localhost:5000`.

### 2. Frontend

Buka terminal baru dan arahkan ke folder `dormduty-frontend`:

```bash
cd dormduty-frontend

# 1. Pasang dependensi
npm install

# 2. Jalankan server pengembangan frontend
npm run dev
```

Aplikasi frontend dapat diakses melalui browser pada alamat yang ditampilkan di terminal (biasanya `http://localhost:3000` atau `http://localhost:5173`).

---

## Akun Pengguna Data Awal (Seed)

Basis data dilengkapi dengan akun seed yang mencakup seluruh peran pengguna:

| Peran | Nama | Email / Identifier | NIM | Kata Sandi | Lantai | Kamar |
| :--- | :--- | :--- | :--- | :--- | :---: | :---: |
| **Admin** | Admin Asrama | `admin@dormduty.test` | `000001` | `admin123` | 1 | Kamar 101 |
| **Coordinator** | Koordinator Lantai 2 | `koordinator@dormduty.test` | `000002` | `koor123` | 2 | Kamar 201 |

> **Catatan**: Kolom login dapat diisi menggunakan **Email** maupun **NIM**.

---

## Menjalankan Pengujian (Testing)

Semua pengujian frontend dijalankan dari folder `dormduty-frontend`:

```bash
cd dormduty-frontend

# Menjalankan seluruh test suite
npx vitest run

# Menjalankan pengujian dengan laporan cakupan (coverage)
npx vitest run --coverage

# Menjalankan pengecekan linter kode
npm run lint
```

---

## Struktur Fitur Utama (`features/duties`)

- **Data Layer**:
  - `api/dutyApi.js`: Klien HTTP untuk operasi CRUD tugas piket, filter statistik, upload bukti, dan verifikasi tugas.
  - `states/action.js` & `states/reducer.js`: State Redux, action creators, dan asynchronous thunk actions dengan penanganan notifikasi SweetAlert2.
- **Layout & Navigasi**:
  - `components/NavbarComponent.jsx`: Menampilkan identitas pengguna, inisial/foto avatar, dan tombol logout.
  - `components/SidebarComponent.jsx`: Navigasi samping yang responsif dengan penyorotan link aktif.
  - `layouts/DutyLayout.jsx`: Pelindung rute autentikasi dan penataan tata letak aplikasi utama.
- **Modal Komponen**:
  - `modals/AddDutyModal.jsx`: Modal pembuatan jadwal piket baru (khusus Admin & Koordinator).
  - `modals/UploadProofModal.jsx`: Modal pengunggahan bukti pengerjaan dengan validasi berkas (JPG/PNG/WEBP, maks 5 MB) dan pratinjau gambar.
  - `modals/VerifyModal.jsx`: Modal keputusan verifikasi (Setujui / Tolak) dengan catatan wajib jika ditolak.
- **Halaman**:
  - `pages/HomePage.jsx`: Dashboard jadwal piket, ringkasan kartu statistik, tab filter (Semua, Tugas Saya, Menunggu Verifikasi), filter lantai/tanggal, dan aksi hapus jadwal dengan konfirmasi.
  - `pages/DetailPage.jsx`: Halaman rincian tugas piket, identitas petugas, jadwal, foto bukti, catatan verifikator, serta tombol aksi kondisional sesuai status dan peran pengguna.

