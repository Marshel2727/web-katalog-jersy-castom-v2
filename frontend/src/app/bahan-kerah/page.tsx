import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getMaterials, getCollars } from "@/lib/api/catalog";
import { OptionGallery } from "@/components/materials/option-gallery";
import { WhatsAppLink } from "@/components/ui/whatsapp-link";
import { Check, ArrowDown, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Pilihan Bahan & Kerah",
  description:
    "Lihat pilihan jenis kain dan model kerah BP Sport. Temukan tekstur dan bentuk pilihan untuk jersey kamu, lalu diskusikan detailnya saat konsultasi.",
  alternates: { canonical: "/bahan-kerah/" },
};

export default async function MaterialsPage() {
  const [materials, collars] = await Promise.all([getMaterials(), getCollars()]);
  const spotlight = materials[0];
  return (
    <main id="main" className="container materials-page">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Beranda</Link>
        <span>/</span>
        <span>Bahan & Kerah</span>
      </nav>

      {/* HERO SECTION: BALANCED 2-COLUMN SHOWCASE */}
      <section className="materials-hero">
        <div className="materials-hero-grid">
          {/* KOLOM KIRI: INFO & AKSI UTAMA */}
          <div className="materials-hero-left">
            <span className="eyebrow">
              <Sparkles size={13} className="inline-icon" /> BP SPORT / THE FINISHING TOUCH
            </span>
            <h1>
              Detail pilihan.
              <br />
              <span className="lime">Nyaman jadi kamu.</span>
            </h1>
            <p className="materials-hero-lead">
              Eksplorasi {materials.length} jenis kain dan {collars.length} model kerah pilihan untuk jersey tim kamu.
              Setiap kain memiliki karakteristik sirkulasi udara, elastisitas, dan tekstur khusus
              yang disesuaikan dengan kebutuhan bertanding.
            </p>

            <div className="materials-quick-actions">
              <a href="#jenis-kain" className="button">
                {materials.length} Jenis Kain <ArrowDown size={15} />
              </a>
              <a href="#model-kerah" className="button button-outline">
                {collars.length} Model Kerah <ArrowDown size={15} />
              </a>
            </div>

            <div className="materials-feature-tags">
              <span>
                <Check size={14} /> 100% Dry-Fit Athletic
              </span>
              <span>
                <Check size={14} /> Sirkulasi Maksimal
              </span>
              <span>
                <Check size={14} /> Jahitan Standar Turnamen
              </span>
            </div>
          </div>

          {/* KOLOM KANAN: SPOTLIGHT CARD (MENGISI RUANG KOSONG) */}
          <div className="materials-hero-right">
            <div className="materials-spotlight-card">
              <div className="spotlight-badge-row">
                <span className="spotlight-tag">★ BAHAN TERPOPULER</span>
                <span className="spotlight-sub">Pilihan Utama Tim</span>
              </div>

              <div className="spotlight-preview-box">
                <Image
                  src={spotlight?.image || "/images/bp-sport-emerald.jpg"}
                  alt={spotlight?.alt || "BP Sport"}
                  width={380}
                  height={220}
                  className="spotlight-img"
                  priority
                />
                <div className="spotlight-caption-overlay">
                  <strong>{spotlight?.name || "Pilihan kain"}</strong>
                  <small>{spotlight?.priceLabel || "Diskusikan bahan saat konsultasi."}</small>
                </div>
              </div>

              <div className="spotlight-specs-list">
                <div className="spec-row">
                  <div className="spec-text">
                    <span>Sirkulasi Udara (Breathability)</span>
                    <strong>98%</strong>
                  </div>
                  <div className="spec-bar"><div className="spec-progress" style={{ width: "98%" }} /></div>
                </div>
                <div className="spec-row">
                  <div className="spec-text">
                    <span>Ketahanan Tarikan (Durability)</span>
                    <strong>92%</strong>
                  </div>
                  <div className="spec-bar"><div className="spec-progress" style={{ width: "92%" }} /></div>
                </div>
                <div className="spec-row">
                  <div className="spec-text">
                    <span>Cepat Kering (Quick-Dry)</span>
                    <strong>96%</strong>
                  </div>
                  <div className="spec-bar"><div className="spec-progress" style={{ width: "96%" }} /></div>
                </div>
              </div>

              <div className="spotlight-consultation">
                <p>Bingung memilih kain atau kerah yang tepat untuk cabang olahraga tim kamu?</p>
                <WhatsAppLink className="spotlight-btn">Konsultasi Bahan & Kerah</WhatsAppLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      <p className="materials-price-note">
        * FREE, nilai K/STEL, dan +K ditampilkan sesuai referensi pilihan
        bahan/kerah, bukan harga jersey lengkap. Harga akhir dan kesesuaian
        dengan pesanan dikonfirmasi saat konsultasi.
      </p>
      <section id="jenis-kain" className="materials-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">01 / JENIS KAIN</span>
            <h2>Tekstur yang kamu pilih.</h2>
          </div>
          <p className="muted">{materials.length} pilihan · Diurutkan sesuai kelompok harga</p>
        </div>
        <OptionGallery items={materials} />
      </section>
      <section id="model-kerah" className="materials-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">02 / MODEL KERAH</span>
            <h2>Karakter di setiap potongan.</h2>
          </div>
          <p className="muted">{collars.length} model · Nomor sesuai referensi</p>
        </div>
        <OptionGallery items={collars} />
      </section>
      <section className="materials-consultation">
        <h2>Sudah punya pilihan?</h2>
        <p>
          Sebutkan nama kain dan nomor kerah saat konsultasi. Kami bantu
          diskusikan detailnya untuk jersey atau kaos custom kamu.
        </p>
        <WhatsAppLink />
      </section>
    </main>
  );
}
