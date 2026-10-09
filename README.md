# BP Sport

Website katalog jersey dan kaos custom BP Sport. Pelanggan dapat mencari referensi desain, melihat paket harga, memilih bahan dan kerah, mencoba simulator jersey, lalu berkonsultasi melalui WhatsApp. Admin mengelola konten toko melalui dashboard.

Frontend menggunakan **Next.js App Router, React, TypeScript, dan Tailwind CSS 4**. Backend menggunakan **Laravel 13, PHP 8.3+, MySQL, dan Laravel Sanctum** dengan autentikasi session cookie.

## Fitur

- Katalog dengan pencarian, filter kategori/koleksi, pagination, dan galeri detail desain.
- Paket harga printing dan sablon beserta pilihan harga dan ketentuan pemesanan.
- Referensi bahan dan kerah, halaman FAQ, serta simulator jersey 2D untuk nama, nomor, dan warna aksen.
- Tombol konsultasi WhatsApp yang membawa informasi desain atau paket.
- Dashboard admin untuk kategori, desain, paket harga, bahan, kerah, ulasan, dan pengaturan toko.
- Upload gambar, pengaturan urutan tampil, status aktif konten, serta penandaan ulasan contoh.

Konten katalog dan pengaturan toko berasal dari MySQL melalui API Laravel. Foto model, preset simulator, dan FAQ masih berada di frontend. Halaman pelanggan dirender dinamis; desain dengan slug baru dapat diakses tanpa build ulang frontend.

## Struktur proyek

```text
web-katalog-jersy-castom/
├── frontend/                    # Aplikasi Next.js pelanggan dan admin
│   ├── src/app/                 # Halaman, metadata, sitemap, dan robots
│   ├── src/components/          # Komponen tampilan dan form admin
│   ├── src/lib/api/             # API publik, autentikasi, dan mutasi admin
│   ├── src/data/                # Manifest optimasi gambar lokal
│   ├── public/                  # Foto model dan aset publik frontend
│   ├── scripts/                 # Pemrosesan aset lokal
│   ├── tests/                   # Pengujian frontend
│   ├── Dockerfile
│   └── package.json
├── backend/                     # API Laravel; tidak memakai npm atau Vite
│   ├── app/                     # Controller, validasi, model, resource, service
│   ├── database/                # Migrasi, factory, dan seeder
│   ├── routes/                  # API, autentikasi, dan perintah console
│   ├── storage/                 # Upload, log, dan cache Laravel
│   ├── tests/                   # Pengujian backend
│   ├── docker/                  # Setup PowerShell, Apache, dan entrypoint
│   ├── Dockerfile
│   └── composer.json
├── deploy/                      # Panduan produksi dan konfigurasi Caddy
├── compose.yaml                 # Docker lokal: frontend, backend, dan MySQL
├── compose.production.yaml      # VPS: backend, MySQL, dan HTTPS Caddy
├── .env.docker.example          # Contoh konfigurasi Docker lokal
└── .env.production.example      # Contoh konfigurasi VPS
```

Jalankan npm dari `frontend/`, Composer/Artisan dari `backend/`, dan Docker Compose dari root proyek.

## Kebutuhan

| Cara menjalankan | Kebutuhan |
| --- | --- |
| Backend/MySQL Docker + frontend lokal | Docker Desktop dengan Linux containers, Docker Compose v2, Node.js 24.x, dan npm. |
| Seluruh aplikasi melalui Docker | Docker Desktop dengan Linux containers dan Docker Compose v2; Node.js, PHP, dan Composer tersedia di image. |
| Backend lokal tanpa Docker | PHP 8.3+, Composer 2, MySQL, serta Node.js 24.x dan npm untuk frontend. Lihat [panduan backend](backend/README.md). |

## Pengembangan lokal: backend Docker dan frontend npm

Contoh berikut menggunakan PowerShell. Ganti direktori proyek jika checkout berada di lokasi lain. Jalankan setiap tahap sampai berhasil sebelum melanjutkan.

### 1. Siapkan konfigurasi Docker

Aktifkan Docker Desktop, lalu jalankan dari root proyek:

```powershell
cd "C:\PROJECT WEB\web-katalog-jersy-castom"
powershell -NoProfile -ExecutionPolicy Bypass -File .\backend\docker\setup.ps1
docker compose --env-file .env.docker config --quiet
```

Script setup membuat `backend/.env` jika belum ada, mengisi `APP_KEY` yang kosong, serta membuat `.env.docker` dengan password MySQL acak. Kunci dan kredensial yang sudah ada dipertahankan. File contoh Docker memakai port backend **8001** dan frontend **3001**.

### 2. Jalankan backend dan database

```powershell
docker compose --env-file .env.docker up -d --build --wait mysql backend
docker compose --env-file .env.docker exec --user www-data backend php artisan migrate
```

Migrasi dijalankan secara eksplisit; startup container tidak menjalankan migrasi otomatis. Database Docker terpisah dari database Laragon, dan MySQL Docker tidak membuka port 3306 ke Windows.

