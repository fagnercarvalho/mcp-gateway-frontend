export type RoleRecord = {
  id: string;
  name: string;
  userCount: number;
  description: string;
};

const roles: RoleRecord[] = [
  { id: "role-1", name: "Platform Admin", userCount: 2, description: "Full admin over gateways, profiles, and SSO." },
  { id: "role-2", name: "Gateway Operator", userCount: 3, description: "Manages gateway endpoints and profile assignments." },
  { id: "role-3", name: "Security Reviewer", userCount: 2, description: "Approves credential handling and SAML posture." },
  { id: "role-4", name: "Developer", userCount: 5, description: "Consumes approved MCPs through assigned profiles." },
];

export async function getRoles() {
  return roles;
}
