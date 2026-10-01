export type JerseyDesign = {
  slug: string;
  code: string;
  name: string;
  category: string;
  description: string;
  color: string;
  accent: string;
  popular: boolean;
  previousOrder: boolean;
  images: string[];
};
export type Testimonial = {
  name: string;
  team: string;
  quote: string;
  initials: string;
  isExample: boolean;
};
export type SiteConfig = { name: string; whatsapp: string; tagline: string; logo?: string | null; instagram?: string | null; tiktok?: string | null };
export type PricingPackage = {
  id: string;
  name: string;
  image: string;
  description: string;
  condition: string;
  options: { label: string; price: number; unit: "atasan" | "setel" }[];
};

export type MaterialOption = {
  id: string;
  name: string;
  image: string;
  alt: string;
  priceLabel: string;
  source: string;
};
export type CollarOption = MaterialOption & { number: number };
