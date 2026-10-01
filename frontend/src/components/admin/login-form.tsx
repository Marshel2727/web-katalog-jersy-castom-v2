"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api/admin";
import { ErrorMessage } from "./error-message";

export function LoginForm() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); const data = new FormData(event.currentTarget); setBusy(true); setError(null);
    try { await login(String(data.get("email")), String(data.get("password"))); router.replace("/admin"); router.refresh(); }
    catch (error) { setError(error instanceof Error ? error : new Error("Gagal masuk.")); }
    finally { setBusy(false); }
  }
  return <main id="main" className="admin-login"><div className="admin-panel"><span className="eyebrow">BP SPORT / ADMIN</span><h1>Masuk ke admin</h1><p>Kelola katalog dan informasi toko.</p>
    <ErrorMessage error={error} /><form onSubmit={submit} className="admin-form"><fieldset disabled={busy}>
      <label><span>Email <span className="admin-required">*</span></span><input type="email" name="email" required autoComplete="username" placeholder="admin@bpsport.id" /></label>
      <label>
        <span className="admin-label-row">
          <span>Password <span className="admin-required">*</span></span>
          <button type="button" className="admin-link-btn" onClick={() => setShowPassword((prev) => !prev)}>{showPassword ? "Sembunyikan" : "Lihat password"}</button>
        </span>
        <input type={showPassword ? "text" : "password"} name="password" required autoComplete="current-password" placeholder="Masukkan password..." />
      </label>
      <button className="button" type="submit">{busy ? "Memproses..." : "Masuk ke dashboard"}</button>
    </fieldset></form><Link href="/" className="text-link">← Kembali ke website</Link>
  </div></main>;
}

