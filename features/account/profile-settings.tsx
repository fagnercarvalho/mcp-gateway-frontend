"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const AVATAR_STORAGE_KEY = "mcp-gateway-avatar";
const PROFILE_NAME = "Jules Tan";
const PROFILE_EMAIL = "jules@company.dev";

export function ProfileSettings() {
  const [avatar, setAvatar] = useState<string | null>(null);

  useEffect(() => {
    const storedAvatar = window.localStorage.getItem(AVATAR_STORAGE_KEY);
    if (storedAvatar) {
      setAvatar(storedAvatar);
    }
  }, []);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : null;
      if (!result) {
        return;
      }

      window.localStorage.setItem(AVATAR_STORAGE_KEY, result);
      window.dispatchEvent(new CustomEvent("mcp-gateway-avatar-updated", { detail: result }));
      setAvatar(result);
    };
    reader.readAsDataURL(file);
  }

  function clearAvatar() {
    window.localStorage.removeItem(AVATAR_STORAGE_KEY);
    window.dispatchEvent(new CustomEvent("mcp-gateway-avatar-updated", { detail: null }));
    setAvatar(null);
  }

  return (
    <section className="grid" style={{ maxWidth: 760 }}>
      <article className="card">
        <div className="profile-settings-header">
          <div className="profile-avatar large">
            {avatar ? (
              <Image src={avatar} alt={`${PROFILE_NAME} avatar`} width={72} height={72} unoptimized />
            ) : (
              <span>{PROFILE_NAME.slice(0, 1)}</span>
            )}
          </div>
          <div className="resource-cell-copy">
            <strong>{PROFILE_NAME}</strong>
            <span>{PROFILE_EMAIL}</span>
          </div>
        </div>

        <div className="form-grid" style={{ marginTop: 24 }}>
          <label className="field">
            <span>Avatar image</span>
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </label>
        </div>

        <div className="profile-settings-actions">
          <button className="secondary-button" type="button" onClick={clearAvatar}>
            Remove avatar
          </button>
        </div>
      </article>
    </section>
  );
}
