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
            Jersey custom
            <br />
            <span className="lime">untuk tim kamu.</span>
          </h1>
          <p>
            Pilih inspirasi desain, tentukan kebutuhan tim, lalu konsultasikan bahan dan harga melalui WhatsApp.
          </p>
          <div className="hero-actions">
            <Link href="/katalog" className="button hero-btn-primary">
              Lihat Desain <ArrowUpRight size={19} />
            </Link>
            <WhatsAppLink className="button button-outline hero-consultation">
              Konsultasi WhatsApp
            </WhatsAppLink>
          </div>
          <div className="hero-trust-bar">
            <span>
              <Check size={15} /> Min. order 6 pcs
            </span>
            <span>
              <Check size={15} /> Mulai Rp 95.000 / stel
            </span>
            <span>
              <Check size={15} /> Bebas pasang nama & nomor
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
            <span>FOTO MODEL ASLI ↗</span>
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
          <span className="eyebrow">01 / DESAIN PILIHAN</span>
          <h2>
            Desain pilihan.
            <br />
            <span className="muted">Karakter unik untuk tim kamu.</span>
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

export function PricingSummary() {
  return (
    <section className="section container" id="paket-ringkasan">
      <div className="section-heading">
        <div>
          <span className="eyebrow">02 / PAKET HARGA</span>
          <h2>
            Pilihan paket jelas.
            <br />
            <span className="muted">Sesuai anggaran tim kamu.</span>
          </h2>
        </div>
        <div className="heading-side">
          <p>
            Mulai dari atasan hemat hingga setelan turnamen lengkap.
            <br />
            Semua paket sudah termasuk gratis pasang nama, nomor, & logo tim.
          </p>
          <Link href="/paket-harga" className="text-link">
            Bandingkan semua paket harga <ArrowUpRight size={18} />
          </Link>
        </div>
      </div>

      <div className="pricing-summary-grid">
        <div className="pricing-summary-card">
          <span className="summary-badge">HEMAT & PRAKTIS</span>
          <h3>Atasan Jersey Printing</h3>
          <p className="summary-desc">Cocok untuk latihan tim, kaos event lari/sepeda, atau seragam cadangan.</p>
          <div className="summary-price">
            <span className="price-prefix">Mulai dari</span>
            <strong>Rp 95.000<small>/pcs</small></strong>
          </div>
          <ul className="summary-perks">
            <li><Check size={15} /> Atasan dry-fit sublimasi full print anti-luntur</li>
            <li><Check size={15} /> Gratis pasang nama pemain & nomor punggung</li>
            <li><Check size={15} /> Minimal order mulai 6 pcs</li>
          </ul>
          <Link href="/paket-harga#printing" className="button button-outline">
            Lihat Detail Paket ↗
          </Link>
        </div>

        <div className="pricing-summary-card featured-tier">
          <span className="summary-badge popular">★ PALING DIMINATI</span>
          <h3>Setelan Printing Turnamen</h3>
          <p className="summary-desc">Paket lengkap paling populer untuk tim futsal, sepak bola, dan kompetisi.</p>
          <div className="summary-price">
            <span className="price-prefix">Mulai dari</span>
            <strong>Rp 125.000<small>/setel</small></strong>
          </div>
          <ul className="summary-perks">
            <li><Check size={15} /> Baju printing depan, belakang, dan lengan</li>
            <li><Check size={15} /> Celana olahraga serasi / senada</li>
            <li><Check size={15} /> Gratis logo tim, nama pemain, & nomor</li>
            <li><Check size={15} /> Jahitan presisi standar turnamen</li>
          </ul>
          <Link href="/paket-harga#printing" className="button">
            Pilih Paket Ini ↗
          </Link>
        </div>

        <div className="pricing-summary-card">
          <span className="summary-badge">SERAGAM KLASIK</span>
          <h3>Setelan + Sablon Polyflex</h3>
          <p className="summary-desc">Setelan jersey bahan lokal atau import dengan sablon nama dan nomor presisi.</p>
          <div className="summary-price">
            <span className="price-prefix">Mulai dari</span>
            <strong>Rp 110.000<small>/setel</small></strong>
          </div>
          <ul className="summary-perks">
            <li><Check size={15} /> Setelan baju + celana olahraga pilihan</li>
            <li><Check size={15} /> Sablon nama, nomor, dan logo tim</li>
            <li><Check size={15} /> Pilihan ideal untuk pemesanan 12 pcs</li>
          </ul>
          <Link href="/paket-harga#sablon" className="button button-outline">
            Lihat Detail Paket ↗
          </Link>
        </div>
      </div>
    </section>
  );
}

