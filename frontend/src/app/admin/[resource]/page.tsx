import { notFound } from "next/navigation";
import { ResourceManager } from "@/components/admin/catalog-resource-manager";
import { isEntityName } from "@/components/admin/catalog-resource-config";
export default async function ResourcePage({ params }: { params: Promise<{ resource: string }> }) {
  const { resource } = await params;
  if (!isEntityName(resource)) notFound();
  return <ResourceManager key={resource} name={resource} />;
}
