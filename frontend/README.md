# Frontend BP Sport

Frontend Next.js App Router + TypeScript terhubung ke API Laravel. Katalog, kategori, paket harga, bahan, kerah, ulasan, dan pengaturan toko dibaca dari database melalui API. Halaman dirender saat diakses; penambahan slug desain tidak memerlukan build ulang.

## Menjalankan di PowerShell

Backend dan MySQL Docker harus aktif. Pada konfigurasi lokal ini backend memakai port 8001 dan frontend memakai 3001 karena port 8000/3000 dipakai proyek lain.

```powershell
cd "C:\PROJECT WEB\web-katalog-jersy-castom"
docker compose --env-file .env.docker up -d --wait

cd frontend
# Hanya untuk checkout baru jika .env.local belum ada:
# Copy-Item .env.example .env.local
npm.cmd run dev -- --port 3001
```

Pelanggan: http://localhost:3001. Admin: http://localhost:3001/admin/login/. Gunakan akun admin yang sudah dibuat di Laravel. Tidak ada password admin bawaan.

Dependensi telah tersedia pada checkout ini. Pada clone baru, jalankan `npm.cmd ci` terlebih dahulu.

## Alamat API dan session

- `NEXT_PUBLIC_API_URL`: alamat API yang dapat dijangkau browser, termasuk akhiran `/api`.
- `API_SERVER_URL`: alamat API dari server Next.js; opsional, mengikuti alamat publik bila kosong.
- `NEXT_PUBLIC_SITE_URL`: alamat frontend untuk canonical, sitemap, dan metadata.
- `DOCKER_BACKEND_PORT` dan `DOCKER_FRONTEND_PORT` dalam `../.env.docker` harus cocok dengan port backend/frontend. Compose menggunakannya untuk port, CORS, dan Sanctum.

Gunakan hostname yang sama untuk frontend dan backend, misalnya keduanya `localhost`. Login menggunakan cookie session Laravel serta XSRF-TOKEN, dengan `credentials: include`. Token tidak disimpan di localStorage. Mengubah port atau alamat API membutuhkan restart frontend; environment publik masuk ke build.

## Struktur kode

```text
src/
  app/
    admin/                  # Login, ringkasan, CRUD, pengaturan
    katalog/[slug]/         # Detail dinamis dari API
  components/
    admin/                  # Form, galeri, pilihan harga, auth, tabel
    providers/              # Informasi toko untuk komponen pelanggan
    catalog/                # Filter, pagination, kartu, galeri
    home/                   # Beranda, simulator, slideshow, FAQ
    materials/              # Cuplikan dan galeri bahan/kerah
    pricing/                # Kartu paket
    layout/                 # Header/footer
    ui/                     # Komponen umum
  lib/api/
    http.ts                 # Transport dan ApiError
    types.ts                # Kontrak respons Laravel
    mappers.ts              # Konversi DTO ke model tampilan
    catalog.ts              # Pembacaan API publik
    admin.ts                # Auth, CSRF, dan mutasi admin
    form-data.ts            # Serialisasi pilihan harga dan form
    use-page.ts             # Pembacaan daftar dengan pembatalan request
  data/                     # Manifest optimasi foto lokal
  types/                    # Model tampilan
tests/                      # API, serialisasi, katalog, WhatsApp
```

## Mengelola konten

Admin menyediakan kategori, desain, paket harga, bahan, kerah, ulasan, dan pengaturan toko. Daftar mendukung pencarian serta pagination. Data nonaktif tidak tampil pada API pelanggan.

Pada instalasi baru, isi Pengaturan toko terlebih dahulu; formulir mendukung database yang belum memiliki identitas toko. Kategori serta konten katalog diisi lewat admin.

Foto menerima JPG/PNG/WebP, maksimal 5 MB dan 5000 × 5000 piksel. Galeri desain berisi 1–12 gambar; foto pertama menjadi sampul. Simpan perubahan urutan sebelum menambahkan foto baru, lalu atur urutannya setelah upload tersimpan. Paket mempunyai 1–20 pilihan harga; ID pilihan lama dipertahankan ketika diedit. Ulasan contoh tetap diberi label.

Kode frontend menangani validasi 422, sesi berakhir 401, CSRF 419, dan gangguan jaringan. Akses tulis tetap diperiksa oleh middleware backend.

## Penyimpanan dan JSON

Gambar katalog dilayani melalui `/storage/...` pada backend. File disimpan pada disk public Laravel (`backend/storage/app/public`); pada Docker penyimpanan ini memakai volume `backend_storage`. Database menyimpan path file.

JSON katalog dan salinan data katalog lokal telah dihapus. Konten hanya disimpan dalam database; perubahan admin tidak memerlukan perubahan file frontend. Backup memerlukan ekspor MySQL beserta penyimpanan gambar. DatabaseSeeder tidak mengisi konten, sehingga seeding tidak menimpa atau memulihkan data admin.

`src/data/optimized-images.json` dipertahankan sebagai manifest aset untuk OptimizedPhoto, bukan sumber data katalog. File konfigurasi package/TypeScript/Composer juga tetap diperlukan.

Foto model, simulator, FAQ, serta ilustrasi identitas masih menjadi aset/konten frontend. Manifest `scripts/prepare-material-assets.mjs` dan `scripts/optimize-photos.mjs` tetap dapat digunakan untuk memproses aset sumber. Menjalankannya tidak mengubah baris MySQL.

## Validasi dan production

```powershell
npm.cmd run lint
npm.cmd run typecheck
npm.cmd test
npm.cmd run build
npm.cmd run start -- --port 3001
```

Hasil build berada di `.next` dan memerlukan runtime Node.js. `npm.cmd run preview -- --port 3001` juga menjalankan Next.js production. Hentikan server yang memakai port yang sama sebelum menjalankan server lain.

Frontend tidak lagi menggunakan static export atau hosting folder `out`. Pada Vercel, gunakan Root Directory `frontend` dan atur alamat backend publik yang dapat dijangkau dari browser serta server Vercel. Publikasi belum termasuk perubahan ini.

Konfigurasi Vercel tersedia di `vercel.json` dan contoh environment di `.env.production.example`. Runtime memakai Node 24.x. Panduan backend HTTPS, domain cookie admin, serta pemindahan data dan gambar tersedia di [panduan deploy produksi](../deploy/README.md).

Pengujian browser saat implementasi mencakup halaman pelanggan, pagination, pencarian, hasil kosong/reset filter, detail desain, dan pengalihan admin tanpa sesi ke login. Pengujian login berhasil, CRUD admin, serta upload melalui browser belum dilakukan sesuai batas yang dipilih pengguna.

FAQ masih menggunakan jQuery dengan event dan selector lokal; simulator tetap memakai visualisasi 2D serta tombol konsultasi WhatsApp.
