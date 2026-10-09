"use client";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  ChevronRight,
  CheckCircle2,
  SearchX,
  RotateCcw,
  ImageIcon,
} from "lucide-react";
import { deleteEntity, listEntities, readEntity } from "@/lib/api/admin";
import type { AdminEntity, EntityName, Query } from "@/lib/api/types";
import { usePage } from "@/lib/api/use-page";
import { Pagination } from "@/components/ui/pagination";
import { resourceConfigs } from "./catalog-resource-config";
import { EntityForm } from "./catalog-editor-modal";
import { ErrorMessage } from "./error-message";
import { useSessionError } from "./auth-gate";

function getEntityThumbnail(item: AdminEntity): string | null {
  if ("images" in item && Array.isArray(item.images) && item.images.length > 0) {
    return item.images[0]?.image_url || null;
  }
  if ("image_url" in item && typeof item.image_url === "string" && item.image_url) {
    return item.image_url;
  }
  return null;
}

export function ResourceManager({ name }: { name: EntityName }) {
  const config = resourceConfigs[name];
  const router = useRouter();
  const [filters, setFilters] = useState({ q: "", page: 1 });
  const load = useCallback((query: Query, signal: AbortSignal) => listEntities(name, query, signal), [name]);
  const { result, loading, error, reload } = usePage(load, filters);
  const [editing, setEditing] = useState<AdminEntity | "new" | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<AdminEntity | null>(null);
  const [actionError, setActionError] = useState<Error | null>(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const sessionError = useSessionError();

  useEffect(() => { if (error) sessionError(error); }, [error, sessionError]);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 4000);
    return () => clearTimeout(timer);
  }, [notice]);

  useEffect(() => {
    if (!confirmDelete) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !busy) setConfirmDelete(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [confirmDelete, busy]);

  async function edit(id: number) {
    setBusy(true); setActionError(null); setNotice("");
    try { setEditing((await readEntity(name, id)).data); }
    catch (error) { sessionError(error); setActionError(error instanceof Error ? error : new Error("Data gagal dimuat.")); }
    finally { setBusy(false); }
  }

  async function confirmRemove() {
    if (!confirmDelete) return;
    const item = confirmDelete;
    setBusy(true); setActionError(null); setNotice("");
    try {
      await deleteEntity(name, item.id);
      setConfirmDelete(null);
      setNotice('Data "' + item.name + '" berhasil dihapus.');
      if (result?.data.length === 1 && filters.page > 1) setFilters((state) => ({ ...state, page: state.page - 1 })); else reload();
      router.refresh();
    } catch (error) { sessionError(error); setActionError(error instanceof Error ? error : new Error("Data gagal dihapus.")); }
    finally { setBusy(false); }
  }

  return <>
    <nav className="admin-breadcrumb" aria-label="Jejak navigasi">
      <Link href="/admin">Dashboard</Link>
      <ChevronRight size={13} aria-hidden="true" />
      <span>{config.title}</span>
    </nav>
    <div className="admin-heading">
      <div>
        <h1>{config.title}</h1>
        <p>{config.description}</p>
      </div>
      <button className="button" disabled={busy || editing !== null} onClick={() => { setEditing("new"); setNotice(""); }}>
        <Plus size={16} aria-hidden="true" />
        <span>Tambah {config.title.toLowerCase()}</span>
      </button>
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

    <ErrorMessage error={actionError} />
    {editing !== null && (
      <EntityForm
        key={editing === "new" ? "new" : editing.id}
        name={name}
        initial={editing === "new" ? undefined : editing}
        onCancel={() => setEditing(null)}
        onSaved={() => { setEditing(null); setNotice("Data berhasil disimpan."); reload(); router.refresh(); }}
      />
    )}
    {confirmDelete !== null && (
      <div className="admin-modal-backdrop" onClick={(event) => { if (event.target === event.currentTarget && !busy) setConfirmDelete(null); }}>
        <section className="admin-panel admin-modal admin-modal-sm" role="alertdialog" aria-modal="true" aria-labelledby="delete-dialog-title">
          <header className="admin-modal-header">
            <div>
              <span className="eyebrow admin-danger-text">KONFIRMASI HAPUS</span>
              <h2 id="delete-dialog-title">Hapus {config.title.toLowerCase()}?</h2>
            </div>
            <button type="button" className="admin-close-btn" disabled={busy} onClick={() => setConfirmDelete(null)} aria-label="Batal hapus">
              <X size={18} aria-hidden="true" />
            </button>
          </header>
          <div className="admin-modal-body">
            <p>Anda akan menghapus <strong>&ldquo;{confirmDelete.name}&rdquo;</strong>. Tindakan ini permanen dan gambar terkait juga akan ikut dihapus.</p>
          </div>
          <footer className="admin-modal-footer">
            <button type="button" className="button button-outline" disabled={busy} onClick={() => setConfirmDelete(null)}>Batal</button>
            <button type="button" className="button admin-button-danger" disabled={busy} onClick={confirmRemove}>
              <Trash2 size={16} aria-hidden="true" />
              <span>{busy ? "Menghapus..." : "Ya, hapus"}</span>
            </button>
          </footer>
        </section>
      </div>
    )}
    <section className="admin-panel">
      <div className="admin-toolbar">
        <label className="admin-search">
          <span>Cari {config.title.toLowerCase()}</span>
          <div className="admin-search-box">
            <Search size={16} className="admin-search-icon" aria-hidden="true" />
            <input type="search" value={filters.q} placeholder="Ketik nama atau kode referensi..." onChange={(event) => setFilters({ q: event.target.value, page: 1 })} />
          </div>
        </label>
        <p className="admin-badge" role="status">
          {loading ? "Memuat..." : (result ? ((result.meta.current_page - 1) * 12 + 1) + "–" + Math.min(result.meta.current_page * 12, result.meta.total) + " dari " + result.meta.total + " data" : "0 data")}
        </p>
      </div>
      <ErrorMessage error={error} />
      {error && <button className="button" onClick={() => error.status === 401 ? sessionError(error) : reload()}>{error.status === 401 ? "Masuk kembali" : "Coba lagi"}</button>}
      {!error && (
        <div className="admin-table-wrap">
          <table className="admin-table" aria-busy={loading}>
            <thead>
              <tr>
                <th>Nama & Produk</th>
                <th>Referensi</th>
                <th>Status</th>
                <th>Urutan</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading && !result ? (
                [1, 2, 3, 4, 5].map((i) => (
                  <tr key={i} className="admin-skeleton-row">
                    <td><div className="admin-skeleton admin-skeleton-text" /></td>
                    <td><div className="admin-skeleton admin-skeleton-sub" /></td>
                    <td><div className="admin-skeleton admin-skeleton-badge" /></td>
                    <td><div className="admin-skeleton admin-skeleton-num" /></td>
                    <td><div className="admin-skeleton admin-skeleton-btn" /></td>
                  </tr>
                ))
              ) : (
                result?.data.map((item) => {
                  const thumb = getEntityThumbnail(item);
                  return (
                    <tr key={item.id}>
                      <td>
                        <div className="admin-table-item">
                          {thumb ? (
                            <Image src={thumb} alt={item.name} width={38} height={38} className="admin-table-thumb" />
                          ) : "initials" in item && item.initials ? (
                            <span className="admin-table-initials">{item.initials}</span>
                          ) : (
                            <span className="admin-table-thumb-fallback">
                              <ImageIcon size={18} aria-hidden="true" />
                            </span>
                          )}
                          <div className="admin-table-title-wrap">
                            <strong>{item.name}</strong>
                            {"price_label" in item && item.price_label && (
                              <small className="admin-subtext">{item.price_label}</small>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>
                        <code className="admin-table-ref">
                          {"code" in item ? item.code : "slug" in item ? item.slug : item.team}
                        </code>
                      </td>
                      <td>
                        <span className={item.is_active ? "admin-status active" : "admin-status"}>
                          <span className="admin-status-dot" aria-hidden="true" />
                          <span>{item.is_active ? "Aktif" : "Nonaktif"}</span>
                        </span>
                      </td>
                      <td>{item.sort_order}</td>
                      <td>
                        <div className="admin-row-actions">
                          <button disabled={busy || editing !== null} onClick={() => edit(item.id)} aria-label={"Edit " + item.name}>
                            <Pencil size={13} aria-hidden="true" />
                            <span>Edit</span>
                          </button>
                          <button className="admin-danger" disabled={busy || editing !== null} onClick={() => setConfirmDelete(item)} aria-label={"Hapus " + item.name}>
                            <Trash2 size={13} aria-hidden="true" />
                            <span>Hapus</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
              {!loading && result?.data.length === 0 && (
                <tr>
                  <td colSpan={5}>
                    <div className="admin-empty-state">
                      <SearchX size={38} className="admin-empty-icon" aria-hidden="true" />
                      <h3>{filters.q ? "Pencarian tidak ditemukan" : "Belum ada " + config.title.toLowerCase()}</h3>
                      <p>{filters.q ? 'Tidak ada data yang cocok dengan "' + filters.q + '". Coba ubah kata kunci pencarian.' : "Mulai kelola konten dengan menambahkan " + config.title.toLowerCase() + " baru."}</p>
                      <div className="admin-actions">
                        {filters.q && (
                          <button type="button" className="button button-outline" onClick={() => setFilters({ q: "", page: 1 })}>
                            <RotateCcw size={14} aria-hidden="true" />
                            <span>Reset pencarian</span>
                          </button>
                        )}
                        <button type="button" className="button" onClick={() => { setEditing("new"); setNotice(""); }}>
                          <Plus size={14} aria-hidden="true" />
                          <span>Tambah {config.title.toLowerCase()}</span>
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      {result && !error && <Pagination page={result.meta.current_page} lastPage={result.meta.last_page} disabled={loading || busy} onChange={(page) => setFilters((state) => ({ ...state, page }))} />}
    </section>
  </>;
}



