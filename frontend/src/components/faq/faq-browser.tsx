"use client";

import { useState, useMemo } from "react";
import { Search, ChevronDown, MessageCircle, HelpCircle, Sparkles, Check, ArrowRight } from "lucide-react";
import { WhatsAppLink } from "@/components/ui/whatsapp-link";
import Link from "next/link";

export interface FaqItem {
  id: string;
  category: "alur" | "produk" | "biaya" | "produksi";
  question: string;
  answer: string;
  highlights?: string[];
}

const FAQ_DATA: FaqItem[] = [
  {
    id: "cara-pesan",
    category: "alur",
    question: "Bagaimana alur dan langkah memesan jersey custom di BP Sport?",
    answer:
      "Pemesanan sangat mudah dan praktis melalui WhatsApp. Cukup pilih referensi dari katalog kami atau kirimkan ide sketsa sendiri. Sampaikan jumlah anggota tim, nama, nomor, dan logo yang ingin dipasang. Tim kami akan membantu mengarahkan pilihan paket bahan, membuatkan mockup visual persetujuan, dan memastikan estimasi biaya serta jadwal pengerjaan sebelum produksi dimulai.",
    highlights: ["Konsultasi gratis via WhatsApp", "Mockup visual sebelum cetak", "Didampingi dari konsep sampai tanding"],
  },
  {
    id: "punya-desain",
    category: "alur",
    question: "Apakah saya harus sudah memiliki desain sendiri yang siap cetak?",
    answer:
      "Tidak perlu! Kamu bebas memilih desain yang tersedia di katalog BP Sport atau sekadar mengirimkan referensi foto dari internet maupun coretan tangan. Desainer BP Sport siap membantu menata letak logo tim, nama pemain, nomor punggung, serta kombinasi warna tim kamu tanpa biaya tambahan desain.",
    highlights: ["Bebas pilih dari katalog kami", "Bisa bawa referensi sendiri", "Bantuan penataan layout gratis"],
  },
  {
    id: "bebas-custom",
    category: "alur",
    question: "Apakah bebas memasang nama pemain, nomor punggung, dan logo tim?",
    answer:
      "Ya, 100% bebas! Semua paket jersey custom BP Sport sudah mencakup kebebasan memasang nama masing-masing pemain, nomor punggung, nomor di celana, logo klub/komunitas di dada, hingga logo sponsor tanpa batasan jumlah warna berkat teknologi full printing sublimasi.",
    highlights: ["Nama pemain & nomor punggung bebas", "Logo tim & sponsor tanpa batas warna", "Nomor celana serasi"],
  },
  {
    id: "minimal-order",
    category: "biaya",
    question: "Berapa minimal pemesanan (minimum order) di BP Sport?",
    answer:
      "Untuk paket Jersey Full Printing Sublimasi, minimal pemesanan mulai dari 6 pcs (sangat ramah untuk tim futsal, mini soccer, basket 3x3, atau komunitas kecil). Untuk paket setelan sablon polyflex/DTF, minimal pemesanan adalah 12 pcs. Jika memesan dalam jumlah besar (50 hingga 500+ pcs untuk turnamen atau seragam kantor), kami menyediakan harga grosir khusus.",
    highlights: ["Printing sublimasi mulai 6 pcs", "Setelan sablon mulai 12 pcs", "Harga grosir khusus partai besar"],
  },
  {
    id: "ukuran-campur",
    category: "produk",
    question: "Apakah bisa memesan jersey dengan ukuran (size chart) yang berbeda-beda?",
    answer:
      "Tentu saja bisa. Dalam satu rombongan pesanan tim, ukuran boleh campur bebas sesuai postur masing-masing pemain, mulai dari ukuran anak-anak, XS, S, M, L, XL, hingga ukuran big size (XXL sampai 5XL). Kami menyediakan panduan tabel ukuran (panjang × lebar dada) yang presisi saat konsultasi.",
    highlights: ["Bebas campur ukuran dalam 1 tim", "Tersedia dari anak-anak s/d 5XL", "Panduan size chart presisi"],
  },
  {
    id: "pilihan-bahan",
    category: "produk",
    question: "Jenis bahan kain apa saja yang digunakan dan apa keunggulannya?",
    answer:
      "Kami menggunakan kain dry-fit athletic standar turnamen profesional: Dry-fit Milano (tekstur zig-zag lembut, sirkulasi udara maksimal, paling diminati tim sepak bola & futsal), Dry-fit Brazil/Bintik (berpori mikro, bobot sangat ringan dan jatuh, ideal untuk aktivitas intensif), dan Dry-fit Serena (elastis dan licin, nyaman untuk olahraga santai). Seluruh bahan memiliki fitur moisture-wicking yang cepat menguapkan keringat.",
    highlights: ["100% Dry-fit athletic berpori", "Teknologi cepat serap & kering", "Pilihan kain Milano, Brazil, & Serena"],
  },
  {
    id: "kualitas-warna",
    category: "produk",
    question: "Bagaimana kualitas cetak warna sublimasi? Apakah bisa luntur atau pecah?",
    answer:
      "Dijamin tidak akan luntur, pecah, atau mengelupas! Teknologi full sublimasi digital kami mentransfer tinta khusus hingga meresap dan mengikat permanen ke dalam serat benang poliester. Warna tetap cerah dan tajam bertahun-tahun, tahan dicuci berulang kali, serta tidak menghambat pori-pori sirkulasi kain.",
    highlights: ["Warna menyatu ke serat kain", "Anti-luntur dan tidak pecah", "Pori-pori kain tetap bernapas"],
  },
  {
    id: "model-kerah",
    category: "produk",
    question: "Model kerah apa saja yang bisa dipilih untuk jersey tim?",
    answer:
      "Kamu bebas memilih variasi bentuk kerah: O-Neck sporty atletik, V-Neck klasik, V-Neck overlap variasi, kerah Shanghai/Koko, hingga kerah Polo berkancing. Setiap model kerah dijahit rapi dengan rib elastis yang nyaman dan tidak mencekik leher saat bergerak aktif.",
    highlights: ["O-Neck, V-Neck, & Shanghai", "Pilihan kerah Polo berkancing", "Rib elastis nyaman di leher"],
  },
  {
    id: "waktu-produksi",
    category: "produksi",
    question: "Berapa lama estimasi waktu pengerjaan / produksi jersey?",
    answer:
      "Estimasi waktu produksi standar adalah 7 hingga 14 hari kerja setelah desain akhir disetujui (ACC), data ukuran lengkap, dan uang muka (DP) dikonfirmasi. Waktu pengerjaan dapat bervariasi tergantung jumlah antrean dan kuantitas pesanan. Untuk kebutuhan turnamen mendesak, silakan diskusikan jadwalmu dengan admin kami.",
    highlights: ["Standar pengerjaan 7–14 hari kerja", "QC ketat sebelum dikemas", "Bisa konsultasi deadline turnamen"],
  },
  {
    id: "sistem-pembayaran",
    category: "biaya",
    question: "Bagaimana sistem pembayaran pemesanan di BP Sport?",
    answer:
      "Sistem pembayaran dilakukan secara bertahap dan transparan: Uang muka (DP) sebesar 50% dibayarkan saat desain dan data ukuran telah disepakati sebelum produksi dimulai. Sisa pelunasan 50% dilakukan setelah seluruh jersey selesai diproduksi, didokumentasikan fotonya oleh admin, dan siap dikirim ke alamatmu.",
    highlights: ["DP 50% di awal sebelum produksi", "Pelunasan 50% saat barang siap kirim", "Bukti foto/video sebelum pelunasan"],
  },
  {
    id: "pengiriman",
    category: "produksi",
    question: "Apakah melayani pengiriman ke luar kota dan seluruh Indonesia?",
    answer:
      "Ya, BP Sport melayani pengiriman ke seluruh wilayah Indonesia! Kami bekerja sama dengan ekspedisi terpercaya seperti JNE, J&T, SiCepat, Lion Parcel, serta kargo darat/udara (Indah Logistik, Baraka, Dakota Cargo) untuk pengiriman pesanan dalam jumlah besar dengan biaya ongkos kirim yang hemat.",
    highlights: ["Kirim ke seluruh Indonesia", "Ekspedisi reguler & kargo hemat", "Nomor resi langsung diinfokan"],
  },
  {
    id: "garansi-kesalahan",
    category: "alur",
    question: "Bagaimana jika terdapat kesalahan cetak nama atau nomor dari pesanan?",
    answer:
      "BP Sport memberikan garansi kualitas produksi penuh. Jika terjadi kesalahan cetak nama atau nomor punggung yang murni diakibatkan oleh kekeliruan pihak produksi kami (berbeda dari lembar data pesanan yang telah kamu konfirmasi), kami akan memperbaikinya atau memproduksi ulang secara gratis.",
    highlights: ["Garansi kesalahan produksi", "Perbaikan atau ganti baru", "Kepuasan tim menjadi prioritas"],
  },
];

