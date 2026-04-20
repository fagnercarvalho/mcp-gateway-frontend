import { PageHeader } from "@/components/ui/page-header";
import { getSsoReadiness } from "@/features/sso/data";
import { SsoAdmin } from "@/features/sso/sso-admin";

export default async function SsoPage() {
  const sso = await getSsoReadiness();

  return (
    <div className="page">
      <PageHeader
        eyebrow="SSO"
        title="SAML setup"
        description="Review the settings needed for SAML sign-in."
        actions={<span className="badge">{sso.provider}</span>}
      />

      <SsoAdmin initialState={sso} />
    </div>
  );
}
