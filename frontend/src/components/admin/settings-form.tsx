"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, UploadCloud, X, ChevronRight, CheckCircle2 } from "lucide-react";
import { readSettings, saveSettings } from "@/lib/api/admin";

import { cleanFormData } from "@/lib/api/form-data";
import type { SiteSettingDto } from "@/lib/api/types";
import { ErrorMessage } from "./error-message";
import { useSessionError } from "./auth-gate";

export function SettingsForm() {
  const router = useRouter();
  const sessionError = useSessionError();
  const [settings, setSettings] = useState<SiteSettingDto | null>(null);
  const [ready, setReady] = useState(false);
  const [logoPreview, setLogoPreview] = useState<{ url: string; name: string; size: string } | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    readSettings().then(({ data }) => { if (active) { setSettings(data); setReady(true); setError(null); } }).catch((error) => { if (active) setError(error); });
    return () => { active = false; };
  }, [attempt]);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 4000);
    return () => clearTimeout(timer);
  }, [notice]);


  useEffect(() => {
    return () => {
      if (logoPreview) URL.revokeObjectURL(logoPreview.url);
    };
  }, [logoPreview]);

  function handleLogoChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    setLogoPreview((prev) => {
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
    const body = cleanFormData(event.currentTarget, []);
    setBusy(true); setError(null); setNotice("");
    try {
      const { data } = await saveSettings(body);
      setSettings(data);
      setLogoPreview(null);
      setNotice("Pengaturan berhasil disimpan.");
      router.refresh();
    }
    catch (error) { sessionError(error); setError(error instanceof Error ? error : new Error("Pengaturan gagal disimpan.")); }
    finally { setBusy(false); }
  }

  return <>
    <nav className="admin-breadcrumb" aria-label="Jejak navigasi">
      <Link href="/admin">Dashboard</Link>
      <ChevronRight size={13} aria-hidden="true" />
      <span>Pengaturan toko</span>
    </nav>
    <div className="admin-heading">
      <div>
        <h1>Pengaturan toko</h1>
        <p>Informasi ini digunakan pada website dan tautan WhatsApp pelanggan.</p>
      </div>
    </div>

    {notice && (
      <aside className="admin-toast" role="status" aria-live="polite">
        <CheckCircle2 size={18} className="admin-toast-icon" aria-hidden="true" />
        <p>{notice}</p>
        <button type="button" className="admin-toast-close" onClick={() => setNotice("")} aria-label="Tutup notifikasi">
          <X size={14} aria-hidden="true" />
        </button>
      </aside>
    )}

    <section className="admin-panel">
      <ErrorMessage error={error} />

      {!ready ? (
        <>{!error ? <p role="status">Memuat pengaturan...</p> : <button className="button" onClick={() => setAttempt((value) => value + 1)}>Coba lagi</button>}</>
      ) : (
        <form className="admin-form" onSubmit={submit}>
          <fieldset disabled={busy}>
            <div className="admin-fields">
              <label>
                <span>Nama toko <span className="admin-required">*</span></span>
                <input name="name" required maxLength={100} defaultValue={settings?.name || ""} />
              </label>
              <label>
                <span>Nomor WhatsApp <span className="admin-required">*</span></span>
                <input name="whatsapp" type="tel" required pattern="[1-9][0-9]{7,14}" placeholder="6281234567890" defaultValue={settings?.whatsapp || ""} />
                <small>Format internasional tanpa + atau spasi. Contoh: 6281234567890.</small>
              </label>
              <label className="admin-field-full">
                <span>Tagline <span className="admin-required">*</span></span>
                <input name="tagline" required maxLength={255} defaultValue={settings?.tagline || ""} />
              </label>
              <label>
                <span>Instagram</span>
                <input name="instagram_url" type="url" maxLength={512} pattern="https://.*" placeholder="https://www.instagram.com/..." defaultValue={settings?.instagram_url || ""} />
              </label>
              <label>
                <span>TikTok</span>
                <input name="tiktok_url" type="url" maxLength={512} pattern="https://.*" placeholder="https://www.tiktok.com/..." defaultValue={settings?.tiktok_url || ""} />
              </label>
            </div>
            <section className="admin-subform">
              <div className="admin-subform-head">
                <h3>Logo toko</h3>
                <p>Format JPG, PNG, atau WebP. Maksimal 5 MB dan 5000 × 5000 piksel.</p>
              </div>
              {(settings?.logo_url || logoPreview) && (
                <div className="admin-preview-grid">
                  {settings?.logo_url && (
                    <div className="admin-preview-card">
                      <span className="admin-badge">Logo saat ini</span>
                      <Image className="admin-current-image" src={settings.logo_url} alt={settings.name} width={300} height={100} />
                    </div>
                  )}
                  {logoPreview && (
                    <div className="admin-preview-card active">
                      <span className="admin-badge active">Pratinjau baru ({logoPreview.size})</span>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img className="admin-current-image" src={logoPreview.url} alt={logoPreview.name} />
                      <small>{logoPreview.name}</small>
                    </div>
                  )}
                </div>
              )}
              <label className="admin-upload-box">
                <UploadCloud size={24} className="admin-upload-icon" aria-hidden="true" />
                <span className="admin-upload-title">{settings ? "Ganti logo (opsional)" : "Logo (opsional)"}</span>
                <span className="admin-upload-hint">Klik untuk memilih file logo dari perangkat Anda</span>
                <input name="logo" type="file" accept="image/jpeg,image/png,image/webp" onChange={handleLogoChange} />
              </label>
            </section>
            <div className="admin-actions">
              <button className="button" type="submit">
                <Check size={16} aria-hidden="true" />
                <span>{busy ? "Menyimpan..." : "Simpan pengaturan"}</span>
              </button>
            </div>
          </fieldset>
        </form>
      )}

    </section>
  </>;
}

