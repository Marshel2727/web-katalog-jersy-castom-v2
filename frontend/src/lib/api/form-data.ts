import type { PricingOptionDto } from "./types.ts";
export function cleanFormData(form: HTMLFormElement, booleanFields: string[]) {
  const data = new FormData(form);
  for (const name of booleanFields) data.set(name, data.has(name) ? "1" : "0");
  for (const [key, value] of [...data.entries()]) if (value instanceof File && !value.size) data.delete(key);
  return data;
}
export function appendOptions(data: FormData, options: PricingOptionDto[]) {
  options.forEach((option, index) => {
    for (const [key, value] of Object.entries({ ...option, sort_order: index })) {
      if (value !== undefined) data.append("options[" + index + "][" + key + "]", String(value));
    }
  });
}
export function moveItem<T>(items: T[], index: number, offset: number): T[] {
  const target = index + offset;
  if (target < 0 || target >= items.length) return items;
  const result = [...items]; [result[index], result[target]] = [result[target], result[index]];
  return result;
}
export function slugify(value: string, max = 120): string {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, max).replace(/-+$/g, "");
}

