import { NextResponse } from "next/server";
import { getAlerts, getMetrics } from "@/lib/api/ops";

function extractActor(title: string, tenantId: string): string {
  const m =
    title.match(/user\s+'?([^'\s]+)'?/i) ??
    title.match(/actor[:\s]+'?([^'\s]+)'?/i);
  return m ? m[1] : tenantId;
}

export async function GET() {
  try {
    const [alertsData, metrics] = await Promise.all([
      getAlerts(),
      getMetrics(),
    ]);

    const total = Object.values(metrics).reduce((s, v) => s + v, 0);

    const entries = alertsData.alerts.slice(0, 10).map((a) => {
      const action =
        a.severity === "High"
          ? "blocked"
          : a.severity === "Medium"
          ? "sanitize"
          : "allowed";

      return {
        action,
        agent: extractActor(a.title, a.tenant_id),
        category: a.stage ?? a.title,
        time: a.created_at
          ? new Intl.DateTimeFormat("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            }).format(new Date(a.created_at))
          : "—",
      };
    });

    return NextResponse.json({ entries, total });
  } catch {
    return NextResponse.json({ entries: [], total: 0 }, { status: 200 });
  }
}
