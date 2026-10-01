"use client";
import type { PricingOptionDto } from "@/lib/api/types";
import { moveItem } from "@/lib/api/form-data";

export function PricingOptions({ value, onChange }: { value: PricingOptionDto[]; onChange: (value: PricingOptionDto[]) => void }) {
  function update(index: number, field: "label" | "price" | "unit", next: string) {
    onChange(value.map((option, position) => position === index ? { ...option, [field]: next } as PricingOptionDto : option));
  }
  return (
    <section className="admin-subform">
      <div className="admin-subform-head">
        <div className="admin-label-row">
          <h3>Pilihan harga</h3>
          <span className="admin-badge">{value.length} / 20 opsi</span>
        </div>
        <p>Harga dalam rupiah, maksimal dua angka desimal. Urutan tampil mengikuti daftar di bawah.</p>
      </div>
      <div className="admin-option-list">
        {value.map((option, index) => (
          <div key={index} className="admin-option-card">
            <div className="admin-option-top">
              <span className="admin-badge">Opsi #{index + 1}</span>
              <div className="admin-row-actions">
                <button type="button" disabled={index === 0} aria-label={"Naikkan pilihan " + (index + 1)} onClick={() => onChange(moveItem(value, index, -1))}>↑</button>
                <button type="button" disabled={index === value.length - 1} aria-label={"Turunkan pilihan " + (index + 1)} onClick={() => onChange(moveItem(value, index, 1))}>↓</button>
                <button type="button" className="admin-danger" disabled={value.length === 1} onClick={() => onChange(value.filter((_, position) => position !== index))}>Hapus</button>
              </div>
            </div>
            <div className="admin-option-row">
              <label>Label *<input required maxLength={150} placeholder="Contoh: Bahan Brazil / Milano" value={option.label} onChange={(event) => update(index, "label", event.target.value)} /></label>
              <label>Harga (Rp) *<input required type="number" min="0" max="9999999999.99" step="0.01" value={option.price} onChange={(event) => update(index, "price", event.target.value)} /></label>
              <label>Satuan<select value={option.unit} onChange={(event) => update(index, "unit", event.target.value)}><option value="atasan">Atasan</option><option value="setel">Setel</option></select></label>
            </div>
          </div>
        ))}
      </div>
      <button type="button" className="button button-outline" disabled={value.length >= 20} onClick={() => onChange([...value, { label: "", price: "0", unit: "atasan", sort_order: value.length }])}>+ Tambah pilihan harga</button>
    </section>
  );
}

