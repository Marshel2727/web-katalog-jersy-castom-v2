import type { EntityName } from "@/lib/api/types";
export type Field = { name: string; label: string; type?: "text" | "textarea" | "number" | "color" | "select" | "checkbox"; required?: boolean; max?: number; options?: [string, string][]; default?: string | boolean };
export type ResourceConfig = { title: string; description: string; fields: Field[]; image?: "single" | "gallery"; pricing?: boolean };
const name: Field = { name: "name", label: "Nama", required: true, max: 150 };
const slug: Field = { name: "slug", label: "Slug URL", required: true, max: 120 };
const description: Field = { name: "description", label: "Deskripsi", type: "textarea", required: true };
const common: Field[] = [{ name: "sort_order", label: "Urutan tampil", type: "number", default: "0", max: 100000 }, { name: "is_active", label: "Aktif / tampil di website", type: "checkbox", default: true }];
const materialFields: Field[] = [name, slug, { name: "price_label", label: "Label harga (contoh: FREE / +5K)", required: true }, { name: "alt_text", label: "Deskripsi gambar" }];
export const resourceConfigs: Record<EntityName, ResourceConfig> = {
  categories: { title: "Kategori", description: "Kelompok produk untuk filter katalog.", fields: [name, slug, ...common] },
  designs: { title: "Desain", description: "Foto produk dan referensi jersey atau kaos.", image: "gallery", fields: [name, { ...slug, max: 180 }, { name: "code", label: "Kode desain", required: true, max: 50 }, { name: "category_id", label: "Kategori", type: "select", required: true }, description, { name: "color_label", label: "Nama warna", required: true, max: 120 }, { name: "accent_color", label: "Warna aksen", type: "color", default: "#34d399", required: true }, { name: "is_popular", label: "Desain pilihan", type: "checkbox" }, { name: "is_previous_order", label: "Pesanan sebelumnya", type: "checkbox" }, ...common] },
  "pricing-packages": { title: "Paket harga", description: "Paket printing dan sablon beserta pilihan harganya.", image: "single", pricing: true, fields: [name, slug, { name: "group", label: "Kelompok", type: "select", required: true, options: [["printing", "Printing"], ["screen_print", "Setelan + sablon"]], default: "printing" }, description, { name: "condition", label: "Ketentuan pemesanan", type: "textarea", required: true }, ...common] },
  materials: { title: "Bahan", description: "Pilihan kain dan label tambahan harga.", image: "single", fields: [...materialFields, ...common] },
  collars: { title: "Kerah", description: "Model kerah dengan nomor referensi.", image: "single", fields: [...materialFields, { name: "number", label: "Nomor kerah", type: "number", required: true, max: 999 }, ...common] },
  testimonials: { title: "Ulasan", description: "Cerita pelanggan. Tandai ulasan contoh dengan jelas.", fields: [{ ...name, max: 100 }, { name: "team", label: "Tim / komunitas", required: true, max: 150 }, { name: "quote", label: "Isi ulasan", type: "textarea", required: true }, { name: "initials", label: "Inisial", required: true, max: 10 }, { name: "is_example", label: "Ulasan contoh", type: "checkbox", default: true }, ...common] },
};
export function isEntityName(value: string): value is EntityName { return Object.hasOwn(resourceConfigs, value); }
