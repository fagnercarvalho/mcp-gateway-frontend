export type ProfileRecord = {
  id: string;
  name: string;
  roleNames: string[];
  mcpNames: string[];
  summary: string;
};

const profiles: ProfileRecord[] = [
  {
    id: "profile-1",
    name: "Operations",
    roleNames: ["Platform Admin", "Gateway Operator"],
    mcpNames: ["Datadog"],
    summary: "For platform staff managing observability-aware production gateways.",
  },
  {
    id: "profile-2",
    name: "Security",
    roleNames: ["Security Reviewer", "Gateway Operator"],
    mcpNames: ["Datadog"],
    summary: "Focused on secrets review, authorization, and SAML governance.",
  },
  {
    id: "profile-3",
    name: "Datadog Readonly",
    roleNames: ["Developer"],
    mcpNames: ["Datadog"],
    summary: "Limits users to safe Datadog MCP access for diagnostics workflows.",
  },
  {
    id: "profile-4",
    name: "Customer Success",
    roleNames: ["Developer"],
    mcpNames: [],
    summary: "Prepared for future MCPs but currently restricted from all tools.",
  },
];

export async function getProfiles() {
  return profiles;
}
