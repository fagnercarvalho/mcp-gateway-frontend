"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { navigation } from "@/lib/navigation";

export function AppSidebar() {
  const pathname = usePathname();

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

      <ThemeToggle />
    </aside>
  );
}
