# Deploy frontend ke Vercel dan backend ke VPS

File ini menyiapkan deployment yang kamu jalankan sendiri. Contoh `tokokamu.com` harus diganti dengan domain milikmu. `compose.production.yaml` berdiri sendiri; jangan digabung dengan `compose.yaml` lokal.

## 1. Domain dan kebutuhan VPS

- Frontend: `https://tokokamu.com`, atau `https://www.tokokamu.com`, di Vercel.
- Backend: `https://api.tokokamu.com` di VPS Linux dengan Docker Engine dan Compose v2.
- Arahkan DNS A `api` ke IP VPS. Tambahkan AAAA hanya bila IPv6 VPS benar-benar tersedia.
- Port TCP 80 dan 443 harus tersedia dan terbuka di firewall VPS/provider. Caddy mengurus sertifikat HTTPS serta redirect HTTP. Jika VPS sudah menjalankan Nginx/Caddy pada port tersebut, sesuaikan reverse proxy yang sudah ada sebelum menjalankan stack ini.
- API dan frontend memakai domain induk yang sama karena admin menggunakan session cookie Sanctum. Domain Vercel bawaan/preview yang berbeda tidak dikonfigurasi untuk login admin pada template ini.

VPS menjalankan Laravel, MySQL, dan Caddy; frontend dijalankan oleh Vercel. MySQL dan Laravel tidak mempunyai port publik di Compose produksi. Subnet `172.30.50.0/24` digunakan untuk jaringan proxy; bila bentrok, ganti `DOCKER_SUBNET` dan `PROXY_IP` dengan subnet/IP yang sesuai. Laravel hanya mempercayai header forwarded dari IP Caddy tersebut.

## 2. Backup data Docker lokal di PowerShell

Lakukan sebelum pemindahan. Hentikan pengeditan konten admin sampai backup database dan gambar selesai agar keduanya konsisten. Perintah berikut membaca database/gambar, membuat arsip, dan tidak menghapus volume lokal.

```powershell
cd "C:\PROJECT WEB\web-katalog-jersy-castom"
New-Item -ItemType Directory -Path ".\deploy-backup" -Force | Out-Null

docker compose --env-file .env.docker exec -T mysql sh -c 'MYSQL_PWD="$MYSQL_PASSWORD" mysqldump --single-transaction --no-tablespaces --set-gtid-purged=OFF --user="$MYSQL_USER" "$MYSQL_DATABASE" > /tmp/catalog-backup.sql'
docker compose --env-file .env.docker cp mysql:/tmp/catalog-backup.sql .\deploy-backup\database.sql

docker compose --env-file .env.docker exec -T backend tar -czf /tmp/public-images.tar.gz -C /var/www/backend/storage/app/public .
docker compose --env-file .env.docker cp backend:/tmp/public-images.tar.gz .\deploy-backup\public-images.tar.gz

Get-Item .\deploy-backup\database.sql, .\deploy-backup\public-images.tar.gz | Select-Object Name, Length
```

Jalankan bertahap dan berhenti bila ada error. Backup SQL berisi akun admin dan konten yang sudah ada, sehingga backup terbaru perlu disimpan secara privat. Folder `deploy-backup/` diabaikan Git untuk file baru; snapshot `web-katalog-jersy-20261010-070458.sql` sudah dilacak dan disertakan di repository. Backup ini tidak menyalin cache/log/session file Laravel.

### Alternatif: memakai snapshot SQL Laragon dari repository

