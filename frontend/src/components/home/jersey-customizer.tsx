"use client";

import { useState } from "react";
import { useSite } from "@/components/providers/site-provider";
import {
  Sparkles,
  RotateCcw,
  ArrowUpRight,
  Shirt,
  Check,
  MessageCircle,
  Eye,
  Sliders,
} from "lucide-react";

interface ModelPreset {
  id: string;
  name: string;
  category: string;
  baseColor: string;
  collarStyle: string;
  patternType: "diagonal" | "stripes" | "geometric" | "minimal";
  defaultAccent: string;
}

const MODEL_PRESETS: ModelPreset[] = [
  {
    id: "volt-united",
    name: "Volt United",
    category: "Sepak Bola",
    baseColor: "#151e18",
    collarStyle: "V-Neck Athletic",
    patternType: "diagonal",
    defaultAccent: "#c5f657",
  },
  {
    id: "velocity-blue",
    name: "Velocity Blue",
    category: "Futsal",
    baseColor: "#0f172a",
    collarStyle: "Round Sport Rib",
    patternType: "stripes",
    defaultAccent: "#38bdf8",
  },
  {
    id: "crimson-strike",
    name: "Crimson Strike",
    category: "Sepak Bola",
    baseColor: "#1a1215",
    collarStyle: "V-Neck Rib",
    patternType: "geometric",
    defaultAccent: "#ef4444",
  },
  {
    id: "sandstorm",
    name: "Sandstorm",
    category: "Basket / Classic",
    baseColor: "#211d17",
    collarStyle: "Armless Classic",
    patternType: "minimal",
    defaultAccent: "#facc15",
  },
];

const ACCENT_COLORS = [
  { name: "Neon Volt", hex: "#c5f657" },
  { name: "Electric Cyan", hex: "#38bdf8" },
  { name: "Crimson Red", hex: "#ef4444" },
  { name: "Solar Gold", hex: "#facc15" },
  { name: "Royal Violet", hex: "#c084fc" },
  { name: "Pure White", hex: "#ffffff" },
];

