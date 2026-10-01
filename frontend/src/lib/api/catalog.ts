import { ApiError, queryString, request } from "./http.ts";
import type { Page, Resource, Query, DesignDto, CategoryDto, PricingPackageDto, MaterialDto, CollarDto, TestimonialDto, SiteSettingDto } from "./types.ts";
import { mapDesign, mapPackage, mapMaterial, mapCollar, mapTestimonial, mapSite } from "./mappers.ts";
export async function all<T>(path: string, query: Query = {}, signal?: AbortSignal): Promise<T[]> {
  const first = await request<Page<T>>(path + queryString({ ...query, per_page: 100, page: 1 }), { signal });
  const items = [...first.data];
  for (let page = 2; page <= first.meta.last_page; page++) {
    const result = await request<Page<T>>(path + queryString({ ...query, per_page: 100, page }), { signal });
    items.push(...result.data);
  }
  return items;
}
export const getCategories = () => all<CategoryDto>("/categories");
export async function getDesigns() { return (await all<DesignDto>("/designs")).map(mapDesign); }
export async function getDesignPage(query: Query = {}, signal?: AbortSignal) {
  const result = await request<Page<DesignDto>>("/designs" + queryString({ per_page: 12, ...query }), { signal });
  return { ...result, data: result.data.map(mapDesign) };
}
export async function getDesign(slug: string) {
  try { return mapDesign((await request<Resource<DesignDto>>("/designs/" + encodeURIComponent(slug))).data); }
  catch (error) { if (error instanceof ApiError && error.status === 404) return null; throw error; }
}
export async function getPricing() {
  const items = await all<PricingPackageDto>("/pricing-packages");
  return { printingPackages: items.filter((item) => item.group === "printing").map(mapPackage), screenPrintPackages: items.filter((item) => item.group === "screen_print").map(mapPackage) };
}
export async function getMaterials() { return (await all<MaterialDto>("/materials")).map(mapMaterial); }
export async function getCollars() { return (await all<CollarDto>("/collars")).map(mapCollar); }
export async function getTestimonials() { return (await all<TestimonialDto>("/testimonials")).map(mapTestimonial); }
export async function getSite() { return mapSite((await request<Resource<SiteSettingDto>>("/site-settings")).data); }
