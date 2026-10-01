import Link from "next/link";
import { OptimizedPhoto as Image } from "@/components/ui/optimized-photo";
import { ArrowUpRight } from "lucide-react";
import type { JerseyDesign } from "@/types";
export function DesignCard({ design }: { design: JerseyDesign }) {
  const hasSecondary = Boolean(design.images && design.images[1]);
  return (
    <Link className="design-card group" href={`/katalog/${design.slug}/`}>
      <div
        className={`card-image ${hasSecondary ? "has-dual-view" : ""}`}
        style={{ "--accent": design.accent } as React.CSSProperties}
      >
        <span className="card-tag">
          {design.popular
            ? "DESAIN PILIHAN"
            : design.previousOrder
              ? "REFERENSI PESANAN"
              : "CUSTOM SERIES"}
        </span>
        <div className="card-image-stack">
          <Image variant="small"
            className="card-img-primary"
            src={design.images[0]}
            alt={`Foto produk ${design.name}`}
            width={520}
            height={580}
          />
          {hasSecondary && (
            <Image variant="small"
              className="card-img-secondary"
              src={design.images[1]}
              alt={`Foto detail ${design.name}`}
              width={520}
              height={580}
            />
          )}
        </div>
        {hasSecondary && (
          <span className="card-view-badge" aria-hidden="true">
            Lihat detail ↗
          </span>
        )}
        <span className="card-arrow">
          <ArrowUpRight size={21} />
        </span>
        <span className="image-note">FOTO PRODUK</span>
      </div>
      <div className="card-meta">
        <span>{design.category}</span>
        <span>{design.code}</span>
      </div>
      <h3>{design.name}</h3>
      <div className="card-bottom">
        <span>{design.color}</span>
        <span className="color-dot" style={{ background: design.accent }} />
      </div>
      <p className="card-price">
        Diskusikan harga <ArrowUpRight size={13} />
      </p>
    </Link>
  );
}