### 3. Buat akun admin

Untuk instalasi baru atau saat membutuhkan akun admin baru:

```powershell
docker compose --env-file .env.docker exec --user www-data backend php artisan app:create-admin
```

Perintah meminta nama, email, password minimal 12 karakter, dan konfirmasi password. Tidak ada akun/password admin bawaan. Gunakan akun yang sudah ada jika database sebelumnya masih dipakai.

### 4. Jalankan frontend pada terminal terpisah

```powershell
cd "C:\PROJECT WEB\web-katalog-jersy-castom\frontend"
if (-not (Test-Path -LiteralPath ".env.local")) {
    Copy-Item -LiteralPath ".env.example" -Destination ".env.local"
}
npm.cmd ci
npm.cmd run dev -- --port 3001
```

`npm.cmd ci` memasang dependensi sesuai `package-lock.json`; ulangi ketika dependensi berubah. Pastikan `.env.local` cocok dengan port Docker yang dipakai:

```dotenv
NEXT_PUBLIC_API_URL=http://localhost:8001/api
API_SERVER_URL=http://localhost:8001/api
NEXT_PUBLIC_SITE_URL=http://localhost:3001
```

| Layanan | Alamat pada konfigurasi contoh |
| --- | --- |
| Website pelanggan | [http://localhost:3001](http://localhost:3001) |
| Login admin | [http://localhost:3001/admin/login/](http://localhost:3001/admin/login/) |
| API katalog | [http://localhost:8001/api/designs](http://localhost:8001/api/designs) |
| Health check Laravel | [http://localhost:8001/up](http://localhost:8001/up) |

Login ke admin, lalu isi **Pengaturan toko**, kategori, desain, paket harga, bahan, kerah, dan ulasan. Instalasi baru tidak berisi konten bawaan; `DatabaseSeeder` tidak mengisi atau memulihkan katalog. Data lama tetap tersedia jika memakai volume/database yang sudah berisi konten.

Gunakan hostname yang sama untuk frontend dan backend saat login, misalnya keduanya `localhost`. Jika port berubah, sesuaikan `.env.docker`, URL pada `frontend/.env.local`, dan port perintah npm. Restart frontend setelah mengubah environment.

## Alternatif: seluruh aplikasi melalui Docker

Setelah setup environment dan migrasi pada bagian sebelumnya, jalankan service frontend:

```powershell
cd "C:\PROJECT WEB\web-katalog-jersy-castom"
docker compose --env-file .env.docker up -d --build --wait frontend
docker compose --env-file .env.docker ps
```

Hentikan server npm yang memakai port 3001 sebelum menjalankan frontend Docker. Alamat website dan API mengikuti `.env.docker`. Server Next.js di container mengakses API melalui `http://backend/api`, sedangkan browser mengakses alamat backend lokal.

Frontend Docker menjalankan build produksi. Perubahan kode frontend memerlukan rebuild image; untuk pengembangan dengan hot reload gunakan frontend npm pada bagian sebelumnya.

## Alternatif: backend lokal dengan Laragon

Ikuti [panduan backend](backend/README.md) untuk membuat database MySQL, memasang dependensi Composer, mengatur `.env`, membuat `APP_KEY`, menjalankan migrasi, membuat link storage, dan membuat admin.

Panduan backend lokal memakai port backend **8000** dan frontend **3000**. Untuk mengikuti konfigurasi tersebut, isi `frontend/.env.local`:

```dotenv
NEXT_PUBLIC_API_URL=http://localhost:8000/api
API_SERVER_URL=http://localhost:8000/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Jalankan `composer run dev` dari `backend/` dan `npm.cmd run dev -- --port 3000` dari `frontend/` pada terminal terpisah. Template backend sudah mengizinkan origin frontend port 3000; jika memakai port berbeda, sesuaikan `FRONTEND_URL` dan `SANCTUM_STATEFUL_DOMAINS` di `backend/.env`.

## Konfigurasi environment

| File atau variabel | Fungsi |
| --- | --- |
| `backend/.env` | Konfigurasi Laravel lokal dan `APP_KEY`; juga dibaca service backend pada Compose lokal. |
| `.env.docker` | Port dan kredensial MySQL Docker lokal. |
| `frontend/.env.local` | Konfigurasi frontend saat berjalan melalui npm. |
| `NEXT_PUBLIC_API_URL` | URL API yang dapat dijangkau browser, termasuk akhiran `/api`. |
| `API_SERVER_URL` | URL API dari server Next.js; mengikuti URL publik jika kosong. |
| `NEXT_PUBLIC_SITE_URL` | URL frontend untuk canonical, sitemap, dan metadata. |
| `.env.production` | Domain, key, dan kredensial stack VPS; lihat [panduan deploy](deploy/README.md). |

File environment berisi kredensial tidak masuk Git. Gunakan file `.example` sebagai template. Perubahan `NEXT_PUBLIC_*` memerlukan build ulang pada produksi karena nilainya dimasukkan ke bundle saat build.

## Halaman dan pengelolaan konten

| Route frontend | Fungsi |
| --- | --- |
| `/` | Beranda, desain pilihan, referensi produksi, dan simulator. |
| `/katalog/` | Pencarian dan filter katalog. |
| `/katalog/{slug}/` | Galeri serta informasi desain. |
| `/paket-harga/` | Paket printing dan sablon. |
| `/bahan-kerah/` | Referensi bahan dan model kerah. |
| `/faq/` | Pertanyaan seputar pemesanan. |
| `/admin/login/` | Login admin. |
| `/admin/` | Dashboard dan akses pengelolaan konten. |
| `/admin/pengaturan/` | Identitas toko, WhatsApp, logo, dan media sosial. |

CRUD admin dilindungi middleware Laravel dan autentikasi Sanctum berbasis session cookie serta CSRF. Konten nonaktif tidak tampil di API publik. Endpoint dan payload tersedia dalam [dokumentasi API backend](backend/README.md#api-publik).

## Penyimpanan dan backup

- **MySQL** menyimpan konten, pengaturan toko, dan akun admin.
- **Disk public Laravel** (`backend/storage/app/public/`) menyimpan gambar katalog; gambar dilayani melalui `/storage/...` pada backend.
- Pada Docker, volume `mysql_data` dan `backend_storage` mempertahankan database serta gambar ketika container dibuat ulang.
- `frontend/src/data/optimized-images.json` adalah manifest gambar lokal, bukan database atau backup katalog. Script aset frontend tidak memperbarui data MySQL.

Backup memerlukan ekspor database **dan** salinan penyimpanan gambar. Simpan juga konfigurasi environment secara privat. Prosedur backup dan pemindahan data tersedia di [panduan deploy](deploy/README.md).

Untuk menghentikan stack lokal dengan volume tetap disimpan:

```powershell
docker compose --env-file .env.docker down
```

Jangan menambahkan `-v` jika database dan gambar ingin dipertahankan. Mengganti password pada `.env.docker` saja tidak mengganti password MySQL dalam volume yang sudah diinisialisasi.

## Pemeriksaan dan build

### Frontend

Jalankan dari `frontend/`:

```powershell
npm.cmd run lint
npm.cmd run typecheck
npm.cmd test
npm.cmd run build
npm.cmd run start -- --port 3001
```

Hentikan server lain pada port yang sama sebelum menjalankan production server. `npm.cmd run preview -- --port 3001` juga menjalankan Next.js production. Build berada di `.next/` dan memerlukan runtime Node.js; proyek tidak menggunakan static export atau folder `out/` untuk deployment.

### Backend

Dengan PHP dan Composer lokal, jalankan dari `backend/`:

```powershell
composer validate --strict
composer run test
```

Pengujian backend memakai SQLite in-memory sesuai `phpunit.xml`, bukan MySQL lokal; diperlukan ekstensi `pdo_sqlite`. Image Docker backend memasang dependensi tanpa development, sehingga perintah ini ditujukan untuk instalasi backend lokal dengan dependensi development.

Untuk memeriksa stack Docker lokal, jalankan dari root proyek:

```powershell
docker compose --env-file .env.docker ps
docker compose --env-file .env.docker logs --tail=100 backend mysql frontend
Invoke-RestMethod -Uri "http://localhost:8001/up"
Invoke-RestMethod -Uri "http://localhost:8001/api/designs"
```

Respons `/up` memeriksa boot Laravel. Periksa juga API dan halaman browser untuk memastikan database, gambar, serta login bekerja. Daftar desain kosong pada database baru merupakan hasil yang wajar sampai konten diisi.

## Deployment produksi

Konfigurasi proyek memisahkan frontend dan backend:

- **Vercel:** Root Directory `frontend`, Node.js 24.x, serta environment API dan URL website. Konfigurasi tersedia di `frontend/vercel.json` dan contoh environment di `frontend/.env.production.example`.
- **VPS:** Laravel, MySQL 8.4, dan Caddy untuk HTTPS melalui `compose.production.yaml`. Salin `.env.production.example` ke `.env.production` dan isi nilainya sesuai domain/server.

Template produksi menggunakan frontend dan API pada domain induk yang sama untuk session cookie admin. Compose produksi berdiri sendiri dan tidak digabung dengan Compose lokal. Menyalin source saja tidak memindahkan database atau gambar.

Ikuti [panduan deployment Vercel dan VPS](deploy/README.md) untuk domain, environment, backup/restore, migrasi, serta pemeriksaan setelah deploy.

## Dokumentasi lanjutan

- [Frontend: struktur, konten, dan aset](frontend/README.md)
- [Backend: setup lokal, API, dan autentikasi](backend/README.md)
- [Docker backend dan MySQL](backend/docker/README.md)
- [Deployment Vercel dan VPS](deploy/README.md)
- [Seleksi foto katalog](frontend/docs/seleksi-foto-katalog.md)
