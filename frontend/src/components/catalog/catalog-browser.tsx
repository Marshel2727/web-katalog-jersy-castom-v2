"use client";
import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { getDesignPage } from "@/lib/api/catalog";
import { usePage } from "@/lib/api/use-page";
import type { CategoryDto, Page } from "@/lib/api/types";
import type { JerseyDesign } from "@/types";
import { Pagination } from "@/components/ui/pagination";
import { DesignCard } from "./design-card";
export function CatalogBrowser({ categories, initial }: { categories: CategoryDto[]; initial: Page<JerseyDesign> }) {
  const [filters, setFilters] = useState({ q: "", category: "", collection: "all", page: 1 });
  const { result, loading, error, reload } = usePage(getDesignPage, filters, initial);
  function filter(key: "q" | "category" | "collection", value: string) { setFilters((state) => ({ ...state, [key]: value, page: 1 })); }
  return <>
    <div className="catalog-controls">
      <label className="search-field"><Search size={20} /><span className="sr-only">Cari nama atau kode desain</span>
        <input value={filters.q} onChange={(event) => filter("q", event.target.value)} placeholder="Cari nama atau kode desain..." />
      </label>
      <label className="collection-select"><SlidersHorizontal size={18} /><span className="sr-only">Koleksi desain</span>
        <select value={filters.collection} onChange={(event) => filter("collection", event.target.value)}>
          <option value="all">Semua desain</option><option value="popular">Pilihan</option><option value="previous">Pesanan sebelumnya</option>
        </select>
      </label>
    </div>
    <div className="filter-row"><div className="filter-tabs" aria-label="Kategori produk">
      {[{ slug: "", name: "Semua" }, ...categories].map((category) => <button key={category.slug} aria-pressed={filters.category === category.slug} className={filters.category === category.slug ? "selected" : ""} onClick={() => filter("category", category.slug)}>{category.name}</button>)}
    </div><span className="results-count" aria-live="polite">{loading ? "Memuat..." : (result?.meta.total ?? 0) + " desain tersedia"}</span></div>
    {error ? <div className="empty-state" role="alert"><p>{error.message}</p><button className="button" onClick={reload}>Coba lagi</button></div>
      : <div aria-busy={loading}>
        {result?.data.length ? <div className="design-grid">{result.data.map((design) => <DesignCard key={design.slug} design={design} />)}</div>
          : <div className="empty-state"><Search size={32} /><h2>Desain belum ditemukan</h2><p>Coba kata kunci lain atau ubah filter kategori kamu.</p><button className="button" onClick={() => setFilters({ q: "", category: "", collection: "all", page: 1 })}>Reset pencarian</button></div>}
        {result && <Pagination page={result.meta.current_page} lastPage={result.meta.last_page} disabled={loading} onChange={(page) => setFilters((state) => ({ ...state, page }))} />}
      </div>}
  </>;
}
