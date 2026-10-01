"use client";
import { createContext, useContext } from "react";
import { usePathname } from "next/navigation";
import type { SiteConfig } from "@/types";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const SiteContext = createContext<SiteConfig | null>(null);
export function useSite() {
  const site = useContext(SiteContext);
  if (!site) throw new Error("SiteProvider diperlukan.");
  return site;
}
export function SiteProvider({ site, children }: { site: SiteConfig; children: React.ReactNode }) {
  const admin = usePathname().startsWith("/admin");
  return <SiteContext.Provider value={site}>
    {!admin && <Header />}
    {children}
    {!admin && <Footer />}
  </SiteContext.Provider>;
}
