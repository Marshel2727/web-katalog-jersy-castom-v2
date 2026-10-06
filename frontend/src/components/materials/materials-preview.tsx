import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { MaterialOption, CollarOption } from "@/types";

export function MaterialsPreview({ materials, collars }: { materials: MaterialOption[]; collars: CollarOption[] }) {
  const collections = [
    {
      title: "Jenis kain",
      subtitle: materials.length + " pilihan tekstur",
      anchor: "jenis-kain",
      items: materials.slice(0, 3),
    },
    {
      title: "Model kerah",
      subtitle: collars.length + " pilihan bentuk",
      anchor: "model-kerah",
      items: collars.slice(0, 3),
    },
  ];
  return (
    <section className="section container materials-preview">
      <div className="section-heading">
        <div>
          <span className="eyebrow">03 / PILIHAN BAHAN & KERAH</span>
          <h2>
            Pilih bahannya.
            <br />
            <span className="muted">Tentukan kerahnya.</span>
          </h2>
        </div>
        <Link href="/bahan-kerah" className="text-link">
          Lihat semua bahan & kerah <ArrowUpRight size={18} />
        </Link>
      </div>
      <div className="materials-preview-groups">
        {collections.map((group) => (
          <div className="materials-preview-group" key={group.anchor}>
            <div className="preview-group-title">
              <h3>{group.title}</h3>
              <span>{group.subtitle}</span>
            </div>
            <div className="preview-option-grid">
              {group.items.map((item) => (
                <Link
                  className="preview-option"
                  key={item.id}
                  href={`/bahan-kerah#${group.anchor}`}
                >
                  <Image
                    src={item.image}
                    alt={item.alt}
                    width={360}
                    height={360}
                  />
                  <strong>{item.name}</strong>
                  <span>{item.priceLabel}</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
      <p className="materials-price-note">
        Label mengikuti referensi pilihan bahan/kerah, bukan harga jersey
        lengkap. Harga akhir dikonfirmasi saat konsultasi.
      </p>
    </section>
  );
}
