"use client";

import { useMemo, useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { Modal } from "@/components/ui/modal";
import { MultiSelect } from "@/components/ui/multi-select";
import { ResourceActions } from "@/components/ui/resource-actions";
import type { GatewayRecord } from "@/features/gateways/data";
import type { ProfileRecord } from "@/features/profiles/data";

type SetupExample = {
  tool: string;
  description: string;
  snippet: string;
};

type GatewaysAdminProps = {
  initialGateways: GatewayRecord[];
  setupExamples: SetupExample[];
  availableProfiles: ProfileRecord[];
};

function TerminalIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 6h16v12H4z" />
      <path d="m8 10 2 2-2 2" />
      <path d="M12 14h4" />
    </svg>
  );
}

export function GatewaysAdmin({ initialGateways, setupExamples, availableProfiles }: GatewaysAdminProps) {
  const [gateways, setGateways] = useState(initialGateways);
  const [editingGateway, setEditingGateway] = useState<GatewayRecord | null>(null);
  const [deleteGateway, setDeleteGateway] = useState<GatewayRecord | null>(null);
  const [setupGateway, setSetupGateway] = useState<GatewayRecord | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState(setupExamples[0]?.tool ?? "Claude Code");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("https://gateway.company.dev/mcp");
  const [selectedProfiles, setSelectedProfiles] = useState<string[]>(["Operations"]);
  const [environment, setEnvironment] = useState<GatewayRecord["environment"]>("Development");

  const previewProfiles = useMemo(
    () => availableProfiles.filter((profile) => selectedProfiles.includes(profile.name)),
    [availableProfiles, selectedProfiles],
  );
  const activeSetup = setupExamples.find((item) => item.tool === selectedTool) ?? setupExamples[0];

  function resetForm() {
    setEditingGateway(null);
    setName("");
    setAddress("https://gateway.company.dev/mcp");
    setSelectedProfiles(["Operations"]);
    setEnvironment("Development");
  }

  function openCreateModal() {
    resetForm();
    setFormOpen(true);
  }

  function openEditModal(gateway: GatewayRecord) {
    setEditingGateway(gateway);
    setName(gateway.name);
    setAddress(gateway.address);
    setSelectedProfiles(gateway.profileNames);
    setEnvironment(gateway.environment);
    setFormOpen(true);
  }

  function closeFormModal() {
    setFormOpen(false);
    resetForm();
  }

  return (
    <section className="grid">
      <div className="section-toolbar">
        <p>Gateways connect profiles to endpoints and define which MCP servers are exposed.</p>
        <button className="action-button toolbar-button" type="button" onClick={openCreateModal}>
          Create gateway
        </button>
      </div>

      <DataTable
        rows={gateways}
        getRowKey={(gateway) => gateway.id}
        columns={[
          {
            header: "Gateway",
            render: (gateway) => (
              <div className="resource-cell-copy">
                <strong>{gateway.name}</strong>
                <span>{gateway.address}</span>
              </div>
            ),
          },
          {
            header: "Environment",
            render: (gateway) => <span className="pill strong">{gateway.environment}</span>,
          },
          {
            header: "Profiles",
            render: (gateway) => (
              <div className="stack">
                {gateway.profileNames.map((profile) => (
                  <span className="pill strong" key={profile}>
                    {profile}
                  </span>
                ))}
              </div>
            ),
          },
          {
            header: "MCPs",
            render: (gateway) => (
              <div className="stack">
                {gateway.mcpNames.map((mcp) => (
                  <span className="pill" key={mcp}>
                    {mcp}
                  </span>
                ))}
              </div>
            ),
          },
          {
            header: "Actions",
            render: (gateway) => (
              <ResourceActions
                extraActions={
                  <button
                    className="icon-button"
                    type="button"
                    onClick={() => setSetupGateway(gateway)}
                    aria-label={`Setup instructions for ${gateway.name}`}
                    title={`Setup instructions for ${gateway.name}`}
                  >
                    <TerminalIcon />
                  </button>
                }
                onEdit={() => openEditModal(gateway)}
                onDelete={() => setDeleteGateway(gateway)}
                deleteLabel={`Delete ${gateway.name}`}
                editLabel={`Edit ${gateway.name}`}
              />
            ),
          },
        ]}
      />

      <Modal
        open={formOpen}
        title={editingGateway ? "Update gateway" : "Create gateway"}
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
                if (!name.trim()) {
                  return;
                }

                const nextProfileNames = previewProfiles.map((profile) => profile.name);
                const nextRoles = [...new Set(previewProfiles.flatMap((profile) => profile.roleNames))];
                const nextMcps = [...new Set(previewProfiles.flatMap((profile) => profile.mcpNames))];
                const nextGateway = {
                  name: name.trim(),
                  address,
                  environment,
                  profileNames: nextProfileNames,
                  roleNames: nextRoles,
                  mcpNames: nextMcps,
                };

                setGateways((current) =>
                  editingGateway
                    ? current.map((item) => (item.id === editingGateway.id ? { ...item, ...nextGateway } : item))
                    : [{ id: `gw-${current.length + 1}`, ...nextGateway }, ...current],
                );
                setSuccessMessage(editingGateway ? "Gateway updated." : "Gateway created.");
                closeFormModal();
              }}
            >
              {editingGateway ? "Save changes" : "Create gateway"}
            </button>
          </>
        }
      >
        <div className="form-grid">
          <label className="field">
            <span>Name</span>
            <input value={name} onChange={(event) => setName(event.target.value)} />
          </label>
          <label className="field">
            <span>Address</span>
            <input value={address} onChange={(event) => setAddress(event.target.value)} />
          </label>
          <label className="field">
            <span>Environment</span>
            <select
              value={environment}
              onChange={(event) => setEnvironment(event.target.value as GatewayRecord["environment"])}
            >
              <option value="Development">Development</option>
              <option value="Staging">Staging</option>
              <option value="Production">Production</option>
            </select>
          </label>
          <MultiSelect
            label="Profiles"
            options={availableProfiles.map((profile) => profile.name)}
            selected={selectedProfiles}
            onChange={setSelectedProfiles}
            placeholder="Select profiles"
          />
          <div className="stack">
            {previewProfiles.map((profile) => (
              <span className="pill strong" key={profile.name}>
                {profile.name}
              </span>
            ))}
          </div>
        </div>
      </Modal>

      <Modal
        open={Boolean(deleteGateway)}
        title="Delete gateway"
        onClose={() => setDeleteGateway(null)}
        actions={
          <>
            <button className="secondary-button" type="button" onClick={() => setDeleteGateway(null)}>
              Cancel
            </button>
            <button
              className="action-button modal-submit"
              type="button"
              onClick={() => {
                if (!deleteGateway) {
                  return;
                }

                setGateways((current) => current.filter((item) => item.id !== deleteGateway.id));
                setDeleteGateway(null);
                setSuccessMessage("Gateway deleted.");
              }}
            >
              Delete gateway
            </button>
          </>
        }
      >
        <p>Delete <strong>{deleteGateway?.name}</strong>?</p>
      </Modal>

      <Modal
        open={Boolean(setupGateway)}
        title={setupGateway ? `${setupGateway.name} setup` : "Gateway setup"}
        onClose={() => setSetupGateway(null)}
        actions={
          <button className="action-button modal-submit" type="button" onClick={() => setSetupGateway(null)}>
            Close
          </button>
        }
      >
        <p>Use the gateway endpoint below and add <code>?profile=operations</code> when you want the session scoped to one profile.</p>
        <div className="tab-list" role="tablist" aria-label="Gateway setup tools">
          {setupExamples.map((example) => (
            <button
              key={example.tool}
              className={`tab-button${selectedTool === example.tool ? " active" : ""}`}
              type="button"
              role="tab"
              aria-selected={selectedTool === example.tool}
              onClick={() => setSelectedTool(example.tool)}
            >
              {example.tool}
            </button>
          ))}
        </div>

        {activeSetup ? (
          <div className="tab-panel">
            <span className="eyebrow">{activeSetup.tool}</span>
            <p>{activeSetup.description}</p>
            <pre className="code-block">
              {activeSetup.snippet.replaceAll(
                "https://gateway.northstar.dev/mcp",
                setupGateway?.address ?? "https://gateway.company.dev/mcp",
              )}
            </pre>
          </div>
        ) : null}
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
