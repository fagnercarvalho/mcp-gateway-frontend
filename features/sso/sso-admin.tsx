"use client";

import { useState } from "react";

type SsoReadiness = Awaited<ReturnType<typeof import("@/features/sso/data").getSsoReadiness>>;

type SsoAdminProps = {
  initialState: SsoReadiness;
};

export function SsoAdmin({ initialState }: SsoAdminProps) {
  const [enabled, setEnabled] = useState(true);
  const [entityId, setEntityId] = useState("urn:mcp-gateway:northstar");
  const [acsUrl, setAcsUrl] = useState("https://gateway.northstar.dev/saml/acs");
  const [metadataUrl, setMetadataUrl] = useState("https://idp.company.dev/app/saml/metadata");

  return (
    <section className="grid" style={{ maxWidth: 820 }}>
      <article className="card">
        <div className="section-toolbar">
          <div className="resource-cell-copy">
            <strong>Enable SSO</strong>
            <span>Turn SAML sign-in on or off for the gateway.</span>
          </div>
          <label className="toggle">
            <input type="checkbox" checked={enabled} onChange={(event) => setEnabled(event.target.checked)} />
            <span className={`toggle-track${enabled ? " active" : ""}`}>
              <span className="toggle-thumb" />
            </span>
          </label>
        </div>

        <div className="form-grid" style={{ marginTop: 24 }}>
          <label className="field">
            <span>Entity ID</span>
            <input value={entityId} onChange={(event) => setEntityId(event.target.value)} />
          </label>
          <label className="field">
            <span>ACS URL</span>
            <input value={acsUrl} onChange={(event) => setAcsUrl(event.target.value)} />
          </label>
          <label className="field">
            <span>Identity provider metadata URL</span>
            <input value={metadataUrl} onChange={(event) => setMetadataUrl(event.target.value)} />
          </label>
        </div>

        <div className="instruction-card" style={{ marginTop: 18 }}>
          <span className="eyebrow">Current configuration</span>
          <p><strong>SSO:</strong> {enabled ? "Enabled" : "Disabled"}</p>
          <p><strong>Entity ID:</strong> {entityId}</p>
          <p><strong>ACS URL:</strong> {acsUrl}</p>
          <p><strong>Metadata URL:</strong> {metadataUrl}</p>
          <p><strong>Provider:</strong> {initialState.provider}</p>
          <p><strong>Protocol:</strong> {initialState.protocol}</p>
        </div>
      </article>
    </section>
  );
}
