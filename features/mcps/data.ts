export type MpcRecord = {
  id: string;
  name: string;
  vendor: string;
  type: string;
  url: string;
  credentialKeys: string[];
  profileNames: string[];
  status: "Allowlisted";
  logoText: string;
};

const mcps: MpcRecord[] = [
  {
    id: "mcp-1",
    name: "Datadog",
    vendor: "Datadog",
    type: "http",
    url: "https://mcp.datadoghq.com/api/unstable/mcp-server/mcp",
    credentialKeys: ["DD_API_KEY", "DD_APPLICATION_KEY"],
    profileNames: ["Operations", "Security", "Datadog Readonly"],
    status: "Allowlisted",
    logoText: "DD",
  },
];

export async function getMcps() {
  return mcps;
}

export async function getAllowedMcpCatalog() {
  return mcps.map((item) => ({
    name: item.name,
    logoText: item.logoText,
    vendor: item.vendor,
    status: item.status,
  }));
}
