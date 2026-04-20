"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { MultiSelect } from "@/components/ui/multi-select";
import { ResourceActions } from "@/components/ui/resource-actions";
import type { ProfileRecord } from "@/features/profiles/data";

type ProfilesAdminProps = {
  initialProfiles: ProfileRecord[];
  allowedMcpNames: string[];
  availableRoleNames: string[];
};

export function ProfilesAdmin({ initialProfiles, allowedMcpNames, availableRoleNames }: ProfilesAdminProps) {
  const [profiles, setProfiles] = useState(initialProfiles);
  const [editingProfile, setEditingProfile] = useState<ProfileRecord | null>(null);
  const [deleteProfile, setDeleteProfile] = useState<ProfileRecord | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [name, setName] = useState("");
  const [summary, setSummary] = useState("");
  const [selectedRoles, setSelectedRoles] = useState<string[]>(["Developer"]);
  const [selectedMcps, setSelectedMcps] = useState<string[]>(allowedMcpNames.slice(0, 1));

  function resetForm() {
    setEditingProfile(null);
    setName("");
    setSummary("");
    setSelectedRoles(["Developer"]);
    setSelectedMcps(allowedMcpNames.slice(0, 1));
  }

  function openCreateModal() {
    resetForm();
    setFormOpen(true);
  }

  function openEditModal(profile: ProfileRecord) {
    setEditingProfile(profile);
    setName(profile.name);
    setSummary(profile.summary);
    setSelectedRoles(profile.roleNames);
    setSelectedMcps(profile.mcpNames);
    setFormOpen(true);
  }

  function closeFormModal() {
    setFormOpen(false);
    resetForm();
  }

  return (
    <section className="grid">
      <div className="section-toolbar">
        <p>Profiles decide which roles and MCP servers are available together.</p>
        <button className="action-button toolbar-button" type="button" onClick={openCreateModal}>
          Create profile
        </button>
      </div>

      {profiles.map((profile) => (
        <article className="card" key={profile.id}>
          <div className="page-header" style={{ alignItems: "start" }}>
            <div>
              <span className="eyebrow">Profile</span>
              <h2>{profile.name}</h2>
              <p>{profile.summary || "No summary provided yet."}</p>
            </div>
            <div className="resource-header-actions">
              <span className="badge strong">{profile.mcpNames.length} MCPs</span>
              <ResourceActions
                onEdit={() => openEditModal(profile)}
                onDelete={() => setDeleteProfile(profile)}
                deleteLabel={`Delete ${profile.name}`}
                editLabel={`Edit ${profile.name}`}
              />
            </div>
          </div>

          <div className="grid two-column">
            <div>
              <p className="eyebrow">Roles</p>
              <div className="stack" style={{ marginTop: 10 }}>
                {profile.roleNames.map((role) => (
                  <span className="pill strong" key={role}>
                    {role}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="eyebrow">Accessible MCPs</p>
              <div className="stack" style={{ marginTop: 10 }}>
                {profile.mcpNames.length ? (
                  profile.mcpNames.map((mcp) => (
                    <span className="pill" key={mcp}>
                      {mcp}
                    </span>
                  ))
                ) : (
                  <span className="pill">No MCP access yet</span>
                )}
              </div>
            </div>
          </div>
        </article>
      ))}

      <Modal
        open={formOpen}
        title={editingProfile ? "Update profile" : "Create profile"}
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

                const nextProfile = {
                  name: name.trim(),
                  summary: summary.trim(),
                  roleNames: selectedRoles,
                  mcpNames: selectedMcps,
                };

                setProfiles((current) =>
                  editingProfile
                    ? current.map((item) => (item.id === editingProfile.id ? { ...item, ...nextProfile } : item))
                    : [{ ...nextProfile, id: `profile-${current.length + 1}` }, ...current],
                );
                setSuccessMessage(editingProfile ? "Profile updated." : "Profile created.");
                closeFormModal();
              }}
            >
              {editingProfile ? "Save changes" : "Create profile"}
            </button>
          </>
        }
      >
        <div className="form-grid">
          <label className="field">
            <span>Name</span>
            <input value={name} onChange={(event) => setName(event.target.value)} />
          </label>
          <MultiSelect
            label="Roles"
            options={availableRoleNames}
            selected={selectedRoles}
            onChange={setSelectedRoles}
            placeholder="Select roles"
          />
          <label className="field">
            <span>Summary</span>
            <textarea value={summary} onChange={(event) => setSummary(event.target.value)} rows={4} />
          </label>
          <MultiSelect
            label="MCP servers"
            options={allowedMcpNames}
            selected={selectedMcps}
            onChange={setSelectedMcps}
            placeholder="Select MCP servers"
          />
        </div>
      </Modal>

      <Modal
        open={Boolean(deleteProfile)}
        title="Delete profile"
        onClose={() => setDeleteProfile(null)}
        actions={
          <>
            <button className="secondary-button" type="button" onClick={() => setDeleteProfile(null)}>
              Cancel
            </button>
            <button
              className="action-button modal-submit"
              type="button"
              onClick={() => {
                if (!deleteProfile) {
                  return;
                }

                setProfiles((current) => current.filter((item) => item.id !== deleteProfile.id));
                setDeleteProfile(null);
                setSuccessMessage("Profile deleted.");
              }}
            >
              Delete profile
            </button>
          </>
        }
      >
        <p>Delete <strong>{deleteProfile?.name}</strong>?</p>
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
