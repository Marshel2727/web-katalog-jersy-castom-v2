"use client";
import Link from "next/link";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Tags,
  Shirt,
  Package,
  Layers,
  Scissors,
  MessageSquareQuote,
  Settings,
  ExternalLink,
  LogOut,
} from "lucide-react";
import { currentAdmin, logout } from "@/lib/api/admin";
import { ApiError } from "@/lib/api/http";
import type { AdminUser } from "@/lib/api/types";
import { resourceConfigs } from "./resource-config";
import { ErrorMessage } from "./error-message";

const resourceIcons: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  categories: Tags,
  designs: Shirt,
  "pricing-packages": Package,
  materials: Layers,
  collars: Scissors,
  testimonials: MessageSquareQuote,
};

const AuthContext = createContext<(error: unknown) => void>(() => {});
export function useSessionError() { return useContext(AuthContext); }
export function AuthGate({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [leaving, setLeaving] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const isLogin = path === "/admin/login/" || path === "/admin/login";
  useEffect(() => {
    if (isLogin) return;
    let active = true;
    currentAdmin().then(({ data }) => { if (active) { setUser(data); setError(null); } }).catch((error) => {
      if (!active) return;
      if (error instanceof ApiError && error.status === 401) router.replace("/admin/login");
      else setError(error instanceof Error ? error : new Error("Sesi tidak dapat diperiksa."));
    });
    return () => { active = false; };
  }, [isLogin, router, attempt]);
  const sessionError = useCallback((error: unknown) => {
    if (error instanceof ApiError && error.status === 401) { setUser(null); router.replace("/admin/login"); }
  }, [router]);
  async function signOut() {
    setLeaving(true); setError(null);
    try { await logout(); setUser(null); router.replace("/admin/login"); }
    catch (error) { sessionError(error); setError(error instanceof Error ? error : new Error("Gagal keluar.")); }
    finally { setLeaving(false); }
  }
  if (isLogin) return children;
  if (!user) return <main id="main" className="admin-login"><h1>Admin BP Sport</h1>{error ? <><ErrorMessage error={error} /><button className="button" onClick={() => setAttempt((value) => value + 1)}>Coba lagi</button></> : <p role="status">Memeriksa sesi...</p>}</main>;
  return <AuthContext.Provider value={sessionError}><div className="admin-shell">
    <aside className="admin-sidebar"><Link href="/admin" className="admin-brand">BP SPORT <small>ADMIN</small></Link>
      <nav aria-label="Navigasi admin">
        <Link className={path === "/admin/" || path === "/admin" ? "selected" : ""} href="/admin">
          <LayoutDashboard size={18} aria-hidden="true" />
          <span>Ringkasan</span>
        </Link>
        {Object.entries(resourceConfigs).map(([slug, config]) => {
          const Icon = resourceIcons[slug] || Tags;
          return (
            <Link className={path.startsWith("/admin/" + slug) ? "selected" : ""} href={"/admin/" + slug} key={slug}>
              <Icon size={18} aria-hidden="true" />
              <span>{config.title}</span>
            </Link>
          );
        })}
        <Link className={path.startsWith("/admin/pengaturan") ? "selected" : ""} href="/admin/pengaturan">
          <Settings size={18} aria-hidden="true" />
          <span>Pengaturan toko</span>
        </Link>
      </nav>
      <div className="admin-account">
        <strong>{user.name}</strong>
        <small>{user.email}</small>
        <Link href="/" target="_blank" className="admin-external-link">
          <span>Lihat website</span>
          <ExternalLink size={13} aria-hidden="true" />
        </Link>
        <button onClick={signOut} disabled={leaving} className="admin-logout-btn">
          <LogOut size={15} aria-hidden="true" />
          <span>{leaving ? "Keluar..." : "Keluar"}</span>
        </button>
      </div>
    </aside>
    <main id="main" className="admin-content"><ErrorMessage error={error} />{children}</main>
  </div></AuthContext.Provider>;
}

