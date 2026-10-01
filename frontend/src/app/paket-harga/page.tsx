import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getPricing } from "@/lib/api/catalog";
import { PackageCard } from "@/components/pricing/package-card";
import { WhatsAppLink } from "@/components/ui/whatsapp-link";
import { Sparkles, Check, ArrowDown } from "lucide-react";

export const metadata: Metadata = {
  title: "Paket Harga Jersey",
  description:
    "Pilihan harga jersey printing dan setelan sablon BP Sport. Bandingkan isi paket, bahan lokal atau import, dan ketentuan pembelian.",
  alternates: { canonical: "/paket-harga/" },
};

export default async function PricingPage() {
  const { printingPackages, screenPrintPackages } = await getPricing();
  const spotlight = printingPackages[0] || screenPrintPackages[0];
  return (
    <main id="main" className="container pricing-page">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Beranda</Link>
        <span>/</span>
        <span>Paket Harga</span>
      </nav>

      {/* HERO SECTION: BALANCED 2-COLUMN SHOWCASE */}
      <section className="pricing-hero">
        <div className="pricing-hero-grid">
          {/* KOLOM KIRI: TEKS & NAVIGASI */}
          <div className="pricing-hero-left">
            <span className="eyebrow">
              <Sparkles size={13} className="inline-icon" /> BP SPORT / PILIH PAKETMU
            </span>
            <h1>
              Pas untuk tim.
              <br />
              <span className="lime">Jelas pilihannya.</span>
            </h1>
            <p className="pricing-hero-lead">
              Mulai dari atasan printing hemat hingga setelan sublimasi turnamen lengkap. Semua paket
              dibuat dengan standar jahitan rapi, warna tajam anti-luntur, dan bahan dry-fit nyaman.
            </p>

            <div className="pricing-hero-actions">
              <a href="#printing" className="button">
                Jersey Printing <ArrowDown size={15} />
              </a>
              <a href="#sablon" className="button button-outline">
                Setelan + Sablon <ArrowDown size={15} />
              </a>
            </div>

            <div className="pricing-feature-tags">
              <span>
                <Check size={14} /> Minimal Order Mulai 6 Pcs
              </span>
              <span>
                <Check size={14} /> Bebas Pasang Nama & Nomor
              </span>
              <span>
                <Check size={14} /> Garansi Jahitan Presisi
              </span>
            </div>
          </div>

          {/* KOLOM KANAN: SPOTLIGHT VALUE CARD (MENGISI RUANG KOSONG) */}
          <div className="pricing-hero-right">
            <div className="pricing-spotlight-card">
              <div className="spotlight-badge-row">
                <span className="spotlight-tag">★ PALING DIMINATI</span>
                <span className="spotlight-sub">Full Sublimasi</span>
              </div>

              <div className="spotlight-preview-box">
                <Image
                  src={spotlight?.image || "/images/bp-sport-emerald.jpg"}
                  alt={spotlight?.name || "Paket jersey"}
                  width={380}
                  height={220}
                  className="spotlight-img"
                  priority
                />
                <div className="spotlight-caption-overlay">
                  <strong>{spotlight?.name || "Paket jersey"}</strong>
                  <small>{spotlight?.description || "Konsultasikan paket untuk tim kamu."}</small>
                </div>
              </div>

              <div className="pricing-spotlight-perks">
                <div className="perk-row">
                  <Check size={14} />
                  <span>Baju printing depan, belakang, dan lengan</span>
                </div>
                <div className="perk-row">
                  <Check size={14} />
                  <span>Celana olahraga polos / senada</span>
                </div>
                <div className="perk-row">
                  <Check size={14} />
                  <span>Gratis pasang logo tim, nama pemain, dan sponsor</span>
                </div>
              </div>

              <div className="spotlight-consultation">
                <p>Ingin penawaran harga khusus untuk kuantitas tim atau komunitas besar?</p>
                <WhatsAppLink className="spotlight-btn">Konsultasi Hitung Budget</WhatsAppLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pricing-section" id="printing">
        <div className="section-heading">
          <div>
            <span className="eyebrow">01 / PRINTING</span>
            <h2>Desain bebas. Identitas penuh.</h2>
          </div>
          <p>Minimal order 6 pcs</p>
        </div>
        <div className="package-grid">
          {printingPackages.map((item) => (
            <PackageCard item={item} key={item.id} />
          ))}
        </div>
      </section>

      <section className="pricing-section" id="sablon">
        <div className="section-heading">
          <div>
            <span className="eyebrow">02 / SETELAN + SABLON</span>
            <h2>Lokal atau import, pilihan kamu.</h2>
          </div>
          <p>Harga untuk pembelian 12 pcs</p>
        </div>
        <p className="pricing-section-note">
          Penempatan logo, nama, nomor, dan sponsor dapat disesuaikan. Pilih kelengkapan sablon
          saat konsultasi.
        </p>
        <div className="package-grid package-grid-two">
          {screenPrintPackages.map((item) => (
            <PackageCard item={item} key={item.id} />
          ))}
        </div>
      </section>

      <aside className="pricing-footnote">
        <h2>Lengkapi dengan bahan & kerah pilihan.</h2>
        <p>
          Tambahan pilihan bahan atau kerah tidak otomatis termasuk dalam harga paket. Harga akhir
          dan detail produksi dikonfirmasi saat konsultasi.
        </p>
        <Link href="/bahan-kerah" className="text-link">
          Lihat pilihan bahan & kerah ↗
        </Link>
      </aside>
    </main>
  );
}
