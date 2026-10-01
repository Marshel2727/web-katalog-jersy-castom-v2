import type { MetadataRoute } from "next";
import { getDesigns } from "@/lib/api/catalog";
import { absoluteUrl } from "@/lib/site-url";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const designs = await getDesigns();
  const paths = ["/", "/katalog/", "/paket-harga/", "/bahan-kerah/"];

  return [
    ...paths.map((path) => ({ url: absoluteUrl(path) })),
    ...designs.map((design) => ({
      url: absoluteUrl(`/katalog/${design.slug}/`),
    })),
  ];
}
