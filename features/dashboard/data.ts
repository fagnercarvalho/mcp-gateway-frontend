type OverviewMetric = {
  label: string;
  value: string;
  detail?: string;
};

type Construct = {
  name: string;
  href: string;
  summary: string;
};

export async function getDashboardOverview(): Promise<{
  metrics: OverviewMetric[];
  constructs: Construct[];
}> {
  return {
    metrics: [
      { label: "Users", value: "12" },
      { label: "Roles", value: "4" },
      { label: "Profiles", value: "4" },
      { label: "Gateways", value: "3" },
    ],
    constructs: [
      { name: "Users", href: "/users", summary: "Manage accounts, passwords, assigned roles, and profile access." },
      { name: "Roles", href: "/roles", summary: "Define reusable permission groups that can be assigned to users and profiles." },
      { name: "Profiles", href: "/profiles", summary: "Combine roles with MCP access so gateways can return the right tools." },
      { name: "MCP Servers", href: "/mcps", summary: "Browse the allowlisted MCP catalog and inspect server-specific configuration." },
      { name: "Gateways", href: "/gateways", summary: "Connect profiles to gateway endpoints and generate setup instructions for tools." },
      { name: "SSO", href: "/sso", summary: "Review SAML setup details for sign-in and identity-provider integration." },
    ],
  };
}
