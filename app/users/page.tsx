import { PageHeader } from "@/components/ui/page-header";
import { getRoles } from "@/features/roles/data";
import { getUsers } from "@/features/users/data";
import { UsersAdmin } from "@/features/users/users-admin";

export default async function UsersPage() {
  const [users, roles] = await Promise.all([getUsers(), getRoles()]);

  return (
    <div className="page">
      <PageHeader
        eyebrow="Users"
        title="Users"
        description="Manage user accounts, passwords, and roles."
      />

      <UsersAdmin initialUsers={users} availableRoleNames={roles.map((role) => role.name)} />
    </div>
  );
}
