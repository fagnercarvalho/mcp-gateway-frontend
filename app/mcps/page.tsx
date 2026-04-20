import { PageHeader } from "@/components/ui/page-header";
import { getAllowedMcpCatalog, getMcps } from "@/features/mcps/data";
import { McpsAdmin } from "@/features/mcps/mcps-admin";

export default async function McpsPage() {
  const [catalog, mcps] = await Promise.all([getAllowedMcpCatalog(), getMcps()]);

  return (
    <div className="page">
      <PageHeader
        eyebrow="MCP Servers"
        title="Allowlisted MCP servers"
        description="Browse the MCP servers that are available to the platform."
      />

      <McpsAdmin initialMcps={mcps} catalog={catalog} />
    </div>
  );
}
