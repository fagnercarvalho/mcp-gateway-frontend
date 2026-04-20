import type { Metadata } from "next";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { ThemeProvider } from "@/components/theme/theme-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "MCP Gateway Admin",
  description: "Admin panel for managing gateways, profiles, users, roles, and MCP servers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <div className="app-shell">
            <AppSidebar />
            <main className="content">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
