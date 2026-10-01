"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { Maximize2, X, Search } from "lucide-react";
import type { MaterialOption } from "@/types";

export function OptionGallery({ items }: { items: MaterialOption[] }) {
  const [selected, setSelected] = useState<MaterialOption | null>(null);
  const [filter, setFilter] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = items.filter((item) => {
    const matchesPrice =
      filter === "Semua" || (filter === "Gratis" ? item.priceLabel === "FREE" : item.priceLabel !== "FREE");
    const matchesSearch =
      !searchQuery.trim() || item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPrice && matchesSearch;
  });

  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const titleId = useId();

  useEffect(() => {
    if (!selected) return;
    const element = dialog.current;
    const previousOverflow = document.body.style.overflow;
    element?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      element?.close();
      document.body.style.overflow = previousOverflow;
    };
  }, [selected]);

  return (
    <>
      <div className="filter-tabs option-filters" role="group" aria-label="Filter harga pilihan">
        <div className="filter-button-group">
          {["Semua", "Gratis", "Berbayar"].map((label) => (
            <button
              key={label}
              className={filter === label ? "selected" : ""}
              aria-pressed={filter === label}
              onClick={() => setFilter(label)}
            >
              {label}
            </button>
          ))}
        </div>

        <label className="option-search-box">
          <Search size={14} className="search-icon" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama pilihan..."
          />
        </label>

        <span className="option-count" aria-live="polite">
          {filteredItems.length} pilihan
        </span>
      </div>
      <div className="option-grid">
        {filteredItems.map((item) => (
          <article className={`option-card${item.image.includes("/kain/") ? " option-card-fabric" : ""}`} key={item.id}>
            <button
              className="option-image-button"
              aria-label={`Perbesar ${item.name}`}
              aria-haspopup="dialog"
              onClick={(event) => {
                trigger.current = event.currentTarget;
                setSelected(item);
              }}
            >
              <Image src={item.image} alt={item.alt} width={720} height={720} />
              <span className="option-enlarge" aria-hidden="true">
                <Maximize2 size={16} />
              </span>
            </button>
            <div className="option-caption">
              <h3>{item.name}</h3>
              <span className="option-price">{item.priceLabel}</span>
            </div>
          </article>
        ))}
      </div>
      <dialog
        ref={dialog}
        className="option-dialog"
        aria-labelledby={titleId}
        onClose={() => {
          setSelected(null);
          trigger.current?.focus({ preventScroll: true });
        }}
        onClick={(event) => {
          if (event.target !== event.currentTarget) return;
          const box = event.currentTarget.getBoundingClientRect();
          if (
            event.clientX < box.left ||
            event.clientX > box.right ||
            event.clientY < box.top ||
            event.clientY > box.bottom
          )
            dialog.current?.close();
        }}
      >
        {selected && (
          <>
            <div className="option-dialog-header">
              <div>
                <h2 id={titleId}>{selected.name}</h2>
                <span className="option-price">{selected.priceLabel}</span>
              </div>
              <button
                className="option-close"
                aria-label="Tutup gambar"
                onClick={() => dialog.current?.close()}
              >
                <X size={22} />
              </button>
            </div>
            <Image
              className="option-full-image"
              src={selected.image}
              alt={selected.alt}
              width={720}
              height={720}
            />
            <p>
              Label sesuai referensi bahan/kerah, bukan harga jersey lengkap.
              Harga akhir dikonfirmasi saat konsultasi.
            </p>
          </>
        )}
      </dialog>
    </>
  );
}
