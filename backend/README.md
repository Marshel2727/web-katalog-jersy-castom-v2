# Backend BP Sport

Untuk menjalankan backend beserta MySQL melalui Docker tanpa PHP pada PATH Windows, ikuti [panduan Docker](docker/README.md).

Laravel 13 / PHP 8.3 untuk API katalog BP Sport dengan MySQL. Backend menyediakan CRUD admin, autentikasi Sanctum berbasis cookie, dan upload gambar. Frontend Next.js membaca konten melalui API. Database MySQL menjadi satu-satunya sumber data katalog; tambah, edit, dan hapus konten melalui admin.

## Struktur

Alur request: route → middleware → Controller → FormRequest → Service → Model/database → Resource JSON.

| Lokasi | Fungsi |
| --- | --- |
| app/Http/Controllers/Api/ | Controller katalog, harga, bahan, kerah, testimoni, pengaturan, dan login. |
| app/Http/Requests/ | Validasi Store/Update per entitas, filter daftar, dan login. |
| app/Http/Resources/ | Respons JSON dan URL gambar. |
| app/Http/Middleware/EnsureAdmin.php | Membatasi CRUD ke akun admin. |
| app/Models/ | User, Category, Design, DesignImage, PricingPackage, PricingOption, Material, Collar, Testimonial, SiteSetting. |
| app/Services/ | CRUD, transaksi, galeri, opsi harga, singleton pengaturan, penyimpanan gambar. |
| app/Console/Commands/CreateAdmin.php | Pembuatan admin interaktif. |
| database/migrations/ | Tabel konten dan tabel runtime Laravel/Sanctum. |
| database/seeders/ | DatabaseSeeder tanpa konten bawaan; db:seed tidak menambah atau mengubah konten. |
| routes/api.php | API publik dan CRUD admin. |
| routes/web.php | Login/logout dengan session dan CSRF. |
| storage/app/public/ | Upload dan gambar hasil seeding. |
| tests/Feature/ | Pengujian API, autentikasi, seeder, dan health check. |

Tabel konten: categories, designs, design_images, pricing_packages, pricing_options, materials, collars, testimonials, site_settings. Admin disimpan pada users dengan flag is_admin.

Category memiliki banyak Design, Design memiliki banyak DesignImage, dan PricingPackage memiliki banyak PricingOption. Kategori yang dipakai desain tidak dapat dihapus (409). Penghapusan desain/paket menghapus baris relasinya. SiteSetting memakai satu record ID 1.

Bootstrap, config, public, storage, dan vendor tetap diperlukan Laravel. Backend tidak memakai npm atau Vite.

## Setup MySQL di Laragon

Aktifkan MySQL, lalu buat database melalui pengelola database:

~~~sql
CREATE DATABASE bp_sport
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;
~~~

Dari PowerShell:

~~~powershell
cd "C:\PROJECT WEB\web-katalog-jersy-castom\backend"
composer install
if (-not (Test-Path -LiteralPath ".env")) {
    Copy-Item -LiteralPath ".env.example" -Destination ".env"
}
~~~

Atur .env lokal; template tidak otomatis mengganti file yang sudah ada:

~~~dotenv
APP_NAME="BP Sport"
APP_URL=http://localhost:8000
FRONTEND_URL=http://localhost:3000,http://127.0.0.1:3000
SANCTUM_STATEFUL_DOMAINS=localhost:3000,127.0.0.1:3000,localhost:8000,127.0.0.1:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=bp_sport
DB_USERNAME=root
DB_PASSWORD=

SESSION_DRIVER=database
CACHE_STORE=database
QUEUE_CONNECTION=database
~~~

Sesuaikan port, username, dan password MySQL Laragon. PHP memerlukan pdo_mysql dan fileinfo; pengujian gambar memakai GD. Composer memerlukan ZIP atau utilitas ekstraksi.

Jika APP_KEY kosong, jalankan **php artisan key:generate**. Kemudian:

~~~powershell
php artisan config:clear
php artisan migrate
php artisan storage:link
php artisan app:create-admin
composer run dev
~~~

Pembuatan admin meminta nama, email, password minimal 12 karakter, dan konfirmasi password. Tidak ada password admin bawaan atau registrasi publik.

Backend dapat diakses pada [localhost:8000](http://localhost:8000). Gunakan hostname yang sama dengan frontend saat login, misalnya keduanya localhost. /up memeriksa boot aplikasi; /api/designs memeriksa katalog. Route / mengembalikan 404. Pada Apache, DocumentRoot menunjuk backend/public. Pada Windows, storage:link mungkin memerlukan Developer Mode atau izin membuat symbolic link.

Konten dan akun yang sudah tersimpan tetap berada di MySQL. Instalasi baru hanya membuat tabel; setelah membuat admin, isi pengaturan toko, kategori, desain, harga, bahan, kerah, dan ulasan melalui admin. DatabaseSeeder tidak mengisi konten sehingga db:seed tidak memulihkan kategori atau produk yang telah dihapus.

Gambar katalog awal yang sudah diimpor tetap disimpan di storage/app/public/seed/images/. Upload baru disimpan oleh ImageService pada folder designs/, pricing-packages/, materials/, collars/, atau site/. Backend tidak membutuhkan folder frontend untuk menjalankan API atau migrasi.

Backup konten dilakukan dengan ekspor database MySQL dan salinan penyimpanan gambar; tidak ada JSON katalog sebagai backup. Status **is_example: true** pada testimoni tetap ditampilkan sebagai ulasan contoh.

## API publik

| GET endpoint | Hasil |
| --- | --- |
| /api/categories, /api/categories/{slug} | Daftar/detail kategori. |
| /api/designs, /api/designs/{slug} | Desain beserta kategori dan galeri. |
| /api/pricing-packages, /api/pricing-packages/{slug} | Paket beserta opsi harga. |
| /api/materials, /api/materials/{slug} | Daftar/detail bahan. |
| /api/collars, /api/collars/{slug} | Daftar/detail kerah. |
| /api/testimonials, /api/testimonials/{id} | Daftar/detail testimoni. |
| /api/site-settings | Identitas, WhatsApp, logo, dan media sosial. |

List memakai pagination Laravel (data, links, meta), per_page default 24 dan maksimum 100. Konten nonaktif tidak ditampilkan di API publik; desain dari kategori nonaktif juga disembunyikan.

Filter q mencari nama, serta kode pada desain. Desain menerima category={slug} dan collection=all|popular|previous. Paket harga menerima group=printing|screen_print. Contoh: /api/designs?category=futsal&collection=popular&per_page=12.

Field API memakai snake_case, seperti color_label, is_previous_order, image_url, source_image_url, dan price_label. Harga opsi adalah string desimal, misalnya "125000.00". Label harga bahan/kerah tetap berupa teks sesuai katalog.

## Autentikasi dan CRUD admin

Sanctum memakai session cookie; CORS mengizinkan origin pada FRONTEND_URL dengan credentials. Gunakan credentials: "include" pada fetch.

1. GET /sanctum/csrf-cookie.
2. POST /api/auth/login dengan JSON email/password dan header X-XSRF-TOKEN dari cookie XSRF-TOKEN yang di-URL-decode.
3. Sertakan cookie pada request admin dan header CSRF pada POST/PUT/PATCH/DELETE.
4. GET /api/auth/me untuk memeriksa akun; POST /api/auth/logout untuk mengakhiri session.

Login dibatasi 5 percobaan per menit per kombinasi email dan IP. Guest menerima 401; akun tanpa hak admin menerima 403 pada CRUD.

Contoh login browser:

~~~javascript
const api = "http://localhost:8000";
await fetch(api + "/sanctum/csrf-cookie", {
  credentials: "include",
  headers: { Accept: "application/json" },
});
const cookie = document.cookie.split("; ").find(value => value.startsWith("XSRF-TOKEN="));
const csrf = cookie ? decodeURIComponent(cookie.slice("XSRF-TOKEN=".length)) : "";
const response = await fetch(api + "/api/auth/login", {
  method: "POST",
  credentials: "include",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-XSRF-TOKEN": csrf,
  },
  body: JSON.stringify({ email, password }),
});
~~~

