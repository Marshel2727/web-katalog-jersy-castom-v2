# BP Sport

## Docker backend dan MySQL

Konfigurasi Docker tersedia pada compose.yaml dan backend/Dockerfile. Panduan serta perintah PowerShell ada di [backend/docker/README.md](backend/docker/README.md). Backend dan MySQL dapat dijalankan tanpa PHP atau Composer pada PATH Windows.

Database Docker disimpan pada volume terpisah dari database Laragon. Frontend tetap dijalankan dari folder frontend.

Proyek dipisahkan menjadi dua folder utama:

```text
web-katalog-jersy-castom/
├── frontend/                 # Aplikasi Next.js
│   ├── src/                  # Halaman, komponen, dan data katalog
│   ├── public/               # Foto dan aset publik
│   ├── scripts/              # Pemrosesan aset
│   ├── tests/                # Pengujian katalog dan WhatsApp
│   ├── docs/                 # Dokumentasi foto katalog
│   ├── package.json
│   ├── package-lock.json
│   └── next.config.ts
└── backend/                  # Laravel 13, terpisah dari frontend
    ├── app/                  # Controller, FormRequest, Resource, Model, Service
    ├── bootstrap/            # Bootstrap dan cache framework
    ├── config/               # Konfigurasi aplikasi
    ├── database/             # Migrasi, factory, dan seeder
    ├── public/               # Entry point HTTP Laravel
    ├── routes/               # API publik, CRUD admin, login, dan console
    ├── storage/              # Log, cache, dan penyimpanan runtime
    ├── tests/                # Pengujian backend
    ├── artisan
    └── composer.json
```

Frontend menggunakan API Laravel untuk konten katalog dan pengaturan toko. Seluruh konten dikelola di MySQL melalui admin; JSON katalog serta data katalog lokal telah dihapus. Halaman admin tersedia untuk login dan pengelolaan konten. Frontend dirender dinamis sehingga slug desain baru tampil tanpa build ulang. Backend tidak memakai npm atau Vite.

## Menjalankan frontend (PowerShell)

```powershell
cd "C:\PROJECT WEB\web-katalog-jersy-castom\frontend"
npm.cmd ci --cache .npm-cache
npm.cmd run dev -- --port 3001
```

Untuk checkout lokal ini, dependensi yang sudah tersedia ikut dipindahkan ke `frontend/node_modules/`, sehingga bisa langsung menjalankan `npm.cmd run dev`. Instalasi dengan `npm.cmd ci` diperlukan pada clone baru atau ketika dependensi perlu dipasang ulang.

Aktifkan backend Docker terlebih dahulu. Konfigurasi lokal memakai frontend http://localhost:3001, admin http://localhost:3001/admin/login/, dan API http://localhost:8001/api. Port diatur melalui .env.docker dan frontend/.env.local. Panduan konten dan pemrosesan aset ada di [frontend/README.md](frontend/README.md).

## Validasi frontend

Jalankan dari folder `frontend/`:

```powershell
npm.cmd run lint
npm.cmd run typecheck
npm.cmd test
npm.cmd run build
npm.cmd run preview -- --port 3001
```

Build berada di `frontend/.next/` dan memerlukan server Node.js. Untuk deployment frontend di Vercel, atur Root Directory menjadi `frontend` dan alamat API publik pada environment. Hosting static export tidak lagi digunakan.

## Menjalankan backend

Gunakan PHP 8.3+ dan Composer. Konfigurasikan `.env` lokal untuk MySQL Laragon sesuai [panduan backend](backend/README.md). Template `backend/.env.example` sudah menggunakan MySQL; perubahan template tidak menimpa `.env` lokal.

```powershell
cd "C:\PROJECT WEB\web-katalog-jersy-castom\backend"
composer install
composer run dev
```

Frontend dan Laravel dijalankan pada terminal terpisah. Periksa Laravel melalui http://127.0.0.1:8000/up. Route `/` backend tidak lagi menampilkan welcome page; halaman pelanggan berada di frontend.

Validasi backend dapat dijalankan dari `backend/` dengan `composer validate --strict` dan `composer run test`. Pengujian memakai konfigurasi terisolasi dalam `phpunit.xml`, bukan database MySQL lokal.
