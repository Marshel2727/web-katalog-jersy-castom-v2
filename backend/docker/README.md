# Docker lokal: Laravel dan MySQL

Stack ini menjalankan backend PHP 8.3 + Apache dan MySQL 8.4. Frontend tetap dijalankan terpisah dari folder frontend. Tidak membutuhkan PHP atau Composer pada PATH Windows.

Database Docker bernama web-katalog-jersy, tetapi datanya terpisah dari database dengan nama sama di Laragon. MySQL Docker hanya tersedia di jaringan container, sehingga tidak memakai port 3306 Windows. Backend memakai localhost:8001.

## Jalankan dari root project

Aktifkan Docker Desktop dengan Linux containers. Konfigurasi lokal memakai port backend 8001 dan frontend 3001 supaya dapat berjalan bersama proyek lain. Sesuaikan DOCKER_BACKEND_PORT dan DOCKER_FRONTEND_PORT di .env.docker bila memakai port berbeda, serta alamat API pada frontend/.env.local.

~~~powershell
cd "C:\PROJECT WEB\web-katalog-jersy-castom"

powershell -NoProfile -ExecutionPolicy Bypass -File .\backend\docker\setup.ps1
docker compose --env-file .env.docker config --quiet
docker compose --env-file .env.docker up -d --build --wait
~~~

Build pertama mengunduh image dan dependensi Composer. Tunggu selesai sebelum menjalankan migrasi:

~~~powershell
docker compose --env-file .env.docker exec --user www-data backend php artisan migrate
docker compose --env-file .env.docker exec --user www-data backend php artisan app:create-admin
docker compose --env-file .env.docker ps
~~~

Perintah create-admin meminta nama, email, dan password. Jalankan hanya saat ingin membuat akun admin baru.

Periksa API:

~~~powershell
Invoke-RestMethod -Uri "http://localhost:8001/api/designs"
~~~

Script setup membuat APP_KEY jika kosong dan membuat .env.docker dengan password acak jika file belum ada. Kunci dan password yang sudah ada dipertahankan. Backend membaca APP_KEY dari backend/.env; kredensial MySQL Docker dibaca dari .env.docker. Compose mengganti DB_HOST menjadi mysql, tanpa mengubah konfigurasi MySQL Laragon di file backend/.env.

## File dan data

| File atau volume | Fungsi |
| --- | --- |
| compose.yaml di root | Service backend/MySQL, health check, port, dan volume. |
| .dockerignore di root | Membatasi build context serta mengecualikan .env, vendor, cache, dan database SQLite. |
| backend/Dockerfile | Image PHP/Apache, ekstensi, dan instalasi Composer dari lock file. |
| backend/docker/entrypoint.sh | Membuat direktori runtime, izin storage, dan symbolic link gambar. |
| backend/docker/apache.conf | DocumentRoot Laravel public dan rewrite. |
| backend/docker/php.ini | Batas upload yang sesuai validasi API. |
| backend/.env | Konfigurasi aplikasi dan APP_KEY, tidak masuk image. |
| .env.docker | Password dan parameter Docker lokal, tidak masuk Git atau image. |
| mysql_data | Penyimpanan database yang bertahan saat container dibuat ulang. |
| backend_storage | Upload, aset seed, dan storage Laravel yang bertahan saat container dibuat ulang. |

Backend tidak lagi menyalin gambar atau data dari frontend saat build. Konten tersimpan di MySQL dan gambar di volume backend_storage. Gambar awal yang sudah diimpor tetap tersedia pada seed/images/; upload berikutnya melalui admin. Instalasi baru memakai database kosong dan diisi lewat admin atau pemulihan backup. Migrasi dijalankan dengan perintah di atas, bukan otomatis saat container restart.

Image tidak memasang dependensi development atau menjalankan frontend. Frontend bisa diakses seperti biasa pada localhost:3001. Frontend telah terhubung ke API, termasuk halaman admin. Jalankan dari folder frontend dengan npm.cmd run dev -- --port 3001.

## Operasi berikutnya

Melihat log:

~~~powershell
docker compose --env-file .env.docker logs --tail=100 backend mysql
~~~

Setelah mengubah kode backend atau gambar sumber, build ulang:

~~~powershell
docker compose --env-file .env.docker up -d --build --wait
docker compose --env-file .env.docker exec --user www-data backend php artisan migrate
~~~

Menghentikan stack dengan data tetap disimpan:

~~~powershell
docker compose --env-file .env.docker down
~~~

Jangan menambahkan -v pada down jika ingin mempertahankan database dan gambar. Password .env.docker harus tetap sama setelah volume MySQL diinisialisasi; mengganti file password saja tidak mengubah password user di database.

Jika port 8000 sudah dipakai, ubah DOCKER_BACKEND_PORT di .env.docker (misalnya 8001), jalankan up kembali, dan akses API pada port tersebut. APP_URL serta domain Sanctum menyesuaikan port ini.

Stack ini untuk pengembangan lokal: APP_ENV=local dan APP_DEBUG=true. Backend hanya dipublikasikan ke loopback Windows.

## Validasi dan referensi

Validasi pada 1 Oktober 2026: build image berhasil, kedua container healthy, migrasi dan seeder berhasil pada MySQL Docker. Pemeriksaan HTTP berhasil untuk 18 desain, 21 bahan, 5 paket, pengaturan toko, gambar seed (200), dan penolakan akses admin tanpa login (401). Pengujian dilakukan pada project Docker sementara dan port 18080.

Validasi config tidak membuktikan image dapat dibangun atau MySQL berjalan. Verifikasi runtime dengan build/up, migrate, ps, serta request /api/designs.

Konfigurasi mengacu pada [startup order Docker Compose](https://docs.docker.com/compose/how-tos/startup-order/), [image PHP resmi](https://hub.docker.com/_/php), dan [deployment Laravel](https://laravel.com/framework/docs/13.x/deployment).