export function JerseyCustomizer() {
  const siteConfig = useSite();
  const [selectedModel, setSelectedModel] = useState<ModelPreset>(MODEL_PRESETS[0]);
  const [accentColor, setAccentColor] = useState(MODEL_PRESETS[0].defaultAccent);
  const [playerName, setPlayerName] = useState("TIM KAMU");
  const [playerNumber, setPlayerNumber] = useState("10");
  const [view, setView] = useState<"back" | "front">("back");
  const [copiedNotification, setCopiedNotification] = useState(false);

  const cleanDigits = siteConfig.whatsapp.replace(/[\s()+-]/g, "");
  const normalizedPhone = cleanDigits.startsWith("0") ? `62${cleanDigits.slice(1)}` : cleanDigits;
  const isWaAvailable = /^[1-9]\d{7,14}$/.test(normalizedPhone);

  const messageText = `Halo BP Sport! Saya mencoba simulator custom jersey di website dan tertarik untuk pesan:
• Model: ${selectedModel.name} (${selectedModel.category})
• Tampak Pilihan: ${view === "back" ? "Punggung (Nama & Nomor)" : "Depan (Dada & Logo)"}
• Nama Punggung: ${playerName || "-"}
• Nomor Punggung: ${playerNumber || "-"}
• Warna Aksen: ${accentColor}
• Model Kerah: ${selectedModel.collarStyle}

Bisa konsultasi estimasi harga, opsi bahan dry-fit, serta minimal order untuk tim kami? Terima kasih!`;

  const waUrl = isWaAvailable
    ? `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(messageText)}`
    : null;

  const handleReset = () => {
    setSelectedModel(MODEL_PRESETS[0]);
    setAccentColor(MODEL_PRESETS[0].defaultAccent);
    setPlayerName("TIM KAMU");
    setPlayerNumber("10");
    setView("back");
  };

  return (
    <section className="customizer-section" id="custom">
      <div className="container">
        <div className="customizer-header">
          <div className="customizer-badge">
            <Sparkles size={14} /> LIVE JERSEY SIMULATOR
          </div>
          <h2>
            Desain jersey tim kamu. <span className="lime">Langsung coba di sini.</span>
          </h2>
          <p>
            Ketik nama & nomor punggung, ganti kombinasi warna aksen, dan lihat perubahannya secara
            langsung sebelum mendiskusikannya dengan tim kami di WhatsApp.
          </p>
        </div>

        <div className="customizer-workbench">
          {/* SISI KIRI: PREVIEW CANVAS */}
          <div className="customizer-stage">
            <div
              className="stage-glow"
              style={{
                background: `radial-gradient(circle at 50% 50%, ${accentColor}33 0%, transparent 68%)`,
              }}
            />

            <div className="stage-toolbar">
              <div className="view-toggle" role="group" aria-label="Pilih sudut pandang jersey">
                <button
                  type="button"
                  className={view === "back" ? "active" : ""}
                  onClick={() => setView("back")}
                >
                  <Eye size={14} /> Tampak Belakang
                </button>
                <button
                  type="button"
                  className={view === "front" ? "active" : ""}
                  onClick={() => setView("front")}
                >
                  <Shirt size={14} /> Tampak Depan
                </button>
              </div>

              <button
                type="button"
                className="reset-btn"
                onClick={handleReset}
                title="Reset pengaturan"
              >
                <RotateCcw size={14} /> Reset
              </button>
            </div>

            {/* SVG REAL-TIME CANVAS */}
            <div className="stage-canvas-wrap">
              <svg
                viewBox="0 0 520 580"
                className="stage-svg"
                role="img"
                aria-label={`Preview jersey ${selectedModel.name} tampak ${view === "back" ? "belakang" : "depan"}`}
              >
                <defs>
                  <linearGradient id="fabricShading" x1="0" y1="0" x2="1" y2=".5">
                    <stop stopColor="#000" stopOpacity=".45" />
                    <stop offset=".24" stopColor="#fff" stopOpacity=".12" />
                    <stop offset=".48" stopColor="#fff" stopOpacity="0" />
                    <stop offset=".75" stopColor="#000" stopOpacity=".15" />
                    <stop offset="1" stopColor="#000" stopOpacity=".45" />
                  </linearGradient>

                  <pattern id="jerseyMesh" width="6" height="6" patternUnits="userSpaceOnUse">
                    <circle cx="2" cy="2" r=".7" fill="#ffffff" opacity=".09" />
                  </pattern>

                  <clipPath id="shirtSilhouette">
                    <path d="M170 92 L224 73 Q260 100 296 73 L350 92 L427 176 L378 222 L346 190 L357 482 Q260 509 163 482 L174 190 L142 222 L93 176 Z" />
                  </clipPath>

                  <filter id="canvasShadow" x="-10%" y="-10%" width="120%" height="130%">
                    <feDropShadow dx="0" dy="18" stdDeviation="16" floodColor="#000" floodOpacity=".5" />
                  </filter>
                </defs>

                {/* Bayangan bawah */}
                <ellipse cx="260" cy="515" rx="125" ry="14" fill="#000" opacity=".28" />

                {/* Jersey Body dengan Clip */}
                <g filter="url(#canvasShadow)">
                  <path
                    d="M170 92 L224 73 Q260 100 296 73 L350 92 L427 176 L378 222 L346 190 L357 482 Q260 509 163 482 L174 190 L142 222 L93 176 Z"
                    fill={selectedModel.baseColor}
                  />

                  <g clipPath="url(#shirtSilhouette)">
                    {/* Pola Dinamis Berdasarkan Model */}
                    {selectedModel.patternType === "diagonal" && (
                      <>
                        <path
                          d="M50 430 L430 110 L470 160 L90 480 Z"
                          fill={accentColor}
                          opacity=".35"
                        />
                        <path
                          d="M40 470 L450 140 L458 155 L50 485 Z"
                          fill={accentColor}
                          opacity=".85"
                        />
                        <path
                          d="M110 500 L450 230 L470 260 L130 520 Z"
                          fill={accentColor}
                          opacity=".2"
                        />
                      </>
                    )}

                    {selectedModel.patternType === "stripes" && (
                      <>
                        <rect x="235" y="60" width="16" height="450" fill={accentColor} opacity=".9" />
                        <rect x="275" y="60" width="16" height="450" fill={accentColor} opacity=".9" />
                        <rect x="195" y="60" width="16" height="450" fill={accentColor} opacity=".4" />
                        <rect x="315" y="60" width="16" height="450" fill={accentColor} opacity=".4" />
                      </>
                    )}

                    {selectedModel.patternType === "geometric" && (
                      <>
                        <polygon points="260,90 320,180 200,180" fill={accentColor} opacity=".25" />
                        <polygon points="260,180 340,300 180,300" fill={accentColor} opacity=".18" />
                        <path
                          d="M70 178 L185 87 M341 88 L449 191"
                          stroke={accentColor}
                          strokeWidth="22"
                          opacity=".8"
                        />
                      </>
                    )}

                    {selectedModel.patternType === "minimal" && (
                      <>
                        <path
                          d="M165 470 Q260 495 355 470"
                          fill="none"
                          stroke={accentColor}
                          strokeWidth="8"
                          opacity=".8"
                        />
                      </>
                    )}

                    {/* Trim Lengan */}
                    <path
                      d="M85 178 L145 220 M374 220 L436 172"
                      stroke={accentColor}
                      strokeWidth="14"
                    />

                    {/* Tekstur Kain & Bayangan Pencahayaan */}
                    <path
                      d="M170 92 L224 73 Q260 100 296 73 L350 92 L427 176 L378 222 L346 190 L357 482 Q260 509 163 482 L174 190 L142 222 L93 176 Z"
                      fill="url(#jerseyMesh)"
                    />
                    <path
                      d="M170 92 L224 73 Q260 100 296 73 L350 92 L427 176 L378 222 L346 190 L357 482 Q260 509 163 482 L174 190 L142 222 L93 176 Z"
                      fill="url(#fabricShading)"
                    />
                  </g>

                  {/* Kerah Jersey */}
                  <path
                    d="M224 73 Q260 100 296 73 L289 95 Q260 122 231 95 Z"
                    fill="#101815"
                    stroke={accentColor}
                    strokeWidth="4"
                  />

                  {/* KONTEN BERDASARKAN SUDUT PANDANG */}
                  {view === "back" ? (
                    <>
                      {/* Nama Pemain di Punggung */}
                      <text
                        x="260"
                        y="178"
                        textAnchor="middle"
                        fontFamily="var(--font-sans), Arial, sans-serif"
                        fontSize="22"
                        fontWeight="800"
                        letterSpacing="4"
                        fill={accentColor}
                        style={{ textTransform: "uppercase" }}
                      >
                        {playerName || "NAMA TIM"}
                      </text>

                      {/* Nomor Punggung Besar */}
                      <text
                        x="260"
                        y="358"
                        textAnchor="middle"
                        fontFamily="var(--font-sans), Arial, sans-serif"
                        fontSize="155"
                        fontWeight="900"
                        fill={accentColor}
                        stroke="#0d1410"
                        strokeWidth="5"
                        letterSpacing="-2"
                      >
                        {playerNumber || "00"}
                      </text>

                      {/* Label Bawah */}
                      <text
                        x="260"
                        y="445"
                        textAnchor="middle"
                        fontFamily="var(--font-sans), Arial, sans-serif"
                        fontSize="10"
                        letterSpacing="6"
                        fontWeight="700"
                        fill="#ffffff"
                        opacity=".6"
                      >
                        BP SPORT APPAREL
                      </text>
                    </>
                  ) : (
                    <>
                      {/* Logo BP Sport di Dada Kiri */}
                      <g transform="translate(195, 150)">
                        <rect width="36" height="36" rx="6" fill="#121a16" stroke={accentColor} strokeWidth="1.5" />
                        <text
                          x="18"
                          y="24"
                          textAnchor="middle"
                          fontFamily="var(--font-sans), Arial, sans-serif"
                          fontSize="13"
                          fontWeight="900"
                          fill={accentColor}
                        >
                          BP
                        </text>
                      </g>

                      {/* Crest Klub di Dada Kanan */}
                      <g transform="translate(290, 150)">
                        <polygon points="18,2 34,10 34,26 18,34 2,26 2,10" fill={accentColor} opacity=".9" />
                        <polygon points="18,6 29,12 29,24 18,30 7,24 7,12" fill="#101713" />
                        <text
                          x="18"
                          y="22"
                          textAnchor="middle"
                          fontFamily="var(--font-sans), Arial, sans-serif"
                          fontSize="10"
                          fontWeight="800"
                          fill="#ffffff"
                        >
                          FC
                        </text>
                      </g>

                      {/* Sponsor Utama di Tengah */}
                      <text
                        x="260"
                        y="270"
                        textAnchor="middle"
                        fontFamily="var(--font-sans), Arial, sans-serif"
                        fontSize="32"
                        fontWeight="900"
                        letterSpacing="4"
                        fill="#ffffff"
                        stroke="#000000"
                        strokeWidth="1"
                      >
                        {playerName || "BP SPORT"}
                      </text>
                      <text
                        x="260"
                        y="292"
                        textAnchor="middle"
                        fontFamily="var(--font-sans), Arial, sans-serif"
                        fontSize="9"
                        letterSpacing="5"
                        fontWeight="700"
                        fill={accentColor}
                      >
                        CUSTOM ATHLETIC WEAR
                      </text>

                      {/* Badge Otentik */}
                      <rect x="185" y="445" width="28" height="16" rx="2" fill="#ffffff" opacity=".7" />
                      <text
                        x="199"
                        y="456"
                        textAnchor="middle"
                        fontFamily="var(--font-sans), Arial, sans-serif"
                        fontSize="8"
                        fontWeight="800"
                        fill="#052f2c"
                      >
                        ORIGINAL
                      </text>
                    </>
                  )}
                </g>
              </svg>
            </div>

            <div className="stage-footer-note">
              <span>* Preview interaktif bersifat visualisasi 2D awal. Detail sablon & bordir disempurnakan saat acc desain.</span>
            </div>
          </div>

          {/* SISI KANAN: CONTROLS & FORM */}
          <div className="customizer-controls">
            {/* 1. MODEL PRESETS */}
            <div className="control-group">
              <label className="control-label">
                <Sliders size={14} /> 1. PILIH MODEL & POLA DASAR
              </label>
              <div className="model-selector-grid">
                {MODEL_PRESETS.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    className={`model-card-btn ${selectedModel.id === m.id ? "active" : ""}`}
                    onClick={() => {
                      setSelectedModel(m);
                      setAccentColor(m.defaultAccent);
                    }}
                  >
                    <strong>{m.name}</strong>
                    <small>{m.category}</small>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. INPUT NAMA & NOMOR */}
            <div className="control-group">
              <label className="control-label">
                <Shirt size={14} /> 2. IDENTITAS PEMAIN / TIM
              </label>
              <div className="input-row">
                <div className="input-field">
                  <span className="input-caption">NAMA PUNGGUNG</span>
                  <input
                    type="text"
                    maxLength={14}
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value.toUpperCase())}
                    placeholder="Contoh: GARUDA"
                  />
                </div>
                <div className="input-field input-field-sm">
                  <span className="input-caption">NOMOR</span>
                  <input
                    type="text"
                    maxLength={3}
                    value={playerNumber}
                    onChange={(e) => setPlayerNumber(e.target.value.replace(/\D/g, ""))}
                    placeholder="10"
                  />
                </div>
              </div>
            </div>

            {/* 3. WARNA AKSEN */}
            <div className="control-group">
              <label className="control-label">
                <Sparkles size={14} /> 3. WARNA AKSEN & NOMOR
              </label>
              <div className="color-swatches">
                {ACCENT_COLORS.map((c) => (
                  <button
                    key={c.hex}
                    type="button"
                    className={`swatch-btn ${accentColor === c.hex ? "active" : ""}`}
                    style={{ background: c.hex }}
                    onClick={() => setAccentColor(c.hex)}
                    title={c.name}
                    aria-label={`Pilih warna aksen ${c.name}`}
                  >
                    {accentColor === c.hex && <Check size={14} color="#000" strokeWidth={3} />}
                  </button>
                ))}
              </div>
            </div>

            {/* SPECS SUMMARY */}
            <div className="customizer-summary">
              <div className="summary-item">
                <span>Model Pilihan:</span>
                <strong>{selectedModel.name}</strong>
              </div>
              <div className="summary-item">
                <span>Kerah Rekomendasi:</span>
                <strong>{selectedModel.collarStyle}</strong>
              </div>
              <div className="summary-item">
                <span>Bahan Unggulan:</span>
                <strong>Dry-Fit Milano Premium</strong>
              </div>
            </div>

            {/* WHATSAPP CTA ACTION */}
            <div className="customizer-actions">
              {waUrl ? (
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button customizer-wa-btn"
                >
                  <MessageCircle size={18} />
                  Kirim Desain Ini ke WhatsApp
                  <ArrowUpRight size={18} />
                </a>
              ) : (
                <div className="wa-demo-box">
                  <button
                    type="button"
                    className="button customizer-wa-btn"
                    onClick={() => {
                      navigator.clipboard?.writeText(messageText);
                      setCopiedNotification(true);
                      setTimeout(() => setCopiedNotification(false), 3000);
                    }}
                  >
                    <MessageCircle size={18} />
                    {copiedNotification ? "Draft Pesan Disalin ke Clipboard!" : "Salin Draft Pesanan Desain"}
                    <ArrowUpRight size={18} />
                  </button>
                  <small className="demo-notice">
                    Nomor WhatsApp toko dapat dihubungkan di konfigurasi. Klik tombol di atas untuk menyalin draf teks pesanan otomatis.
                  </small>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
