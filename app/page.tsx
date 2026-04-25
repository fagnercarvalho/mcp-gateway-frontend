import Link from "next/link";
import { MetricCard } from "@/components/ui/metric-card";
import { PageHeader } from "@/components/ui/page-header";
import { getDashboardOverview } from "@/features/dashboard/data";

export default async function HomePage() {
  const overview = await getDashboardOverview();

  return (
    <div className="page">
      <PageHeader
        eyebrow="Overview"
        title="MCP gateway control panel"
        description="Manage users, roles, profiles, MCP servers, gateways, and SSO from one place."
      />

      <section className="grid metrics-grid">
        {overview.metrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </section>

      <section className="grid">
        <article className="card overview-card">
          <div className="section-heading">
            <span className="eyebrow">Platform Constructs</span>
            <h2>How the platform is organized</h2>
          </div>
          <div className="list">
            {overview.constructs.map((construct) => (
              <div className="list-item" key={construct.name}>
                <Link className="construct-link" href={construct.href}>
                  {construct.name}
                </Link>
                <p>{construct.summary}</p>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}
