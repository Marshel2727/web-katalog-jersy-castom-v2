# Struktur proyek

- `frontend/` berisi aplikasi Next.js, aset, konfigurasi, scripts, dan tests.
- `backend/` berisi Laravel 13. Jalankan perintah Composer/Artisan dari folder tersebut; backend tidak memakai npm atau Vite.
- Jalankan perintah npm dari `frontend/`. Dokumentasi Next.js terpasang berada di `frontend/node_modules/next/dist/docs/`.
- Batasi perubahan pada tugas yang diminta. Pemisahan folder tidak mengubah fitur atau menghubungkan frontend ke backend.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