CRUD tersedia untuk categories, designs, pricing-packages, materials, collars, testimonials:

| Method | Endpoint |
| --- | --- |
| GET | /api/admin/{resource} |
| POST | /api/admin/{resource} |
| GET | /api/admin/{resource}/{id} |
| PUT/PATCH | /api/admin/{resource}/{id} |
| DELETE | /api/admin/{resource}/{id} |
| PUT/PATCH | /api/admin/site-settings |

Admin menggunakan ID numerik. Create mengembalikan 201, update 200, delete 204. Update SiteSetting membuat record pertama (201) jika belum ada; pembaruan berikutnya 200.

## Payload dan upload

| Entitas | Field wajib saat membuat |
| --- | --- |
| Category | name, slug |
| Design | category_id, slug, code, name, description, color_label, accent_color, images[] |
| PricingPackage | slug, group, name, description, condition, image, options[] |
| Material | slug, name, price_label, image |
| Collar | slug, number, name, price_label, image |
| Testimonial | name, team, quote, initials; tentukan is_example sesuai status konten |
| SiteSetting | name, tagline, whatsapp pada pembuatan pertama |

Konten katalog menerima is_active dan sort_order. Desain juga menerima is_popular dan is_previous_order. Slug memakai huruf kecil/angka dan tanda minus. WhatsApp berupa nomor internasional tanpa +, misalnya 6281234567890. Aturan lengkap terdapat pada FormRequest.

Upload menerima JPG/JPEG/PNG/WebP maksimal 5 MB per gambar, dimensi maksimal 5000×5000. SVG ditolak. Gunakan FormData dan biarkan browser mengatur Content-Type.

Untuk update multipart, kirim **POST ke endpoint ID** dengan field **_method=PATCH**. PHP menangani upload multipart melalui POST, kemudian Laravel melakukan method spoofing. Update tanpa file bisa memakai PATCH JSON.

Galeri desain harus berisi 1–12 gambar. images[] menambahkan gambar; remove_image_ids[] menghapus gambar milik desain; image_order[], jika dikirim, harus berisi seluruh ID gambar yang tersisa. Untuk mengatur urutan gambar baru, upload dahulu, ambil ID dari respons, lalu kirim update urutan terpisah. Gambar pertama menjadi sampul.

Paket mempunyai 1–20 opsi. Setiap opsi berisi label, price nonnegatif maksimal dua desimal, unit=atasan|setel, dan opsional sort_order. Pada update, options[] mengganti seluruh daftar: sertakan id untuk opsi lama yang dipertahankan dan tanpa id untuk opsi baru. ID dari paket lain ditolak.

~~~json
{
  "options": [
    { "id": 1, "label": "Atasan", "price": 100000, "unit": "atasan" },
    { "label": "Setelan", "price": 125000, "unit": "setel" }
  ]
}
~~~

Upload memakai nama yang dibuat backend. Transaksi gagal membersihkan upload baru dan mempertahankan gambar lama. File upload lama dihapus setelah transaksi berhasil; gambar seed yang dapat dipakai bersama tetap disimpan.

## Pengujian

~~~powershell
composer validate --strict
php artisan route:list --path=api
php artisan test
php vendor/bin/pint --test
~~~

PHPUnit memakai SQLite in-memory, session/cache array, dan Storage fake. Cakupan: CRUD, hak akses, cookie login, CSRF, CORS, validasi gambar/harga, rollback upload, galeri, cascade, serta seeder tanpa duplikasi.

Pengujian ini tidak membuktikan koneksi atau migrasi MySQL Laragon. Jalankan setup MySQL di atas untuk pemeriksaan lokal. Pertahankan database serta storage/app/public saat deployment. .env, vendor, dan file runtime tidak masuk Git.
