import { PageHeader } from "@/components/ui/page-header";
import { getRoles } from "@/features/roles/data";
import { RolesAdmin } from "@/features/roles/roles-admin";

export default async function RolesPage() {
  const roles = await getRoles();

  return (
    <div className="page">
      <PageHeader
        eyebrow="Roles"
        title="Roles"
        description="Manage reusable permission groups for the platform."
      />

      <RolesAdmin initialRoles={roles} />
    </div>
  );
}
