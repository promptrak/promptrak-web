import { NextResponse } from "next/server";

import { getAlerts, getMetrics, getReadiness } from "@/lib/api/ops";
import { getPatternStats } from "@/lib/api/patterns";

export async function GET() {
  try {
    const [metrics, alerts, readiness, patternStats] = await Promise.all([
      getMetrics(),
      getAlerts(),
      getReadiness(),
      getPatternStats(),
    ]);

    return NextResponse.json({
      metrics,
      alerts: alerts.alerts.slice(0, 3),
      readiness,
      patternStats,
    });
  } catch {
    return NextResponse.json(
      {
        metrics: {},
        alerts: [],
        readiness: { status: "unknown", gemini: "unknown" },
        patternStats: { promoted: 0, candidate: 0, retired: 0, shadow_rejected: 0 },
      },
      { status: 200 }
    );
  }
}
