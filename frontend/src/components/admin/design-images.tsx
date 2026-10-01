"use client";
import Image from "next/image";
import { useEffect, useMemo } from "react";
import type { DesignImageDto } from "@/lib/api/types";
import { moveItem } from "@/lib/api/form-data";

export function DesignImages({ images, onChange, removed, onRemove, uploads, onUploads, orderChanged }: { images: DesignImageDto[]; onChange: (images: DesignImageDto[]) => void; removed: number[]; onRemove: (ids: number[]) => void; uploads: File[]; onUploads: (files: File[]) => void; orderChanged: boolean }) {
  const uploadPreviews = useMemo(() => uploads.map((file) => ({ file, url: URL.createObjectURL(file) })), [uploads]);
  useEffect(() => {
    return () => {
      uploadPreviews.forEach((item) => URL.revokeObjectURL(item.url));
    };
  }, [uploadPreviews]);

  const activeCount = images.filter((image) => !removed.includes(image.id)).length + uploads.length;

  return (
    <section className="admin-subform">
      <div className="admin-subform-head">
        <div className="admin-label-row">
          <h3>Galeri desain</h3>
          <span className="admin-badge">{activeCount} / 12 gambar</span>
        </div>
        <p>Gambar pertama menjadi sampul utama. Format JPG, PNG, atau WebP; maksimal 5 MB per gambar (5000 × 5000 piksel).</p>
      </div>
      {(images.length > 0 || uploadPreviews.length > 0) && (
        <div className="admin-gallery">
          {images.map((image, index) => {
            const isRemoved = removed.includes(image.id);
            return (
              <article key={image.id} className={isRemoved ? "removed" : ""}>
                <div className="admin-gallery-top">
                  <span className={index === 0 && !isRemoved ? "admin-badge active" : "admin-badge"}>
                    {isRemoved ? "Akan dihapus" : index === 0 ? "Sampul" : "Gambar " + (index + 1)}
                  </span>
                </div>
                <Image src={image.image_url} alt={image.alt_text || "Gambar desain"} width={160} height={160} />
                <div className="admin-row-actions">
                  <button type="button" disabled={uploads.length > 0 || index === 0} onClick={() => onChange(moveItem(images, index, -1))} aria-label={"Naikkan gambar " + (index + 1)}>↑</button>
                  <button type="button" disabled={uploads.length > 0 || index === images.length - 1} onClick={() => onChange(moveItem(images, index, 1))} aria-label={"Turunkan gambar " + (index + 1)}>↓</button>
                  <button type="button" className={isRemoved ? undefined : "admin-danger"} onClick={() => onRemove(isRemoved ? removed.filter((id) => id !== image.id) : [...removed, image.id])}>
                    {isRemoved ? "Pulihkan" : "Hapus"}
                  </button>
                </div>
              </article>
            );
          })}
          {uploadPreviews.map((item, index) => (
            <article key={item.file.name + "-" + index} className="admin-gallery-new">
              <div className="admin-gallery-top">
                <span className="admin-badge active">Baru #{index + 1}</span>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.url} alt={item.file.name} />
              <small className="admin-truncate">{item.file.name}</small>
              <div className="admin-row-actions">
                <button type="button" className="admin-danger" onClick={() => onUploads(uploads.filter((_, pos) => pos !== index))}>Batal</button>
              </div>
            </article>
          ))}
        </div>
      )}
      <label className="admin-upload-box">
        <span className="admin-upload-title">Tambahkan foto ke galeri</span>
        <span className="admin-upload-hint">{orderChanged ? "Simpan perubahan urutan terlebih dahulu sebelum menambah foto baru" : "Klik untuk memilih satu atau beberapa foto sekaligus"}</span>
        <input type="file" accept="image/jpeg,image/png,image/webp" multiple disabled={orderChanged} onChange={(event) => onUploads(Array.from(event.target.files || []))} />
      </label>
      {uploads.length > 0 && <p className="admin-muted" role="status">{uploads.length} foto baru siap diunggah ke akhir galeri.</p>}
    </section>
  );
}

