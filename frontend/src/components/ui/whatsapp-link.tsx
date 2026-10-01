"use client";
import { useSite } from "@/components/providers/site-provider";
import type { PricingPackage } from "@/types";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { MessageCircle, ArrowUpRight } from "./icon";
export function WhatsAppLink({
  design,
  pricingPackage,
  children = "Konsultasi via WhatsApp",
  className = "",
}: {
  design?: { name: string; code: string };
  pricingPackage?: PricingPackage;
  children?: React.ReactNode;
  className?: string;
}) {
  const siteConfig = useSite();
  const url = buildWhatsAppUrl(siteConfig.whatsapp, design, pricingPackage);
  if (!url)
    return (
      <span className={`wa-unavailable ${className}`}>
        <span className="button disabled" aria-disabled="true">
          <MessageCircle size={18} />
          {children}
        </span>
        <small>WhatsApp toko belum tersedia</small>
      </span>
    );
  return (
    <a
      className={`button ${className}`}
      href={url}
      target="_blank"
      rel="noopener noreferrer"
    >
      <MessageCircle size={18} />
      {children}
      <ArrowUpRight size={17} />
    </a>
  );
}
