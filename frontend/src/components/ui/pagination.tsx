"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function Pagination({ page, lastPage, disabled, onChange }: { page: number; lastPage: number; disabled?: boolean; onChange: (page: number) => void }) {
  if (lastPage < 2) return null;
  return (
    <nav className="pagination" aria-label="Halaman hasil">
      <button className="button button-outline" disabled={disabled || page <= 1} onClick={() => onChange(page - 1)} aria-label="Halaman sebelumnya">
        <ChevronLeft size={16} aria-hidden="true" />
        <span>Sebelumnya</span>
      </button>
      <span className="pagination-info">Halaman <strong>{page}</strong> dari <strong>{lastPage}</strong></span>
      <button className="button button-outline" disabled={disabled || page >= lastPage} onClick={() => onChange(page + 1)} aria-label="Halaman berikutnya">
        <span>Berikutnya</span>
        <ChevronRight size={16} aria-hidden="true" />
      </button>
    </nav>
  );
}

