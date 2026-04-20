# MCP Gateway Frontend

Admin panel prototype for managing MCP gateways, users, roles, profiles, allowlisted MCP servers, and SSO readiness.

This project uses Next.js with the App Router and currently runs entirely on mock data. Each page reads through a small async data layer so the frontend can later switch from local mocks to real HTTP calls without rewriting the page components.

## Requirements

- Node.js 24.x recommended
- npm 11.x recommended

## How To Run

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open the app:

```text
http://localhost:3000
```

## Useful Commands

Run type checking:

```bash
npm run typecheck
```

Run linting:

```bash
npm run lint
```

Create a production build:

```bash
npm run build
```

Start the production server after building:

```bash
npm run start
```

## Current Scope

- `Users`: mock user list plus client-side draft creation flow
- `Roles`: mock role catalog plus client-side draft creation flow
- `Profiles`: role-to-MCP access mapping
- `MCPs`: allowlist-based MCP management, currently Datadog only
- `Gateways`: gateway definitions with profile-aware setup instructions
- `SSO`: SAML readiness view
- `Theme`: light/dark toggle stored in local browser storage

## Project Structure

```text
app/         Next.js routes and global layout
components/  Shared UI and layout components
features/    Page/domain slices with mock data and admin components
lib/         Shared constants such as navigation
docs/        Planning documents
```

## Mock Data Design

The mock data is intentionally isolated under `features/*/data.ts`.

Examples:

- `features/users/data.ts`
- `features/gateways/data.ts`
- `features/mcps/data.ts`

These functions are asynchronous on purpose. When a backend exists, the intended swap is:

1. Keep the page components mostly unchanged.
2. Replace mock-returning functions with HTTP calls.
3. Move form submissions to matching create/update/delete service functions.

## Notes

- The app currently persists only theme preference in `localStorage`.
- Admin form changes are client-side only and reset on refresh.
- MCP selection is intentionally constrained to the allowed catalog, which currently contains only Datadog.
