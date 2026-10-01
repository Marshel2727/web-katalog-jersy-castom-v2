import type { Metadata } from "next";
import {
  Hero,
  FeaturedDesigns,
  PricingSummary,
  PreviousOrders,
  OrderingSteps,
  CustomSection,
  Reviews,
  ClosingCta,
} from "@/components/home/home-sections";
import { MaterialsPreview } from "@/components/materials/materials-preview";
import { OrderingFaq } from "@/components/home/ordering-faq";

export const metadata: Metadata = { alternates: { canonical: "/" } };

import { getDesigns, getMaterials, getCollars, getTestimonials } from "@/lib/api/catalog";

export default async function Home() {
  const [designs, materials, collars, testimonials] = await Promise.all([
    getDesigns(),
    getMaterials(),
    getCollars(),
    getTestimonials(),
  ]);

  return (
    <main id="main">
      {/* 1. Pembuka dan foto produk: BP Sport menyediakan apa? */}
      <Hero />

      {/* 2. Desain pilihan: Ada desain yang cocok untuk tim saya? */}
      <FeaturedDesigns designs={designs} />

      {/* 3. Ringkasan paket harga: Apakah sesuai anggaran? */}
      <PricingSummary />

      {/* 4. Hasil produksi asli: Bagaimana kualitas hasil jadinya? */}
      <PreviousOrders designs={designs} />

      {/* 5. Cara pesan: Apa yang perlu saya siapkan? */}
      <OrderingSteps />

      {/* 6. Simulator opsional: Bagaimana kalau dibuat lebih personal? */}
      <CustomSection />

      {/* Pengenalan singkat bahan dry-fit & model kerah */}
      <MaterialsPreview materials={materials} collars={collars} />

      {/* 7. FAQ dan konsultasi: Masih ada hal yang perlu ditanyakan? */}
      <OrderingFaq />
      <Reviews testimonials={testimonials} />
      <ClosingCta />
    </main>
  );
}
