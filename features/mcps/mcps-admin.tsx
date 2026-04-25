"use client";

import { useMemo, useState } from "react";
import { Modal } from "@/components/ui/modal";
import { ResourceActions } from "@/components/ui/resource-actions";
import type { MpcRecord } from "@/features/mcps/data";

type AllowedCatalogEntry = {
  name: string;
  logoText: string;
  vendor: string;
  status: string;
};

type MpcTemplate = {
  name: string;
  vendor: string;
  type: string;
  url: string;
  headers: Array<{
    key: string;
    value: string;
  }>;
  status: "Allowlisted";
  logoText: string;
};

type McpsAdminProps = {
  initialMcps: MpcRecord[];
  catalog: AllowedCatalogEntry[];
};

const mcpTemplates: Record<string, MpcTemplate> = {
  Datadog: {
    name: "Datadog",
    vendor: "Datadog",
    type: "http",
    url: "https://mcp.datadoghq.com/api/unstable/mcp-server/mcp",
    headers: [
      { key: "DD_API_KEY", value: "<YOUR_API_KEY>" },
      { key: "DD_APPLICATION_KEY", value: "<YOUR_APPLICATION_KEY>" },
    ],
    status: "Allowlisted",
    logoText: "DD",
  },
};

function buildConfigExample(mcp: Pick<MpcRecord, "name" | "type" | "url" | "headers">) {
  return JSON.stringify(
    {
      mcpServers: {
        [mcp.name.toLowerCase().replace(/\s+/g, "-")]: {
          type: mcp.type,
          url: mcp.url,
          headers: Object.fromEntries(mcp.headers.map((header) => [header.key, header.value])),
        },
      },
    },
    null,
    2,
  );
}

