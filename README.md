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
├── deploy-backup/               # Backup SQL yang disertakan dalam repository
│   └── web-katalog-jersy-20261010-070458.sql
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

Contoh berikut menggunakan PowerShell. Ganti direktori proyek jika checkout berada di lokasi lain. Jalankan setiap tahap sampai berhasil sebelum melanjutkan. Salin hanya isi kotak kode, tanpa prompt `PS C:\...>`, `mysql>`, atau teks hasil terminal.

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
```

Setelah service aktif, pilih satu alur:

| Pilihan | Langkah |
| --- | --- |
| Database kosong | Jalankan migration di bawah, buat admin, lalu isi konten sendiri. |
| Memakai data dari backup | Ikuti [import SQL ke Docker](#import-ke-mysql-docker) terlebih dahulu; gunakan akun admin yang ikut dipulihkan jika tersedia. |

Untuk pilihan **database kosong**:

```powershell
docker compose --env-file .env.docker exec --user www-data backend php artisan migrate
```

Migrasi dijalankan secara eksplisit; startup container tidak menjalankan migrasi otomatis. Database Docker terpisah dari database Laragon, dan MySQL Docker tidak membuka port 3306 ke Windows.

### 3. Buat akun admin

Untuk pilihan database kosong atau saat membutuhkan akun admin baru:

```powershell
docker compose --env-file .env.docker exec --user www-data backend php artisan app:create-admin
```

Perintah meminta nama, email, password minimal 12 karakter, dan konfirmasi password. Tidak ada akun/password admin bawaan. Setelah import backup, gunakan email/password akun admin yang ikut dipulihkan; buat akun baru hanya jika diperlukan.

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

Untuk database kosong, login ke admin lalu isi **Pengaturan toko**, kategori, desain, paket harga, bahan, kerah, dan ulasan. `DatabaseSeeder` tidak mengisi atau memulihkan katalog. Jika memilih import SQL, konten berasal dari backup yang dipulihkan; jika memakai volume/database lama, data yang sudah tersimpan tetap tersedia.

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

Untuk database kosong, ikuti [panduan backend](backend/README.md) sampai migrasi dan pembuatan admin. Untuk memakai data lama, siapkan dependensi Composer dan environment Laravel, lalu ikuti [import SQL ke Laragon](#import-ke-mysql-laragon) sebelum menjalankan migrasi atau membuat akun admin baru.

Panduan backend lokal memakai port backend **8000** dan frontend **3000**. Untuk mengikuti konfigurasi tersebut, isi `frontend/.env.local`:

```dotenv
NEXT_PUBLIC_API_URL=http://localhost:8000/api
API_SERVER_URL=http://localhost:8000/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Jalankan `composer run dev` dari `backend/` dan `npm.cmd run dev -- --port 3000` dari `frontend/` pada terminal terpisah. Template backend sudah mengizinkan origin frontend port 3000; jika memakai port berbeda, sesuaikan `FRONTEND_URL` dan `SANCTUM_STATEFUL_DOMAINS` di `backend/.env`.

## Memulihkan data dari backup SQL

Repository menyertakan [web-katalog-jersy-20261010-070458.sql](deploy-backup/web-katalog-jersy-20261010-070458.sql), hasil ekspor MySQL Laragon pada **10 Oktober 2026**. File berisi struktur tabel dan data saat ekspor, termasuk tabel katalog, pengaturan toko, serta akun pengguna. Clone repository membawa file SQL tersebut, tetapi **tidak otomatis mengimpornya ke MySQL**.

Backup ini merupakan snapshot: perubahan database setelah ekspor tidak ikut tersimpan otomatis. Ekspor ulang jika membutuhkan data terbaru. File SQL ini sudah dilacak Git, sedangkan file backup baru di folder `deploy-backup/` tetap diabaikan oleh aturan `.gitignore`.

Gunakan **database tujuan kosong**. Dump memuat `DROP TABLE IF EXISTS`, sehingga import dapat mengganti tabel beserta data yang sudah ada. Jika target sudah berisi konten, buat backup database dan gambar target sebelum melakukan pemulihan.

Dump juga memuat `CREATE DATABASE` dan `USE` untuk **`web-katalog-jersy`**. Contoh berikut memakai nama tersebut; mengganti nama database pada konfigurasi aplikasi saja tidak mengubah target di dalam SQL. Untuk dump ini, gunakan MySQL 8.4 agar sesuai dengan sumber ekspor dan image Docker proyek.

### Import ke MySQL Laragon

Aktifkan MySQL Laragon. Dari PowerShell, masuk ke folder backup lalu buka client MySQL:

```powershell
cd "C:\PROJECT WEB\web-katalog-jersy-castom\deploy-backup"
& "C:\laragon\bin\mysql\mysql-8.4.3-winx64\bin\mysql.exe" --host=127.0.0.1 --port=3306 --user=root --password --default-character-set=utf8mb4
```

Sesuaikan lokasi `mysql.exe`, port, dan username jika instalasi Laragon berbeda. Masukkan password saat diminta; jika akun tidak memakai password, langsung tekan Enter.

