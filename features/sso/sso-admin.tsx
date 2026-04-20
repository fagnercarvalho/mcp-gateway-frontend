"use client";

import { useState } from "react";

type SsoReadiness = Awaited<ReturnType<typeof import("@/features/sso/data").getSsoReadiness>>;

type SsoAdminProps = {
  initialState: SsoReadiness;
};

export function SsoAdmin({ initialState }: SsoAdminProps) {
  const [entityId, setEntityId] = useState("urn:mcp-gateway:northstar");
  const [acsUrl, setAcsUrl] = useState("https://gateway.northstar.dev/saml/acs");

  return (
    <section className="grid two-column">
      <article className="card">
        <span className="eyebrow">Readiness</span>
        <div className="list" style={{ marginTop: 16 }}>
          {initialState.states.map((state) => (
            <div className="list-item" key={state.label}>
              <strong>{state.label}</strong>
              <p>{state.value}</p>
              <span className={`status ${state.status}`}>{state.status === "ok" ? "Configured" : "Planned"}</span>
            </div>
          ))}
        </div>
      </article>

      <article className="card">
        <span className="eyebrow">SAML Draft</span>
        <h2>Identity provider handoff</h2>
        <p>These fields define the SAML values the platform exposes for sign-in.</p>

        <div className="form-grid" style={{ marginTop: 20 }}>
          <label className="field">
            <span>Entity ID</span>
            <input value={entityId} onChange={(event) => setEntityId(event.target.value)} />
          </label>
          <label className="field">
            <span>ACS URL</span>
            <input value={acsUrl} onChange={(event) => setAcsUrl(event.target.value)} />
          </label>
        </div>

        <div className="instruction-card" style={{ marginTop: 18 }}>
          <span className="eyebrow">Backend handoff</span>
          <p><strong>Entity ID:</strong> {entityId}</p>
          <p><strong>ACS URL:</strong> {acsUrl}</p>
          <p><strong>Provider:</strong> {initialState.provider}</p>
        </div>
      </article>

      <article className="instruction-card">
        <span className="eyebrow">Protocol</span>
        <h2>{initialState.protocol}</h2>
        <div className="list" style={{ marginTop: 16 }}>
          {initialState.notes.map((note) => (
            <div className="list-item" key={note}>
              <p>{note}</p>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}
