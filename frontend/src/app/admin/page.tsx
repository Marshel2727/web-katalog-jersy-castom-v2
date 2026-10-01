import Link from "next/link";
import {
  Tags,
  Shirt,
  Package,
  Layers,
  Scissors,
  MessageSquareQuote,
  Settings,
  ArrowUpRight,
} from "lucide-react";
import { resourceConfigs } from "@/components/admin/resource-config";

const resourceIcons: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  categories: Tags,
  designs: Shirt,
  "pricing-packages": Package,
  materials: Layers,
  collars: Scissors,
  testimonials: MessageSquareQuote,
};

export default function AdminPage() {
  return (
    <>
      <div className="admin-heading">
        <div>
          <span className="eyebrow">BP SPORT / ADMIN</span>
          <h1>Kelola website</h1>
          <p>Pilih bagian yang ingin diperbarui. Perubahan data aktif akan tampil di website pelanggan.</p>
        </div>
      </div>
      <div className="admin-dashboard">
        {Object.entries(resourceConfigs).map(([slug, config]) => {
          const Icon = resourceIcons[slug] || Tags;
          return (
            <Link className="admin-panel admin-dash-card" href={"/admin/" + slug} key={slug}>
              <div className="admin-dash-card-header">
                <div className="admin-dash-icon-wrap">
                  <Icon size={20} aria-hidden="true" />
                </div>
                <ArrowUpRight size={18} className="admin-arrow-icon" aria-hidden="true" />
              </div>
              <h2>{config.title}</h2>
              <p>{config.description}</p>
            </Link>
          );
        })}
        <Link className="admin-panel admin-dash-card" href="/admin/pengaturan">
          <div className="admin-dash-card-header">
            <div className="admin-dash-icon-wrap">
              <Settings size={20} aria-hidden="true" />
            </div>
            <ArrowUpRight size={18} className="admin-arrow-icon" aria-hidden="true" />
          </div>
          <h2>Pengaturan toko</h2>
          <p>Nama, logo, WhatsApp, dan media sosial.</p>
        </Link>
      </div>
    </>
  );
}

