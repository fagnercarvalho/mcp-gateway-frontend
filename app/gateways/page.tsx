import { PageHeader } from "@/components/ui/page-header";
import { getGatewaySetupExamples, getGateways } from "@/features/gateways/data";
import { getProfiles } from "@/features/profiles/data";
import { GatewaysAdmin } from "@/features/gateways/gateways-admin";

export default async function GatewaysPage() {
  const [gateways, setupExamples, profiles] = await Promise.all([
    getGateways(),
    getGatewaySetupExamples(),
    getProfiles(),
  ]);

  return (
    <div className="page">
      <PageHeader
        eyebrow="Gateways"
        title="Gateways"
        description="Manage gateway endpoints, assigned profiles, and setup instructions."
      />

      <GatewaysAdmin initialGateways={gateways} setupExamples={setupExamples} availableProfiles={profiles} />
    </div>
  );
}
