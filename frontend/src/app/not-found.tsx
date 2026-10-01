import Link from "next/link";
export default function NotFound() {
  return (
    <main id="main" className="container not-found">
      <span className="eyebrow">404 / OUT OF THE FIELD</span>
      <h1>
        Sepertinya kamu
        <br />
        keluar lapangan.
      </h1>
      <p>
        Halaman atau desain ini tidak ditemukan. Yuk, cari inspirasi lainnya.
      </p>
      <Link href="/katalog" className="button">
        Kembali ke katalog ↗
      </Link>
    </main>
  );
}
