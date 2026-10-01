"use client";

import { useEffect, useRef } from "react";
import $ from "jquery";

const questions = [
  ["Bagaimana cara memesan?", "Pilih referensi desain atau paket, lalu klik tombol WhatsApp. Sampaikan jumlah pesanan dan kebutuhanmu. Desain, harga akhir, serta waktu produksi disepakati saat konsultasi."],
  ["Apakah harus punya desain sendiri?", "Tidak. Kamu bisa memilih referensi dari katalog atau menceritakan idemu. Kami bantu arahkan pilihan warna, nama, nomor, dan logo."],
  ["Berapa minimal pemesanannya?", "Paket printing minimal 6 pcs. Harga paket setelan sablon yang ditampilkan berlaku untuk pembelian 12 pcs. Untuk kaos custom atau kebutuhan lain, konsultasikan jumlahnya melalui WhatsApp."],
  ["Bagaimana memilih bahan dan kerah?", "Lihat halaman Bahan & Kerah sebagai referensi. Jika belum yakin, kami bantu memilih saat konsultasi. Pilihan tertentu dapat menambah biaya."],
  ["Apakah harga di website sudah harga akhir?", "Harga paket menjadi acuan awal. Harga akhir menyesuaikan pilihan bahan, kerah, desain, dan jumlah pesanan, lalu dikonfirmasi sebelum produksi."],
];

export function OrderingFaq() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    // Selector dibatasi pada FAQ; React tidak mengelola status buka/tutupnya.
    const section = $(root.current!);
    const buttons = section.find<HTMLButtonElement>(".faq-question");
    const answers = section.find(".faq-answer");
    answers.hide();
    buttons.attr("aria-expanded", "false");

    // Contoh jQuery dasar: event, penelusuran DOM, atribut, class, dan animasi.
    buttons.on("click.faq", function () {
      const button = $(this);
      const answer = button.closest(".faq-item").find(".faq-answer");
      answer.stop(true, true);
      const expanded = button.attr("aria-expanded") !== "true";
      button.attr("aria-expanded", String(expanded));
      button.closest(".faq-item").toggleClass("is-open", expanded);
      const duration = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 250;
      answer.slideToggle(duration);
    });

    return () => {
      buttons.off(".faq");
      answers.stop(true, true).show();
      buttons.attr("aria-expanded", "true");
      section.find(".faq-item").removeClass("is-open");
    };
  }, []);

  return (
    <section ref={root} className="container section ordering-faq" aria-labelledby="faq-title">
      <div className="section-heading">
        <div><span className="eyebrow">SEBELUM MEMESAN</span><h2 id="faq-title">Pertanyaan yang sering ditanyakan.</h2></div>
      </div>
      <div className="faq-list">
        {questions.map(([question, answer], index) => (
          <article className="faq-item" key={question}>
            <h3><button type="button" className="faq-question" id={`faq-question-${index}`} aria-expanded="true" aria-controls={`faq-answer-${index}`}>
              {question}<span className="faq-symbol" aria-hidden="true">+</span>
            </button></h3>
            <div className="faq-answer" id={`faq-answer-${index}`} role="region" aria-labelledby={`faq-question-${index}`}><p>{answer}</p></div>
          </article>
        ))}
      </div>
    </section>
  );
}
