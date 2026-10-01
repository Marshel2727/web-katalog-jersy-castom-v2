export type CategoryDto = { id: number; name: string; slug: string; is_active: boolean; sort_order: number };
export type DesignImageDto = { id: number; image_url: string; alt_text: string | null; sort_order: number };
export type DesignDto = CategoryDto & {
  category_id: number; category: CategoryDto; code: string; description: string;
  color_label: string; accent_color: string; is_popular: boolean; is_previous_order: boolean; images: DesignImageDto[];
};
export type PricingOptionDto = { id?: number; label: string; price: string; unit: "atasan" | "setel"; sort_order: number };
export type PricingPackageDto = CategoryDto & { group: "printing" | "screen_print"; description: string; condition: string; image_url: string; options: PricingOptionDto[] };
export type MaterialDto = CategoryDto & { image_url: string; alt_text: string | null; price_label: string; source_image_url: string | null };
export type CollarDto = MaterialDto & { number: number };
export type TestimonialDto = { id: number; name: string; team: string; quote: string; initials: string; is_example: boolean; is_active: boolean; sort_order: number };
export type SiteSettingDto = { id: number; name: string; tagline: string; whatsapp: string; logo_url: string | null; instagram_url: string | null; tiktok_url: string | null };
export type AdminUser = { id: number; name: string; email: string; is_admin: boolean };
export type Page<T> = { data: T[]; meta: { current_page: number; last_page: number; total: number; per_page: number } };
export type Resource<T> = { data: T };
export type AdminEntities = { categories: CategoryDto; designs: DesignDto; "pricing-packages": PricingPackageDto; materials: MaterialDto; collars: CollarDto; testimonials: TestimonialDto };
export type EntityName = keyof AdminEntities;
export type AdminEntity = AdminEntities[EntityName];
export type Query = Record<string, string | number | undefined>;
