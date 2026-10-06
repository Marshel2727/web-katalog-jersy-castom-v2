import type { Metadata } from "next";
import Link from "next/link";
import { FaqBrowser } from "@/components/faq/faq-browser";
import { HelpCircle, Check, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Tanya Jawab (Q&A) Seputar Pemesanan Jersey Custom",
  description:
    "Pertanyaan yang sering diajukan seputar pemesanan jersey custom BP Sport: alur pesan, minimal order 6 pcs, pilihan bahan dry-fit, ukuran, sistem pembayaran, dan garansi.",
  alternates: { canonical: "/faq/" },
};

export default function FaqPage() {
  return (
    <main id="main" className="container faq-page">
      {/* BREADCRUMB */}
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Beranda</Link>
        <span>/</span>
        <span>Tanya Jawab (Q&A)</span>
      </nav>

      {/* HERO SECTION Q&A */}
      <section className="faq-hero">
        <span className="eyebrow">
          <HelpCircle size={14} className="inline-icon" /> PUSAT BANTUAN & TANYA JAWAB
        </span>
        <h1>
          Pertanyaan sering diajukan.
          <br />
          <span className="lime">Jawaban lengkap di sini.</span>
        </h1>
        <p className="faq-hero-lead">
          Pelajari alur pemesanan jersey custom tim kamu, ketentuan minimal order mulai 6 pcs,
          spesifikasi bahan dry-fit berpori, hingga kepastian waktu produksi dan sistem pembayaran.
        </p>

        <div className="faq-hero-tags">
          <span>
            <Check size={14} /> Minimal Order Mulai 6 Pcs
          </span>
          <span>
            <Check size={14} /> Bebas Custom Nama, Nomor & Logo
          </span>
          <span>
            <Check size={14} /> Garansi Cetak Sublimasi Anti-Luntur
          </span>
        </div>
      </section>

      {/* ACCORDION BROWSER DENGAN PENCARIAN & KATEGORI */}
      <FaqBrowser />
    </main>
  );
}
