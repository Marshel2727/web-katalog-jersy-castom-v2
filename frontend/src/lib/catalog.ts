import type { JerseyDesign } from "../types/index.ts";
export function filterDesigns(
  items: JerseyDesign[],
  query: string,
  category: string,
  collection: string,
) {
  return items.filter(
    (d) =>
      `${d.name} ${d.code}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()) &&
      (category === "Semua" || d.category === category) &&
      (collection === "Semua desain" ||
        ((collection === "Pilihan" || collection === "Populer") ? d.popular : d.previousOrder)),
  );
}
