import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { SiteProvider } from "@/components/providers/site-provider";
import { getSiteForLayout } from "@/lib/api/site";
import { siteUrl } from "@/lib/site-url";
import "./globals.css";

export const dynamic = "force-dynamic";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

const defaultMetadata: Metadata = {
  metadataBase: siteUrl,
  verification: { google: "ANSYNoLjWtV1srX8JBzorvRiZVmCLhPPSyccutgrM-A" },
  title: {
    default: "BP Sport — Jersey & Kaos Custom",
    template: "%s | BP Sport",
  },
  description:
    "BP Sport melayani jersey sebagai produk utama serta kaos desain custom. Jelajahi katalog jersey dan diskusikan desain, nama, nomor, warna, serta logo melalui WhatsApp.",
  icons: { icon: "/images/bp-sport-icon.png" },
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "BP Sport",
    title: "BP Sport — Jersey & Kaos Custom",
    description:
      "Desain sesuai identitas tim kamu. Lihat katalog, paket harga, serta pilihan bahan dan kerah. Konsultasikan pesanan langsung melalui WhatsApp.",
    images: [{ url: "/images/bp-sport-emerald.jpg", alt: "Logo BP Sport dengan latar kain emerald" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "BP Sport — Jersey & Kaos Custom",
    description: "Jersey dan kaos custom untuk tim, komunitas, dan acara. Pilih desainmu dan konsultasikan melalui WhatsApp.",
    images: ["/images/bp-sport-emerald.jpg"],
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteForLayout();
  const title = site.name + " — Jersey & Kaos Custom";
  return {
    ...defaultMetadata,
    title: { default: title, template: "%s | " + site.name },
    description: site.tagline,
    openGraph: { ...defaultMetadata.openGraph, siteName: site.name, title, description: site.tagline },
    twitter: { ...defaultMetadata.twitter, title, description: site.tagline },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const site = await getSiteForLayout();
  return (
    <html lang="id" className={plusJakartaSans.variable}>
      <body className={plusJakartaSans.className}>
        <a href="#main" className="skip-link">
          Lewati ke konten
        </a>
        <SiteProvider site={site}>{children}</SiteProvider>
      </body>
    </html>
  );
}
