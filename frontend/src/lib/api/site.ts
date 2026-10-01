import { cache } from "react";
import { getSite } from "./catalog";

// Layout tetap tersedia ketika API sedang offline agar admin bisa membuka halaman login.
export const getSiteForLayout = cache(async () => {
  try { return await getSite(); }
  catch { return { name: "BP Sport", tagline: "Jersey & Kaos Custom", whatsapp: "" }; }
});
