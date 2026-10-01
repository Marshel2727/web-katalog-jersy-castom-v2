import type { Query } from "./types.ts";

export class ApiError extends Error {
  status: number;
  errors: Record<string, string[]>;
  constructor(message: string, status: number, errors: Record<string, string[]> = {}) {
    super(message); this.name = "ApiError"; this.status = status; this.errors = errors;
  }
}
export function apiBase() {
  const url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
  return (typeof window === "undefined" ? process.env.API_SERVER_URL || url : url).replace(/\/$/, "");
}
export function queryString(query: Query = {}) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) if (value !== undefined && value !== "") params.set(key, String(value));
  return params.size ? "?" + params.toString() : "";
}
export async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");
  if (init.body && !(init.body instanceof FormData)) headers.set("Content-Type", "application/json");
  let response: Response;
  try {
    response = await fetch(apiBase() + path, { ...init, headers, signal: init.signal ?? AbortSignal.timeout(15000), credentials: "include", cache: "no-store" });
  } catch (error) {
    if (init.signal?.aborted) throw error;
    throw new ApiError("Tidak dapat menghubungi server. Periksa koneksi dan coba lagi.", 0);
  }
  const body = response.status === 204 ? undefined : await response.json().catch(() => undefined);
  if (!response.ok) {
    const message = response.status === 401 ? "Sesi berakhir. Silakan masuk kembali."
      : response.status === 419 ? "Sesi formulir berakhir. Muat ulang halaman dan coba lagi."
      : response.status >= 500 ? "Server sedang mengalami masalah. Coba lagi nanti."
      : body?.message || "Permintaan tidak berhasil.";
    throw new ApiError(message, response.status, body?.errors);
  }
  if (response.status !== 204 && body === undefined) throw new ApiError("Respons server tidak valid.", response.status);
  return body as T;
}
