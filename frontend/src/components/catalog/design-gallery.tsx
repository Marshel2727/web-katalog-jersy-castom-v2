"use client";
import { OptimizedPhoto as Image } from "@/components/ui/optimized-photo";
import { useState } from "react";
import type { JerseyDesign } from "@/types";
export function DesignGallery({ design }: { design: JerseyDesign }) {
  const [index, setIndex] = useState(0);
  return (
    <div className="gallery">
      <div className="gallery-main">
        <span className="card-tag">{design.code} / CUSTOM SERIES</span>
        <Image
          src={design.images[index]}
          alt={`Foto ${design.name} — ${index === 0 ? "sampul" : `detail ${index}`}`}
          width={650}
          height={720}
          priority
        />
        <span className="image-note">
          FOTO PRODUK · DESAIN DAPAT DISESUAIKAN
        </span>
      </div>
      <div className="gallery-thumbnails">
        {design.images.map((src, i) => (
          <button
            key={src}
            onClick={() => setIndex(i)}
            aria-pressed={index === i}
            aria-label={`Lihat ${i === 0 ? "sampul" : `detail ${i}`}`}
            className={index === i ? "selected" : ""}
          >
            <Image variant="small" src={src} alt="" width={70} height={78} />
            <span>{i === 0 ? "Sampul" : `Detail ${i}`}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