export function CustomSection() {
  return <JerseyCustomizer />;
}
export function PreviousOrders({ designs }: { designs: JerseyDesign[] }) {
  // Hindari menduplikasi desain yang sudah tampil di seksi 01 (popular)
  const popularSlugs = new Set(designs.filter((d) => d.popular).map((d) => d.slug));
  const distinctOrders = designs.filter((d) => d.previousOrder && !popularSlugs.has(d.slug));
  const listToDisplay = distinctOrders.length >= 2
    ? distinctOrders.slice(0, 3)
    : designs.filter((d) => d.previousOrder).slice(0, 3);

  return (
    <section className="section container" id="hasil-produksi">
      <div className="section-heading">
        <div>
          <span className="eyebrow">04 / HASIL PRODUKSI ASLI</span>
          <h2>
            Hasil jadi di lapangan.
            <br />
            <span className="muted">Nyata & berkarakter.</span>
          </h2>
        </div>
        <div className="heading-side">
          <p>
            Inspirasi tampilan jersey untuk komunitas,
            <br />
            klub, dan momen kebersamaan tim.
          </p>
          <Link href="/katalog" className="text-link">
            Jelajahi galeri pesanan <ArrowUpRight size={18} />
          </Link>
        </div>
      </div>
      <div className="stories-grid">
        {listToDisplay.map((d, i) => {
          const hasDistinctSecond = Boolean(d.images[1] && d.images[1] !== d.images[0]);
          return (
            <Link
              href={`/katalog/${d.slug}/`}
              className={`story story-${i % 2}`}
              key={d.slug}
            >
              <div className="story-top">
                <span>TEAM COLLECTION / 0{i + 1}</span>
                <ArrowUpRight size={24} />
              </div>
              <div className={`story-shirts ${hasDistinctSecond ? "has-dual-shirts" : "single-shirt"}`}>
                <Image
                  variant="small"
                  src={d.images[0]}
                  alt={`Foto produk ${d.name}`}
                  width={350}
                  height={390}
                />
                {hasDistinctSecond && (
                  <Image
                    variant="small"
                    src={d.images[1]}
                    alt={`Foto detail ${d.name}`}
                    width={350}
                    height={390}
                  />
                )}
              </div>
              <div className="story-caption">
                <div>
                  <small>{d.category.toUpperCase()} / HASIL JADI TIM</small>
                  <h3>{d.name}</h3>
                </div>
                <span>Lihat desain ↗</span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
export function OrderingSteps() {
  const steps = [
    {
      icon: Shirt,
      title: "Pilih referensi",
      text: "Pilih desain dari katalog atau kirim ide sendiri. Belum punya desain? Kami bantu arahkan.",
    },
    {
      icon: PencilRuler,
      title: "Konsultasi WhatsApp",
      text: "Ceritakan pilihan jersey atau kaos, jumlah pesanan, dan detail nama serta nomor tim kamu.",
    },
    {
      icon: Palette,
      title: "Sepakati bahan & harga",
      text: "Sepakati bahan dry-fit, model kerah, harga akhir, dan jadwal produksi sebelum pengerjaan.",
    },
    {
      icon: PackageCheck,
      title: "Produksi & pengiriman",
      text: "Setelah disepakati, jersey diproduksi dengan jahitan presisi lalu dikirim ke kotamu.",
    },
  ];
  return (
    <section className="process-section" id="cara-pesan">
      <div className="container section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">05 / CARA PEMESANAN</span>
            <h2>
              Alur pesan ringkas.
              <br />
              <span className="muted">Dari ide sampai ke lapangan.</span>
            </h2>
          </div>
          <p className="muted">
            Pemesanan mudah melalui WhatsApp.
            <br />
            Kami dampingi dari konsep desain sampai siap tanding.
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
          <span className="eyebrow">06 / DARI KOMUNITAS</span>
          <h2>Cerita di balik jersey tim.</h2>
        </div>
      </div>
      <div className="reviews-grid">
        {testimonials.map((t) => (
          <article className="review" key={t.name}>
            <div className="stars" aria-label="Rating 5 dari 5">
              {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} size={15} fill="currentColor" />
              ))}
            </div>
            <blockquote>“{t.quote}”</blockquote>
            <div className="review-person">
              <span className="avatar">{t.initials}</span>
              <div>
                <strong>{t.name}</strong>
                <small>{t.team}</small>
              </div>
            </div>
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
