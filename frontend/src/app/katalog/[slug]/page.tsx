import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDesign, getDesignPage } from "@/lib/api/catalog";
import { DesignGallery } from "@/components/catalog/design-gallery";
import { DesignCard } from "@/components/catalog/design-card";
import { WhatsAppLink } from "@/components/ui/whatsapp-link";
import { Check, ArrowRight } from "lucide-react";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const d = await getDesign(slug);
  return {
    title: d?.name ?? "Desain tidak ditemukan",
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
        <DesignGallery design={design} />
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
            <span>Warna referensi</span>
            <strong>
              <i className="color-dot" style={{ background: design.accent }} />
              {design.color}
            </strong>
          </div>
          <h2>Satu desain. Banyak kemungkinan.</h2>
          <div className="custom-options">
            {[
              "Nama pemain",
              "Nomor punggung",
              "Logo tim / komunitas",
              "Kombinasi warna",
            ].map((t) => (
              <span key={t}>
                <Check size={17} />
                {t}
              </span>
            ))}
          </div>
          <div className="price-box">
            <small>DIBUAT SESUAI KEBUTUHAN TIM</small>
            <h3>Diskusikan harga</h3>
            <p>
              Harga, bahan, jumlah minimum, dan waktu produksi disepakati saat
              konsultasi.
            </p>
          </div>
          <Link className="text-link material-detail-link" href="/bahan-kerah">
            Lihat pilihan bahan & kerah <ArrowRight size={16} />
          </Link>
          <p className="ordering-help">Nama, nomor, logo, dan warna dapat diubah. Belum tahu bahan atau kerah yang cocok? Kami bantu pilih saat konsultasi.</p>
          <WhatsAppLink design={design}>Pesan desain ini via WhatsApp</WhatsAppLink>
          <p className="demo-note">
            Pemesanan dilanjutkan melalui WhatsApp. Tambahkan jumlah pesanan dan kebutuhanmu; harga akhir dikonfirmasi bersama toko.
          </p>
        </section>
      </div>
      <section className="section related">
        <div className="section-heading">
          <div>
            <span className="eyebrow">KEEP EXPLORING</span>
            <h2>Inspirasi lainnya.</h2>
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
