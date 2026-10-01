import Image from "next/image";
import type { PricingPackage } from "@/types";
import { WhatsAppLink } from "@/components/ui/whatsapp-link";

export function PackageCard({ item }: { item: PricingPackage }) {
  return <article className="package-card">
    <div className="package-image"><Image src={item.image} alt={`Ilustrasi ${item.name} tampak depan dan belakang`} width={745} height={545} /></div>
    <div className="package-content"><h3>{item.name}</h3><p>{item.description}</p><span className="package-condition">{item.condition}</span>
      <ul className="package-prices">{item.options.map(option => <li key={option.label}><span>{option.label}</span><strong>{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(option.price)}<small>/{option.unit}</small></strong></li>)}</ul>
      <p className="package-extra-note">Pilihan bahan atau kerah tertentu dapat menambah biaya. Harga akhir dikonfirmasi melalui WhatsApp.</p>
      <WhatsAppLink pricingPackage={item}>Pesan paket ini via WhatsApp</WhatsAppLink>
    </div>
  </article>;
}
