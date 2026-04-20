import { PageHeader } from "@/components/ui/page-header";
import { getAllowedMcpCatalog } from "@/features/mcps/data";
import { getRoles } from "@/features/roles/data";
import { getProfiles } from "@/features/profiles/data";
import { ProfilesAdmin } from "@/features/profiles/profiles-admin";

export default async function ProfilesPage() {
  const [profiles, catalog, roles] = await Promise.all([getProfiles(), getAllowedMcpCatalog(), getRoles()]);

  return (
    <div className="page">
      <PageHeader
        eyebrow="Profiles"
        title="Profiles"
        description="Manage access profiles that combine roles and MCP servers."
      />

      <ProfilesAdmin
        initialProfiles={profiles}
        allowedMcpNames={catalog.map((item) => item.name)}
        availableRoleNames={roles.map((role) => role.name)}
      />
    </div>
  );
}
