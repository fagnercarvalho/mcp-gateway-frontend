"use client";

import { useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { Modal } from "@/components/ui/modal";
import { ResourceActions } from "@/components/ui/resource-actions";
import type { RoleRecord } from "@/features/roles/data";

type RolesAdminProps = {
  initialRoles: RoleRecord[];
};

export function RolesAdmin({ initialRoles }: RolesAdminProps) {
  const [roles, setRoles] = useState(initialRoles);
  const [editingRole, setEditingRole] = useState<RoleRecord | null>(null);
  const [deleteRole, setDeleteRole] = useState<RoleRecord | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  function resetForm() {
    setEditingRole(null);
    setName("");
    setDescription("");
  }

  function openCreateModal() {
    resetForm();
    setFormOpen(true);
  }

  function openEditModal(role: RoleRecord) {
    setEditingRole(role);
    setName(role.name);
    setDescription(role.description);
    setFormOpen(true);
  }

  function closeFormModal() {
    setFormOpen(false);
    resetForm();
  }

  return (
    <section className="grid">
      <div className="section-toolbar">
        <p>Define reusable permission groups for users, profiles, and gateways.</p>
        <button className="action-button toolbar-button" type="button" onClick={openCreateModal}>
          Create role
        </button>
      </div>

      <DataTable
        rows={roles}
        getRowKey={(role) => role.id}
        columns={[
          { header: "Role", render: (role) => role.name },
          { header: "Users", render: (role) => role.userCount },
          { header: "Description", render: (role) => role.description },
          {
            header: "Actions",
            render: (role) => (
              <ResourceActions
                onEdit={() => openEditModal(role)}
                onDelete={() => setDeleteRole(role)}
                deleteLabel={`Delete ${role.name}`}
                editLabel={`Edit ${role.name}`}
              />
            ),
          },
        ]}
      />

      <Modal
        open={formOpen}
        title={editingRole ? "Update role" : "Create role"}
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

                const nextRole = { name: name.trim(), description: description.trim() };
                setRoles((current) =>
                  editingRole
                    ? current.map((item) => (item.id === editingRole.id ? { ...item, ...nextRole } : item))
                    : [{ id: `role-${current.length + 1}`, ...nextRole, userCount: 0 }, ...current],
                );
                setSuccessMessage(editingRole ? "Role updated." : "Role created.");
                closeFormModal();
              }}
            >
              {editingRole ? "Save changes" : "Create role"}
            </button>
          </>
        }
      >
        <div className="form-grid">
          <label className="field">
            <span>Name</span>
            <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Billing Auditor" />
          </label>
          <label className="field">
            <span>Description</span>
            <textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={4} />
          </label>
        </div>
      </Modal>

      <Modal
        open={Boolean(deleteRole)}
        title="Delete role"
        onClose={() => setDeleteRole(null)}
        actions={
          <>
            <button className="secondary-button" type="button" onClick={() => setDeleteRole(null)}>
              Cancel
            </button>
            <button
              className="action-button modal-submit"
              type="button"
              onClick={() => {
                if (!deleteRole) {
                  return;
                }

                setRoles((current) => current.filter((item) => item.id !== deleteRole.id));
                setDeleteRole(null);
                setSuccessMessage("Role deleted.");
              }}
            >
              Delete role
            </button>
          </>
        }
      >
        <p>Delete <strong>{deleteRole?.name}</strong>?</p>
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
