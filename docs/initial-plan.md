## MCP Gateway

Create an admin panel for for managing a MCP Gateways

This will use Next.js

For now we don’t have a backend but for each page that shows data create the layer to return mock data so we can easily replace that with HTTP calls in the future

Components will be separated by folders sliced by different pages

The panel can have light or dark theme

We will use Keycloak in the backend to manage users, roles, SAML, etc via the Keycloak Admin API. and a Go backend for the MCP Gateway itself

MCP is Model Context Protocol, protocol created by Anthropic for managing context for LLMs

The gateway can allow individual developers or companies to manage a list of MCP servers in only one gateway.

Advantages of the gateway:
- Can allow only some profiles to access certain MCPs
- Offers observability for MCP calls
- Offers authentication/authorization in the gateway, including SSO with SAML

Pages will be:
- Users (this will be email, password, role).
- Roles (name, users)
- Profiles (roles, MCPs that can access)
- MCPs
    - Each MCP has a name, MCP information such as address, credentials and list of profiles that can access the MCP
    - Only whitelisted MCPs returned by the Go backend can be added, for now let’s just have the Datadog MCP, with the Datadog logo and stuff like that
    - Here is an example of MCP:
```json
{
  "mcpServers": {
    "datadog": {
      "type": "http",
      "url": "https://mcp.datadoghq.com/api/unstable/mcp-server/mcp",
      "headers": {
          "DD_API_KEY": "<YOUR_API_KEY>",
          "DD_APPLICATION_KEY": "<YOUR_APPLICATION_KEY>"
      }
    }
  }
}
```
- Gateways
    - Each gateway has a name, address and a list of profiles that can access the gateway
    - Each time a profile is selected it shows the roles and MCPs related to that profile
    - Show setup instructions in Claude Code, Codex, Cursor, etc. and other AI tools for the gateway and show passing ?profile=<profile> will allow only tools for that specific profile to be returned
- SSO (with SAML)

Separate this by phases: setup phase, each page phase