File [web-katalog-jersy-20261010-070458.sql](../deploy-backup/web-katalog-jersy-20261010-070458.sql) berisi struktur dan data Laragon pada 10 Oktober 2026. Jika memilih file ini, lewati ekspor SQL Docker di atas dan gunakan nama file tersebut pada langkah pemulihan. Untuk import lokal ke Laragon atau Docker, lihat [panduan pemulihan database](../README.md#memulihkan-data-dari-backup-sql).

Siapkan arsip gambar dari **instalasi Laravel Laragon yang menjadi sumber data**, bukan dari volume Docker yang berbeda. Dengan file gambar sumber tersedia di `backend/storage/app/public/`, jalankan dari root proyek di PowerShell:

```powershell
tar -czf .\deploy-backup\public-images.tar.gz -C .\backend\storage\app\public .
if ($LASTEXITCODE -ne 0) {
    throw "Pembuatan arsip gambar gagal. Periksa folder sumber."
}
```

SQL tidak memuat file foto. Pertahankan struktur subfolder gambar dan gunakan arsip yang sesuai dengan snapshot database. Snapshot dalam repository tidak diperbarui otomatis ketika konten di MySQL berubah; buat ekspor baru jika ingin memindahkan data terbaru.

Simpan juga nilai `APP_KEY` dari `backend/.env` secara privat untuk dipakai pada VPS. Jangan masukkan file `.env` ke repository, image, atau environment frontend Vercel.

## 3. Konfigurasi backend di VPS

Clone/upload source project ke `/opt/bp-sport` (atau folder pilihanmu), lalu gunakan shell Bash di VPS. Akun yang dipakai harus mempunyai akses Docker serta izin tulis pada folder project.

```bash
cd /opt/bp-sport
cp .env.production.example .env.production
chmod 600 .env.production
nano .env.production
```

Isi semua nilai berikut:

| Variabel | Isi |
| --- | --- |
| `ROOT_DOMAIN` | `tokokamu.com`, tanpa skema atau subdomain API. |
| `FRONTEND_DOMAIN` | `tokokamu.com` atau `www.tokokamu.com`, sesuai URL frontend yang benar-benar dipakai. |
| `API_DOMAIN` | `api.tokokamu.com`, tanpa `https://` atau `/api`. |
| `ACME_EMAIL` | Email milikmu untuk sertifikat. |
| `APP_KEY` | Nilai lengkap dari backend lokal ketika memindahkan data. |
| `DB_DATABASE` | Nama database target; default `web-katalog-jersy`. |
| `DB_USERNAME` | User aplikasi MySQL; gunakan `bp_app`, bukan `root`. |
| `DB_PASSWORD` | Password baru yang kuat untuk user aplikasi di VPS. |
| `MYSQL_ROOT_PASSWORD` | Password kuat yang berbeda untuk root MySQL di VPS. |

Untuk membuat password acak, jalankan `openssl rand -hex 32` dua kali dan masukkan hasil berbeda ke kedua kolom password. Untuk **instalasi baru tanpa data lokal**, key baru bisa dibuat dengan `printf 'base64:'; openssl rand -base64 32`. Saat memindahkan data gunakan key lama.

Definisikan fungsi Compose berikut di shell VPS agar setiap perintah selalu memakai konfigurasi produksi:

```bash
dc() { docker compose --env-file .env.production -f compose.production.yaml "$@"; }
dc config --quiet
dc build backend
dc run --rm --no-deps --entrypoint caddy caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile
dc up -d --wait mysql
```

Jangan lanjutkan bila validasi/build gagal. Compose produksi tidak membaca `backend/.env`; semua konfigurasi backend disediakan dari `.env.production` lewat Compose. `APP_ENV=production`, debug mati, cookie HTTPS, CORS frontend, domain session, serta alamat gambar ditetapkan oleh file produksi ini.

## 4. Pulihkan database dan gambar yang sudah ada

Langkah ini ditujukan untuk database VPS baru yang belum berisi konten. Bila sudah ada database produksi, buat backup database dan gambar produksi sebelum melakukan pemulihan karena import SQL dapat mengganti tabel yang sudah ada.

Pilih SQL hasil ekspor Docker (`deploy-backup/database.sql`) atau snapshot Laragon dalam repository (`deploy-backup/web-katalog-jersy-20261010-070458.sql`). Snapshot Laragon memuat `CREATE DATABASE` dan `USE web-katalog-jersy`; untuk file itu, isi `DB_DATABASE=web-katalog-jersy` pada `.env.production`. Mengganti nama database pada perintah client saja tidak mengganti target di dalam SQL.

Upload SQL pilihan dan arsip gambar yang sesuai dari PowerShell. Jika repository sudah di-clone di VPS, snapshot SQL sudah tersedia; arsip gambar tetap perlu dipindahkan. Ganti `user` dan `IP_VPS` dengan akun/IP VPS milikmu; folder project di VPS harus sudah ada dan bisa ditulis akun tersebut:

```powershell
cd "C:\PROJECT WEB\web-katalog-jersy-castom"
scp -r .\deploy-backup user@IP_VPS:/opt/bp-sport/
```

Lanjutkan di shell VPS yang sudah mempunyai fungsi `dc`:

```bash
cd /opt/bp-sport
# Pilih satu file SQL. Ganti menjadi deploy-backup/database.sql untuk ekspor Docker terbaru.
backup_sql="deploy-backup/web-katalog-jersy-20261010-070458.sql"
chmod 700 deploy-backup
chmod 600 "$backup_sql" deploy-backup/public-images.tar.gz

dc cp "$backup_sql" mysql:/tmp/catalog-backup.sql
dc exec -T mysql sh -c 'MYSQL_PWD="$MYSQL_PASSWORD" mysql --user="$MYSQL_USER" "$MYSQL_DATABASE" < /tmp/catalog-backup.sql'

dc up -d --wait backend
dc cp deploy-backup/public-images.tar.gz backend:/tmp/public-images.tar.gz
dc exec -T backend tar -xzf /tmp/public-images.tar.gz -C /var/www/backend/storage/app/public
dc exec -T backend chown -R www-data:www-data /var/www/backend/storage/app/public
dc exec --user www-data backend php artisan migrate --force

dc up -d --wait caddy
dc ps
curl --fail https://api.tokokamu.com/up
curl --fail https://api.tokokamu.com/api/designs
```

Ganti hostname pada kedua perintah curl dengan `API_DOMAIN` milikmu. Akun admin dari database lama ikut dipindahkan, sehingga gunakan email/password yang sama. Bila belum mempunyai akun admin, jalankan `dc exec --user www-data backend php artisan app:create-admin`.

Jika **tidak memindahkan data lokal**, lewati import SQL/arsip, jalankan backend, migrasi, buat admin, lalu jalankan Caddy. Database baru tidak mempunyai konten bawaan; isi pengaturan toko dan katalog melalui admin.

Volume produksi memakai nama project `bp-sport-production`, terpisah dari `bp-sport-catalog` lokal. Menyalin repository tidak memindahkan volume atau mengimpor SQL otomatis; import SQL pilihan dan pemulihan arsip gambar yang membawa konten serta foto ke server tujuan. Jangan memakai `down -v` untuk stack yang datanya ingin disimpan.

## 5. Frontend di Vercel

Push source yang sudah disiapkan ke repository milikmu, lalu Import Project di Vercel:

| Pengaturan | Nilai |
| --- | --- |
| Root Directory | `frontend` |
| Framework Preset | Next.js |
| Node.js Version | 24.x (juga ditetapkan di `package.json`) |
| Install Command | `npm ci --no-audit --no-fund` |
| Build Command | `npm run build` |
| Output Directory | Biarkan default Next.js; jangan isi `out`. |

`frontend/vercel.json` menyediakan framework serta perintah install/build. Tidak perlu membangun Docker frontend untuk deployment Vercel.

Pada Settings > Environment Variables, tambahkan untuk **Production** (ganti domain):

```dotenv
NEXT_PUBLIC_API_URL=https://api.tokokamu.com/api
API_SERVER_URL=https://api.tokokamu.com/api
NEXT_PUBLIC_SITE_URL=https://tokokamu.com
```

Contohnya juga ada di `frontend/.env.production.example`; Vercel tidak membaca file contoh itu secara otomatis. Jangan masukkan password MySQL atau APP_KEY ke Vercel. `API_SERVER_URL` harus URL yang dapat dijangkau Vercel, bukan `http://backend/api` atau `localhost`.

Tambahkan custom domain frontend di Settings > Domains dan ikuti record DNS yang ditampilkan Vercel. Gunakan URL yang sama dengan `FRONTEND_DOMAIN` di VPS. Deploy setelah environment diisi; perubahan `NEXT_PUBLIC_*` memerlukan redeploy karena nilainya dimasukkan ke bundle saat build. Login admin pada domain preview Vercel tidak termasuk konfigurasi ini.

## 6. Pemeriksaan setelah deploy

1. API `/up` dan `/api/designs` dapat diakses melalui HTTPS.
2. URL gambar dari respons API menggunakan domain API produksi dan mengembalikan gambar.
3. Katalog, detail, bahan, harga, dan pengaturan toko menampilkan data yang dipindahkan.
4. Login pada `https://tokokamu.com/admin/login/` berhasil menggunakan akun yang dipindahkan.
5. Simpan satu perubahan konten, upload gambar, dan pastikan hasilnya muncul di halaman pelanggan. Uji dengan data yang kamu pilih sendiri.

Laravel mempercayai IP Caddy yang dikonfigurasi, sehingga pagination dan URL request mengenali HTTPS. Cookie session tetap HttpOnly; XSRF-TOKEN dapat dibaca frontend untuk header CSRF. CORS hanya mengizinkan URL frontend produksi yang ditentukan.

## 7. Update berikutnya dan backup VPS

Sesudah backup dan memperbarui source di VPS:

```bash
cd /opt/bp-sport
dc build backend
dc up -d --wait backend
dc exec --user www-data backend php artisan migrate --force
dc logs --tail=100 backend caddy
```

Startup backend membuat link storage dan memperbarui cache konfigurasi saat `APP_ENV=production`. Migrasi tetap dijalankan secara eksplisit. Bila domain/environment berubah, jalankan `dc up -d --wait backend caddy`, lalu redeploy frontend Vercel dengan URL yang baru. Password MySQL hanya dipakai untuk inisialisasi volume baru; menggantinya dalam `.env.production` saja tidak mengubah password database yang sudah ada.

Backup database VPS dan gambar memakai perintah export yang sama seperti bagian 2, tetapi ganti `docker compose --env-file .env.docker` dengan `dc` dan gunakan path Bash. Simpan salinan backup di lokasi privat di luar VPS, bukan hanya dalam container. Simpan juga `.env.production` secara privat untuk pemulihan key/kredensial. Caddy menyimpan sertifikat dalam volume `caddy_data`.

Referensi: [Vercel monorepos](https://vercel.com/docs/monorepos), [versi Node Vercel](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions), [Laravel Sanctum](https://laravel.com/docs/13.x/sanctum), [deployment Laravel](https://laravel.com/docs/13.x/deployment), dan [HTTPS otomatis Caddy](https://caddyserver.com/docs/automatic-https).
