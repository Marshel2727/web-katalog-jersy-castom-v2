import { test } from "node:test";
import assert from "node:assert/strict";
import { request, ApiError, queryString } from "../src/lib/api/http.ts";
import { all, getDesign } from "../src/lib/api/catalog.ts";
import { csrfToken, readSettings } from "../src/lib/api/admin.ts";
import { appendOptions, moveItem, slugify } from "../src/lib/api/form-data.ts";
import { mapPackage, mapMaterial, mapDesign } from "../src/lib/api/mappers.ts";
import type { DesignDto, MaterialDto, PricingPackageDto } from "../src/lib/api/types.ts";

test("query encodes filters and retains numeric zero", () => {
  assert.equal(queryString({ q: "Nama & tim", sort_order: 0, empty: "", missing: undefined }), "?q=Nama+%26+tim&sort_order=0");
});
test("mappers preserve dynamic categories, uploaded URLs and decimal prices", () => {
  const design = { slug: "baru", code: "NEW", name: "Baru", category: { name: "Kategori baru" }, color_label: "Biru", accent_color: "#123456", is_popular: true, is_previous_order: false, images: [{ image_url: "https://catalog.test/storage/new.webp" }] } as DesignDto;
  assert.equal(mapDesign(design).category, "Kategori baru");
  assert.equal(mapDesign(design).images[0], "https://catalog.test/storage/new.webp");
  assert.equal(mapPackage({ options: [{ label: "Setel", price: "120000.50", unit: "setel" }] } as PricingPackageDto).options[0].price, 120000.5);
  assert.equal(mapMaterial({ name: "Milano", image_url: "/storage/kain.webp", alt_text: null, source_image_url: null } as MaterialDto).alt, "Milano");
});
test("CSRF token is decoded without losing equals signs", () => {
  assert.equal(csrfToken("other=foo; XSRF-TOKEN=abc%3D%3D; session=xyz"), "abc==");
  assert.equal(csrfToken("session=xyz"), "");
});
test("pricing form preserves scoped IDs, decimals, zero price and order", () => {
  const data = new FormData();
  appendOptions(data, [{ id: 12, label: "Lama", price: "0", unit: "atasan", sort_order: 8 }, { label: "Baru", price: "99.50", unit: "setel", sort_order: 5 }]);
  assert.equal(data.get("options[0][id]"), "12");
  assert.equal(data.get("options[0][price]"), "0");
  assert.equal(data.get("options[1][price]"), "99.50");
  assert.equal(data.get("options[1][sort_order]"), "1");
  assert.equal(data.has("options[1][id]"), false);
});
test("gallery move is immutable and ignores moves outside the list, and slugify normalizes names", () => {
  const items = [11, 22, 33];
  assert.deepEqual(moveItem(items, 1, -1), [22, 11, 33]);
  assert.deepEqual(items, [11, 22, 33]);
  assert.equal(moveItem(items, 0, -1), items);
  assert.equal(slugify("  Jersey Futsal Garuda #1! "), "jersey-futsal-garuda-1");
  assert.equal(slugify("A-B-C", 3), "a-b");
});

test("transport and pagination honor the Laravel API contract", async (context) => {
  const original = globalThis.fetch;
  context.after(() => { globalThis.fetch = original; });
  const calls: string[] = [];
  globalThis.fetch = async (url, init) => {
    calls.push(String(url));
    assert.equal(init?.credentials, "include");
    assert.equal(init?.cache, "no-store");
    assert.equal(new Headers(init?.headers).get("Accept"), "application/json");
    const page = Number(new URL(String(url)).searchParams.get("page"));
    return Response.json({ data: [page], meta: { last_page: 3 } });
  };
  assert.deepEqual(await all<number>("/categories"), [1, 2, 3]);
  assert.equal(calls.length, 3);
  const data = new FormData(); data.set("name", "New");
  globalThis.fetch = async (_, init) => { assert.equal(new Headers(init?.headers).has("Content-Type"), false); return new Response(null, { status: 204 }); };
  assert.equal(await request("/admin/categories/1", { method: "POST", body: data }), undefined);
  globalThis.fetch = async () => Response.json({ message: "Invalid", errors: { slug: ["Slug sudah digunakan."] } }, { status: 422 });
  await assert.rejects(request("/admin/categories", { method: "POST", body: "{}" }), (error: unknown) => error instanceof ApiError && error.status === 422 && error.errors.slug[0] === "Slug sudah digunakan.");
  globalThis.fetch = async () => Response.json({ message: "Not found" }, { status: 404 });
  assert.equal(await getDesign("tidak-ada"), null);
  assert.deepEqual(await readSettings(), { data: null });
  globalThis.fetch = async () => Response.json({}, { status: 500 });
  await assert.rejects(readSettings(), (error: unknown) => error instanceof ApiError && error.status === 500);
  globalThis.fetch = async () => Response.json({}, { status: 419 });
  await assert.rejects(request("/auth/logout", { method: "POST" }), (error: unknown) => error instanceof ApiError && error.message.includes("formulir"));
  globalThis.fetch = async () => { throw new Error("Network unavailable"); };
  await assert.rejects(request("/designs"), (error: unknown) => error instanceof ApiError && error.status === 0);
});
