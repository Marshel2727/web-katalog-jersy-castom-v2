import type { Metadata } from "next";
import {
  Hero,
  FeaturedDesigns,
  CustomSection,
  PreviousOrders,
  OrderingSteps,
  Reviews,
  ClosingCta,
} from "@/components/home/home-sections";
import { MaterialsPreview } from "@/components/materials/materials-preview";
import Link from "next/link";
import { OrderingFaq } from "@/components/home/ordering-faq";

export const metadata: Metadata = { alternates: { canonical: "/" } };

import { getDesigns, getMaterials, getCollars, getTestimonials } from "@/lib/api/catalog";

export default async function Home() {
  const [designs, materials, collars, testimonials] = await Promise.all([getDesigns(), getMaterials(), getCollars(), getTestimonials()]);
  return (
    <main id="main">
      <Hero />
      <FeaturedDesigns designs={designs} />
      <div className="container pricing-teaser"><div><span className="eyebrow">PAKET JERSEY BP SPORT</span><h2>Sudah punya desain incaran?</h2><p>Lihat harga printing dan setelan sablon beserta isi paketnya.</p></div><Link className="button" href="/paket-harga">Lihat Paket Harga ↗</Link></div>
      <CustomSection />
      <MaterialsPreview materials={materials} collars={collars} />
      <PreviousOrders designs={designs} />
      <OrderingSteps />
      <OrderingFaq />
      <Reviews testimonials={testimonials} />
      <ClosingCta />
    </main>
  );
}
