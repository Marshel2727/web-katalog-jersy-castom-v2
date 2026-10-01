import { apiBase, queryString, request, ApiError } from "./http.ts";
import type { AdminEntities, AdminUser, EntityName, Page, Query, Resource, SiteSettingDto } from "./types.ts";
async function csrf() {
  const response = await fetch(apiBase().replace(/\/api$/, "") + "/sanctum/csrf-cookie", { credentials: "include", headers: { Accept: "application/json" }, signal: AbortSignal.timeout(15000) });
  if (!response.ok) throw new ApiError("Sesi formulir tidak dapat disiapkan.", response.status);
}
export function csrfToken(cookie: string) {
  const value = cookie.split(/;\s*/).find((part) => part.startsWith("XSRF-TOKEN="))?.slice("XSRF-TOKEN=".length);
  return value ? decodeURIComponent(value) : "";
}
async function mutate<T>(path: string, method: string, body?: BodyInit) {
  if (!csrfToken(document.cookie)) await csrf();
  return request<T>(path, { method, body, headers: { "X-XSRF-TOKEN": csrfToken(document.cookie) } });
}
export const currentAdmin = () => request<Resource<AdminUser>>("/auth/me");
export async function login(email: string, password: string) { await csrf(); return mutate<Resource<AdminUser>>("/auth/login", "POST", JSON.stringify({ email, password })); }
export const logout = () => mutate<void>("/auth/logout", "POST");
export const listEntities = <K extends EntityName>(name: K, query: Query = {}, signal?: AbortSignal) => request<Page<AdminEntities[K]>>("/admin/" + name + queryString({ per_page: 12, ...query }), { signal });
export const readEntity = <K extends EntityName>(name: K, id: number) => request<Resource<AdminEntities[K]>>("/admin/" + name + "/" + id);
export function saveEntity<K extends EntityName>(name: K, body: FormData, id?: number) {
  if (id) body.set("_method", "PATCH");
  return mutate<Resource<AdminEntities[K]>>("/admin/" + name + (id ? "/" + id : ""), "POST", body);
}
export const deleteEntity = (name: EntityName, id: number) => mutate<void>("/admin/" + name + "/" + id, "DELETE");
export async function readSettings(): Promise<Resource<SiteSettingDto | null>> {
  try { return await request<Resource<SiteSettingDto>>("/site-settings"); }
  catch (error) {
    if (error instanceof ApiError && error.status === 404) return { data: null };
    throw error;
  }
}
export function saveSettings(body: FormData) { body.set("_method", "PATCH"); return mutate<Resource<SiteSettingDto>>("/admin/site-settings", "POST", body); }
