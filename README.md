# DormDuty — Sistem Manajemen & Verifikasi Piket Asrama

DormDuty adalah aplikasi berbasis web untuk mempermudah pengelolaan jadwal piket kebersihan, pelaporan bukti pengerjaan, dan proses verifikasi oleh pengurus asrama secara terstruktur dan transparan.

Proyek ini dibangun sebagai tugas praktikum Pemrograman Aplikasi Berbasis Web Enterprise (PABWE).

---

## Arsitektur & Teknologi

Repositori ini mengintegrasikan aplikasi Frontend React langsung di root (kompatibel dengan pipeline Delcom CI/CD) dan server Backend Express di dalam subfolder:

- **Frontend (Root Direktori `./`)**:
  - React 19 + Vite
  - Tailwind CSS v4
  - Redux Toolkit (state management terpusat dengan aksi & reducer terstruktur)
  - React Router DOM v7 (manajemen rute & proteksi halaman)
  - SweetAlert2 (dialog konfirmasi & umpan balik aksi interaktif)
  - Vitest + Testing Library React (pengujian otomatis unit & integrasi dengan target cakupan tinggi)
  - Berjalan di port default `3000`

- **Backend (`dormduty-backend/`)**:
  - Node.js (ESM) + Express.js
  - Basis data SQLite (`better-sqlite3`)
  - Autentikasi JWT (JSON Web Token) & enkripsi kata sandi menggunakan `bcryptjs`
  - Penanganan berkas bukti kebersihan (multipart form-data) dengan `multer`
  - Berjalan di port `5000` (Base URL: `http://localhost:5000/api/v1`)

---

## Prasyarat Sistem

- **Node.js**: Versi 20+ (direkomendasikan Node.js 24)
- **Bun**: Versi 1.1+ (digunakan pada pipeline CI/CD)
- **NPM**: Versi 10+
- **Sistem Operasi**: Windows (PowerShell / Command Prompt), macOS, atau Linux

---

## Panduan Instalasi & Menjalankan Aplikasi

Aplikasi membutuhkan dua terminal yang berjalan bersamaan (satu untuk backend dan satu untuk frontend).

### 1. Menjalankan Backend

Buka terminal pertama dan arahkan ke folder `dormduty-backend`:


cd dormduty-backend

# 1. Pasang dependensi backend
npm install

# 2. Inisialisasi basis data dan data awal (seed)
npm run seed

# 3. Jalankan server backend dalam mode pengembangan
npm run dev

Server backend akan aktif di http://localhost:5000 (Endpoint cek status: http://localhost:5000/api/v1/health).
2. Menjalankan Frontend

Buka terminal kedua pada root direktori repositori (tidak perlu masuk ke subfolder):
code Bash

# 1. Pasang dependensi frontend
npm install
# atau menggunakan bun:
# bun install

# 2. Jalankan server frontend
npm run dev

Aplikasi frontend dapat diakses melalui browser pada alamat http://localhost:3000.
Akun Pengguna Data Awal (Seed)

Basis data dilengkapi dengan akun seed yang mencakup peran administratif dan operasional:
Peran	Nama	Email / Identifier	NIM	Kata Sandi	Lantai	Kamar
Admin	Admin Asrama	admin@dormduty.test	000001	admin123	1	Kamar 101
Coordinator	Koordinator Lantai 2	koordinator@dormduty.test	000002	koor123	2	Kamar 201

    Catatan: Masuk ke aplikasi (login) dapat menggunakan Email maupun NIM.

Menjalankan Pengujian Otomatis (Testing)

Seluruh pengujian unit dan integrasi dijalankan langsung dari root direktori:
code Bash

# Menjalankan seluruh test suite
npx vitest run

# Menjalankan pengujian dengan laporan cakupan kode (coverage report)
npx vitest run --coverage

# Menjalankan pemeriksaan kualitas kode (linter)
npm run lint

Integrasi CI/CD & Deployment (Delcom)

Proyek ini telah dikonfigurasi dengan pipeline otomasi Delcom CI/CD:

    GitHub: Menampung kode sumber dan mengirimkan webhook perubahan ke Jenkins.

    Jenkins: Menjalankan pengujian otomatis, analisis kerentanan keamanan (Trivy), serta memaketkan artefak aplikasi (latest-app.zip).

    SonarQube: Menganalisis metrik kualitas kode, duplikasi, dan cakupan pengujian melalui sonar-project.properties.

    Delcom Cloud Deployment: Menyajikan aplikasi web aktif pada domain .slif.cloud.

Struktur Fitur Utama (src/features/duties)

    Data Layer:

        api/dutyApi.js: Klien HTTP untuk operasi CRUD tugas piket, filter statistik, upload bukti, dan verifikasi tugas.

        states/action.js & states/reducer.js: State Redux, action creators, dan asynchronous thunk actions dengan umpan balik SweetAlert2.

    Layout & Navigasi:

        components/NavbarComponent.jsx: Menampilkan profil pengguna aktif, peran, avatar, dan tombol logout.

        components/SidebarComponent.jsx: Navigasi rute utama dengan drawer responsif untuk perangkat mobile.

        layouts/DutyLayout.jsx: Pelindung rute autentikasi dan penataan tata letak aplikasi utama.

    Komponen Modal:

        modals/AddDutyModal.jsx: Formulir penugasan jadwal piket baru (khusus Admin & Koordinator).

        modals/UploadProofModal.jsx: Formulir unggah foto bukti kebersihan (format JPG/PNG/WEBP, maks 5 MB).

        modals/VerifyModal.jsx: Formulir keputusan verifikasi (Setujui / Tolak) dengan catatan evaluasi wajib jika ditolak.

    Halaman:

        pages/HomePage.jsx: Dashboard roster jadwal, metrik statistik, tab filter (Semua, Tugas Saya, Menunggu Verifikasi), serta filter lantai.

        pages/DetailPage.jsx: Rincian mendalam data tugas piket, foto bukti pengerjaan, riwayat evaluasi, dan tombol aksi kondisional sesuai peran pengguna.


### Cara Pakai:
1. Buka file **`README.md`** di VS Code.
2. Hapus seluruh isinya, lalu tempelkan teks di atas.
3. Simpan file (`Ctrl + S`).