const CATEGORIES = [
  { key: "semua", label: "Semua Pertanyaan" },
  { key: "alur", label: "Alur & Desain" },
  { key: "produk", label: "Bahan, Kerah & Ukuran" },
  { key: "biaya", label: "Harga & Pembayaran" },
  { key: "produksi", label: "Produksi & Kirim" },
] as const;

export function FaqBrowser() {
  const [selectedCategory, setSelectedCategory] = useState<string>("semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({ "cara-pesan": true });

  const toggleItem = (id: string) => {
    setOpenIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredItems = useMemo(() => {
    return FAQ_DATA.filter((item) => {
      const matchCategory = selectedCategory === "semua" || item.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q) ||
        item.highlights?.some((h) => h.toLowerCase().includes(q));
      return matchCategory && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="faq-browser">
      {/* KONTROL PENCARIAN & KATEGORI */}
      <div className="faq-controls">
        <label className="faq-search-box">
          <Search size={19} className="search-icon" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari topik pertanyaan (misal: minimal order, bahan, luntur, DP, estimasi)..."
            aria-label="Cari pertanyaan"
          />
          {searchQuery && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => setSearchQuery("")}
              aria-label="Hapus pencarian"
            >
              ×
            </button>
          )}
        </label>

        <div className="faq-category-pills" role="tablist" aria-label="Kategori Pertanyaan">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              type="button"
              role="tab"
              aria-selected={selectedCategory === cat.key}
              className={`faq-pill ${selectedCategory === cat.key ? "active" : ""}`}
              onClick={() => setSelectedCategory(cat.key)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* HASIL ACCORDION DAFTAR PERTANYAAN */}
      <div className="faq-results-info">
        <span>Menampilkan <strong>{filteredItems.length}</strong> pertanyaan</span>
        {searchQuery && (
          <button type="button" className="text-link reset-link" onClick={() => { setSearchQuery(""); setSelectedCategory("semua"); }}>
            Reset filter
          </button>
        )}
      </div>

      {filteredItems.length === 0 ? (
        <div className="empty-state faq-empty">
          <HelpCircle size={40} className="empty-icon" />
          <h3>Pertanyaan belum ditemukan</h3>
          <p>
            Coba gunakan kata kunci lain atau pilih kategori &ldquo;Semua Pertanyaan&rdquo;.
          </p>
          <button
            type="button"
            className="button"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("semua");
            }}
          >
            Tampilkan Semua Pertanyaan
          </button>
        </div>
      ) : (
        <div className="faq-accordion-list">
          {filteredItems.map((item, index) => {
            const isOpen = Boolean(openIds[item.id]);
            return (
              <article key={item.id} className={`faq-card ${isOpen ? "is-open" : ""}`}>
                <button
                  type="button"
                  className="faq-card-header"
                  onClick={() => toggleItem(item.id)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-body-${item.id}`}
                >
                  <span className="faq-number">0{index + 1}</span>
                  <span className="faq-question-text">{item.question}</span>
                  <ChevronDown size={20} className={`faq-chevron ${isOpen ? "rotate" : ""}`} />
                </button>

                {isOpen && (
                  <div id={`faq-body-${item.id}`} className="faq-card-body">
                    <p className="faq-answer-text">{item.answer}</p>
                    {item.highlights && item.highlights.length > 0 && (
                      <div className="faq-highlights">
                        {item.highlights.map((h) => (
                          <span key={h} className="faq-highlight-tag">
                            <Check size={13} /> {h}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}

      {/* KOTAK BANTUAN WHATSAPP DI BAWAH ACCORDION */}
      <section className="faq-contact-card">
        <div className="faq-contact-content">
          <div className="contact-badge">
            <Sparkles size={14} /> KONSULTASI LANGSUNG
          </div>
          <h3>Punya pertanyaan spesifik seputar jersey tim kamu?</h3>
          <p>
            Admin BP Sport siap membantu menghitung perkiraan biaya, mengecek stok bahan dry-fit,
            hingga memberikan saran model terbaik sesuai anggaran timmu.
          </p>
          <div className="faq-contact-actions">
            <WhatsAppLink className="button faq-wa-btn">
              <MessageCircle size={17} /> Tanya Admin via WhatsApp
            </WhatsAppLink>
            <Link href="/katalog" className="button button-outline">
              Lihat Katalog Desain <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
