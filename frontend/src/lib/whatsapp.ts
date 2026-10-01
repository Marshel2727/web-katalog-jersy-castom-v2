import type { PricingPackage } from "../types/index.ts";

export function buildWhatsAppUrl(
  phone: string,
  design?: { name: string; code: string },
  pricingPackage?: PricingPackage,
): string | null {
  const digits = phone.replace(/[\s()+-]/g, "");
  const normalized = digits.startsWith("0") ? `62${digits.slice(1)}` : digits;
  if (!/^[1-9]\d{7,14}$/.test(normalized)) return null;
  const message = pricingPackage
    ? [
        `Halo BP Sport! Saya tertarik dengan paket ${pricingPackage.name}.`,
        pricingPackage.description,
        "",
        ...pricingPackage.options.map((option) =>
          `${option.label}: Rp${option.price.toLocaleString("id-ID")}/${option.unit}`,
        ),
        pricingPackage.condition,
        "",
        pricingPackage.options.length > 1
          ? "Saya ingin diskusi pilihan sablon dan penempatan nama, nomor, sponsor, atau logo untuk paket ini."
          : `Saya ingin diskusi desain custom untuk ${pricingPackage.description.toLowerCase()}.`,
        "Mohon konfirmasi harga akhir dan waktu produksinya. Terima kasih!",
      ].join("\n")
    : design
    ? `Halo BP Sport! Saya ingin diskusi custom jersey dengan referensi ${design.name} (${design.code}). Bisa dibantu untuk desain dan harganya?`
    : "Halo BP Sport! Saya ingin konsultasi pemesanan jersey atau kaos custom. Bisa dibantu untuk desain dan harganya?";
  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
}