Setelah prompt MySQL muncul, jalankan perintah berikut **di client MySQL**, bukan di PowerShell. Jalankan satu per satu dan berhenti jika import menampilkan error:

```sql
SOURCE web-katalog-jersy-20261010-070458.sql;
SHOW TABLES FROM `web-katalog-jersy`;
EXIT;
```

`SOURCE` membaca file dari folder kerja yang dipilih sebelum membuka client. Setelah keluar, atur koneksi pada `backend/.env` sesuai database yang dipulihkan:

```dotenv
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=web-katalog-jersy
DB_USERNAME=root
```

Isi `DB_PASSWORD` secara privat sesuai akun MySQL. Setelah dependensi Composer dan `APP_KEY` tersedia, jalankan dari PowerShell:

```powershell
cd "C:\PROJECT WEB\web-katalog-jersy-castom\backend"
php artisan config:clear
php artisan migrate
php artisan storage:link
```

Migration menerapkan perubahan struktur yang belum tercatat dalam backup; migration tidak menggantikan import data. Gunakan akun admin yang ikut dipulihkan jika tersedia. Jika perlu akun baru, jalankan `php artisan app:create-admin`.

### Import ke MySQL Docker

Jalankan dari root proyek setelah [setup environment Docker](#1-siapkan-konfigurasi-docker). Pastikan `DOCKER_DB_DATABASE=web-katalog-jersy` pada `.env.docker` agar database aplikasi cocok dengan target dump. Database Docker dan Laragon tetap terpisah; perintah ini mengimpor salinan data ke MySQL Docker.

```powershell
cd "C:\PROJECT WEB\web-katalog-jersy-castom"
docker compose --env-file .env.docker up -d --wait mysql
docker compose --env-file .env.docker cp .\deploy-backup\web-katalog-jersy-20261010-070458.sql mysql:/tmp/catalog-restore.sql
```

Setelah penyalinan berhasil, import melalui shell di dalam container:

```powershell
docker compose --env-file .env.docker exec -T mysql sh -c 'MYSQL_PWD="$MYSQL_PASSWORD" mysql --user="$MYSQL_USER" --default-character-set=utf8mb4 "$MYSQL_DATABASE" < /tmp/catalog-restore.sql'
if ($LASTEXITCODE -ne 0) {
    throw "Import SQL gagal. Periksa pesan error sebelum melanjutkan."
}
```

Sesudah import berhasil, jalankan backend dan migration yang belum diterapkan:

```powershell
docker compose --env-file .env.docker up -d --build --wait backend
docker compose --env-file .env.docker exec --user www-data backend php artisan migrate
```

Entrypoint backend Docker membuat link storage. Akun admin dalam dump ikut dipulihkan; jika perlu akun baru, gunakan perintah `app:create-admin` pada bagian setup. Jangan menjalankan `migrate:fresh` atau `migrate:refresh` karena perintah tersebut membangun ulang tabel dan dapat menghilangkan data yang dipulihkan.

### Gambar dan pemeriksaan hasil

SQL menyimpan path gambar, bukan file fotonya. Untuk sumber Laragon, salin juga seluruh isi `backend/storage/app/public/` dari instalasi sumber dengan struktur subfolder yang sama. Pada tujuan Laragon, letakkan di folder tersebut dan jalankan `storage:link`. Pada Docker, gambar harus masuk ke `storage/app/public/` di service backend, yang menggunakan volume `backend_storage`; gunakan prosedur arsip/pemulihan di [panduan deploy](deploy/README.md#4-pulihkan-database-dan-gambar-yang-sudah-ada).

Setelah database dan gambar dipulihkan, periksa katalog, paket harga, pengaturan toko, foto produk, serta login admin. Pastikan `APP_URL` menunjuk alamat backend tujuan agar URL gambar sesuai. `DatabaseSeeder` tetap kosong, sehingga `db:seed` tidak memulihkan data atau gambar yang hilang.

Referensi perintah import: [MySQL 8.4 — Reloading SQL-Format Backups](https://dev.mysql.com/doc/refman/8.4/en/reloading-sql-format-dumps.html).

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

Template produksi menggunakan frontend dan API pada domain induk yang sama untuk session cookie admin. Compose produksi berdiri sendiri dan tidak digabung dengan Compose lokal. Clone repository menyertakan snapshot SQL di atas; database aktif tetap perlu diimpor dan gambar dipindahkan terpisah.

Ikuti [panduan deployment Vercel dan VPS](deploy/README.md) untuk domain, environment, backup/restore, migrasi, serta pemeriksaan setelah deploy.

## Dokumentasi lanjutan

- [Frontend: struktur, konten, dan aset](frontend/README.md)
- [Backend: setup lokal, API, dan autentikasi](backend/README.md)
- [Docker backend dan MySQL](backend/docker/README.md)
- [Deployment Vercel dan VPS](deploy/README.md)
- [Seleksi foto katalog](frontend/docs/seleksi-foto-katalog.md)
