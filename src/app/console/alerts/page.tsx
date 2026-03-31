"use client";

import { useEffect, useState } from "react";
import { useConsoleAuth } from "@/lib/console-auth";
import { AlertTriangle, RefreshCw, CheckCircle } from "lucide-react";
import type { Alert, AlertsResponse } from "@/lib/api/types";

function SeverityBadge({ severity }: { severity: string }) {
  const s = severity.toLowerCase();
  const styles =
    s === "high"   ? "bg-red-500/10 text-red-400 border-red-500/20" :
    s === "medium" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                     "bg-blue-500/10 text-blue-400 border-blue-500/20";
  return (
    <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${styles}`}>
      {severity}
    </span>
  );
}

function StageBadge({ stage }: { stage?: string }) {
  if (!stage) return null;
  return (
    <span className="inline-flex items-center rounded-md border border-zinc-700 bg-zinc-800 px-2 py-0.5 text-xs font-mono text-zinc-400">
      {stage}
    </span>
  );
}

export default function AlertsPage() {
  const { authFetch } = useConsoleAuth();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await authFetch<AlertsResponse>("/alerts");
      setAlerts(data.alerts ?? []);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const high   = alerts.filter((a) => a.severity === "High").length;
  const medium = alerts.filter((a) => a.severity === "Medium").length;
  const low    = alerts.filter((a) => a.severity === "Low").length;

  return (
    <div className="flex-1 overflow-y-auto">
      <header className="h-14 border-b border-zinc-800 bg-zinc-900 flex items-center justify-between px-6 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-4 w-4 text-zinc-500" />
          <h1 className="text-base font-semibold text-zinc-100">Alerts</h1>
          {!loading && (
            <div className="flex items-center gap-2 ml-2">
              {high   > 0 && <span className="rounded-md border border-red-500/20 bg-red-500/10 px-2 py-0.5 text-xs font-medium text-red-400">{high} High</span>}
              {medium > 0 && <span className="rounded-md border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-400">{medium} Medium</span>}
              {low    > 0 && <span className="rounded-md border border-blue-500/20 bg-blue-500/10 px-2 py-0.5 text-xs font-medium text-blue-400">{low} Low</span>}
            </div>
          )}
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="flex items-center gap-2 rounded-md border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-700 disabled:opacity-40 transition-colors"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </header>

      <main className="p-6 max-w-screen-xl mx-auto">
        {error && (
          <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</div>
        )}

        <div className="rounded-lg border border-zinc-800 bg-zinc-900 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-sm text-zinc-600">Loading alerts...</div>
          ) : alerts.length === 0 ? (
            <div className="p-8 flex flex-col items-center gap-2 text-zinc-500">
              <CheckCircle className="h-8 w-8 text-emerald-500/50" />
              <p className="text-sm">No alerts — all clear.</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Severity</th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Title</th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Stage</th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Detail</th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Time</th>
                </tr>
              </thead>
              <tbody>
                {alerts.map((a) => (
                  <tr key={a.alert_id} className="border-b border-zinc-800/50 hover:bg-zinc-800/40 transition-colors">
                    <td className="px-5 py-3"><SeverityBadge severity={a.severity} /></td>
                    <td className="px-5 py-3 text-sm text-zinc-200 font-medium">{a.title}</td>
                    <td className="px-5 py-3"><StageBadge stage={a.stage} /></td>
                    <td className="px-5 py-3 text-sm text-zinc-400 max-w-xs truncate">{a.detail ?? "—"}</td>
                    <td className="px-5 py-3 text-xs text-zinc-500 tabular-nums whitespace-nowrap">
                      {new Date(a.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
