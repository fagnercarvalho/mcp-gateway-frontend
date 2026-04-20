export async function getSsoReadiness() {
  return {
    provider: "Identity Provider",
    protocol: "SAML 2.0",
    states: [
      { label: "Identity source", value: "Central identity provider", status: "ok" as const },
      { label: "Role sync", value: "Admin API mapping", status: "ok" as const },
      { label: "Metadata exchange", value: "Configured through the backend", status: "warn" as const },
      { label: "Assertion validation", value: "Gateway middleware", status: "warn" as const },
    ],
    notes: [
      "Manage users, passwords, roles, and SSO settings through the admin API presented by the platform.",
      "Expose SAML metadata and ACS endpoints from the backend, not directly from Next.js.",
      "Keep profile-to-role mapping in the gateway domain so UI and backend stay aligned.",
    ],
  };
}
