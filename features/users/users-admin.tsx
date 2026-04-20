"use client";

import { useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { Modal } from "@/components/ui/modal";
import { MultiSelect } from "@/components/ui/multi-select";
import { ResourceActions } from "@/components/ui/resource-actions";
import type { UserRecord } from "@/features/users/data";

type UsersAdminProps = {
  initialUsers: UserRecord[];
  availableRoleNames: string[];
};

export function UsersAdmin({ initialUsers, availableRoleNames }: UsersAdminProps) {
  const [users, setUsers] = useState(initialUsers);
  const [editingUser, setEditingUser] = useState<UserRecord | null>(null);
  const [deleteUser, setDeleteUser] = useState<UserRecord | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [passwordStatus, setPasswordStatus] = useState<UserRecord["passwordStatus"]>("Password set");
  const [selectedRoles, setSelectedRoles] = useState<string[]>(["Developer"]);

  function resetForm() {
    setEditingUser(null);
    setEmail("");
    setPasswordStatus("Password set");
    setSelectedRoles(["Developer"]);
  }

  function openCreateModal() {
    resetForm();
    setFormOpen(true);
  }

  function openEditModal(user: UserRecord) {
    setEditingUser(user);
    setEmail(user.email);
    setPasswordStatus(user.passwordStatus);
    setSelectedRoles(user.roleNames);
    setFormOpen(true);
  }

  function closeFormModal() {
    setFormOpen(false);
    resetForm();
  }

  return (
    <section className="grid">
      <div className="section-toolbar">
        <p>Manage accounts, passwords, and roles.</p>
        <button className="action-button toolbar-button" type="button" onClick={openCreateModal}>
          Create user
        </button>
      </div>

      <DataTable
        rows={users}
        getRowKey={(user) => user.id}
        columns={[
          { header: "Email", render: (user) => user.email },
          { header: "Password", render: (user) => <span className="pill">{user.passwordStatus}</span> },
          {
            header: "Roles",
            render: (user) => (
              <div className="stack">
                {user.roleNames.map((role) => (
                  <span className="pill strong" key={role}>
                    {role}
                  </span>
                ))}
              </div>
            ),
          },
          {
            header: "Actions",
            render: (user) => (
              <ResourceActions
                onEdit={() => openEditModal(user)}
                onDelete={() => setDeleteUser(user)}
                deleteLabel={`Delete ${user.email}`}
                editLabel={`Edit ${user.email}`}
              />
            ),
          },
        ]}
      />

      <Modal
        open={formOpen}
        title={editingUser ? "Update user" : "Create user"}
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
                if (!email.trim()) {
                  return;
                }

                const nextUser = {
                  email: email.trim(),
                  passwordStatus,
                  roleNames: selectedRoles,
                };

                setUsers((current) =>
                  editingUser
                    ? current.map((item) => (item.id === editingUser.id ? { ...item, ...nextUser } : item))
                    : [{ id: `usr-${current.length + 1}`, ...nextUser }, ...current],
                );
                setSuccessMessage(editingUser ? "User updated." : "User created.");
                closeFormModal();
              }}
            >
              {editingUser ? "Save changes" : "Create user"}
            </button>
          </>
        }
      >
        <div className="form-grid">
          <label className="field">
            <span>Email</span>
            <input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="jules@company.dev" />
          </label>
          <label className="field">
            <span>Password</span>
            <select
              value={passwordStatus}
              onChange={(event) => setPasswordStatus(event.target.value as UserRecord["passwordStatus"])}
            >
              <option value="Password set">Password set</option>
              <option value="Reset required">Reset required</option>
            </select>
          </label>
          <MultiSelect
            label="Roles"
            options={availableRoleNames}
            selected={selectedRoles}
            onChange={setSelectedRoles}
            placeholder="Select roles"
          />
        </div>
      </Modal>

      <Modal
        open={Boolean(deleteUser)}
        title="Delete user"
        onClose={() => setDeleteUser(null)}
        actions={
          <>
            <button className="secondary-button" type="button" onClick={() => setDeleteUser(null)}>
              Cancel
            </button>
            <button
              className="action-button modal-submit"
              type="button"
              onClick={() => {
                if (!deleteUser) {
                  return;
                }

                setUsers((current) => current.filter((item) => item.id !== deleteUser.id));
                setDeleteUser(null);
                setSuccessMessage("User deleted.");
              }}
            >
              Delete user
            </button>
          </>
        }
      >
        <p>Delete <strong>{deleteUser?.email}</strong>?</p>
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
