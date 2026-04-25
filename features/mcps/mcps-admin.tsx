"use client";

import { useState } from "react";
import { DataTable } from "@/components/ui/data-table";
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

type HeaderDraft = {
  key: string;
  value: string;
  lockedKey: boolean;
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

export function McpsAdmin({ initialMcps, catalog }: McpsAdminProps) {
  const defaultTemplateName = catalog[0]?.name ?? "Datadog";
  const [mcps, setMcps] = useState(initialMcps);
  const [editingMcp, setEditingMcp] = useState<MpcRecord | null>(null);
  const [deleteMcp, setDeleteMcp] = useState<MpcRecord | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(defaultTemplateName);
  const [name, setName] = useState("");
  const [type, setType] = useState("http");
  const [url, setUrl] = useState("");
  const [headers, setHeaders] = useState<HeaderDraft[]>([]);

  function applyTemplate(templateName: string) {
    const template = mcpTemplates[templateName] ?? mcpTemplates.Datadog;
    setSelectedTemplate(template.name);
    setName(template.name);
    setType(template.type);
    setUrl(template.url);
    setHeaders(template.headers.map((header) => ({ ...header, lockedKey: true })));
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
    const template = mcpTemplates[defaultTemplateName] ?? mcpTemplates.Datadog;
    const lockedKeys = new Set(template.headers.map((header) => header.key));
    setEditingMcp(mcp);
    setSelectedTemplate(defaultTemplateName);
    setName(mcp.name);
    setType(mcp.type);
    setUrl(mcp.url);
    setHeaders(mcp.headers.map((header) => ({ ...header, lockedKey: lockedKeys.has(header.key) })));
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

  function addHeader() {
    setHeaders((current) => [...current, { key: "", value: "", lockedKey: false }]);
  }

  function removeHeader(index: number) {
    setHeaders((current) => current.filter((_, headerIndex) => headerIndex !== index));
  }

  return (
    <section className="grid">
      <div className="section-toolbar">
        <p>Create MCPs from approved templates and manage their connection settings.</p>
        <button className="action-button toolbar-button" type="button" onClick={openCreateModal}>
          Create MCP
        </button>
      </div>

      <DataTable
        rows={mcps}
        getRowKey={(mcp) => mcp.id}
        columns={[
          {
            header: "MCP",
            render: (mcp) => (
              <div className="resource-cell">
                <span className="logo-badge table">{mcp.logoText}</span>
                <div className="resource-cell-copy">
                  <strong>{mcp.name}</strong>
                  <span>{mcp.vendor}</span>
                </div>
              </div>
            ),
          },
          { header: "Type", render: (mcp) => <span className="pill strong">{mcp.type}</span> },
          { header: "URL", render: (mcp) => <code>{mcp.url}</code> },
          {
            header: "Headers",
            render: (mcp) => (
              <div className="stack">
                {mcp.headers.map((header) => (
                  <span className="pill" key={header.key}>
                    {header.key}
                  </span>
                ))}
              </div>
            ),
          },
          {
            header: "Actions",
            render: (mcp) => (
              <ResourceActions
                onEdit={() => openEditModal(mcp)}
                onDelete={() => setDeleteMcp(mcp)}
                deleteLabel={`Delete ${mcp.name}`}
                editLabel={`Edit ${mcp.name}`}
              />
            ),
          },
        ]}
      />

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
          <div className="field">
            <span>Template</span>
            <div className="catalog-grid compact">
              {catalog.map((item) => (
                <button
                  key={item.name}
                  type="button"
                  className={`catalog-card compact${selectedTemplate === item.name ? " selected" : ""}`}
                  onClick={() => applyTemplate(item.name)}
                  disabled={Boolean(editingMcp)}
                >
                  <span className="logo-badge">{item.logoText}</span>
                  <strong>{item.name}</strong>
                  <span>{item.vendor}</span>
                </button>
              ))}
            </div>
          </div>
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
            <input value={url} disabled readOnly />
          </label>
          <div className="field">
            <span>Headers</span>
            <div className="headers-grid">
              {headers.map((header, index) => (
                <div className="header-row" key={`${header.key}-${index}`}>
                  <input
                    value={header.key}
                    onChange={(event) => updateHeader(index, "key", event.target.value)}
                    disabled={header.lockedKey}
                    readOnly={header.lockedKey}
                    aria-label={`Header key ${index + 1}`}
                  />
                  <input
                    value={header.value}
                    onChange={(event) => updateHeader(index, "value", event.target.value)}
                    aria-label={`Header value ${index + 1}`}
                  />
                  <button
                    className="icon-button header-row-remove"
                    type="button"
                    onClick={() => removeHeader(index)}
                    aria-label={`Remove header ${index + 1}`}
                    title={`Remove header ${index + 1}`}
                    disabled={header.lockedKey}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <button className="secondary-button header-add-button" type="button" onClick={addHeader}>
              Add header
            </button>
          </div>
          <p className="form-note">
            Template URL and built-in header names stay fixed. You can update header values and add extra headers.
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

                setMcps((current) => current.filter((item) => item.id !== deleteMcp.id));
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
