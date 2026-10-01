import type { JerseyDesign, PricingPackage, MaterialOption, CollarOption, Testimonial, SiteConfig } from "../../types/index.ts";
import type { DesignDto, PricingPackageDto, MaterialDto, CollarDto, TestimonialDto, SiteSettingDto } from "./types.ts";
export const mapDesign = (item: DesignDto): JerseyDesign => ({
  slug: item.slug, code: item.code, name: item.name, category: item.category.name,
  description: item.description, color: item.color_label, accent: item.accent_color,
  popular: item.is_popular, previousOrder: item.is_previous_order, images: item.images.map((image) => image.image_url),
});
export const mapPackage = (item: PricingPackageDto): PricingPackage => ({
  id: item.slug, name: item.name, image: item.image_url, description: item.description, condition: item.condition,
  options: item.options.map((option) => ({ label: option.label, price: Number(option.price), unit: option.unit })),
});
export const mapMaterial = (item: MaterialDto): MaterialOption => ({ id: item.slug, name: item.name, image: item.image_url, alt: item.alt_text || item.name, priceLabel: item.price_label, source: item.source_image_url || item.image_url });
export const mapCollar = (item: CollarDto): CollarOption => ({ ...mapMaterial(item), number: item.number });
export const mapTestimonial = (item: TestimonialDto): Testimonial => ({ name: item.name, team: item.team, quote: item.quote, initials: item.initials, isExample: item.is_example });
export const mapSite = (item: SiteSettingDto): SiteConfig => ({ name: item.name, tagline: item.tagline, whatsapp: item.whatsapp, logo: item.logo_url, instagram: item.instagram_url, tiktok: item.tiktok_url });
