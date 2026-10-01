import test from "node:test";
import assert from "node:assert/strict";
import { filterDesigns } from "../src/lib/catalog.ts";
import type { JerseyDesign } from "../src/types/index.ts";
const items: JerseyDesign[] = [
  {
    slug: "a",
    code: "JK-001",
    name: "Volt United",
    category: "Sepak bola",
    description: "",
    color: "",
    accent: "",
    images: [],
    popular: true,
    previousOrder: false,
  },
  {
    slug: "b",
    code: "JK-002",
    name: "Velocity Blue",
    category: "Futsal",
    description: "",
    color: "",
    accent: "",
    images: [],
    popular: true,
    previousOrder: true,
  },
];
test("search ignores case and whitespace and supports codes", () => {
  assert.equal(
    filterDesigns(items, " VOLT ", "Semua", "Semua desain").length,
    1,
  );
  assert.equal(
    filterDesigns(items, "jk-002", "Semua", "Semua desain")[0].slug,
    "b",
  );
});
test("category, search and collection filters combine", () => {
  assert.equal(
    filterDesigns(items, "blue", "Futsal", "Pesanan sebelumnya").length,
    1,
  );
  assert.equal(
    filterDesigns(items, "volt", "Sepak bola", "Pesanan sebelumnya").length,
    0,
  );
  assert.equal(filterDesigns(items, "", "Semua", "Populer").length, 2);
});
test("unknown query produces an empty list", () =>
  assert.deepEqual(
    filterDesigns(items, "missing", "Semua", "Semua desain"),
    [],
  ));
