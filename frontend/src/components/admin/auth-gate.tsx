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
  Menu,
  X,
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

function getPageTitle(path: string): string {
  if (path === "/admin/" || path === "/admin") return "Ringkasan";
  if (path.startsWith("/admin/pengaturan")) return "Pengaturan Toko";
  for (const [slug, config] of Object.entries(resourceConfigs)) {
    if (path.startsWith("/admin/" + slug)) return config.title;
  }
  return "Dashboard";
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase() || "BP";
}

const AuthContext = createContext<(error: unknown) => void>(() => {});
export function useSessionError() { return useContext(AuthContext); }
export function AuthGate({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [leaving, setLeaving] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isLogin = path === "/admin/login/" || path === "/admin/login";

  useEffect(() => {
    setSidebarOpen(false);
  }, [path]);

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

  const pageTitle = getPageTitle(path);
  const initials = getInitials(user.name);

  return (
    <AuthContext.Provider value={sessionError}>
      <div className="admin-shell">
        {sidebarOpen && (
          <div
            className="admin-sidebar-backdrop"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        <aside className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}>
          <div className="admin-sidebar-header">
            <Link href="/admin" className="admin-brand" onClick={() => setSidebarOpen(false)}>
              BP SPORT <small>ADMIN</small>
            </Link>
            <button
              type="button"
              className="admin-sidebar-close-btn"
              onClick={() => setSidebarOpen(false)}
              aria-label="Tutup navigasi"
            >
              <X size={18} aria-hidden="true" />
            </button>
          </div>

          <nav aria-label="Navigasi admin">
            <Link
              className={path === "/admin/" || path === "/admin" ? "selected" : ""}
              href="/admin"
              onClick={() => setSidebarOpen(false)}
            >
              <LayoutDashboard size={18} aria-hidden="true" />
              <span>Ringkasan</span>
            </Link>
            {Object.entries(resourceConfigs).map(([slug, config]) => {
              const Icon = resourceIcons[slug] || Tags;
              return (
                <Link
                  className={path.startsWith("/admin/" + slug) ? "selected" : ""}
                  href={"/admin/" + slug}
                  key={slug}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon size={18} aria-hidden="true" />
                  <span>{config.title}</span>
                </Link>
              );
            })}
            <Link
              className={path.startsWith("/admin/pengaturan") ? "selected" : ""}
              href="/admin/pengaturan"
              onClick={() => setSidebarOpen(false)}
            >
              <Settings size={18} aria-hidden="true" />
              <span>Pengaturan toko</span>
            </Link>
          </nav>
        </aside>

        <div className="admin-main-wrapper">
          <header className="admin-header">
            <div className="admin-header-left">
              <button
                type="button"
                className="admin-menu-toggle"
                onClick={() => setSidebarOpen((prev) => !prev)}
                aria-label={sidebarOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
                aria-expanded={sidebarOpen}
              >
                {sidebarOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
              </button>
              <div className="admin-header-context">
                <span className="admin-header-badge">Panel Pengelola</span>
                <span className="admin-header-sep">/</span>
                <span className="admin-header-title">{pageTitle}</span>
              </div>
            </div>

            <div className="admin-header-right">
              <Link href="/" target="_blank" className="admin-header-site-link" title="Buka website publik di tab baru">
                <span>Lihat website</span>
                <ExternalLink size={13} aria-hidden="true" />
              </Link>

              <div className="admin-header-divider" aria-hidden="true" />

              <div className="admin-user-badge">
                <div className="admin-user-avatar" aria-hidden="true">
                  {initials}
                </div>
                <div className="admin-user-info">
                  <strong>{user.name}</strong>
                  <small>{user.email}</small>
                </div>
              </div>

              <button
                type="button"
                onClick={signOut}
                disabled={leaving}
                className="admin-header-logout-btn"
                title="Keluar dari akun admin"
              >
                <LogOut size={15} aria-hidden="true" />
                <span>{leaving ? "Keluar..." : "Keluar"}</span>
              </button>
            </div>
          </header>

          <main id="main" className="admin-content">
            <ErrorMessage error={error} />
            {children}
          </main>
        </div>
      </div>
    </AuthContext.Provider>
  );
}

