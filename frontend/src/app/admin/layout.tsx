import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthGate } from "@/components/admin/auth-gate";
import "@/components/admin/admin.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-admin",
  display: "swap",
});

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${inter.variable} ${inter.className} admin-root`}>
      <AuthGate>{children}</AuthGate>
    </div>
  );
}

