"use client";
import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { X, UploadCloud, Check } from "lucide-react";
import { saveEntity } from "@/lib/api/admin";

import { all } from "@/lib/api/catalog";
import { appendOptions, cleanFormData, slugify } from "@/lib/api/form-data";
import type { AdminEntity, CategoryDto, DesignDto, DesignImageDto, EntityName, PricingOptionDto, PricingPackageDto } from "@/lib/api/types";
import { useSessionError } from "./auth-gate";
import { resourceConfigs } from "./catalog-resource-config";
import { ErrorMessage } from "./error-message";
import { FormField } from "./admin-form-field";
import { PricingOptions } from "./pricing-options";
import { DesignImages } from "./design-images";

export function EntityForm({ name, initial, onSaved, onCancel }: { name: EntityName; initial?: AdminEntity; onSaved: () => void; onCancel: () => void }) {
  const config = resourceConfigs[name];
  const titleId = useId();
  const initialImages = name === "designs" && initial ? (initial as DesignDto).images : [];
  const [images, setImages] = useState<DesignImageDto[]>(initialImages);
  const [removed, setRemoved] = useState<number[]>([]);
  const [uploads, setUploads] = useState<File[]>([]);
  const [singlePreview, setSinglePreview] = useState<{ url: string; name: string; size: string } | null>(null);
  const [options, setOptions] = useState<PricingOptionDto[]>(name === "pricing-packages" && initial ? (initial as PricingPackageDto).options : [{ label: "", price: "0", unit: "atasan", sort_order: 0 }]);
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [categoryReady, setCategoryReady] = useState(name !== "designs");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const sessionError = useSessionError();
  const form = useRef<HTMLFormElement>(null);
  const slugDirty = useRef(Boolean(initial));
  const slugField = config.fields.find((field) => field.name === "slug");

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !busy) onCancel();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [busy, onCancel]);

  useEffect(() => {
    return () => {
      if (singlePreview) URL.revokeObjectURL(singlePreview.url);
    };
  }, [singlePreview]);

  useEffect(() => {
    form.current?.querySelector<HTMLInputElement>("input")?.focus();
    if (name !== "designs") return;
    const controller = new AbortController();
    all<CategoryDto>("/admin/categories", {}, controller.signal).then((items) => { setCategories(items); setCategoryReady(true); }).catch((error) => {
      if (!controller.signal.aborted) { setError(error); sessionError(error); }
    });
    return () => controller.abort();
  }, [name, sessionError]);

  function syncSlug(sourceName?: string) {
    if (!form.current || !slugField) return;
    const nameInput = form.current.elements.namedItem("name") as HTMLInputElement | null;
    const slugInput = form.current.elements.namedItem("slug") as HTMLInputElement | null;
    if (!slugInput) return;
    const raw = sourceName ?? nameInput?.value ?? "";
    slugInput.value = slugify(raw, slugField.max ?? 120);
  }

  function handleSingleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    setSinglePreview((prev) => {
      if (prev) URL.revokeObjectURL(prev.url);
      if (!file) return null;
      return {
        url: URL.createObjectURL(file),
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + " MB",
      };
    });
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const body = cleanFormData(event.currentTarget, config.fields.filter((field) => field.type === "checkbox").map((field) => field.name));
    setError(null);
    if (config.image === "gallery") {
      const remaining = images.filter((image) => !removed.includes(image.id));
      if (remaining.length + uploads.length < 1 || remaining.length + uploads.length > 12) { setError(new Error("Desain harus memiliki 1–12 gambar.")); return; }
      if (uploads.some((file) => file.size > 5 * 1024 * 1024)) { setError(new Error("Ukuran setiap gambar maksimal 5 MB.")); return; }
      uploads.forEach((file) => body.append("images[]", file));
      removed.forEach((id) => body.append("remove_image_ids[]", String(id)));
      if (initial && !uploads.length) remaining.forEach((image) => body.append("image_order[]", String(image.id)));
    }
    if (config.pricing) appendOptions(body, options);
    setBusy(true);
    try { await saveEntity(name, body, initial?.id); onSaved(); }
    catch (error) { sessionError(error); setError(error instanceof Error ? error : new Error("Data gagal disimpan.")); }
    finally { setBusy(false); }
  }

  const values = (initial || {}) as Record<string, unknown>;
  const imageUrl = "image_url" in values ? String(values.image_url) : null;
  const standardFields = config.fields.filter((field) => field.type !== "checkbox");
  const toggleFields = config.fields.filter((field) => field.type === "checkbox");

  return (
    <div className="admin-modal-backdrop" onClick={(event) => { if (event.target === event.currentTarget && !busy) onCancel(); }}>
      <section className="admin-panel admin-modal" role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <header className="admin-modal-header">
          <div>
            <span className="eyebrow">{initial ? "EDIT DATA" : "TAMBAH DATA BARU"}</span>
            <h2 id={titleId}>{initial ? "Edit " + config.title : "Tambah " + config.title}</h2>
            <p>{config.description}</p>
          </div>
          <button type="button" className="admin-close-btn" disabled={busy} onClick={onCancel} aria-label="Tutup formulir">
            <X size={18} aria-hidden="true" />
          </button>
        </header>

        <form ref={form} className="admin-form admin-modal-form" onSubmit={submit}>
          <div className="admin-modal-body">
            <fieldset disabled={busy} className="admin-modal-fields">
              <ErrorMessage error={error} />
              <div className="admin-fields">
                {standardFields.map((field) => (
                  <FormField
                    key={field.name}
                    field={field.name === "category_id" ? { ...field, options: categories.map((category) => [String(category.id), category.name + (category.is_active ? "" : " (nonaktif)")]) } : field}
                    value={values[field.name]}
                    onNameChange={slugField ? (val) => { if (!slugDirty.current) syncSlug(val); } : undefined}
                    onSlugInput={() => { slugDirty.current = true; }}
                    onAutoSlug={slugField ? () => { slugDirty.current = false; syncSlug(); } : undefined}
                  />
                ))}
              </div>
              {toggleFields.length > 0 && (
                <div className="admin-toggles" role="group" aria-label="Pengaturan status">
                  {toggleFields.map((field) => (
                    <FormField key={field.name} field={field} value={values[field.name]} />
                  ))}
                </div>
              )}
              {config.image === "single" && (
                <section className="admin-subform">
                  <div className="admin-subform-head">
                    <h3>Foto {config.title.toLowerCase()}</h3>
                    <p>Format JPG, PNG, atau WebP. Maksimal 5 MB dan 5000 × 5000 piksel.</p>
                  </div>
                  {(imageUrl || singlePreview) && (
                    <div className="admin-preview-grid">
                      {imageUrl && (
                        <div className="admin-preview-card">
                          <span className="admin-badge">Foto saat ini</span>
                          <Image className="admin-current-image" src={imageUrl} alt={String(values.name || "Foto saat ini")} width={200} height={160} />
                        </div>
                      )}
                      {singlePreview && (
                        <div className="admin-preview-card active">
                          <span className="admin-badge active">Pratinjau baru ({singlePreview.size})</span>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img className="admin-current-image" src={singlePreview.url} alt={singlePreview.name} />
                          <small>{singlePreview.name}</small>
                        </div>
                      )}
                    </div>
                  )}
                  <label className="admin-upload-box">
                    <UploadCloud size={24} className="admin-upload-icon" aria-hidden="true" />
                    <span className="admin-upload-title">{initial ? "Pilih file untuk mengganti gambar (opsional)" : "Pilih file gambar *"}</span>
                    <span className="admin-upload-hint">Klik untuk memilih gambar dari perangkat Anda</span>
                    <input name="image" type="file" accept="image/jpeg,image/png,image/webp" required={!initial} onChange={handleSingleFileChange} />
                  </label>
                </section>
              )}
              {config.image === "gallery" && (
                <DesignImages
                  images={images}
                  onChange={setImages}
                  removed={removed}
                  onRemove={setRemoved}
                  uploads={uploads}
                  onUploads={setUploads}
                  orderChanged={images.some((image, index) => image.id !== initialImages[index]?.id)}
                />
              )}
              {config.pricing && <PricingOptions value={options} onChange={setOptions} />}
            </fieldset>
          </div>
          <footer className="admin-modal-footer">
            <button type="button" className="button button-outline" disabled={busy} onClick={onCancel}>Batal</button>
            <button type="submit" className="button" disabled={busy || !categoryReady}>
              <Check size={16} aria-hidden="true" />
              <span>{busy ? "Menyimpan..." : initial ? "Simpan perubahan" : "Simpan data"}</span>
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}


