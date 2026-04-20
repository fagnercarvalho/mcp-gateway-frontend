"use client";

import { useMemo, useState } from "react";
import type { MpcRecord } from "@/features/mcps/data";

type AllowedCatalogEntry = {
  name: string;
  logoText: string;
  vendor: string;
  status: string;
};

type McpsAdminProps = {
  initialMcps: MpcRecord[];
  catalog: AllowedCatalogEntry[];
};

const configExamples: Record<string, string> = {
  Datadog: `{
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
}`,
};

export function McpsAdmin({ initialMcps, catalog }: McpsAdminProps) {
  const [selectedName, setSelectedName] = useState<string | null>(null);

  const selectedCatalog = useMemo(
    () => catalog.find((item) => item.name === selectedName) ?? null,
    [catalog, selectedName],
  );
  const selectedMcp = useMemo(
    () => initialMcps.find((item) => item.name === selectedName) ?? null,
    [initialMcps, selectedName],
  );

  return (
    <section className="grid">
      <div className="section-toolbar">
        <p>Only allowlisted MCP servers are available here.</p>
      </div>

      <div className="catalog-grid">
        {catalog.map((item) => (
          <button
            key={item.name}
            type="button"
            className={`catalog-card${selectedName === item.name ? " selected" : ""}`}
            onClick={() => setSelectedName(item.name)}
          >
            <span className="logo-badge">{item.logoText}</span>
            <strong>{item.name}</strong>
            <span>{item.vendor}</span>
            <span className="pill strong">{item.status}</span>
          </button>
        ))}
      </div>

      {selectedCatalog && selectedMcp ? (
        <article className="card">
          <div className="page-header" style={{ alignItems: "start" }}>
            <div className="catalog-hero">
              <span className="logo-badge large">{selectedCatalog.logoText}</span>
              <div>
                <span className="eyebrow">{selectedCatalog.vendor}</span>
                <h2>{selectedCatalog.name}</h2>
                <p>{selectedMcp.url}</p>
              </div>
            </div>
            <span className="badge strong">{selectedMcp.type}</span>
          </div>

          <div className="grid two-column">
            <div>
              <p className="eyebrow">Credential headers</p>
              <div className="stack" style={{ marginTop: 10 }}>
                {selectedMcp.credentialKeys.map((key) => (
                  <span className="pill strong" key={key}>
                    {key}
                  </span>
                ))}
              </div>

              <p className="eyebrow" style={{ marginTop: 18 }}>Profiles</p>
              <div className="stack" style={{ marginTop: 10 }}>
                {selectedMcp.profileNames.map((profile) => (
                  <span className="pill" key={profile}>
                    {profile}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p className="eyebrow">Configuration</p>
              <pre className="code-block">{configExamples[selectedCatalog.name] ?? ""}</pre>
            </div>
          </div>
        </article>
      ) : (
        <article className="instruction-card empty-state">
          <p>Select an MCP server to view its configuration and access details.</p>
        </article>
      )}
    </section>
  );
}
