import type { Metadata } from "next";
import {
  Hero,
  FeaturedDesigns,
  PricingSummary,
  PreviousOrders,
  OrderingSteps,
  Reviews,
  ClosingCta,
} from "@/components/home/home-sections";
import { MaterialsPreview } from "@/components/materials/materials-preview";

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

      {/* 6. Pilihan bahan dry-fit & model kerah */}
      <MaterialsPreview materials={materials} collars={collars} />

      {/* 7. Ulasan & Testimoni Komunitas */}
      <Reviews testimonials={testimonials} />

      {/* 8. Penutup & Konsultasi WhatsApp */}
      <ClosingCta />
    </main>
  );
}
