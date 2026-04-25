import { PageHeader } from "@/components/ui/page-header";
import { ProfileSettings } from "@/features/account/profile-settings";

export default function ProfilePage() {
  return (
    <div className="page">
      <PageHeader eyebrow="Account" title="Profile" description="Update your avatar image." />
      <ProfileSettings />
    </div>
  );
}
