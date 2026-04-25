"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { navigation } from "@/lib/navigation";

const AVATAR_STORAGE_KEY = "mcp-gateway-avatar";
const PROFILE_NAME = "Jules Tan";
const PROFILE_EMAIL = "jules@company.dev";

export function AppSidebar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const storedAvatar = window.localStorage.getItem(AVATAR_STORAGE_KEY);
    if (storedAvatar) {
      setAvatar(storedAvatar);
    }

    function handleAvatarUpdated(event: Event) {
      const customEvent = event as CustomEvent<string | null>;
      setAvatar(customEvent.detail ?? null);
    }

    function handleClickOutside(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    window.addEventListener("mcp-gateway-avatar-updated", handleAvatarUpdated as EventListener);
    window.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("mcp-gateway-avatar-updated", handleAvatarUpdated as EventListener);
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="eyebrow">MCP Gateway</span>
      </div>

      <nav aria-label="Primary">
        <ul className="nav-list">
          {navigation.map((item) => {
            const active = pathname === item.href;

            return (
              <li key={item.href}>
                <Link className={`nav-link${active ? " active" : ""}`} href={item.href}>
                  <span>{item.label}</span>
                  <span className="eyebrow">{item.shortLabel}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <ThemeToggle />

        <div className="account-menu" ref={menuRef}>
          <button
            className="account-trigger"
            type="button"
            onClick={() => setMenuOpen((current) => !current)}
            aria-expanded={menuOpen}
            aria-haspopup="menu"
          >
            <span className="profile-avatar">
              {avatar ? (
                <Image src={avatar} alt={`${PROFILE_NAME} avatar`} width={42} height={42} unoptimized />
              ) : (
                <span>{PROFILE_NAME.slice(0, 1)}</span>
              )}
            </span>
            <span className="account-copy">
              <strong>{PROFILE_NAME}</strong>
              <span>{PROFILE_EMAIL}</span>
            </span>
          </button>

          {menuOpen ? (
            <div className="account-dropdown" role="menu">
              <Link className="account-menu-item" href="/profile" role="menuitem" onClick={() => setMenuOpen(false)}>
                Profile
              </Link>
              <button
                className="account-menu-item"
                type="button"
                role="menuitem"
                onClick={() => {
                  setMenuOpen(false);
                  window.location.assign("/");
                }}
              >
                Logout
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </aside>
  );
}
