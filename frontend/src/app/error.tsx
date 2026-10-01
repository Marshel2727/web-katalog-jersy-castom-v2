"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return <main id="main" className="container empty-state" role="alert">
    <h1>Data belum dapat dimuat</h1>
    <p>Periksa koneksi dan pastikan backend aktif, lalu coba lagi.</p>
    <button className="button" onClick={reset}>Coba lagi</button>
  </main>;
}