export function McpsAdmin({ initialMcps, catalog }: McpsAdminProps) {
  const defaultTemplateName = catalog[0]?.name ?? "Datadog";
  const [mcps, setMcps] = useState(initialMcps);
  const [selectedName, setSelectedName] = useState<string | null>(initialMcps[0]?.name ?? null);
  const [editingMcp, setEditingMcp] = useState<MpcRecord | null>(null);
  const [deleteMcp, setDeleteMcp] = useState<MpcRecord | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(defaultTemplateName);
  const [name, setName] = useState("");
  const [type, setType] = useState("http");
  const [url, setUrl] = useState("");
  const [headers, setHeaders] = useState<Array<{ key: string; value: string }>>([]);

  const selectedMcp = useMemo(() => mcps.find((item) => item.name === selectedName) ?? null, [mcps, selectedName]);

  function applyTemplate(templateName: string) {
    const template = mcpTemplates[templateName] ?? mcpTemplates.Datadog;
    setSelectedTemplate(template.name);
    setName(template.name);
    setType(template.type);
    setUrl(template.url);
    setHeaders(template.headers.map((header) => ({ ...header })));
  }

  function resetForm(templateName = defaultTemplateName) {
    setEditingMcp(null);
    applyTemplate(templateName);
  }

  function openCreateModal() {
    resetForm();
    setFormOpen(true);
  }

  function openEditModal(mcp: MpcRecord) {
    setEditingMcp(mcp);
    setSelectedTemplate(defaultTemplateName);
    setName(mcp.name);
    setType(mcp.type);
    setUrl(mcp.url);
    setHeaders(mcp.headers.map((header) => ({ ...header })));
    setFormOpen(true);
  }

  function closeFormModal() {
    setFormOpen(false);
    resetForm();
  }

  function updateHeader(index: number, field: "key" | "value", value: string) {
    setHeaders((current) =>
      current.map((header, headerIndex) => (headerIndex === index ? { ...header, [field]: value } : header)),
    );
  }

  return (
    <section className="grid">
      <div className="section-toolbar">
        <p>Only allowlisted MCP servers are available here.</p>
        <button className="action-button toolbar-button" type="button" onClick={openCreateModal}>
          Create MCP
        </button>
      </div>

      <div className="catalog-grid">
        {mcps.map((item) => (
          <button
            key={item.id}
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

      {selectedMcp ? (
        <article className="card">
          <div className="page-header" style={{ alignItems: "start" }}>
            <div className="catalog-hero">
              <span className="logo-badge large">{selectedMcp.logoText}</span>
              <div>
                <span className="eyebrow">{selectedMcp.vendor}</span>
                <h2>{selectedMcp.name}</h2>
                <p>{selectedMcp.url}</p>
              </div>
            </div>
            <div className="resource-header-actions">
              <span className="badge strong">{selectedMcp.type}</span>
              <ResourceActions
                onEdit={() => openEditModal(selectedMcp)}
                onDelete={() => setDeleteMcp(selectedMcp)}
                deleteLabel={`Delete ${selectedMcp.name}`}
                editLabel={`Edit ${selectedMcp.name}`}
              />
            </div>
          </div>

          <div className="grid two-column">
            <div>
              <p className="eyebrow">Headers</p>
              <div className="stack" style={{ marginTop: 10 }}>
                {selectedMcp.headers.map((header) => (
                  <span className="pill strong" key={header.key}>
                    {header.key}: {header.value}
                  </span>
                ))}
              </div>

              <p className="eyebrow" style={{ marginTop: 18 }}>Profiles</p>
              <div className="stack" style={{ marginTop: 10 }}>
                {selectedMcp.profileNames.length ? (
                  selectedMcp.profileNames.map((profile) => (
                    <span className="pill" key={profile}>
                      {profile}
                    </span>
                  ))
                ) : (
                  <span className="pill">No profiles assigned yet</span>
                )}
              </div>
            </div>

            <div>
              <p className="eyebrow">Configuration</p>
              <pre className="code-block">{buildConfigExample(selectedMcp)}</pre>
            </div>
          </div>
        </article>
      ) : (
        <article className="instruction-card empty-state">
          <p>Select an MCP server to view its configuration and access details.</p>
        </article>
      )}

      <Modal
        open={formOpen}
        title={editingMcp ? "Update MCP" : "Create MCP"}
        onClose={closeFormModal}
        actions={
          <>
            <button className="secondary-button" type="button" onClick={closeFormModal}>
              Cancel
            </button>
            <button
              className="action-button modal-submit"
              type="button"
              onClick={() => {
                if (!name.trim() || !url.trim() || headers.some((header) => !header.key.trim() || !header.value.trim())) {
                  return;
                }

                const template = mcpTemplates[selectedTemplate] ?? mcpTemplates.Datadog;
                const nextMcp = {
                  name: name.trim(),
                  vendor: template.vendor,
                  type: type.trim(),
                  url: url.trim(),
                  headers: headers.map((header) => ({ key: header.key.trim(), value: header.value.trim() })),
                  credentialKeys: headers.map((header) => header.key.trim()),
                  profileNames: editingMcp?.profileNames ?? [],
                  status: template.status,
                  logoText: template.logoText,
                };

                setMcps((current) =>
                  editingMcp
                    ? current.map((item) => (item.id === editingMcp.id ? { ...item, ...nextMcp } : item))
                    : [{ ...nextMcp, id: `mcp-${current.length + 1}` }, ...current],
                );
                setSelectedName(nextMcp.name);
                setSuccessMessage(editingMcp ? "MCP updated." : "MCP created.");
                closeFormModal();
              }}
            >
              {editingMcp ? "Save changes" : "Create MCP"}
            </button>
          </>
        }
      >
        <div className="form-grid">
          <label className="field">
            <span>Template</span>
            <select
              value={selectedTemplate}
              onChange={(event) => applyTemplate(event.target.value)}
              disabled={Boolean(editingMcp)}
            >
              {catalog.map((item) => (
                <option key={item.name} value={item.name}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Name</span>
            <input value={name} onChange={(event) => setName(event.target.value)} />
          </label>
          <label className="field">
            <span>Type</span>
            <input value={type} disabled readOnly />
          </label>
          <label className="field">
            <span>URL</span>
            <input value={url} onChange={(event) => setUrl(event.target.value)} />
          </label>
          <div className="field">
            <span>Headers</span>
            <div className="headers-grid">
              {headers.map((header, index) => (
                <div className="header-row" key={`${header.key}-${index}`}>
                  <input
                    value={header.key}
                    onChange={(event) => updateHeader(index, "key", event.target.value)}
                    aria-label={`Header key ${index + 1}`}
                  />
                  <input
                    value={header.value}
                    onChange={(event) => updateHeader(index, "value", event.target.value)}
                    aria-label={`Header value ${index + 1}`}
                  />
                </div>
              ))}
            </div>
          </div>
          <p className="form-note">
            MCP creation is restricted to allowlisted templates. Only Datadog is currently available.
          </p>
        </div>
      </Modal>

      <Modal
        open={Boolean(deleteMcp)}
        title="Delete MCP"
        onClose={() => setDeleteMcp(null)}
        actions={
          <>
            <button className="secondary-button" type="button" onClick={() => setDeleteMcp(null)}>
              Cancel
            </button>
            <button
              className="action-button modal-submit"
              type="button"
              onClick={() => {
                if (!deleteMcp) {
                  return;
                }

                const remainingMcps = mcps.filter((item) => item.id !== deleteMcp.id);
                setMcps(remainingMcps);
                setSelectedName((current) => (current === deleteMcp.name ? (remainingMcps[0]?.name ?? null) : current));
                setDeleteMcp(null);
                setSuccessMessage("MCP deleted.");
              }}
            >
              Delete MCP
            </button>
          </>
        }
      >
        <p>Delete <strong>{deleteMcp?.name}</strong>?</p>
      </Modal>

      <Modal
        open={Boolean(successMessage)}
        title="Success"
        onClose={() => setSuccessMessage(null)}
        actions={
          <button className="action-button modal-submit" type="button" onClick={() => setSuccessMessage(null)}>
            Close
          </button>
        }
      >
        <p>{successMessage}</p>
      </Modal>
    </section>
  );
}
