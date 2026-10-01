import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDesign, getDesignPage } from "@/lib/api/catalog";
import { DesignGallery } from "@/components/catalog/design-gallery";
import { DesignCard } from "@/components/catalog/design-card";
import { WhatsAppLink } from "@/components/ui/whatsapp-link";
import { Check, ArrowRight, ArrowUpRight, ShieldCheck, Sparkles } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const d = await getDesign(slug);
  return {
    title: d?.name ? `${d.name} — Jersey Custom BP Sport` : "Desain tidak ditemukan",
    description: d?.description,
    alternates: { canonical: `/katalog/${slug}/` },
  };
}

export default async function DetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const design = await getDesign(slug);
  if (!design) notFound();
  const { data: designs } = await getDesignPage({ per_page: 5 });

  return (
    <main id="main" className="container detail-page">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Beranda</Link>
        <span>/</span>
        <Link href="/katalog">Katalog</Link>
        <span>/</span>
        <span>{design.name}</span>
      </nav>

      <div className="detail-grid">
        {/* Kolom Kiri: Galeri Foto Produk */}
        <DesignGallery design={design} />

        {/* Kolom Kanan: Alur Informasi & Keputusan Pembelian */}
        <section className="detail-info">
          <span className="eyebrow">
            {design.category.toUpperCase()} / {design.code}
          </span>
          <h1>
            {design.name}
            <span className="lime">.</span>
          </h1>
          <p className="detail-description">{design.description}</p>

          <div className="detail-spec">
            <span>Warna referensi model:</span>
            <strong>
              <i className="color-dot" style={{ background: design.accent }} />
              {design.color}
            </strong>
          </div>

          {/* 1. Opsi Penyesuaian Bebas */}
          <div className="detail-custom-section">
            <h2>Bebas disesuaikan untuk tim kamu:</h2>
            <div className="custom-options">
              {[
                "Nama & nomor punggung bebas",
                "Logo tim & sponsor dada/lengan",
                "Kombinasi warna bisa diubah",
                "Pilihan kerah O-Neck, V-Neck, atau Polo",
              ].map((t) => (
                <span key={t}>
                  <Check size={16} />
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* 2. Rekomendasi Paket & Estimasi Anggaran */}
          <div className="detail-package-card">
            <div className="package-tag-row">
              <span className="package-tag">
                <Sparkles size={13} /> REKOMENDASI PAKET TURNAMEN
              </span>
              <span className="package-order-min">Min. order 6 pcs</span>
            </div>

            <div className="detail-price-highlight">
              <span className="price-label">Kisaran Anggaran Paket:</span>
              <div className="price-range">
                <strong>Rp 95.000 – Rp 135.000</strong>
                <small>/ stel (baju + celana)</small>
              </div>
            </div>

            <p className="package-included-note">
              Sudah termasuk kain dry-fit premium, cetak full sublimasi anti-luntur, sablon/printing nama pemain, nomor punggung, serta logo tim kamu.
            </p>

            <div className="detail-links-group">
              <Link className="text-link" href="/paket-harga">
                Lihat rincian paket harga lengkap <ArrowRight size={15} />
              </Link>
              <Link className="text-link" href="/bahan-kerah">
                Lihat opsi bahan dry-fit & model kerah <ArrowRight size={15} />
              </Link>
            </div>
          </div>

          {/* 3. Syarat & Garansi */}
          <div className="detail-guarantee">
            <span>
              <ShieldCheck size={17} /> Garansi jahitan rapi & warna sublimasi tajam
            </span>
            <small>
              Punya ide kombinasi lain atau ingin menambah sponsor tim? Kami bantu arahkan saat konsultasi.
            </small>
          </div>

          {/* 4. Aksi Utama: Konsultasikan Desain Ini */}
          <div className="detail-cta-wrapper">
            <WhatsAppLink design={design} className="button detail-wa-btn">
              Konsultasikan Desain Ini via WhatsApp <ArrowRight size={18} />
            </WhatsAppLink>
            <p className="demo-note">
              Pesan WhatsApp otomatis menyertakan kode referensi <strong>{design.code} ({design.name})</strong> agar langsung diproses admin toko kami.
            </p>
          </div>
        </section>
      </div>

      {/* Sticky Bottom Action Bar di Ponsel */}
      <aside className="mobile-sticky-bar" aria-label="Konsultasi cepat jersey">
        <div className="mobile-sticky-info">
          <strong>{design.name}</strong>
          <span>Mulai Rp 95rb/stel • Min. 6 pcs</span>
        </div>
        <WhatsAppLink design={design} className="button mobile-sticky-btn">
          Konsultasi WA <ArrowUpRight size={15} />
        </WhatsAppLink>
      </aside>

      {/* Desain Inspirasi Lainnya */}
      <section className="section related">
        <div className="section-heading">
          <div>
            <span className="eyebrow">INSPIRASI LAINNYA</span>
            <h2>Desain rekomendasi untuk kamu.</h2>
          </div>
          <Link className="text-link" href="/katalog">
            Semua desain <ArrowRight size={18} />
          </Link>
        </div>
        <div className="design-grid">
          {designs
            .filter((d) => d.slug !== slug)
            .slice(0, 4)
            .map((d) => (
              <DesignCard key={d.slug} design={d} />
            ))}
        </div>
      </section>
    </main>
  );
}
