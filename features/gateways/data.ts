export type GatewayRecord = {
  id: string;
  name: string;
  address: string;
  profileNames: string[];
  roleNames: string[];
  mcpNames: string[];
  environment: "Development" | "Staging" | "Production";
};

const gateways: GatewayRecord[] = [
  {
    id: "gw-1",
    name: "Northstar Dev Gateway",
    address: "https://gateway-dev.northstar.dev/mcp",
    profileNames: ["Operations", "Datadog Readonly"],
    roleNames: ["Platform Admin", "Gateway Operator", "Developer"],
    mcpNames: ["Datadog"],
    environment: "Development",
  },
  {
    id: "gw-2",
    name: "Northstar Staging Gateway",
    address: "https://gateway-staging.northstar.dev/mcp",
    profileNames: ["Operations", "Security"],
    roleNames: ["Platform Admin", "Gateway Operator", "Security Reviewer"],
    mcpNames: ["Datadog"],
    environment: "Staging",
  },
  {
    id: "gw-3",
    name: "Northstar Production Gateway",
    address: "https://gateway.northstar.dev/mcp",
    profileNames: ["Operations"],
    roleNames: ["Platform Admin", "Gateway Operator"],
    mcpNames: ["Datadog"],
    environment: "Production",
  },
];

export async function getGateways() {
  return gateways;
}

export async function getGatewaySetupExamples() {
  return [
    {
      tool: "Claude Code",
      description:
        "Use the gateway as a remote MCP endpoint. The profile query parameter restricts the returned tools to the selected profile.",
      snippet: `claude mcp add northstar-gateway \\\n  --transport http \\\n  \"https://gateway.northstar.dev/mcp?profile=operations\"`,
    },
    {
      tool: "Codex",
      description:
        "Point Codex at the HTTP MCP endpoint directly. Keep the profile in the URL when you want the session limited to one profile.",
      snippet: `codex mcp add northstar-gateway \\\n  --url \"https://gateway.northstar.dev/mcp?profile=operations\"`,
    },
    {
      tool: "Cursor",
      description:
        "Add the gateway under Cursor's MCP server config. Cursor will read the endpoint and only surface tools returned for the chosen profile.",
      snippet: `{\n  \"mcpServers\": {\n    \"northstar-gateway\": {\n      \"url\": \"https://gateway.northstar.dev/mcp?profile=operations\"\n    }\n  }\n}`,
    },
  ];
}
