import { PageHeader } from "@/components/ui/page-header";
import { getSsoReadiness } from "@/features/sso/data";
import { SsoAdmin } from "@/features/sso/sso-admin";

export default async function SsoPage() {
  const sso = await getSsoReadiness();

  return (
    <div className="page">
      <PageHeader
        eyebrow="SSO"
        title="SSO setup"
        description=""
      />

      <SsoAdmin initialState={sso} />
    </div>
  );
}
