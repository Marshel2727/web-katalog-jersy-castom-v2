import Link from "next/link";
import { OptimizedPhoto as Image } from "@/components/ui/optimized-photo";
import { ModelSlideshow } from "./model-slideshow";
import { JerseyCustomizer } from "./jersey-customizer";
import type { JerseyDesign, Testimonial } from "@/types";
import { DesignCard } from "@/components/catalog/design-card";
import { WhatsAppLink } from "@/components/ui/whatsapp-link";
import {
  ArrowUpRight,
  Check,
  PencilRuler,
  Palette,
  Shirt,
  PackageCheck,
  Star,
} from "@/components/ui/icon";
export function Hero() {
  return (
    <>
      <section className="hero container">
        <div className="hero-copy">
          <div className="hero-kicker">
            <span className="status-dot" /> BP SPORT / JERSEY & CUSTOM APPAREL
          </div>
          <h1>
            Bukan sekadar
            <br />
            jersey.
            <br />
            <span className="lime">Ini identitas.</span>
          </h1>
          <p>
            Jersey dan kaos custom untuk tim, komunitas, dan acara.
            Sesuaikan warna, logo, nama, serta nomor sesuai kebutuhan kamu.
          </p>
          <div className="hero-actions">
            <Link href="/katalog" className="button">
              Lihat Katalog <ArrowUpRight size={19} />
            </Link>
            <WhatsAppLink className="hero-consultation">Konsultasi WhatsApp</WhatsAppLink>
          </div>
          <p className="ordering-help">Pemesanan dilakukan melalui WhatsApp. Belum punya desain? Ceritakan kebutuhanmu, kami bantu arahkan.</p>
          <div className="hero-features">
            <span>
              <Check size={15} /> Desain sesukamu
            </span>
            <span>
              <Check size={15} /> Konsultasi langsung
            </span>
          </div>
        </div>
        <div className="hero-art">
          <div className="art-grid" />
          <div className="art-word">
            YOUR
            <br />
            GAME.
          </div>
          <span className="art-label">BP SPORT — CUSTOM ATHLETIC WEAR</span>
          <ModelSlideshow />
          <div className="hero-sticker">
            <span>BUILT FOR</span>
            <strong>
              YOUR
              <br />
              TEAM.
            </strong>
            <ArrowUpRight size={27} />
          </div>
          <div className="art-bottom">
            <span>
              <i className="status-dot" /> JERSEY CUSTOM — BP SPORT
            </span>
            <span>FOTO MODEL ↗</span>
          </div>
        </div>
      </section>
      <div className="ticker" aria-label="Layanan jersey dan kaos custom">
        <div aria-hidden="true">
          JERSEY CUSTOM <span>✳</span> KAOS DESAIN CUSTOM <span>✳</span>{" "}
          DARI IDE JADI IDENTITAS <span>✳</span> MADE FOR YOUR GAME{" "}
          <span>✳</span>{" "}
          JERSEY CUSTOM <span>✳</span> KAOS DESAIN CUSTOM <span>✳</span>{" "}
          DARI IDE JADI IDENTITAS <span>✳</span> MADE FOR YOUR GAME{" "}
          <span>✳</span>
        </div>
      </div>
    </>
  );
}
export function FeaturedDesigns({ designs }: { designs: JerseyDesign[] }) {
  return (
    <section className="section container" id="pilihan">
      <div className="section-heading">
        <div>
          <span className="eyebrow">01 / FIND YOUR INSPIRATION</span>
          <h2>
            Desain pilihan.
            <br />
            <span className="muted">Karakter nggak pasaran.</span>
          </h2>
        </div>
        <div className="heading-side">
          <p>
            Temukan titik awal untuk jersey tim kamu.
            <br />
            Setiap desain bisa dibuat lebih personal.
          </p>
          <Link href="/katalog" className="text-link">
            Lihat semua desain <ArrowUpRight size={18} />
          </Link>
        </div>
      </div>
      <div className="design-grid">
        {designs
          .filter((d) => d.popular)
          .map((d) => (
            <DesignCard key={d.slug} design={d} />
          ))}
      </div>
      <p className="demo-note">
        Pilihan referensi dari foto produk BP Sport.
      </p>
    </section>
  );
}
export function CustomSection() {
  return <JerseyCustomizer />;
}
export function PreviousOrders({ designs }: { designs: JerseyDesign[] }) {
  return (
    <section className="section container">
      <div className="section-heading">
        <div>
          <span className="eyebrow">03 / TEAM STORIES</span>
          <h2>
            Beda tim.
            <br />
            Beda cerita.
          </h2>
        </div>
        <div className="heading-side">
          <p>
            Inspirasi tampilan jersey untuk komunitas,
            <br />
            klub, dan momen kebersamaan tim.
          </p>
          <span className="demo-note">
            Foto produk sebagai inspirasi pesanan kamu.
          </span>
        </div>
      </div>
      <div className="stories-grid">
        {designs.filter((design) => design.previousOrder).slice(0, 2).map((d, i) => (
          <Link
            href={`/katalog/${d.slug}/`}
            className={`story story-${i}`}
            key={d.slug}
          >
            <div className="story-top">
              <span>TEAM COLLECTION / 0{i + 1}</span>
              <ArrowUpRight size={24} />
            </div>
            <div className="story-shirts">
              <Image variant="small"
                src={d.images[0]}
                alt={`Foto produk ${d.name}`}
                width={350}
                height={390}
              />
              <Image variant="small"
                src={d.images[1] || d.images[0]}
                alt={`Foto detail ${d.name}`}
                width={350}
                height={390}
              />
            </div>
            <div className="story-caption">
              <div>
                <small>{d.category.toUpperCase()} / FOTO PRODUK</small>
                <h3>{d.name} Collection</h3>
              </div>
              <span>Lihat desain ↗</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
export function OrderingSteps() {
  const steps = [
    {
      icon: Shirt,
      title: "Pilih referensi",
      text: "Pilih referensi dari katalog atau kirim ide sendiri. Belum punya desain? Kami bantu arahkan.",
    },
    {
      icon: PencilRuler,
      title: "Konsultasi WhatsApp",
      text: "Ceritakan pilihan jersey atau kaos, jumlah pesanan, dan detail desain custom kamu.",
    },
    {
      icon: Palette,
      title: "Sepakati desain dan harga",
      text: "Sepakati desain, bahan, kerah, harga akhir, dan estimasi pengerjaan sebelum produksi.",
    },
    {
      icon: PackageCheck,
      title: "Produksi",
      text: "Setelah disepakati, jersey atau kaos custom kamu masuk proses produksi.",
    },
  ];
  return (
    <section className="process-section" id="cara-pesan">
      <div className="container section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">04 / SIMPLE STEPS, GREAT JERSEYS</span>
            <h2>
              Dari ide ke lapangan.
              <br />
              <span className="muted">Gampang, kok.</span>
            </h2>
          </div>
          <p className="muted">
            Pemesanan melalui WhatsApp.
            <br />
            Kami bantu dari desain sampai produksi.
          </p>
        </div>
        <div className="steps">
          {steps.map((s, i) => (
            <article key={s.title}>
              <div className="step-top">
                <s.icon size={27} />
                <span>0{i + 1}</span>
              </div>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
export function Reviews({ testimonials }: { testimonials: Testimonial[] }) {
  return (
    <section className="section container" id="ulasan">
      <div className="section-heading">
        <div>
          <span className="eyebrow">05 / FROM THE TEAM</span>
          <h2>Cerita di balik jersey.</h2>
        </div>
        {testimonials.some((item) => item.isExample) && <span className="demo-badge">TERMASUK ULASAN CONTOH</span>}
      </div>
      <div className="reviews-grid">
        {testimonials.map((t) => (
          <article className="review" key={t.name}>
            {t.isExample && <div className="stars" aria-label="Contoh rating 5 dari 5">
              {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} size={15} fill="currentColor" />
              ))}
            </div>}
            <blockquote>“{t.quote}”</blockquote>
            <div className="review-person">
              <span className="avatar">{t.initials}</span>
              <div>
                <strong>{t.name}</strong>
                <small>{t.team}</small>
              </div>
            </div>
            {t.isExample && (
              <small className="example-caption">
                Contoh ulasan · bukan testimoni asli
              </small>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
export function ClosingCta() {
  return (
    <section className="container closing-wrap">
      <div className="closing-cta">
        <span className="eyebrow">LET’S CREATE SOMETHING THAT’S YOURS.</span>
        <h2>
          Siap bikin tim kamu
          <br />
          tampil <span>beda?</span>
        </h2>
        <p>Satu ide kecil bisa jadi awal identitas besar tim kamu.</p>
        <WhatsAppLink>Diskusi jersey atau kaos custom</WhatsAppLink>
        <span className="closing-decoration" aria-hidden="true">
          ↗
        </span>
      </div>
    </section>
  );
}
